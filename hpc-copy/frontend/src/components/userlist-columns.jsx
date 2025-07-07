import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import axios from 'axios';
import { ArrowUpDown } from "lucide-react";
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
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const userListColumns = (onDataRefresh) => [
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
    accessorKey: "uId",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        UID
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "username",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        USER NAME
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const [openDialog, setOpenDialog] = useState(false);
      const [adminPassword, setAdminPassword] = useState("");
      const navigate = useNavigate();

      const handleDelete = async () => {
        const body = { password: adminPassword };
        try {
          const response = await axios.post('http://localhost:8000/api/users/match-password', body);
          if (response?.data) {
            await axios.delete(`http://localhost:8000/api/users/${user.uId}`);
            onDataRefresh();
            toast.success("User Deleted Successfully");
          } else {
            toast.error("Error deleting user");
          }
        } catch (error) {
          toast.error(error.response?.data?.message || "An error occurred");
        } finally {
          setOpenDialog(false);
        }
      };

      return (
        <>
          {user.username !== "aetpl" && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-6 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(user.uId)}
                  className="text-lg cursor-pointer"
                >
                  Copy UID
                </DropdownMenuItem>
                <DropdownMenuItem className="text-lg cursor-pointer" onClick={() => navigate(`/users/${user.uId}`)}>
                  View Details
                </DropdownMenuItem>
                <DropdownMenuItem className="text-lg cursor-pointer" onClick={() => navigate(`/edituser/${user.uId}`)}>
                  Edit User
                </DropdownMenuItem>
                <h1 className="text-lg ml-2 cursor-pointer" onClick={() => setOpenDialog(true)}>
                  Delete User
                </h1>
                <Dialog open={openDialog} onOpenChange={setOpenDialog}>
                  <DialogTrigger asChild>
                    <Button className="hidden" />
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Confirm Deletion</DialogTitle>
                      <DialogDescription>
                        Are you sure you want to delete this user? Please enter the admin password to confirm.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="password" className="text-right">
                          Password
                        </Label>
                        <Input
                          type="password"
                          id="password"
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          className="col-span-3"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="button" onClick={handleDelete}>
                        Delete
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </>
      );
    },
  },
];
