import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import { Button } from '@/components/ui/button';
import { FaFile } from "react-icons/fa";
import { GoFileDirectoryFill } from "react-icons/go";
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger } from "@/components/ui/context-menu";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { VscNewFile } from "react-icons/vsc";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FileManagerScreen = () => {
    const { userInfo } = useSelector((state) => state.auth);
    const { username } = userInfo;
    const [files, setFiles] = useState([]);
    const [fileContent, setFileContent] = useState('');
    const [currentPath, setCurrentPath] = useState('');
    const [dialogMode, setDialogMode] = useState('');
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogFileName, setDialogFileName] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    

    const defaultFileContent = `#!/bin/bash
#SBATCH --job-name=HelloName      
#SBATCH --output=helloName_output.txt  
#SBATCH --error=helloName_error.txt    
#SBATCH --ntasks=1                 
#SBATCH --cpus-per-task=1          
#SBATCH --time=00:10:00            

# Load any required modules (optional)
# module load some_module

# Run the command`;

    const fetchFiles = async (path = '') => {
        try {
            const response = await axios.get(`http://localhost:5173/api/filemanagement/fetchdirectories/${username}`, {
                params: { path }
            });
            setFiles(response.data);
            setCurrentPath(path);
        } catch (error) {
            console.error("Error fetching files:", error);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleFileAction = async () => {
        if (dialogMode === 'create') {
            try {
                await axios.post(`http://localhost:5173/api/filemanagement/createfile/${username}`, {
                    filename: dialogFileName,
                    content: fileContent,
                    path: currentPath
                });
                toast.success(`${dialogFileName} created successfully`);
                fetchFiles(currentPath);
            } catch (error) {
                toast.error(`Error creating ${dialogFileName}`);
                console.error("Error creating file:", error);
            }
        } else if (dialogMode === 'update') {
            try {
                await axios.put(`http://localhost:5173/api/filemanagement/updatefilecontent/${username}/${dialogFileName}`, {
                    content: fileContent
                }, {
                    params: { path: currentPath }
                });
                toast.success(`${dialogFileName} updated successfully`);
                fetchFiles(currentPath);
            } catch (error) {
                toast.error(`Error updating ${dialogFileName}`);
                console.error("Error updating file:", error);
            }
        }
        setIsDialogOpen(false);
    };

    const openCreateFileDialog = () => {
        setDialogMode('create');
        setDialogTitle('Create New File');
        setDialogFileName('');
        setFileContent(defaultFileContent);
        setIsDialogOpen(true);
    };

    const openUpdateFileDialog = async (filename) => {
        try {
            const response = await axios.get(`http://localhost:5173/api/filemanagement/filecontent/${username}/${filename}`, {
                params: { path: currentPath }
            });
            setDialogMode('update');
            setDialogTitle('Edit File');
            setDialogFileName(filename);
            setFileContent(response.data.content);
            setIsDialogOpen(true);
        } catch (error) {
            toast.error(`Error reading ${filename}`);
            console.error("Error reading file:", error);
        }
    };

    const deleteFile = async (filename) => {
        try {
            await axios.delete(`http://localhost:5173/api/filemanagement/deletefile/${username}/${filename}`, {
                params: { path: currentPath }
            });
            toast.success(`${filename} deleted successfully`);
            fetchFiles(currentPath);
        } catch (error) {
            toast.error(`Error deleting ${filename}`);
            console.error("Error deleting file:", error);
        }
    };

    const executeFile = async (filename) => {
        try {
          const response = await axios.post(`http://localhost:8000/api/jobs/execute`, {
            filename,
            path: currentPath // send relative path if in a subdirectory
          });
          alert(`Job submitted successfully: ${response.data.jobId}`);
        } catch (error) {
          console.error(error);
          alert("Failed to execute job.");
        }
      };
      
      

    const openDirectory = (dirName) => {
        const newPath = currentPath ? `${currentPath}/${dirName}` : dirName;
        fetchFiles(newPath);
    };

    return (
        <div className="relative">
            <div className="h-auto md:h-[750px] px-4">
                <h1 className="text-3xl text-center py-6 font-bold text-gray-800">File Manager</h1>

                {currentPath && (
                    <div className="mb-4 text-gray-600">
                        <span>Current Path: {currentPath}</span>
                        <Button 
                            className="ml-4 bg-green-500 hover:bg-green-700"
                            onClick={() => {
                                const pathParts = currentPath.split('/');
                                pathParts.pop();
                                fetchFiles(pathParts.join('/'));
                            }}
                        >
                            Go Back
                        </Button>
                    </div>
                )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {files.map((file, index) => (
                <ContextMenu key={index}>
                <ContextMenuTrigger>
                    <div 
                    className="flex flex-col items-center p-2 bg-gray-100 rounded-md shadow-sm cursor-pointer"
                    onClick={() =>
                        file.isDirectory
                        ? openDirectory(file.name)
                        : openUpdateFileDialog(file.name)
                    }
                    >
                    {file.isDirectory ? (
                        <GoFileDirectoryFill className="text-4xl sm:text-6xl text-blue-500" />
                    ) : (
                        <FaFile className="text-4xl sm:text-6xl text-yellow-500" />
                    )}
                    <span className="mt-2 text-center text-gray-700 font-medium truncate w-full">
                        {file.name}
                    </span>
                    </div>
                </ContextMenuTrigger>

                <ContextMenuContent>
                    <ContextMenuItem
                    className="cursor-pointer text-green-500"
                    onClick={() =>
                        file.isDirectory
                        ? openDirectory(file.name)
                        : openUpdateFileDialog(file.name)
                    }
                    >
                    {file.isDirectory ? "Open Directory" : "Read File"}
                    </ContextMenuItem>

                    <ContextMenuItem
                    className="cursor-pointer text-red-500"
                    onClick={() => deleteFile(file.name)}
                    >
                    Delete
                    </ContextMenuItem>

                    {!file.isDirectory && (
                    <ContextMenuItem
                        className="cursor-pointer text-purple-500"
                        onClick={() => executeFile(file.name)}
                    >
                        Execute
                    </ContextMenuItem>
                    )}
                </ContextMenuContent>
                </ContextMenu>
            ))}
            </div>


                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>{dialogTitle}</DialogTitle>
                        </DialogHeader>
                        {dialogMode === 'create' && (
                            <input
                                type="text"
                                value={dialogFileName}
                                onChange={(e) => setDialogFileName(e.target.value)}
                                placeholder="Enter file name"
                                className="w-full p-2 mt-4 border rounded-md"
                            />
                        )}
                        <textarea
                            value={fileContent}
                            onChange={(e) => setFileContent(e.target.value)}
                            rows={10}
                            placeholder="Enter file content"
                            className="w-full p-2 mt-4 border rounded-md"
                        />
                        <DialogFooter>
                            <Button onClick={handleFileAction} className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                                {dialogMode === 'create' ? "Create" : "Update"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <VscNewFile
                onClick={openCreateFileDialog}
                className="fixed bottom-12 right-12 md:right-10 cursor-pointer text-blue-500 text-4xl sm:text-5xl p-2 shadow-md shadow-slate-400 hover:shadow-lg"
            />
        </div>
    );
};

export default FileManagerScreen;
