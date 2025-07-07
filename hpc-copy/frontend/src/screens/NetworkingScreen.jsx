import React, { useEffect, useState } from "react";
import axios from "axios";
import { networkListColumns } from "@/components/networking-columns";
import { DataTable } from "@/components/networking-data-table";

const NetworkingScreen = () => {
  const [networkList, setNetworkList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchNetworkList = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8000/api/networks/getnetworkinfo"); // Replace with your API endpoint
      setNetworkList(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworkList();
  }, []);

  


  if (loading) return  <div className="flex items-center justify-center h-screen">
  <div>Loading...</div>
</div>
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto">
       <DataTable columns={networkListColumns()} data={networkList} />
    </div>
  );
};

export default NetworkingScreen;

