import asyncHandler from 'express-async-handler';
import { exec } from 'child_process';





// Cget slurm status
// Access only Admin Role
export const getSlurmStatus = asyncHandler(async (req, res) => {

    exec("systemctl status slurmdbd", (err,stdout,stderr) => {

        if (err) {
            return res.status(500).json({ status: 'Error fetching status', error: stderr });
          }
          const isActive = stdout.includes('active (running)');
          return res.json({ status: isActive ? 'Running' : 'Stopped' });

    })
    
  });
  


  // post actions 

  export const postActions = asyncHandler(async(req,res) => {
    
    const { action } = req.params;
    console.log(action)
    if (!['start', 'stop', 'restart'].includes(action)) {
        return res.status(400).send('Invalid action');
      }
      exec(`sudo systemctl ${action} slurmdbd`, (err, stdout, stderr) => {
        if (err) {
          return res.status(500).json({ error: stderr });
        }
        res.send(`${action.charAt(0).toUpperCase() + action.slice(1)} successful`);
      });

  })