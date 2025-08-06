import fs from 'fs/promises';
import path from 'path';
import asyncHandler from 'express-async-handler';
import { exec } from 'child_process'; // <-- Needed for executeFile

// Fetch directories and files (show directories first)
export const fetchDirectories = asyncHandler(async (req, res) => {
    const { user } = req.params;
    const dirPath = req.query.path ? `/home/${user}/${req.query.path}` : `/home/${user}`;

    try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true });
        const result = entries
            .filter(entry => !entry.name.startsWith('.'))
            .map(entry => ({
                name: entry.name,
                isDirectory: entry.isDirectory(),
            }))
            .sort((a, b) => {
                if (a.isDirectory && !b.isDirectory) return -1;
                if (!a.isDirectory && b.isDirectory) return 1;
                return a.name.localeCompare(b.name);
            });

        res.json(result);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return res.status(404).json({ error: 'Directory not found' });
        }
        if (error.code === 'EACCES') {
            return res.status(403).json({ error: 'Permission denied' });
        }
        res.status(500).json({ error: 'Unable to read directory' });
    }
});

// Read file content
export const fetchFileContent = asyncHandler(async (req, res) => {
    const { user, filename } = req.params;
    const relativePath = req.query.path || '';
    const filePath = path.join('/home', user, relativePath, filename);

    try {
        const data = await fs.readFile(filePath, 'utf-8');
        res.json({ content: data });
    } catch (err) {
        if (err.code === 'ENOENT') {
            return res.status(404).json({ error: 'File not found' });
        }
        if (err.code === 'EACCES') {
            return res.status(403).json({ error: 'Permission denied' });
        }
        res.status(500).json({ error: 'Unable to read file' });
    }
});

// Update file content
export const updateFileContent = asyncHandler(async (req, res) => {
    const { user, filename } = req.params;
    const { content, path: relativePath = '' } = req.body;
    const filePath = path.join('/home', user, relativePath, filename);

    if (!content) {
        return res.status(400).json({ error: 'File content is required' });
    }

    try {
        await fs.writeFile(filePath, content, 'utf-8');
        res.json({ message: 'File updated successfully' });
    } catch (err) {
        if (err.code === 'ENOENT') {
            return res.status(404).json({ error: 'File not found' });
        }
        if (err.code === 'EACCES') {
            return res.status(403).json({ error: 'Permission denied' });
        }
        res.status(500).json({ error: 'Unable to update file' });
    }
});

// Delete file or directory
export const deleteFile = asyncHandler(async (req, res) => {
    const { user, filename } = req.params;
    const relativePath = req.query.path || '';
    const filePath = path.join('/home', user, relativePath, filename);

    try {
        const stats = await fs.stat(filePath);

        if (stats.isDirectory()) {
            await fs.rm(filePath, { recursive: true, force: true });
            res.json({ message: 'Directory deleted successfully' });
        } else {
            await fs.unlink(filePath);
            res.json({ message: 'File deleted successfully' });
        }
    } catch (err) {
        if (err.code === 'ENOENT') {
            return res.status(404).json({ error: 'File or directory not found' });
        }
        if (err.code === 'EACCES') {
            return res.status(403).json({ error: 'Permission denied' });
        }
        res.status(500).json({ error: 'Unable to delete file or directory' });
    }
});

// Create file
export const createFile = asyncHandler(async (req, res) => {
    const { user } = req.params;
    const { filename, content, path: relativePath = '' } = req.body;
    const filePath = path.join('/home', user, relativePath, filename);

    if (!filename) {
        return res.status(400).json({ error: 'Filename is required' });
    }

    try {
        await fs.writeFile(filePath, content || '');
        res.json({ message: 'File created successfully' });
    } catch (err) {
        if (err.code === 'EACCES') {
            return res.status(403).json({ error: 'Permission denied' });
        }
        res.status(500).json({ error: 'Unable to create file' });
    }
});

// Execute a file with extension .sh or .exe
export const executeFile = async (req, res) => {
    try {
        const { user: username, filename } = req.params;
        const { path: relativePath } = req.query;

        const allowedExtensions = ['.sh', '.exe'];
        const fileExtension = path.extname(filename).toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
            return res.status(400).json({ error: 'Only .sh or .exe files can be executed.' });
        }

        const basePath = path.join('/home', username);
        const fullPath = path.join(basePath, relativePath || '', filename);

        if (!fullPath.startsWith(basePath)) {
            return res.status(403).json({ error: 'Access outside user directory is not allowed.' });
        }

        try {
            await fs.access(fullPath);
        } catch {
            return res.status(404).json({ error: 'File not found.' });
        }

        let command;
        if (fileExtension === '.sh') {
            command = `sbatch "${fullPath}"`;
        } else if (fileExtension === '.exe') {
            command = `"${fullPath}"`;
        }

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error('Execution error:', error);
                return res.status(500).json({ error: error.message });
            }

            res.status(200).json({
                message: 'Execution triggered successfully.',
                output: stdout || stderr,
            });
        });
    } catch (err) {
        console.error('Execution failed:', err);
        res.status(500).json({ error: 'Server error during file execution.' });
    }
};
