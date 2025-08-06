import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import axios from 'axios';
import ReactSpeedometer from "react-d3-speedometer"


// Register the chart components with ChartJS
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const ClusterMonitoringScreen = () => {
    // Define state for disk usage data
    const [diskUsage, setDiskUsage] = useState({ path: '', total: 0, used: 0, free: 0 });
    const [cpuUsage, setCPUUsage] = useState({ cpuUsage: 0 });
    const [nodes, setnodes] = useState([]);
    const fetchDiskUsage = async () => {
        try {
            const response = await axios.get('http://localhost:5173/api/networks/getdiskusage');
            const { total, free, used, path } = response.data.output; // Adjust based on API response structure
            setDiskUsage({ used, free, total, path });
        } catch (error) {
            console.error('Error fetching disk usage data:', error);
        }
    };
    const fetchCpuUsage = async () => {
        try {
            const response = await axios.get('http://localhost:5173/api/networks/getcpuusage');
            const { cpuUsage } = response.data; // Adjust based on API response structure
            setCPUUsage({ cpuUsage });
        } catch (error) {
            console.error('Error fetching CPU usage data:', error);
        }
    };


    const fetchNodeList = async () => {
        try {

            const response = await axios.get("http://localhost:5173/api/scheduler/getnodesinfo"); // Replace with your API endpoint
            setnodes(response.data?.nodes)
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchNodeList();
    }, []);


    useEffect(() => {
        fetchDiskUsage()
        const diskInterval = setInterval(fetchDiskUsage, 5000);

        return () => clearInterval(diskInterval);
    }, []);

    useEffect(() => {
        fetchCpuUsage()

        const cpuInterval = setInterval(fetchCpuUsage, 5000);

        return () => clearInterval(cpuInterval);
    }, []);

    const nodesDown = nodes && nodes.filter(node => node.STATE !== "idle").length;
    const totalNodes = nodes.length;
    const nodesUp = totalNodes - nodesDown;
    const result = [nodesDown, totalNodes, nodesUp];


    // Define the data for the bar graph (Cluster Nodes)
    const nodeData = {
        labels: ['Node Down', 'Total Nodes', 'Node Up'],
        datasets: [
            {
                label: 'Cluster Nodes Status',
                data: result,
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
        <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 min-h-screen">
          <h2 className="text-3xl text-center font-bold text-gray-800 mb-10">
            Cluster Monitoring Dashboard
          </h2>
      
          <div className="flex flex-wrap justify-center gap-6">
            
            {/* CPU Usage */}
            <div className="flex-1 max-w-xl min-w-[300px] h-80 bg-white rounded-2xl shadow-md p-6 border border-gray-200 flex flex-col justify-between">
              <h3 className="text-xl font-bold text-center text-sky-700">CPU Usage (%)</h3>
              <div className="flex justify-center items-center flex-1">
                <ReactSpeedometer
                  maxValue={100}
                  value={cpuUsage?.cpuUsage}
                  needleColor="black"
                  startColor="green"
                  endColor="red"
                  segments={10}
                  textColor="#555"
                />
              </div>
            </div>
      
            {/* Cluster Node Status - Bar Chart */}
            <div className="flex-1 max-w-xl min-w-[300px] h-80 bg-white rounded-2xl shadow-md p-6 border border-gray-200 flex flex-col justify-between">
              <h3 className="text-xl font-bold text-center text-sky-700">Cluster Node Status</h3>
              <div className="flex-1 flex items-center">
                <Bar data={nodeData} options={options} />
              </div>
            </div>
      
            {/* Disk Management - Pie Chart */}
            <div className="flex-1 max-w-xl min-w-[300px] h-80 bg-white rounded-2xl shadow-md p-6 border border-gray-200 flex flex-col justify-between">
              <h3 className="text-xl font-bold text-center text-sky-700">Disk Management</h3>
              <div className="text-sm text-gray-600 mb-2 text-center">
                <p>
                  <span className="font-semibold">Mount Point:</span>{" "}
                  <span className="text-gray-800">{diskUsage.path}</span>
                </p>
                <p>
                  <span className="font-semibold">Total Disk:</span>{" "}
                  <span className="text-gray-800">{diskUsage.total} GB</span>
                </p>
              </div>
              <div className="flex-1 flex items-center justify-center">
                <Pie data={diskData} options={{ ...options }} />
              </div>
            </div>
          </div>
        </div>
      );
      
};

export default ClusterMonitoringScreen;
