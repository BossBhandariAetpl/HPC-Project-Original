import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageNodeScreen = () => {
    const [nodes, setNodes] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch compute nodes
    const fetchNodes = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:8000/api/node/getallnodes'); // Replace with your API endpoint
            setNodes(response.data.nodes); // Access the 'nodes' array from the response
        } catch (error) {
            console.error('Error fetching nodes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNodeSelect = (node) => {
        setSelectedNode(node);
    };

    const handlePowerAction = async (nodeId, action) => {
        try {
            await axios.post(`/api/nodes/${nodeId}/power`, { action }); // Example power action API
            alert(`Node ${action} successfully!`);
        } catch (error) {
            console.error(`Error performing ${action} action:`, error);
        }
    };

    return (
        <div>
            <h1 className='text-2xl font-semibold text-center'>Manage Compute Nodes</h1>

            <button
                onClick={fetchNodes}
                className="px-4 py-2 bg-blue-500 text-white rounded"
            >
                Get All Nodes
            </button>

            {loading ? (
                <p>Loading nodes...</p>
            ) : (
                nodes && <div>
                    <h2 className='text-xl font-semibold text-center'>Node List</h2>
                    <ul>
                        {nodes.map((node, index) => (
                            <button
                                key={index}
                                className="py-2 px-2 rounded border-1  bg-gray-200 border-gray-400 text-gray-700 mb-2 cursor-pointer font-semibold"
                                onClick={() => handleNodeSelect({ name: node })} // Wrap node in an object to simulate a node object
                            >
                                {node}
                            </button>
                        ))}
                    </ul>

                    {selectedNode && (
                        <div>
                            <h3>Selected Node: {selectedNode.name}</h3>
                          
                            <p>Status: Unknown</p>
                            <p>IP: Unknown</p>
                            <button onClick={() => handlePowerAction(selectedNode.name, 'reboot')} className="px-4 py-2 bg-yellow-500 text-white rounded ">Reboot</button>
                            <button onClick={() => handlePowerAction(selectedNode.name, 'poweroff')} className="px-4 py-2 bg-red-500 text-white rounded mx-4">Power Off</button>
                            <button onClick={() => handlePowerAction(selectedNode.name, 'poweron')} className="px-4 py-2 bg-green-500 text-white rounded">Power On</button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ManageNodeScreen;
