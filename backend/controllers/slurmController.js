import asyncHandler from 'express-async-handler';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

// ------------------------------
// Check SLURM Controller Status
// ------------------------------
export const getSlurmStatus = asyncHandler(async (req, res) => {
  exec("systemctl status slurmctld", (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ status: 'Error fetching status', error: stderr });
    }
    const isActive = stdout.includes('active (running)');
    return res.json({ status: isActive ? 'Running' : 'Stopped' });
  });
});

// ------------------------------
// Start / Stop / Restart SLURM
// ------------------------------
export const postActions = asyncHandler(async (req, res) => {
  const { action } = req.params;

  if (!['start', 'stop', 'restart'].includes(action)) {
    return res.status(400).send('Invalid action');
  }

  exec(`sudo systemctl ${action} slurmctld`, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).json({ error: stderr });
    }
    res.send(`${action.charAt(0).toUpperCase() + action.slice(1)} successful`);
  });
});

// ------------------------------
// Get SLURM Node Status (sinfo)
// ------------------------------
export const getNodeStatus = asyncHandler(async (req, res) => {
  try {
    const { stdout } = await execAsync('sinfo -o "%20N %10T %10C %10m"');
    res.json({ output: stdout });
  } catch (err) {
    res.status(500).json({ error: err.stderr || err.message });
  }
});

// ------------------------------
// Get SLURM Job Queue (squeue)
// ------------------------------
export const getJobQueue = asyncHandler(async (req, res) => {
  try {
    const { stdout } = await execAsync('squeue -o "%.18i %.9P %.20j %.8u %.2t %.10M %.6D %R"');
    res.json({ output: stdout });
  } catch (err) {
    res.status(500).json({ error: err.stderr || err.message });
  }
});

// ------------------------------
// Cancel Job (scancel <jobId>)
// ------------------------------
export const cancelJob = asyncHandler(async (req, res) => {
  const { jobId } = req.body;

  if (!jobId) {
    return res.status(400).json({ error: 'jobId is required' });
  }

  try {
    const { stdout } = await execAsync(`scancel ${jobId}`);
    res.json({ message: `Job ${jobId} cancelled`, output: stdout });
  } catch (err) {
    res.status(500).json({ error: err.stderr || err.message });
  }
});

// ------------------------------
// Submit Job Script (sbatch <scriptPath>)
// ------------------------------
export const submitJob = asyncHandler(async (req, res) => {
  const { scriptPath } = req.body;

  if (!scriptPath) {
    return res.status(400).json({ error: 'scriptPath is required' });
  }

  try {
    const { stdout } = await execAsync(`sbatch ${scriptPath}`);
    res.json({ message: 'Job submitted', output: stdout });
  } catch (err) {
    res.status(500).json({ error: err.stderr || err.message });
  }
});
