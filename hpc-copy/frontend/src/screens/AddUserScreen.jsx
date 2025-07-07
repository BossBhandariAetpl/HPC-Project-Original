import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from 'axios';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
    username: z.string()
        .min(2, "Username must be at least 2 characters")
        .max(20, "Username must be at most 20 characters")
        .regex(/^[^\s.]+$/, "Username must not contain whitespace or dots"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character")
        .max(50, "Password must be at most 50 characters"),
    confirmpassword: z.string()
        .min(8, "Confirm Password must be at least 8 characters")
        .regex(/[A-Z]/, "Confirm Password must contain at least one uppercase letter")
        .regex(/[0-9]/, "Confirm Password must contain at least one number")
        .regex(/[!@#$%^&*(),.?":{}|<>]/, "Confirm Password must contain at least one special character")
        .max(50, "Confirm Password must be at most 50 characters"),
    email: z.string().email("Email must be a valid email address"),
    status: z.enum(['active', 'inactive']),
    role: z.enum(['admin', 'user']),
}).refine(data => data.password === data.confirmpassword, {
    message: "Passwords don't match",
    path: ["confirmpassword"],
})


export default function AddUserScreen() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmpassword: "",
            status: "active",
            role: "user",
        },
    })

    const onSubmit = async (values) => {
        const body = {
            username: values.username,
            password: values.password,
            email: values.email
        }
        try {
            const response = await axios.post('http://localhost:8000/api/users/add-user', body);
            toast.success("User Added Successfully");
            form.reset();
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4 py-10">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-2xl border border-gray-200">
                <h3 className="text-2xl font-bold text-center mb-6 text-gray-700">Add New User</h3>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold text-gray-700">Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="border-gray-300 focus:ring-2 focus:ring-sky-400"
                                            placeholder="Enter Username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="font-semibold text-gray-700">Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="border-gray-300 focus:ring-2 focus:ring-sky-400"
                                            placeholder="Enter email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold text-gray-700">Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                className="border-gray-300 focus:ring-2 focus:ring-sky-400"
                                                placeholder="Enter Password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="confirmpassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold text-gray-700">Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                className="border-gray-300 focus:ring-2 focus:ring-sky-400"
                                                placeholder="Re-type Password"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <FormField
                                control={form.control}
                                name="status"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="font-semibold text-gray-700">Status</FormLabel>
                                        <FormControl>
                                            <select
                                                {...field}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-400"
                                            >
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
                                    <FormItem>
                                        <FormLabel className="font-semibold text-gray-700">Role</FormLabel>
                                        <FormControl>
                                            <select
                                                {...field}
                                                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-sky-400"
                                            >
                                                <option value="admin">Admin</option>
                                                <option value="user">User</option>
                                            </select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="text-center">
                            <Button
                                type="submit"
                                className="bg-sky-600 text-white px-6 py-2 rounded-md hover:bg-sky-700 transition duration-300"
                            >
                                Submit
                            </Button>
                        </div>
                    </form>
                </Form>
                <ToastContainer />
            </div>
        </div>
    )
}
