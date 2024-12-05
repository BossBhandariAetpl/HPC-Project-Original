import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast,ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const UserDetailScreen = () => {
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState({});
  const [adminPassword, setAdminPassword] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");



  const getUserInfo = async () => {
    try {
      const response = await axios.get(`http://localhost:5173/api/users/${id}`);
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
      const response = await axios.post('http://localhost:5173/api/users/match-password', body);
      
      if (response && response.data) {
        const values = {
          username: userInfo.username,
          password: newPassword
        }
        try {
          const res = await axios.patch(`http://localhost:5173/api/users/${id}/password`, values);
          console.log(res)
          if(res)
          {
          
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
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      {userInfo ? (
        <div className="bg-gray-200 shadow-md p-6 mt-10 w-full max-w-2xl">
          <div className="flex justify-center">
            <Avatar variant="outline" className="cursor-pointer w-24 h-24">
              <AvatarImage />
              <AvatarFallback className="text-lg font-semibold">{userInfo.username}</AvatarFallback>
            </Avatar>
          </div>
          <h2 className="text-2xl font-semibold text-center mt-4">{userInfo.cn}</h2>
          <p className="text-gray-600 text-center mb-4">{userInfo.role}</p>

          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-4">Profile Information</h3>
            <div className="grid grid-cols-2 gap-x-4">
              {Object.entries(userInfo).map(([key, value]) => (
                <div key={key} className="text-gray-700 mb-2">
                  <span className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>{value}
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex justify-around">
            <Dialog open={openDialog} onOpenChange={setOpenDialog}>
              <DialogTrigger asChild>

                {userInfo.username !== "aetpl" && userInfo.role  !== "admin" &&   <Button variant="outline" className="bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600" onClick={() => setOpenDialog(true)}>Change Password</Button>}
               
              </DialogTrigger>
              <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="adminPassword" className="text-right font-semibold">
                      Admin Password
                    </Label>
                    <Input
                      id="adminPassword"
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="newPassword" className="text-right font-semibold">
                      New User Password
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="confirmPassword" className="text-right font-semibold">
                      Confirm New Password
                    </Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleChangePassword} type="submit">Save Changes</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      ) : (
        <div className='text-center bg-gray-200 text'>User Not Found</div>
      )}

      <ToastContainer/>
    </div>
  )
}

export default UserDetailScreen;
