import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from 'react-router-dom'
import { jobsListColumns } from "@/components/ui/clusterDataTable/jobslist-columns";
import { DataTable } from "@/components/ui/clusterDataTable/jobslist-data-table";
import { BsPatchExclamationFill } from "react-icons/bs";

const JobsListScreen = () => {
  const { user} = useParams();
  const [jobsList, setjobsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  console.log(jobsList)

  const fetchJobsList = async () => {
    try {
      setLoading(true);
      const response = await axios.get( !user ? "http://localhost:5173/api/scheduler/getjobsinfo" : `http://localhost:5173/api/userscheduler/${user}/getuserjobsinfo`); // Replace with your API endpoint
      setjobsList(response.data?.jobs)
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





  if (loading) return <div className="flex items-center justify-center h-screen">
    <div>Loading...</div>
  </div>
  
  if (error || jobsList.length === 0)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-400 text-4xl">  <BsPatchExclamationFill /></div>
        <div className="text-2xl">No Data Found</div>
      
      </div>
    );

  return (
    <div className="container mx-auto">

      <DataTable columns={jobsListColumns(handleDataRefresh)} data={jobsList} onDataRefresh={handleDataRefresh} />
    </div>
  );
};

export default JobsListScreen;

