import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import axios from 'axios';
import ReactSpeedometer from "react-d3-speedometer"


// Register the chart components with ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const ClusterScreen = () => {
    // Define state for disk usage data
    const [diskUsage, setDiskUsage] = useState({ path: '', total: 0, used: 0, free: 0 });
    const [cpuUsage, setCPUUsage] = useState({ cpuUsage: 0 });

    console.log(cpuUsage)

    const fetchDiskUsage = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/networks/getdiskusage');
            const { total, free, used, path } = response.data.output; // Adjust based on API response structure
            setDiskUsage({ used, free, total, path });
        } catch (error) {
            console.error('Error fetching disk usage data:', error);
        }
    };
    const fetchCpuUsage = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/networks/getcpuusage');
            const { cpuUsage } = response.data; // Adjust based on API response structure
            setCPUUsage({ cpuUsage });
        } catch (error) {
            console.error('Error fetching CPU usage data:', error);
        }
    };


    useEffect(() => {
        fetchDiskUsage()
        const diskInterval = setInterval(fetchDiskUsage, 1000);

        return () => clearInterval(diskInterval);
    }, []);

    useEffect(() => {
        fetchCpuUsage()

        const cpuInterval = setInterval(fetchCpuUsage, 1000);

        return () => clearInterval(cpuInterval);
    }, []);

    // Define the data for the bar graph (Cluster Nodes)
    const nodeData = {
        labels: ['Node Down', 'Total Nodes', 'Node Up'],
        datasets: [
            {
                label: 'Cluster Nodes Status',
                data: [1, 2, 1],
                backgroundColor: [
                    'rgb(255, 0, 0)', // Red color for Node Down
                    'rgba(54, 162, 235)', // Blue color for Total Nodes
                    'rgb(0, 128, 0)', // Green color for Node Up
                ],
                borderColor: [
                    'rgba(255, 0, 0,1)',   // Red border for Node Down
                    'rgba(54, 162, 235, 1)',   // Blue border for Total Nodes
                    'rgba(0, 128, 0,1)',   // Green border for Node Up
                ],
                borderWidth: 1,
            },
        ],
    };

    // Define data for Disk Management (Pie Chart)
    const diskData = {
        labels: [
            `Used Disk\n${diskUsage.used} GB`,
            `Free Disk\n${diskUsage.free} GB`,

        ],
        datasets: [
            {
                label: 'Disk Usage',
                data: [diskUsage.used, diskUsage.free], // Use fetched data; 0 for path as it's not a part of the usage
                backgroundColor: [
                    'rgb(255, 0, 0)',  // Red for Used Disk
                    'rgb(0, 128, 0)',  // Green for Free Disk

                ],
                borderColor: [
                    'rgb(255,0 , 0)',    // Red border for Used Disk
                    'rgb(0, 128, 0)',    // Green border for Free Disk

                ],
                borderWidth: 1,
            },
        ],
    };

    // Define the options for the bar graph and pie chart
    const options = {
        responsive: true,
        maintainAspectRatio: false, // Allows custom height and width
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
            },
        },
    };

    return (
        <div className="p-6 bg-gray-100 rounded-lg">
            <h2 className="text-3xl text-center py-6 font-bold text-gray-800">Cluster Monitoring</h2>

            <div className="flex flex-wrap justify-center gap-6"> {/* Row layout */}

                <div className="flex-1 max-w-xl h-80  rounded-lg p-4">
                    <h3 className="text-xl font-semibold mb-4  text-black text-center">CPU Usage(%)</h3>
                    <div className='flex justify-center'>
                        <ReactSpeedometer maxValue={100} value={cpuUsage?.cpuUsage} needleColor='black' startColor='green' segments={10} endColor='red' textColor='#AAA' />

                    </div>

                </div>

                {/* Container for Cluster Node Status (Bar Chart) */}
                <div className="flex-1 max-w-xl h-80 bg-white rounded-lg p-4">

                    <Bar data={nodeData} options={options} />
                </div>

                {/* Container for Disk Management (Pie Chart) */}
                <div className="flex flex-wrap max-w-xl h-80 rounded-lg p-4">
                    <div className='flex justify-between items-center'>

                        <h3 className="text-xl font-semibold  text-gray-700 text-center">Disk Management</h3>
                        <p className="font-semibold text-gray-600">Mount Point: {diskUsage.path}</p>
                        <p className="font-semibold text-gray-600">Total Disk: {diskUsage.total} GB</p>
                    </div>

                    <Pie data={diskData} options={{ ...options }} />
                </div>

            </div>
        </div>



    );
};

export default ClusterScreen;
