import asyncHandler from 'express-async-handler';
import { exec } from 'child_process';






// Compute Node Management Start
// Access only Admin Role
export const getAllNodes = asyncHandler(async (req, res) => {
    // Define the path to the Bash script
    // const scriptPath = path.join(__dirname, '../scripts/getallnodes.sh');

    // Define the command to execute the script with sudo
    // const command = 'lsdef -t node -l';
     const command = 'nodels';

  

    // Execute the command
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing script: ${error.message}`);
            return res.status(500).json({ error: 'Script execution failed' });
        }

        if (stderr) {
            console.error(`Script error output: ${stderr}`);
            return res.status(500).json({ error: 'Script encountered an error' });
        }

        if (stdout) {
            console.log(`Script output: ${stdout}`);
            // Optionally, parse the output into JSON here
            return res.status(200).json({ output: stdout });
        } else {
            console.log('No output from the script');
            return res.status(204).send(); // No Content
        }
    });
});
  
  // Helper function to parse the stdout and create an array of JSON objects
  const parseNodesOutput = async (output) => {
    const nodes = [];
    let currentNode = {};
  
    // Split output by lines and process each line
    output.split('\n').forEach(line => {
      line = line.trim();
  
      if (line.startsWith('Object name:')) {
        // When encountering a new node, push the previous node (if any) into the array
        if (Object.keys(currentNode).length !== 0) {
          nodes.push(currentNode);
        }
        // Start a new node object
        currentNode = { name: line.split(':')[1].trim() };
      } else if (line && line.includes('=')) {
        // Split the attribute line into key and value
        const [key, value] = line.split('=').map(part => part.trim());
        currentNode[key] = value;
      }
    });
  
    // Push the last node after looping ends
    if (Object.keys(currentNode).length !== 0) {
      nodes.push(currentNode);
    }
  
    return nodes;
  };
  
