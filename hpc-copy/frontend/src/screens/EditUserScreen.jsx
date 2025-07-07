import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const EditUserScreen = () => {
  const [userInfo, setUserInfo] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();

  const formSchema = z.object({
    username: z.string().min(2).max(20).regex(/^[^\s.]+$/, "No spaces or dots allowed"),
    email: z.string().email("Invalid email"),
    loginShell: z.enum(["/bin/bash", "/sbin/nologin"]),
    shadowInactive: z.string().min(1),
    shadowLastChange: z.string().min(1),
    shadowMax: z.string().min(1),
    shadowMin: z.string().min(1),
    shadowWarning: z.string().min(1),
    status: z.enum(["active", "inactive"]),
    role: z.enum(["admin", "user"]),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      loginShell: "",
      shadowInactive: "",
      shadowLastChange: "",
      shadowMax: "",
      shadowMin: "",
      shadowWarning: "",
      status: "",
      role: "",
    },
  });

  const getUserInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/users/${id}`);
      setUserInfo(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  useEffect(() => {
    if (userInfo) {
      form.reset({
        username: userInfo.username || "",
        email: userInfo.email || "",
        loginShell: userInfo.loginShell || "",
        shadowInactive: userInfo.shadowInactive || "",
        shadowLastChange: userInfo.shadowLastChange || "",
        shadowWarning: userInfo.shadowWarning || "",
        shadowMax: userInfo.shadowMax || "",
        shadowMin: userInfo.shadowMin || "",
        status: userInfo.status || "",
        role: userInfo.role || "",
      });
    }
  }, [userInfo, form]);

  const onSubmit = async (values) => {
    try {
      const response = await axios.patch(`http://localhost:8000/api/users/${id}`, values);
      if (response.data) {
        const data = response.data;
        navigate(`/users/${data.user.uId}`);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-4xl mx-auto my-10 p-8 bg-white shadow-xl rounded-lg space-y-8"
      >
        <h3 className="text-2xl font-bold text-center text-sky-700">Update User Profile</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Username */}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input disabled placeholder="Enter username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Login Shell */}
          <FormField
            control={form.control}
            name="loginShell"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Login Shell</FormLabel>
                <FormControl>
                  <select className="border p-2 w-full" {...field}>
                    <option value="/bin/bash">/bin/bash</option>
                    <option value="/sbin/nologin">/sbin/nologin</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Shadow Inactive */}
          <FormField
            control={form.control}
            name="shadowInactive"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shadow Inactive</FormLabel>
                <FormControl>
                  <select className="border p-2 w-full" {...field}>
                    <option value="">Select</option>
                    <option value="0">0 (Disable immediately)</option>
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="-1">Never disable</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Shadow Last Change */}
          <FormField
            control={form.control}
            name="shadowLastChange"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shadow Last Change</FormLabel>
                <FormControl>
                  <select className="border p-2 w-full" {...field}>
                    <option value="">Select</option>
                    <option value="19000">19000 (past date)</option>
                    <option value="19010">19010</option>
                    <option value="99999">Never expires</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Shadow Max */}
          <FormField
            control={form.control}
            name="shadowMax"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shadow Max</FormLabel>
                <FormControl>
                  <select className="border p-2 w-full" {...field}>
                    <option value="">Select</option>
                    <option value="30">30 days</option>
                    <option value="60">60 days</option>
                    <option value="90">90 days</option>
                    <option value="99999">Never expires</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Shadow Min */}
          <FormField
            control={form.control}
            name="shadowMin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shadow Min</FormLabel>
                <FormControl>
                  <select className="border p-2 w-full" {...field}>
                    <option value="">Select</option>
                    <option value="0">0 (change anytime)</option>
                    <option value="7">7 days</option>
                    <option value="14">14 days</option>
                    <option value="30">30 days</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Shadow Warning */}
          <FormField
            control={form.control}
            name="shadowWarning"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Shadow Warning</FormLabel>
                <FormControl>
                  <select className="border p-2 w-full" {...field}>
                    <option value="">Select</option>
                    <option value="7">7 days before expiry</option>
                    <option value="14">14 days</option>
                    <option value="21">21 days</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Status */}
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <select className="border p-2 w-full" {...field}>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Role */}
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <select className="border p-2 w-full" {...field}>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="text-center pt-6">
          <Button className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-2 rounded-md" type="submit">
            Save Changes
          </Button>
        </div>
      </form>

      <ToastContainer />
    </Form>
  );
};

export default EditUserScreen;
