import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { RiMenuLine, RiCloseLine } from "react-icons/ri";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { IoMdSettings } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { Button } from "@/components/ui/button";
import { MdDashboard } from "react-icons/md";
import { GrCluster } from "react-icons/gr";
import { IoGitNetworkOutline } from "react-icons/io5";
import { FaUsers } from "react-icons/fa";
import { FaFile } from "react-icons/fa";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDispatch, useSelector } from "react-redux";
import { useLogoutMutation } from "@/slices/userApiSlice";
import { logout } from "@/slices/authSlice";
import logo from '../assets/logo.png'
import headerbg from '../assets/wiring.png'

function HomeScreen() {
  const [isAsideOpen, setIsAsideOpen] = useState(true);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  }

  const toggleAside = () => {
    setIsAsideOpen((prevIsAsideOpen) => !prevIsAsideOpen);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header
        className={`relative px-4 py-4 ${!isAsideOpen ? "mb-12" : ""} flex items-center`}
        style={{
          backgroundImage: `url(${headerbg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >


        {/* Left: Hamburger Menu */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <button className="text-white focus:outline-none" onClick={toggleAside}>
            {isAsideOpen ? <RiCloseLine size={24} /> : <RiMenuLine size={24} />}
          </button>
        </div>

        {/* Center: Logo */}
        <div className="flex-1 flex justify-center">
          <div className="w-52">
            <img src={logo} alt="Logo" className="mx-auto" />
          </div>
        </div>

        {/* Right: Title and Avatar */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center space-x-2">
          <h1 className="hidden sm:block text-white text-2xl font-bold">
            HPC Manager
          </h1>
          <Sheet>
            <SheetTrigger asChild>
              <Avatar variant="outline" className="cursor-pointer">
                <AvatarImage />
                <AvatarFallback>{userInfo.username.toUpperCase()[0]}</AvatarFallback>
              </Avatar>
            </SheetTrigger>

            <SheetContent className="bg-gray-200">
              <SheetHeader></SheetHeader>
              
              <div className="grid gap-4 py-4 mt-6">
                {/* ✅ Updated Profile Link */}
                <div
                  onClick={() => navigate(`/users/${userInfo.uId}`)}
                  className="flex items-center cursor-pointer px-4 py-2 text-lg font-bold text-gray-700 hover:bg-gray-300 rounded"
                >
                  <CgProfile className="text-2xl mr-2" />
                  Your Profile
                </div>

                {/* ✅ Original Settings (unchanged) */}
                <div className="flex items-center cursor-pointer px-4 py-2 text-lg font-bold text-gray-700 hover:bg-gray-300 rounded">
                  <IoMdSettings className="text-2xl mr-2" />
                  Settings
                </div>

                {/* ✅ Logout button (unchanged) */}
                <SheetClose asChild>
                  <Button type="submit" onClick={logoutHandler}>
                    Logout
                  </Button>
                </SheetClose>
              </div>

              <SheetFooter></SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
      </header>



      
      <div className="flex lg:flex-1 lg:flex-row flex-col gap-12 overflow-hidden">
        {userInfo.role === 'admin' ? (
          <aside
            className={`bg-gray-200 lg:w-72 ${isAsideOpen ? "block" : "hidden"}`}
          >
            <nav className="p-4">

              <div className="flex items-center  gap-x-4 px-2 ">

                <Avatar variant="outline" className="cursor-pointer w-16 h-16">
                  <AvatarImage />
                  <AvatarFallback>{userInfo.username.toUpperCase()[0]}</AvatarFallback>
                </Avatar>

                <h2 className="text-lg font-bold text-gray-700 data-[focus]:bg-gray-100">{userInfo.username.toUpperCase()}</h2>
              </div>
              <div className="border-gray-400 border-b-2 pb-4 ">

              </div>


              <ul className="text-lg font-bold text-gray-700 data-[focus]:bg-gray-100 p-6">
                <li className="flex  items-center mb-3 gap-x-2 text-center ">
                  <MdDashboard />
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      isActive ? "text-blue-700 " : ""
                    }
                    end
                  >
                    Dashboard
                  </NavLink>
                </li>
                <li className="flex  items-center mb-3 gap-x-2 text-center ">
                <GrCluster />
                  <NavLink
                    to="/cluster"
                    className={({ isActive }) =>
                      isActive ? "text-blue-700 " : ""
                    }
                    end
                  >
                    Cluster
                  </NavLink>
                </li>

                <li className="flex  items-center mb-3 gap-x-2 text-center ">
                <IoGitNetworkOutline />
                  <NavLink
                    to="/networking"
                    className={({ isActive }) =>
                      isActive ? "text-blue-700 " : ""
                    }
                    end
                  >
                    Networking
                  </NavLink>
                </li>
                
                <li className=" flex  items-center mb-3 gap-x-2 text-center">
                  <FaUsers />

                  <NavLink
                    to="/userlist"
                    className={({ isActive }) =>
                      isActive ? "text-blue-700 " : ""
                    }
                  >
                    Userlist
                  </NavLink>
                </li>
                <li className=" flex  items-center mb-3 gap-x-2 text-center">
                  <MdDashboard />

                  <NavLink
                    to="/queuemanage"
                    className={({ isActive }) =>
                      isActive ? "text-blue-700 " : ""
                    }
                  >
                    Manage Queue 
                  </NavLink>
                </li>
                <li className=" flex  items-center mb-3 gap-x-2 text-center">
                  <MdDashboard />

                  <NavLink
                    to="/slurmworkload"
                    className={({ isActive }) =>
                      isActive ? "text-blue-700 " : ""
                    }
                  >
                    Workload Manager
                  </NavLink>
                </li>
                <li className=" flex  items-center mb-3 gap-x-2 text-center">
                  <MdDashboard />

                  <NavLink
                    to="/jobhistory"
                    className={({ isActive }) =>
                      isActive ? "text-blue-700 " : ""
                    }
                  >
                    Jobs History
                  </NavLink>
                </li>
              </ul>
            </nav>
          </aside>
        ) : (
          <aside
            className={`lg:w-72 ${isAsideOpen ? "block" : "hidden"} bg-gray-200 `}
          >
            <nav className="p-4">

              <div className="flex items-center  gap-x-4 px-2 ">

                <Avatar variant="outline" className="cursor-pointer w-16 h-16">
                  <AvatarImage />
                  <AvatarFallback>{userInfo.username.toUpperCase()[0]}</AvatarFallback>
                </Avatar>

                <h2 className="text-lg font-bold text-gray-700 data-[focus]:bg-gray-100">{userInfo.username.toUpperCase()}</h2>
              </div>
              <div className="border-gray-400 border-b-2 pb-4 ">

              </div>


              <ul className="text-lg font-bold text-gray-700 data-[focus]:bg-gray-100 p-6">
                <li className="flex  items-center mb-3 gap-x-2 text-center ">
                  <MdDashboard />
                  <NavLink
                    to="/dashboard"
                    className={({ isActive }) =>
                      isActive ? "text-blue-700 " : ""
                    }
                    end
                  >
                    Dashboard
                  </NavLink>

                </li>
                <li className="flex  items-center mb-3 gap-x-2 text-center ">
                <FaFile />
                <NavLink
                    to="/filemanager"
                    className={({ isActive }) =>
                      isActive ? "text-blue-700 " : ""
                    }
                    end
                  >
                    File Manager
                  </NavLink>

                </li>
               

              
              </ul>
            </nav>
          </aside>
        )}


        <main className="flex-1 overflow-y-auto ">
          <Outlet />
        </main>


      </div>

      <footer className={`bg-sky-600 h-7 flex justify-center items-center text-lg font-bold text-white data-[focus]:bg-gray-100`}>
        © 2024 by Aura Emanating Teknology Pvt. Ltd. Rights Reserved.
      </footer>
    </div>
  );
}

export default HomeScreen;
