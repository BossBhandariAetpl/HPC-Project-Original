import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserDetailScreen = () => {
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState({});
  const [adminPassword, setAdminPassword] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const getUserInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/users/${id}`);
      setUserInfo(response.data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const handleChangePassword = async () => {
    try {
      if (newPassword !== confirmPassword) {
        toast.error("New password and confirm password do not match.");
        return;
      }

      const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;
      if (!specialCharRegex.test(newPassword)) {
        toast.error("Password must contain at least one special character.");
        return;
      }

      const body = { password: adminPassword };
      const response = await axios.post('http://localhost:8000/api/users/match-password', body);

      if (response && response.data) {
        const values = {
          username: userInfo.username,
          password: newPassword
        }
        try {
          const res = await axios.patch(`http://localhost:8000/api/users/${id}/password`, values);
          if (res) {
            toast.success(res.data.message);
          }
        } catch (error) {
          console.error('Error updating password:', error);
          toast.error(error.response?.data?.message || "An error occurred");
        }
      } else {
        toast.error("Error deleting user");
      }
    } catch (error) {
      console.error('Error matching password:', error);
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setOpenDialog(false);
      setAdminPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center p-6">
      {userInfo ? (
        <div className="bg-white rounded-2xl shadow-lg p-8 mt-10 w-full max-w-3xl transition-all duration-300">
          <div className="flex flex-col items-center">
            <Avatar className="w-28 h-28 ring-4 ring-sky-300 shadow-lg">
              <AvatarImage />
              <AvatarFallback className="text-xl font-bold uppercase">{userInfo.username}</AvatarFallback>
            </Avatar>
            <h2 className="text-3xl font-bold mt-4 text-gray-800">{userInfo.cn}</h2>
            <p className="text-gray-500 text-md">{userInfo.role}</p>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-2">Profile Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(userInfo).map(([key, value]) => (
                <div key={key} className="text-gray-700 bg-gray-100 p-3 rounded-md shadow-sm">
                  <span className="font-semibold capitalize text-gray-600">{key.replace(/([A-Z])/g, ' $1')}: </span>
                  <span className="ml-1 text-gray-800">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex justify-center">
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>
                {userInfo.username !== "aetpl" && userInfo.role !== "admin" && (
                  <Button
                    variant="outline"
                    className="bg-sky-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-sky-700 transition duration-300"
                    onClick={() => setOpenDialog(true)}
                  >
                    Change Password
                  </Button>
                )}
              </DialogTrigger>

              <DialogContent className="sm:max-w-[600px] rounded-xl shadow-lg">
                <DialogHeader>
                  <DialogTitle className="text-xl font-semibold text-gray-800">Change Password</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="adminPassword" className="text-right font-medium text-gray-700">
                      Admin Password
                    </Label>
                    <Input
                      id="adminPassword"
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="col-span-3 bg-gray-50"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="newPassword" className="text-right font-medium text-gray-700">
                      New User Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="col-span-3 bg-gray-50"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="confirmPassword" className="text-right font-medium text-gray-700">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="col-span-3 bg-gray-50"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleChangePassword}
                    type="submit"
                    className="bg-green-600 text-white hover:bg-green-700 transition duration-300"
                  >
                    Save Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ) : (
        <div className='text-center text-red-600 mt-10'>User Not Found</div>
      )}

      <ToastContainer />
    </div>
  );
}

export default UserDetailScreen;
