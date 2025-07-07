import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import logo from '../assets/logo.png'
import { useLoginMutation } from "../slices/userApiSlice";
import { toast } from "react-toastify";


const LoginScreen = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();
    const dispatch = useDispatch();
    const [login, { isLoading }] = useLoginMutation();
    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (userInfo) {
            navigate("/dashboard");
        }
    }, [userInfo]);

    const onSubmit = async (data) => {
        try {
            const res = await login(data).unwrap();
            dispatch(setCredentials({ ...res }));
            // navigate("/users");
        } catch (err) {
            toast.error(err?.data?.message);
            console.log(err?.data?.message)
        }
    };

    return (
        <>
            <div className="w-full">
                <div className="w-full h-screen flex justify-center items-center bg-main-page bg-no-repeat bg-center bg-cover relative">
                    <div className="absolute top-0 left-0 w-full h-full bg-main-page bg-no-repeat bg-center bg-cover blur-sm"></div>
                    <div className="relative">
                        <Card className="w-[500px]">
                            <CardHeader>
                                <div className="flex justify-between items-center">
                                    <div className="w-44">
                                        <img
                                            src={logo}
                                            alt=""
                                        />
                                    </div>
                                    <div>
                                        <CardTitle className="text-center">LOGIN FORM</CardTitle>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardDescription className="text-center">
                                AURA HPC MANAGER
                            </CardDescription>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                <CardContent>
                                    <div className="grid w-full items-center gap-4">
                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="username">USERNAME</Label>
                                            <Input
                                                id="username"
                                                placeholder="Enter username"
                                                {...register("username", {
                                                    required: "Username is required",
                                                })}
                                            />
                                            {errors.username && (
                                                <div className="text-red-500">
                                                    {errors.username.message}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col space-y-1.5">
                                            <Label htmlFor="password">PASSWORD</Label>
                                            <Input
                                                id="password"
                                                type="password"
                                                placeholder="Enter password"
                                                {...register("password", {
                                                    required: "Password is required",
                                                })}
                                            />
                                            {errors.password && (
                                                <div className="text-red-500">
                                                    {errors.password.message}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-center">
                                    <Button type="submit">Login</Button>
                                </CardFooter>
                            </form>
                            {isLoading && (
                                <div className="flex justify-center items-center">
                                    ...Loading
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            </div>
        </>

    )
}

export default LoginScreen;