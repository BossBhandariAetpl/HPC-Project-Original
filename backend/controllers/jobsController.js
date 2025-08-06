import asyncHandler from 'express-async-handler';
import mysqldb from '../config/mysqldb.js';
import { exec } from "child_process";
import path from "path";

// =====================
// Get All Jobs
// =====================
export const getAllJobs = asyncHandler(async (req, res) => {
    try {
        // You can customize the query below as needed
        const [jobs] = await mysqldb.query('SELECT * FROM slurm_acct_db.cluster_job_table;');
        res.status(200).json(jobs);
    } catch (err) {
        console.error("Database Error in getAllJobs:", err.message);
        res.status(500).json({ error: err.message });
    }
});

// =======================
// Execute Job Script
// =======================
export const executeJob = asyncHandler(async (req, res) => {
    const { filename, path: relativePath = '' } = req.body;
    const user = req.user?.username || req.body.user || "ldapuser1";

    // Debug incoming request
    console.log("==> Execute Job request received:");
    console.log("Filename:", filename);
    console.log("Relative path:", relativePath);
    console.log("User:", user);

    if (!filename || typeof filename !== 'string') {
        return res.status(400).json({ error: 'Filename is required and must be a string.' });
    }

    // Validate extension (.sh only for SLURM)
    const ext = path.extname(filename).toLowerCase();
    if (ext !== '.sh') {
        return res.status(400).json({ error: 'Only .sh job scripts are allowed to be submitted.' });
    }

    // Build full path to script
    const filePath = path.join('/home', user, relativePath, filename);
    console.log("Full path to execute:", filePath);

    // Execute the job using sbatch
    exec(`sbatch "${filePath}"`, (error, stdout, stderr) => {
        console.log("stdout:", stdout);
        console.log("stderr:", stderr);

        if (error) {
            console.error("Error executing job:", error.message);
            return res.status(500).json({ error: `Failed to execute job: ${error.message}` });
        }

        // Extract Job ID from SLURM output
        const match = stdout.match(/Submitted batch job (\d+)/);
        const jobId = match ? match[1] : null;

        if (!jobId) {
            return res.status(500).json({ error: 'Job submitted but job ID could not be extracted.' });
        }

        res.json({
            message: "Job submitted successfully",
            jobId
        });
    });
});
