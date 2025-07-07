import asyncHandler from 'express-async-handler';
import { exec } from 'child_process';



// This whole function that is made below is nothing but a GET API calling function which calls the function to GET 
// the status(response) from the api link that has been create for a remote node.

// Access only Admin Role
export const getcomputenodeagentStatus = asyncHandler(async (req, res) => {             // GETs the request and sends the response
    const { node } = req.params;                                                        // requests for the command from the compute node
    exec(`xdsh ${node} systemctl status slurmd`, (err,stdout,stderr) => {               // executes this command to check the status of whether the slurmd Daemon/service is running or not
        if (err) {                                                                      // checks the error status returns the following response
            return res.status(500).json({ status: 'Error fetching status', error: stderr });
          }
          const isActive = stdout.includes('active (running)');                        // matches the string passed 
          return res.json({ status: isActive ? 'Running.....' : 'Stopped.....' });     // ternary conditioning whether the status is runnning or has been stopped
    })
    
  });
  
  // post actions 
  export const postActions = asyncHandler(async(req,res) => {              // again takes the request response as parameter of the function
    const { node,action } = req.params;
    console.log(node , action)
    if (!['start', 'stop', 'restart'].includes(action)) {                  // if the action is not start stop or restart then it will throw an error
        return res.status(400).send('Invalid action');
      }
      exec(`xdsh ${node} systemctl ${action} slurmd`, (err, stdout, stderr) => { // then executes this command 
        if (err) {
          return res.status(500).json({ error: stderr });                        // if error occurs in the command that ran the it will return 500 error
        }
        res.send({message :`${action.charAt(0).toUpperCase() + action.slice(1)} successful`}); // returns the status 
      });

  })