import React, { useEffect, useState } from "react";
import axios from "axios";
import { jobsListColumns } from "@/components/ui/clusterDataTable/jobslist-columns";
import { DataTable } from "@/components/ui/clusterDataTable/jobslist-data-table";

const JobsListScreen = () => {
  const [jobsList, setjobsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchJobsList = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5173/api/scheduler/getjobsinfo"); // Replace with your API endpoint
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

  console.log(jobsList)



  if (loading) return <div className="flex items-center justify-center h-screen">
    <div>Loading...</div>
  </div>
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto">
      <DataTable columns={jobsListColumns} data={jobsList} />
    </div>
  );
};

export default JobsListScreen;

