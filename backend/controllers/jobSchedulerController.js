import asyncHandler from "express-async-handler";
import { exec } from 'child_process';


// get the information of all the Nodes
export const getNodesInfo = asyncHandler(async (req, res) => {
    exec("lsdef -t node -l", (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return res.status(500).json({ error: stderr });
        }

        const timestamp = new Date().toISOString();

        const nodeBlocks = stdout
            .split(/\n\n+/) // split nodes by double line breaks
            .map(block => block.trim())
            .filter(block => block.length > 0);

        if (nodeBlocks.length === 0) {
            return res.status(404).json({ error: "No node data found." });
        }

        const nodes = nodeBlocks.map(block => {
            const lines = block.split("\n");
            const node = {};
            for (const line of lines) {
                const [key, ...rest] = line.split("=");
                if (key && rest.length > 0) {
                    node[key.trim()] = rest.join("=").trim();
                }
            }
            return node;
        });

        const getNodeInfo = async (nodeName) => {
            return new Promise((resolve, reject) => {
                const sanitizedNodeName = nodeName.replace(/[^a-zA-Z0-9.-]/g, "");
                if (!sanitizedNodeName) {
                    return reject("Invalid node name.");
                }

                exec(
                    `ssh ${sanitizedNodeName} "ip link show | grep 'ether' | awk '{print \\$2}' | head -n1 && sudo dmidecode -t system | grep -A3 '^System Information'"`,
                    (err, stdout, stderr) => {
                        if (err) {
                            console.error(`Error fetching node info for ${sanitizedNodeName}: ${err.message}`);
                            return resolve({ mac: "N/A", type: "Error fetching info" });
                        }
                        if (stderr && stderr.toLowerCase().includes("permission denied")) {
                            console.error(`SSH permission error for ${sanitizedNodeName}: ${stderr}`);
                            return resolve({ mac: "N/A", type: "Permission denied" });
                        }

                        const [mac, ...typeInfo] = stdout.trim().split("\n");
                        const type = typeInfo.join(" ");
                        resolve({ mac: mac || "N/A", type: type || "N/A" });
                    }
                );
            });
        };

        const getNodeDetails = async () => {
            try {
                const detailedNodes = await Promise.all(
                    nodes.map(async (node) => {
                        const nodeName = node.name || node["Object Name"] || node["noderes.name"];
                        if (!nodeName) return node;

                        const info = await getNodeInfo(nodeName);
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
            const trimmedOutput = stdout.trim();
            if (!trimmedOutput) {
                return res.status(404).json({ error: "There are no jobs." });
            }

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
    const { jobId } = req.params;
    console.log(jobId);

    exec(`scancel ${jobId}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).json({ error: error.message });
        }
        if (stderr) {
            console.error(`Stderr: ${stderr}`);
            return res.status(500).json({ error: stderr });
        }

        return res.status(200).json({ message: `Job ${jobId} has been canceled.` });
    });
});
