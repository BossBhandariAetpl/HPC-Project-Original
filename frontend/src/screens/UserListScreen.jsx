import React, { useEffect, useState } from "react";
import axios from "axios";
import { userListColumns   } from "@/components/userlist-columns";
import { DataTable } from "@/components/userlist-data-table";

const UserListScreen = () => {
  const [userList, setUserList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fetchUserList = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:5173/api/users/"); // Replace with your API endpoint
      setUserList(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const handleDataRefresh = () => {
    fetchUserList();
  };

  console.log(userList)


  if (loading) return  <div className="flex items-center justify-center h-screen">
  <div>Loading...</div>
</div>
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto">
       <DataTable columns={userListColumns(handleDataRefresh)} data={userList} onDataRefresh={handleDataRefresh} />
    </div>
  );
};

export default UserListScreen;

