import asyncHandler from 'express-async-handler';
import { exec } from 'child_process';





// Cget slurm status
// Access only Admin Role
export const getSlurmStatus = asyncHandler(async (req, res) => {

    exec("systemctl status slurmctld", (err,stdout,stderr) => {                     // executes command to check whether slurmctld is running or not 

        if (err) {
            return res.status(500).json({ status: 'Error fetching status', error: stderr });
          }
          const isActive = stdout.includes('active (running)');
          return res.json({ status: isActive ? 'Running' : 'Stopped' });          // returns the status 

    })
    
  });
  


  // post actions 

  export const postActions = asyncHandler(async(req,res) => {
    
    const { action } = req.params;
    if (!['start', 'stop', 'restart'].includes(action)) {
        return res.status(400).send('Invalid action');
      }
      exec(`sudo systemctl ${action} slurmctld`, (err, stdout, stderr) => {       // executes the related action to start, stop or restart using the command 
        if (err) {
          return res.status(500).json({ error: stderr });                        // returns the status in json format
        }
        res.send(`${action.charAt(0).toUpperCase() + action.slice(1)} successful`);
      });

  })