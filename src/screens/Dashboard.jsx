import { FaUsers } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
import { FiClock } from "react-icons/fi";
import { PiTreeStructureBold } from "react-icons/pi";
import { FaGear } from "react-icons/fa6";
import { FaBars } from "react-icons/fa";
import { HiUserPlus } from 'react-icons/hi2';
import { IoEyeSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import { HiServer } from "react-icons/hi";
import { PiCpuBold } from 'react-icons/pi';
import { HiOutlineSignal } from 'react-icons/hi2';
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useSelector } from "react-redux";

export function Dashboard() {
  const {userInfo} = useSelector((state) => (state.auth))

  
  let content;

  if (userInfo.role === 'admin') {
    content = [
      {
        id: 1,
        icon: <FaUsers className="text-6xl md:text-8xl" />,
        title: "User Profile",
        color: "bg-blue-600",
        url: `/users/${userInfo.uId}`
      },
      {
        id: 2,
        icon: <HiUserPlus className="text-white text-6xl md:text-8xl" />,
        title: "Add Users",
        color: "bg-cyan-600",
        url: '/adduser',
      },
      {
        id: 3,
        icon: <HiOutlineSignal className="text-white text-6xl md:text-8xl" />,
        title: "Sync Nodes",
        color: "bg-rose-800",
        url: '',
      },
      {
        id: 4,
        icon: <PiTreeStructureBold className="text-6xl md:text-8xl" />,
        title: "Monitor a Job",
        color: "bg-lime-600",
        url: ''
      },
      {
        id: 5,
        icon: <FiClock className="text-6xl md:text-8xl" />,
        title: "Job History",
        color: "bg-amber-600",
        url: '/jobhistory'
      },
      {
        id: 6,
        icon: <HiServer className="text-white text-6xl md:text-8xl" />,
        title: "System Services",
        color: "bg-red-600",
        url: '',
      },
      {
        id: 7,
        icon: <PiCpuBold className="text-white text-6xl md:text-8xl" />,
        title: "Node Management",
        color: "bg-blue-600",
        url: '/managenode',
      },
      {
        id: 8,
        icon: <IoEyeSharp className="text-6xl md:text-8xl" />,
        title: "Cluster Monitoring",
        color: "bg-orange-600",
        url: '/cluster'
      },
    ];
  } else {
    content = [
      {
        id: 1,
        icon: <FaUsers className="text-6xl md:text-8xl" />,
        title: "User Profile",
        color: "bg-blue-600",
        url: `/users/${userInfo.uId}`
      },
      {
        id: 2,
        icon: <FiClock className="text-6xl md:text-8xl" />,
        title: "Job History",
        color: "bg-amber-600",
        url: `/jobhistory/${userInfo.username}`
      },
      
    ];
  }
  

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-3 gap-y-2 p-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      {content.map((item) => (
        <Link to={item.url} key={item.id} className="transition-transform transform hover:scale-105">
          <Card className="w-full rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-300">
            <CardContent className="p-0">
              <div className={`flex flex-col items-center justify-center p-6 ${item.color} text-white`}>
                {item.icon}
                <h2 className="pt-4 text-center text-lg md:text-xl font-semibold">{item.title}</h2>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between items-center p-4 bg-white">
              <h3 className="text-md font-medium text-gray-700 hover:text-blue-600 transition-colors">
                More info
              </h3>
              <FaPlusCircle className="text-2xl text-gray-500 hover:text-blue-500 transition-colors" />
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
  
}

export default Dashboard;
