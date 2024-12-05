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
    FormDescription,
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
    path: ["confirmpassword"], // The field that should show the error
})


export default function AddUserScreen() {
    // 1. Define your form.
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

    // 2. Define a submit handler.

    const onSubmit = async (values) => {
        console.log(values)
        const body = {
            username: values.username,
            password: values.password,
            email: values.email
        }
        try {
            const response = await axios.post('http://localhost:5173/api/users/add-user', body);
            console.log('User added successfully:', response.data);
            toast.success("User Added Successfully");
            form.reset();
        } catch (error) {
            console.error('Error adding user:', error);
            toast.error(error.response?.data?.message || "An error occurred");
        }
    };
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="py-4 bg-gray-200 space-y-8">
                <h3 className="text-center text-xl font-semibold">ADD USER</h3>

                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className="px-4">
                            <FormLabel className="font-semibold">Username</FormLabel>
                            <FormControl>
                                <Input className="border-2" placeholder="Enter Username" {...field} />
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
                    name="password"
                    render={({ field }) => (
                        <FormItem className="px-4">
                            <FormLabel className="font-semibold">Password</FormLabel>
                            <FormControl>
                                <Input className="border-2" placeholder="Enter Password" type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="confirmpassword"
                    render={({ field }) => (
                        <FormItem className="px-4">
                            <FormLabel className="font-semibold">Confirm Password</FormLabel>
                            <FormControl>
                                <Input className="border-2" placeholder="Re-type Password" type="password" {...field} />
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
