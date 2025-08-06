import asyncHandler from 'express-async-handler';
import { exec } from 'child_process';

// Get slurmdbd status
// Access only Admin Role
export const getSlurmStatus = asyncHandler(async (req, res) => {
  exec("systemctl status slurmdbd", (err, stdout, stderr) => {
    if (err) {
      console.error("Error fetching slurmdbd status:", err.message);
      return res.status(500).json({ status: 'Error fetching status', error: stderr || err.message });
    }

    const isActive = stdout.includes('active (running)');
    console.log("slurmdbd status output:\n", stdout);
    return res.json({ status: isActive ? 'Running' : 'Stopped' });
  });
});

// Post actions (start, stop, restart)
export const postActions = asyncHandler(async (req, res) => {
  const { action } = req.params;

  if (!['start', 'stop', 'restart'].includes(action)) {
    return res.status(400).json({ error: 'Invalid action' });
  }

  exec(`sudo systemctl ${action} slurmdbd`, (err, stdout, stderr) => {
    if (err) {
      console.error(`Failed to ${action} slurmdbd:`, err.message);
      return res.status(500).json({ error: stderr || err.message });
    }

    console.log(`slurmdbd ${action} successful:\n`, stdout);
    res.json({ message: `${action.charAt(0).toUpperCase() + action.slice(1)} successful` });
  });
});
