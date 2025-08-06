import asyncHandler from 'express-async-handler';
import { exec } from 'child_process';

// This function calls the GET API on the specified compute node to check the slurmd service status
export const getcomputenodeagentStatus = asyncHandler(async (req, res) => {
    const { node } = req.params;

    if (!node || typeof node !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing node name' });
    }

    exec(`xdsh ${node} systemctl status slurmd`, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error checking status of slurmd on ${node}: ${stderr || err.message}`);
            return res.status(500).json({
                status: 'Error fetching status',
                error: stderr || err.message
            });
        }

        const isActive = stdout.includes('active (running)');
        return res.json({
            status: isActive ? 'Running.....' : 'Stopped.....'
        });
    });
});


// This function performs post actions (start, stop, restart) on slurmd for a given node
export const postActions = asyncHandler(async (req, res) => {
    const { node, action } = req.params;

    console.log(node, action);

    if (!node || typeof node !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing node name' });
    }

    if (!['start', 'stop', 'restart'].includes(action)) {
        return res.status(400).send('Invalid action');
    }

    exec(`xdsh ${node} systemctl ${action} slurmd`, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error performing ${action} on ${node}: ${stderr || err.message}`);
            return res.status(500).json({
                error: stderr || err.message
            });
        }

        res.send({
            message: `${action.charAt(0).toUpperCase() + action.slice(1)} successful`
        });
    });
});
