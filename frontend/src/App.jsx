import { useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import React from "react";
import { Route, Routes } from "react-router-dom";
import {
  JobsScreen,
  HomeScreen,
  UserListScreen,
  Dashboard,
  QueueManage,
  AddUserScreen,
  UserDetailScreen,
  EditUserScreen,
  ManageNodeScreen,
  LoginScreen,
  NotFoundScreen,
  NetworkingScreen,
  Cluster
} from "./screens/index.js";
import JobsListScreen from "./screens/clusterScreen/JobsListScreen.jsx";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

function App() {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  return (
    <>
      <Routes>
        {/* Render admin routes if user is an admin */}
        {userInfo?.role === 'admin' ? (
          <>
            <Route element={<HomeScreen />}>
              <Route path='dashboard' element={<Dashboard />} />
              <Route path="jobs" element={<JobsScreen />} />
              <Route path="adduser" element={<AddUserScreen />} />
              <Route path="managenode" element={<ManageNodeScreen />} />
              <Route path="edituser/:id" element={<EditUserScreen />} />
              <Route path="users/:id" element={<UserDetailScreen />} />
              <Route path="userlist" element={<UserListScreen />} />
              <Route path="queuemanage" element={<QueueManage />} />
              <Route path="jobmonitoring" element={<JobsListScreen />} />
              <Route path="cluster" element={<Cluster/>} />
              <Route path="networking" element={<NetworkingScreen />} />
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        ) : userInfo?.role === 'user' ? (
          // Render user routes if user is a regular user
          <>
            <Route element={<HomeScreen />}>
              <Route path='dashboard' element={<Dashboard />} />
              <Route path="jobs" element={<JobsScreen />} />
              {/* Add other routes for regular users here */}
            </Route>
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </>
        ) : (
          // Render login routes if user is not authenticated
          <>
            <Route path="/login" element={<LoginScreen />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}

        {/* Not Found Route */}
        <Route path="*" element={<NotFoundScreen />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;