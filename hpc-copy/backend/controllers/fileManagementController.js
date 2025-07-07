import fs from 'fs/promises';        // Use promise-based API and use it with await functions 
import path from 'path';             // built in node.js module to safely connect the file structure  
import asyncHandler from 'express-async-handler'; // Automatic error handling instead of using try and except block 

// function to fetch directories and Files
export const fetchDirectories = asyncHandler(async (req, res) => {
    const {user} = req.params                                    // extracts the username from the url 
    const dirPath = req.query.path ||   `/home/${user}`;         // Default to the current directory and creates a path like 

    try {
        const entries = await fs.readdir(dirPath, { withFileTypes: true }); // reads the directory and gives all the file/folders present in that path  it also distinguishes the file and folders 
        const result = entries
            .filter(entry => !entry.name.startsWith('.')) // Exclude hidden files
            .map(entry => ({
                name: entry.name,
                isDirectory: entry.isDirectory(),
            }));                                          // Builds a simplified whether the file/folder present is a file/folder or not with the name 
        res.json(result);                                 // sends a json response of the list   
    } catch (error) {
        if (error.code === 'ENOENT') {                    // ENOENT: error no entity whether it is a directory or not
            return res.status(404).json({ error: 'Directory not found' }); 
        }
        if (error.code === 'EACCES') {                    // EACCES : no permission to read that directory 
            return res.status(403).json({ error: 'Permission denied' });
        }
        res.status(500).json({ error: 'Unable to read directory' });     // for all other unexpected error 
    }
});


// function to read a fie 

export const fetchFileContent = asyncHandler(async (req, res) => {
    const {user, filename} = req.params
        const filePath = `/home/${user}/${filename}`
    if (!filePath) {                                                           // if not filepath then returns an error 
        return res.status(400).json({ error: 'File path is required' });
    }

    try {
        const data = await fs.readFile(filePath, 'utf-8');                  // waits and read the file with filepath as mentioned above 
        res.json({ content: data });                                        // responds in json format the content of the file 
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


// Function to Update a file

export const updateFileContent = asyncHandler(async (req, res) => {
    const { user, filename } = req.params;
    const { content } = req.body; // Assuming content is sent in the request body
    const filePath = `/home/${user}/${filename}`;

    if (!filePath) {
        return res.status(400).json({ error: 'File path is required' });
    }

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



// Function to Delete a file

export const deleteFile = asyncHandler(async (req, res) => {
    const { user, filename } = req.params;
    const filePath = `/home/${user}/${filename}`;

    if (!filePath) {
        return res.status(400).json({ error: 'File path is required' });
    }

    try {
        await fs.unlink(filePath);
        res.json({ message: 'File deleted successfully' });
    } catch (err) {
        if (err.code === 'ENOENT') {
            return res.status(404).json({ error: 'File not found' });
        }
        if (err.code === 'EACCES') {
            return res.status(403).json({ error: 'Permission denied' });
        }
        res.status(500).json({ error: 'Unable to delete file' });
    }
});



// Function to Create a File
export const createFile = asyncHandler(async (req, res) => {
    const { user } = req.params;
    const { filename, content } = req.body; // File content passed in the request body
    const filePath = `/home/${user}/${filename}`;

    if (!filename) {
        return res.status(400).json({ error: 'Filename is required' });
    }

    try {
        // Write content to the file (if content is undefined, an empty file is created)
        await fs.writeFile(filePath, content || '');
        res.json({ message: 'File created successfully' });
    } catch (err) {
        if (err.code === 'EACCES') {
            return res.status(403).json({ error: 'Permission denied' });
        }
        res.status(500).json({ error: 'Unable to create file' });
    }
});


