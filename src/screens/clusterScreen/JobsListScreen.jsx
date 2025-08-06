import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom';
import { jobsListColumns } from "@/components/ui/clusterDataTable/jobslist-columns";
import { DataTable } from "@/components/ui/clusterDataTable/jobslist-data-table";
import { BsPatchExclamationFill } from "react-icons/bs";

const JobsListScreen = () => {
  const { user } = useParams();
  const [jobsList, setjobsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchJobsList = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        !user
          ? "http://localhost:5173/api/jobs/getAlljobs"
          : `http://localhost:5173/api/userscheduler/${user}/getuserjobsinfo`
      );
      setjobsList(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsList();
  }, []);

  const handleDataRefresh = () => {
    fetchJobsList();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-xl text-gray-600 font-semibold animate-pulse">Loading job data...</div>
      </div>
    );
  }

  if (error || jobsList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="text-red-500 text-5xl mb-4"><BsPatchExclamationFill /></div>
        <div className="text-xl text-gray-700 font-medium">No job data found</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {user ? `${user}'s Jobs` : "All Cluster Jobs"}
      </h2>

      <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
        <DataTable
          columns={jobsListColumns(handleDataRefresh)}
          data={jobsList}
          onDataRefresh={handleDataRefresh}
        />
      </div>
    </div>
  );
};

export default JobsListScreen;
