import { FaUsers } from "react-icons/fa";
import { FaPlusCircle } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
import { FiClock } from "react-icons/fi";
import { PiTreeStructureBold } from "react-icons/pi";
import { FaGear } from "react-icons/fa6";
import { FaBars } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useSelector } from "react-redux";

export function Dashboard() {
  const {userInfo} = useSelector((state) => (state.auth))
  console.log(userInfo)
  
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
        icon: <FaUsers className="text-6xl md:text-8xl" />,
        title: "Add Users",
        color: "bg-cyan-600",
        url: '/adduser'
      },
      {
        id: 3,
        icon: <FiRefreshCw className="text-6xl md:text-8xl" />,
        title: "Sync Users",
        color: "bg-rose-800",
        url: ''
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
        url: ''
      },
      {
        id: 6,
        icon: <FaGear className="text-6xl md:text-8xl" />,
        title: "System Services",
        color: "bg-red-600",
        url: ''
      },
      {
        id: 7,
        icon: <FaBars className="text-6xl md:text-8xl" />,
        title: "Manage Nodes",
        color: "bg-purple-600",
        url: '/managenode'
      },
      {
        id: 8,
        icon: <IoEyeSharp className="text-6xl md:text-8xl" />,
        title: "Cluster Monitoring",
        color: "bg-orange-600",
        url: ''
      },
    ];
  } else {
    content = [
      {
        id: 1,
        icon: <FaUsers className="text-6xl md:text-8xl" />,
        title: "User Profile",
        color: "bg-blue-600",
        url: ''
      },
      {
        id: 2,
        icon: <FiClock className="text-6xl md:text-8xl" />,
        title: "Job History",
        color: "bg-amber-600",
        url: ''
      },
      
    ];
  }
  

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10 p-4 cursor-pointer">
      {content.map((item) => {
        return (
          <Link to={item.url} key={item.id}>
            <Card className="w-full drop-shadow-xl">
              <CardContent className="p-0">
                <div className={`flex flex-col items-center justify-center p-4 ${item.color} text-white`}>
                  {item.icon}
                  <h2 className="pt-4 text-center text-lg md:text-xl">{item.title}</h2>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center p-4">
                <h3 className="text-lg font-bold text-gray-700 data-[focus]:bg-gray-100">More info</h3>
                <FaPlusCircle className="text-2xl" />
              </CardFooter>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}

export default Dashboard;
