import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PiPowerDuotone } from "react-icons/pi";
import { LuPowerOff } from "react-icons/lu";
import { MdOutlineRestartAlt } from "react-icons/md";

const SlurmcontrollerScreen = ({ title, apiBase }) => {
    const [status, setStatus] = useState(''); // To store the service status
    const [nodes, setNodes] = useState([]);

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

    const fetchNodeList = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/scheduler/getnodesinfo"); // Replace with your API endpoint
            setNodes(response.data?.nodes || []);
        } catch (err) {
            console.error('Error fetching nodes:', err);
        }
    };

    const handleNodeAction = async (node, action) => {
        try {
            await axios.post(`${apiBase}/postaction/${node}/${action}`); // Dynamic endpoint for nodes
            fetchNodeList(); // Refresh node data
        } catch (err) {
            console.error(`Error performing ${action} on ${node}:`, err);
        }
    };

    useEffect(() => {
        fetchNodeList();
        fetchStatus();
    }, []);

    return (
        <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">{title}</h1>

            {["Slurm Controller", "Slurm Database"].includes(title) && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <p className="text-xl mb-6">
                        <span className="font-semibold text-gray-700">Status:</span>{" "}
                        <span
                            className={`inline-block px-3 py-1 rounded-full text-white text-sm font-medium ${status === "Running"
                                ? "bg-green-500"
                                : status === "Stopped"
                                    ? "bg-red-500"
                                    : "bg-yellow-500"
                                }`}
                        >
                            {status || "Fetching..."}
                        </span>
                    </p>

                    <div className="flex flex-wrap gap-4 items-center">
                        {status === "Running" ? (
                            <button
                                onClick={() => handleAction("stop")}
                                className="w-14 h-14 rounded-full bg-red-500 hover:bg-red-600 shadow-md flex justify-center items-center"
                                title={`Stop ${title}`}
                            >
                                <LuPowerOff className="text-white text-2xl" />
                            </button>
                        ) : (
                            <button
                                onClick={() => handleAction("start")}
                                className="w-14 h-14 rounded-full bg-green-500 hover:bg-green-600 shadow-md flex justify-center items-center"
                                title={`Start ${title}`}
                            >
                                <PiPowerDuotone className="text-white text-2xl" />
                            </button>
                        )}

                        <button
                            onClick={() => handleAction("restart")}
                            className="w-14 h-14 rounded-full bg-gray-500 hover:bg-gray-600 shadow-md flex justify-center items-center"
                            title={`Restart ${title}`}
                        >
                            <MdOutlineRestartAlt className="text-white text-2xl" />
                        </button>

                        <button
                            onClick={fetchStatus}
                            className="px-4 py-2 text-sm font-semibold bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                        >
                            Refresh Status
                        </button>
                    </div>
                </div>
            )}

            {title === "Compute Node Agent" && (
                <div className="bg-white rounded-xl shadow-lg p-6 mt-6">
                    <h2 className="text-2xl font-semibold mb-4 text-gray-800">Compute Nodes</h2>
                    {nodes.length > 0 ? (
                        nodes.map((node, index) => (
                            <div
                                key={index}
                                className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 p-4 border rounded-lg bg-gray-50"
                            >
                                <div className="mb-2 md:mb-0">
                                    <p className="text-gray-700 font-semibold">
                                        Node: <span className="font-normal">{node.NODELIST}</span>
                                    </p>
                                    <p className="text-gray-700 font-semibold">
                                        Status: <span className="font-normal">{node.STATE}</span>
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleNodeAction(node.NODELIST, "start")}
                                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
                                    >
                                        Start
                                    </button>
                                    <button
                                        onClick={() => handleNodeAction(node.NODELIST, "stop")}
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                    >
                                        Stop
                                    </button>
                                    <button
                                        onClick={() => handleNodeAction(node.NODELIST, "restart")}
                                        className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
                                    >
                                        Restart
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No nodes available.</p>
                    )}
                </div>
            )}
        </div>
    );

};

export default SlurmcontrollerScreen;
