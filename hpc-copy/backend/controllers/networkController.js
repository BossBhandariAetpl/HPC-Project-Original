import asyncHandler from 'express-async-handler';
import { check } from 'diskusage';           // how much disk space is used and available 
import { resolve } from 'path';             // safely creates an absolute path 
import si from "systeminformation"         // gets the information from the system 
import { exec } from 'child_process';       // allows us to execute linux based commands 
import os from 'os'
import dns from 'dns'



//   Disk usage and space
// Function to get disk usage
export const getDiskUsage = asyncHandler(async (req, res) => {
    const path = resolve('/'); // Specify the path to check
    check(path, (err, info) => {
        if (err) {
            console.error(`Error getting disk usage: ${err.message}`);
            return res.status(500).json({ error: 'Failed to get disk usage' });
        }

        // Convert bytes to gigabytes
        const totalGB = (info.total / (1024 ** 3)).toFixed(2);          // total space
        const freeGB = (info.free / (1024 ** 3)).toFixed(2);            // free space
        const availableGB = (info.available / (1024 ** 3)).toFixed(2);  // available space 
        const usedGB = (info.total - info.free) / (1024 ** 3);          // Calculate used space
        const usedGBFormatted = usedGB.toFixed(2);                      // Format to 2 decimal places

        res.status(200).json({
            output: {
                path: path , // Send path in key-value form
                total: totalGB,
                free: freeGB,
                available: availableGB,
                used: usedGBFormatted // Add used space to the response
            }
        });
    });
});


// CPU usage api
export const getCPUUsage = asyncHandler(async (req, res) => {

    try {
        const cpu = await si.currentLoad();
        res.json({ cpuUsage: cpu.currentLoad });
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving CPU usage' });
    }
});


// Get Network Info
// Function to calculate Classless InterDomain Routing(CIDR) notation (netmask bits)
const getNetmaskBits = (netmask) => {
    if (!netmask) return 'N/A'; // IPv6 doesn't have a traditional netmask
    return netmask.split('.').reduce((acc, octet) => acc + (parseInt(octet, 10).toString(2).match(/1/g) || []).length, 0);
  };
// Function to get the base address (network address)
const getBaseAddress = (ip, netmask) => {
    if (!netmask) return 'N/A'; // IPv6 doesn't have a traditional netmask
    const ipParts = ip.split('.').map(Number);
    const maskParts = netmask.split('.').map(Number);
    const baseAddress = ipParts.map((part, i) => part & maskParts[i]);
    return baseAddress.join('.');
  };



export const getNetworkByName = asyncHandler(async(req,res) => {
  // this should return the names of the network such as ib cable details (10G port), the ethernet(1G port) along with 
  // all networking ports names. 
  // we will be using "nmcli connection show" command
})


// API route to fetch network information with asyncHandler
export const getNetworkInfo = asyncHandler(async (req, res) => {
    try {
      const networkInterfaces = os.networkInterfaces();
      // Use Promise wrapper for dns.lookup to make it async
      const domainName = await new Promise((resolve, reject) => {  // function to resolve and reject the domain name
        dns.lookup(os.hostname(), (err, address) => {
          if (err) reject('N/A');
          else resolve(address);
        });
      });
  
      const result = [];
  
      // Loop through each network interface and gather information
      Object.entries(networkInterfaces).forEach(([name, interfaces]) => {
        interfaces.forEach((iface) => {
          const netmaskBits = iface.family === 'IPv4' ? getNetmaskBits(iface.netmask) : 'N/A';
          const baseAddress = iface.family === 'IPv4' ? getBaseAddress(iface.address, iface.netmask) : 'N/A';
          result.push({
            Name: name,
            IP: iface.address,
            Family: iface.family,
            Netmask: iface.netmask || 'N/A', // IPv6 won't have a netmask
            NetmaskBits: netmaskBits,
            BaseAddress: baseAddress,
            Type: iface.internal ? 'Internal' : 'External',
            DomainName: domainName
          });
        });
      });
  
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: 'Error retrieving network information' });
    }
  });

// API route to add network information with asyncHandler
export const addNetworkInfo = asyncHandler(async (req, res) => {
  const { name, address, netmask } = req.body;

  console.log(name,address,netmask)

  // Validate required fields
  if (!name || !address || !netmask) {
    return res.status(400).json({ error: 'Missing required fields: name, address, netmask' });
  }

// Example command to create and configure a network interface (Linux)
const command = `
sudo ip link add ${name} type dummy &&
sudo ip addr add ${address}/${netmask} dev ${name} &&
sudo ip link set ${name} up
`;

// Execute the system command to add and configure the network interface
exec(command, (error, stdout, stderr) => {
if (error) {
  console.error(`Error executing command: ${error.message}`);
  return res.status(500).json({ error: 'Failed to add network interface' });
}

if (stderr) {
  console.error(`Error output: ${stderr}`);
  return res.status(500).json({ error: 'Command error: ' + stderr });
}

// Successful execution
res.json({ message: `Network interface ${name} has been added with IP ${address}/${netmask}` });
});
});






// API route to remove network information with asyncHandler
export const removeNetworkInfo = asyncHandler(async (req, res) => {
  const { name } = req.params; // Extracting the network interface name from the URL parameters
  console.log(name)

  // Validate required fields
  if (!name) {
    return res.status(400).json({ error: 'Missing required parameter: name' });
  }

  // Command to remove the network interface (Linux)
  const command = `sudo ip link delete ${name}`;

  // Execute the system command to remove the network interface
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error executing command: ${error.message}`);
      return res.status(500).json({ error: 'Failed to remove network interface' });
    }

    if (stderr) {
      console.error(`Error output: ${stderr}`);
      return res.status(500).json({ error: 'Command error: ' + stderr });
    }

    // Successful execution
    res.json({ message: `Network interface ${name} has been removed successfully` });
  });
  
});