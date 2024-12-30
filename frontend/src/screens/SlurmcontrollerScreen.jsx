import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PiPowerDuotone } from "react-icons/pi";
import { LuPowerOff } from "react-icons/lu";
import { MdOutlineRestartAlt } from "react-icons/md";

const SlurmcontrollerScreen = ({ title, apiBase }) => {
    const [status, setStatus] = useState(''); // To store the service status

    // Fetch the current status
    const fetchStatus = async () => {
        try {
            const response = await axios.get(`${apiBase}/getstatus`); // Dynamic API endpoint
            setStatus(response.data.status);
        } catch (error) {
            console.error('Error fetching status:', error);
            setStatus('Error fetching status');
        }
    };

    // Start, stop, or restart the service
    const handleAction = async (action) => {
        try {
            await axios.post(`${apiBase}/postaction/${action}`); // Dynamic API endpoint
            fetchStatus(); // Update status after action
        } catch (error) {
            console.error(`Error performing ${action}:`, error);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    return (
        <div>
            {(title === "Slurm Controller" || title === "Slurm Database") && (
                <div className="p-6 bg-gray-100">
                    <h1 className="text-2xl font-bold mb-4">{title}</h1>
                    <div className="bg-white p-4 rounded shadow-md">
                        <p className="mb-4 text-lg">
                            <strong>Status:</strong> {status || 'Fetching...'}
                        </p>
                        <div className="flex space-x-6 items-center">
                            {status === 'Running' ? (
                                <button
                                    onClick={() => handleAction('stop')}
                                    className="p-4 rounded-full bg-red-500 hover:bg-red-600 shadow-md focus:outline-none flex justify-center items-center"
                                    title={`Stop ${title}`}
                                >
                                    <LuPowerOff className="text-white text-2xl" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => handleAction('start')}
                                    className="p-4 rounded-full bg-green-500 hover:bg-green-600 shadow-md focus:outline-none flex justify-center items-center"
                                    title={`Start ${title}`}
                                >
                                    <PiPowerDuotone className="text-white text-2xl" />
                                </button>
                            )}
                            <button
                                onClick={() => handleAction('restart')}
                                className="p-4 rounded-full bg-gray-500 hover:bg-gray-600 shadow-md focus:outline-none flex justify-center items-center"
                                title={`Restart ${title}`}
                            >
                                <MdOutlineRestartAlt className="text-white text-2xl" />
                            </button>
                            <button
                                onClick={fetchStatus}
                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none"
                            >
                                Refresh Status
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {title === "Compute Node Agent" && (
                <div className="p-6 bg-gray-100">
                    <h1 className="text-2xl font-bold mb-4">{title}</h1>
                    <div className="bg-white p-4 rounded shadow-md">
                        <p>This section is for managing Compute Node Agents.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SlurmcontrollerScreen;
