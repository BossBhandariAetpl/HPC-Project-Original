import asyncHandler from 'express-async-handler';
import { exec } from 'child_process';
import util from 'util';

const execAsync = util.promisify(exec);

// Helper function to parse the stdout and create an array of JSON objects
const parseNodesOutput = (output) => {
  const nodes = [];
  let currentNode = {};

  output.split('\n').forEach(line => {
    line = line.trim();

    if (line.startsWith('Object name:')) {
      if (Object.keys(currentNode).length !== 0) {
        nodes.push(currentNode);
      }
      currentNode = { name: line.split(':')[1].trim() };
    } else if (line && line.includes('=')) {
      const [key, value] = line.split('=').map(part => part.trim());
      currentNode[key] = value;
    }
  });

  if (Object.keys(currentNode).length !== 0) {
    nodes.push(currentNode);
  }

  return nodes;
};

// Access only Admin Role
export const getAllNodes = asyncHandler(async (req, res) => {
  const command = `lsdef -t node -l`;

  console.log('Entry point'); // Debug

  try {
    const { stdout, stderr } = await execAsync(command);

    if (stderr) {
      console.error(`Command stderr: ${stderr}`);
      return res.status(500).json({ error: 'Command execution error', details: stderr });
    }

    if (!stdout.trim()) {
      return res.status(204).send(); // No content
    }

    console.log(stdout); // For inspection
    const nodes = parseNodesOutput(stdout);
    return res.status(200).json({ nodes });

  } catch (error) {
    console.error(`Error executing command: ${error.message}`);
    return res.status(500).json({ error: 'Script execution failed', details: error.message });
  }
});
