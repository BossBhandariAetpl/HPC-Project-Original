import asyncHandler from "express-async-handler";
import { exec } from 'child_process';

// Get All Jobs 
export const getUserJobsInfo = asyncHandler(async (req, res) => {
    const { user } = req.params;

    exec(`squeue --noheader --format='%i|%P|%j|%u|%t|%M|%D|%R' -u ${user}`, (error, stdout, stderr) => {
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
                return res.status(404).json({ error: "There are no jobs." });
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
