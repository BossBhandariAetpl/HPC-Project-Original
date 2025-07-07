
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";
import axios from "axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



export const jobsListColumns  = (onDataRefresh) => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="ml-4"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "id_job",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        JOB ID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "job_name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        JOB NAME
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    )
  },
  {
    accessorKey: "nodelist",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        NODE LIST
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    )
  },
  {
    accessorKey: "nodes_alloc",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        ALLOCATED NODES
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "state",
    header: ({ column }) => (
        <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            STATE
            <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
    ),
    cell: ({ getValue }) => {
        const state = getValue();
        const stateDescription =
            state === 0 ? "Pending" :
            state === 1 ? "Running" :
            state === 2 ? "Suspended" :
            state === 3 ? "Completed" :
            state === 4 ? "Cancelled" :
            state === 5 ? "Failed" :
            state === 6 ? "Time Out" :
            state === 7 ? "Node Fail" :
            state === 8 ? "Preempted" :
            state === 9 ? "Boot Fail" :
            "UNKNOWN: The job state is not recognized.";

        return (
            <div className="">
                {stateDescription}
            </div>
        );
    },
},
  {
    accessorKey: "work_dir",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        WORK DIRECTORY
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    )
  },
  // {
  //   accessorKey: "submit_line",
  //   header: ({ column }) => (
  //     <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
  //       SUBMIT LINE
  //       <ArrowUpDown className="ml-2 h-4 w-4" />
  //     </Button>
  //   )
  // },
  {
    id: "actions",
    cell: ({ row }) => {
      const job = row.original
     
      const killJob = async (jobid) => {
        try {
          const response = await axios.delete(`http://localhost:8000/api/scheduler/killjob/${jobid}`);
          if(response)
          {
            onDataRefresh();
            toast.success(`${jobid} job Killed Successfully`);
          }
          
      } catch (error) {
        toast.error(`Error Killing ${jobid}`);
        console.error("Error reading file:", error);
      }
      };
   
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-6 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem className="text-md cursor-pointer" onClick={() => killJob(job.JOBID)}>
                  Kill Job
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  }, 
];
