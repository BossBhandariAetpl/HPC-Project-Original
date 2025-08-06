import asyncHandler from 'express-async-handler';
import { check } from 'diskusage';
import { resolve } from 'path';
import si from 'systeminformation';
import { exec } from 'child_process';
import os from 'os';
import dns from 'dns';


// Disk usage and space
export const getDiskUsage = asyncHandler(async (req, res) => {
  const path = resolve('/'); // root filesystem

  check(path, (err, info) => {
    if (err) {
      console.error(`Error getting disk usage: ${err.message}`);
      return res.status(500).json({ error: 'Failed to get disk usage' });
    }

    const totalGB = (info.total / (1024 ** 3)).toFixed(2);
    const freeGB = (info.free / (1024 ** 3)).toFixed(2);
    const availableGB = (info.available / (1024 ** 3)).toFixed(2);
    const usedGB = ((info.total - info.free) / (1024 ** 3)).toFixed(2);

    res.status(200).json({
      output: {
        path: path,
        total: totalGB,
        free: freeGB,
        available: availableGB,
        used: usedGB
      }
    });
  });
});


// CPU usage
export const getCPUUsage = asyncHandler(async (req, res) => {
  try {
    const cpu = await si.currentLoad();
    res.json({ cpuUsage: cpu.currentLoad });
  } catch (error) {
    console.error("CPU usage fetch error:", error.message);
    res.status(500).json({ error: 'Error retrieving CPU usage' });
  }
});


// Netmask helper
const getNetmaskBits = (netmask) => {
  if (!netmask) return 'N/A';
  return netmask.split('.').reduce((acc, octet) => acc + (parseInt(octet, 10).toString(2).match(/1/g) || []).length, 0);
};

const getBaseAddress = (ip, netmask) => {
  if (!netmask) return 'N/A';
  const ipParts = ip.split('.').map(Number);
  const maskParts = netmask.split('.').map(Number);
  const baseAddress = ipParts.map((part, i) => part & maskParts[i]);
  return baseAddress.join('.');
};


// Show active connections via nmcli
export const getNetworkByName = asyncHandler(async (req, res) => {
  exec('nmcli connection show', (err, stdout, stderr) => {
    if (err || stderr) {
      console.error("nmcli error:", err || stderr);
      return res.status(500).json({ error: 'Failed to fetch network connections' });
    }

    const lines = stdout.trim().split('\n');
    const headers = lines[0].split(/\s{2,}/); // split by 2+ spaces
    const data = lines.slice(1).map(line => {
      const parts = line.split(/\s{2,}/);
      return headers.reduce((obj, key, i) => {
        obj[key.trim()] = parts[i]?.trim() || '';
        return obj;
      }, {});
    });

    res.json(data);
  });
});


// Full network interface info
export const getNetworkInfo = asyncHandler(async (req, res) => {
  try {
    const networkInterfaces = os.networkInterfaces();

    const domainName = await new Promise((resolve, reject) => {
      dns.lookup(os.hostname(), (err, address) => {
        if (err) resolve('N/A');
        else resolve(address);
      });
    });

    const result = [];

    Object.entries(networkInterfaces).forEach(([name, interfaces]) => {
      interfaces.forEach((iface) => {
        const netmaskBits = iface.family === 'IPv4' ? getNetmaskBits(iface.netmask) : 'N/A';
        const baseAddress = iface.family === 'IPv4' ? getBaseAddress(iface.address, iface.netmask) : 'N/A';

        result.push({
          Name: name,
          IP: iface.address,
          Family: iface.family,
          Netmask: iface.netmask || 'N/A',
          NetmaskBits: netmaskBits,
          BaseAddress: baseAddress,
          Type: iface.internal ? 'Internal' : 'External',
          DomainName: domainName
        });
      });
    });

    res.json(result);
  } catch (error) {
    console.error("Error fetching network info:", error.message);
    res.status(500).json({ error: 'Error retrieving network information' });
  }
});


// Add network interface
export const addNetworkInfo = asyncHandler(async (req, res) => {
  const { name, address, netmask } = req.body;

  if (!name || !address || !netmask) {
    return res.status(400).json({ error: 'Missing required fields: name, address, netmask' });
  }

  const command = `
    sudo ip link add ${name} type dummy &&
    sudo ip addr add ${address}/${netmask} dev ${name} &&
    sudo ip link set ${name} up
  `;

  exec(command, (error, stdout, stderr) => {
    if (error || stderr) {
      console.error("Add interface error:", error?.message || stderr);
      return res.status(500).json({ error: 'Failed to add network interface' });
    }

    res.json({ message: `Network interface ${name} has been added with IP ${address}/${netmask}` });
  });
});


// Remove network interface
export const removeNetworkInfo = asyncHandler(async (req, res) => {
  const { name } = req.params;

  if (!name) {
    return res.status(400).json({ error: 'Missing required parameter: name' });
  }

  const command = `sudo ip link delete ${name}`;

  exec(command, (error, stdout, stderr) => {
    if (error || stderr) {
      console.error("Remove interface error:", error?.message || stderr);
      return res.status(500).json({ error: 'Failed to remove network interface' });
    }

    res.json({ message: `Network interface ${name} has been removed successfully` });
  });
});
