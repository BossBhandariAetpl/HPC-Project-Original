import asyncHandler from "express-async-handler";
import { exec } from 'child_process';



// get the information of all the Nodes
// function to get Information of all node 

export const getNodesInfo = asyncHandler(async (req, res) => {
    exec("sinfo -lN", (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return res.status(500).json({ error: stderr });
        }

        // Separate the first line (timestamp) and process the rest
        const lines = stdout.trim().split("\n");                     // trims the string and splits by next line
        const timestamp = lines[0];                                  // First line is the timestamp
        const dataLines = lines.slice(1);                            // Remaining lines contain the table data

        // Convert the output into a structured format
        const headers = dataLines[0].split(/\s+/);                   // Extract headers
        const nodes = dataLines.slice(1).map(line => {                // Gets the node name 
            const values = line.split(/\s+/);
            return headers.reduce((obj, header, index) => {
                obj[header] = values[index];
                return obj;
            }, {});
        });


        // Get additional info (MAC Address & Type) for each node
        const getNodeInfo = async (nodeName) => {
            return new Promise((resolve, reject) => {
                const sanitizedNodeName = nodeName.replace(/[^a-zA-Z0-9.-]/g, ""); // Remove invalid characters
                if (!sanitizedNodeName) {
                    return reject("Invalid node name.");
                }
        
                exec(
                    `ssh ${sanitizedNodeName} "ip link show | grep 'ether' | awk '{print \\$2}' && sudo dmidecode | grep -A3 '^System Information'"`,
                    (err, stdout, stderr) => {
                        if (err) {
                            console.error(`Error fetching node info for ${sanitizedNodeName}: ${err.message}`);
                            return reject(err.message);
                        }
                        if (stderr) {
                            console.error(`Stderr for ${sanitizedNodeName}: ${stderr}`);
                            return reject(stderr);
                        }
                        const [mac, ...typeInfo] = stdout.trim().split("\n");
                        const type = typeInfo.join(" ");
                        resolve({ mac, type });
                    }
                );
            });
        };

        const getNodeDetails = async () => {
            try {
                const detailedNodes = await Promise.all(
                    nodes.map(async (node) => {
                        const info = await getNodeInfo(node.NODELIST);
                        return {
                            ...node,
                            MAC: info.mac,
                            Type: info.type,
                        };
                    })
                );
                res.status(200).json({ timestamp, nodes: detailedNodes });
            } catch (err) {
                console.error(`Error fetching node details: ${err}`);
                res.status(500).json({ error: err });
            }
        };

        getNodeDetails();
    });
});




// Get All Running Jobs 

export const getJobsInfo = asyncHandler(async (req, res) => {
    

    exec("squeue --noheader --format='%i|%P|%j|%u|%t|%M|%D|%R'", (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return res.status(500).json({ error: stderr });
        }

        try {
          // Check if the output is empty
          const trimmedOutput = stdout.trim();
          if (!trimmedOutput) {
              return res.status(500).json({ error: "There are no jobs." });
          }

          // Process the output into a structured format
          const lines = trimmedOutput.split("\n");
          const jobs = lines.map(line => {
              const [JOBID, PARTITION, NAME, USER, ST, TIME, NODES, NODELIST_REASON] = line.split("|");
              return {
                  JOBID,
                  PARTITION,
                  NAME,
                  USER,
                  ST,
                  TIME,
                  NODES,
                  "NODELIST(REASON)": NODELIST_REASON,
              };
          });

          return res.status(200).json({ jobs });
        } catch (parseError) {
            console.error(`Parse Error: ${parseError.message}`);
            return res.status(500).json({ error: "Failed to parse job information." });
        }
    });
});




// Kill a Job
export const killJob = asyncHandler(async (req, res) => {
    const { jobId } = req.params; // Get the job ID from the request parameters
    console.log(jobId)
    exec(`scancel ${jobId}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return res.status(500).json({ error: stderr });
        }

        // If job is successfully canceled
        return res.status(200).json({ message: `Job ${jobId} has been canceled.` });
    });
});