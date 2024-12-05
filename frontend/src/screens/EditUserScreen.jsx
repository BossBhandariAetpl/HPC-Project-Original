import React, { useState, useEffect } from 'react'
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod"
import { useParams } from 'react-router-dom'
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const EditUserScreen = () => {
    const [userInfo, setUserInfo] = useState({})
    const navigate = useNavigate();

    const getUserInfo = async () => {
        try {
            const response = await axios.get(`http://localhost:5173/api/users/${id}`);
            setUserInfo(response.data)



        } catch (error) {
            console.error('Error adding user:', error);

        }


    }


    useEffect(() => {

        getUserInfo()

    }, [])

    const formSchema = z.object({
        username: z.string()
            .min(2, "Username must be at least 2 characters")
            .max(20, "Username must be at most 20 characters")
            .regex(/^[^\s.]+$/, "Username must not contain whitespace or dots"),

        email: z.string()
            .email("Email must be a valid email address"),

        loginShell: z.enum(["/bin/bash", "/sbin/nologin"], "Login Shell must be a valid option"),

        shadowInactive: z.enum(["0", "7", "14", "-1"], "Shadow Inactive must be a valid option")
            .or(z.string().min(1, "Shadow Inactive must be selected")),

        shadowLastChange: z.enum(["19000", "19010", "today"], "Shadow Last Change must be a valid option")
            .or(z.string().min(1, "Shadow Last Change must be selected")),

        shadowMax: z.enum(["30", "60", "90", "99999"], "Shadow Max must be a valid option")
            .or(z.string().min(1, "Shadow Max must be selected")),

        shadowWarning: z.enum(["7", "14", "21"], "shadow Warning must be a valid option")
            .or(z.string().min(1, "shadow Warningmust be selected")),

        shadowMin: z.enum(["0", "7", "14", "30"], "Shadow Min must be a valid option")
            .or(z.string().min(1, "Shadow Min must be selected")),

        status: z.enum(['active', 'inactive'], "Status must be either active or inactive"),

        role: z.enum(['admin', 'user'], "Role must be either admin or user")
    });


    const { id } = useParams();

    // 1. Define your form.
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
            status: "",
            shadowWarning:"",
            role: "",

        },
    })

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

    // 2. Define a submit handler.

    const onSubmit = async (values) => {

        

        console.log(values)

        try {
            const response = await axios.patch(`http://localhost:5173/api/users/${id}`, values);
            console.log('User Updated successfully:', response.data);
            // toast.success("User Updated Successfully");

            if(response.data)
            {
                const data = response.data;
                navigate(`/users/${data.user.uId}`)
            }
        } catch (error) {
            console.error('Error adding user:', error);
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="py-4 bg-gray-200 space-y-8">
                <h3 className="text-center text-xl font-semibold">UPDATE USER</h3>

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className="px-4">
                            <FormLabel className="font-semibold">Username</FormLabel>
                            <FormControl>
                                <Input className="border-2" placeholder="Enter Username" {...field} disabled />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className="px-4">
                            <FormLabel className="font-semibold">Email</FormLabel>
                            <FormControl>
                                <Input className="border-2" placeholder="Enter email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="loginShell"
                    render={({ field }) => (
                        <FormItem className="px-4">
                            <FormLabel className="font-semibold block">Login Shell</FormLabel>
                            <FormControl>
                                <select {...field} className="border-2 p-2 w-full">

                                    <option value="/bin/bash">/bin/bash</option>
                                    <option value="/sbin/nologin">/sbin/nologin</option>
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                <FormField
                    control={form.control}
                    name="shadowInactive"
                    render={({ field }) => (
                        <FormItem className="px-4">
                            <FormLabel className="font-semibold block">Shadow Inactive</FormLabel>
                            <FormControl>
                                <select className="border-2 p-2 w-full " {...field}>
                                    <option value="">select Inactive Days</option>
                                    <option value="0">0 (Disabled immediately after expiration)</option>
                                    <option value="7">7 (Disabled 7 days after expiration)</option>
                                    <option value="14">14 (Disabled 14 days after expiration)</option>
                                    <option value="-1">-1 (Never disabled)</option>
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="shadowLastChange"
                    render={({ field }) => (
                        <FormItem className="px-4">
                            <FormLabel className="font-semibold block">Shadow Last Change</FormLabel>
                            <FormControl>
                                <select className="border-2 p-2 w-full" {...field}>
                                    <option value="">select Last Change Date</option>
                                    <option value="19000">19000 (A specific past date)</option>
                                    <option value="19010">19010 (Another specific date)</option>
                                    {/* <option value="today">Use Today's Date</option> */}
                                    <option value="99999">Never expires (99999)</option>
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="shadowMax"
                    render={({ field }) => (
                        <FormItem className="px-4">
                            <FormLabel className="font-semibold block">Shadow Max</FormLabel>
                            <FormControl>
                                <select className="border-2 p-2 w-full" {...field}>
                                    <option value="">select Maximum Password Validity</option>
                                    <option value="30">30 days</option>
                                    <option value="60">60 days</option>
                                    <option value="90">90 days</option>
                                    <option value="99999">Never expires (99999)</option>
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="shadowMin"
                    render={({ field }) => (
                        <FormItem className="px-4">
                            <FormLabel className="font-semibold block">Shadow Min</FormLabel>
                            <FormControl>
                                <select className="border-2 p-2 w-full" {...field}>
                                    <option value="">select Minimum Days Between Changes</option>
                                    <option value="0">0 (Can change anytime)</option>
                                    <option value="1">1 day</option>
                                    <option value="7">7 days</option>
                                    <option value="14">14 days</option>
                                    <option value="30">30 days</option>
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />



                <FormField
                    control={form.control}
                    name="shadowWarning"
                    render={({ field }) => (
                        <FormItem className="px-4">
                            <FormLabel className="font-semibold block">Shadow Warning</FormLabel>
                            <FormControl>
                                <select className="border-2 p-2 w-full" {...field}>
                                    <option value="">Select Warning Days</option>
                                    <option value="7">7 (7 days before password expiration)</option>
                                    <option value="14">14 (14 days before password expiration)</option>
                                    <option value="21">21 (21 days before password expiration)</option>
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />







                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem className="px-4">
                            <FormLabel className="font-semibold block">Status</FormLabel>
                            <FormControl>
                                <select {...field} className="border-2 p-2 w-full">

                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem className="px-4">
                            <FormLabel className="font-semibold block">Role</FormLabel>
                            <FormControl>
                                <select {...field} className="border-2 p-2 w-full">

                                    <option value="admin">Admin</option>
                                    <option value="user">User</option>
                                </select>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />




                <div className="text-center">
                    <Button type="submit">Submit</Button>
                </div>
            </form>

            <ToastContainer />
        </Form>
    )
}

export default EditUserScreen