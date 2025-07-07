import React, { useEffect, useState } from "react";
import axios from "axios";
import { nodeListColumns } from "@/components/ui/clusterDataTable/nodelist-columns";
import { DataTable } from "@/components/ui/clusterDataTable/nodelist-data-table";

const NodeListScreen = () => {
  const [nodeList, setnodeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchNodeList = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/scheduler/getnodesinfo"); // Replace with your API endpoint
      setnodeList(response.data?.nodes)
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNodeList();
  }, []);





  if (loading) return <div className="flex items-center justify-center h-screen">
    <div>Loading...</div>
  </div>
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto">
      <DataTable columns={nodeListColumns} data={nodeList} />
    </div>
  );
};

export default NodeListScreen;

