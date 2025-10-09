import React, { useEffect, useState } from "react";
import { adminAuthService } from "../../../service/adminAuth";
import { AdminLayout } from "../../../layouts/AdminLayouts";
import Table from "../../../component/common/Table";
import Button from "../../../component/common/Button";
import { Search } from "../../../component/common/Search";
import { ConfirmModal } from "../../../component/common/ConfirmModal";
import Pagination from "../../../component/common/Pagination";
import { Column } from "../../../types/component.types";
import { DropdownFilter } from "../../../component/common/DropDownFilter";
import { IUser } from "../../../models/user";

export const UsersListPage: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

 
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 500);
  
    return () => clearTimeout(delayDebounce); 
  }, [currentPage, searchTerm, statusFilter]);
  

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchUsers();
    }, 500);
  
    return () => {
      clearTimeout(handler);
    };
  }, [currentPage, searchTerm, statusFilter]);

  const fetchUsers = async () => {
    try {
      const res = await adminAuthService.getAllUsers({
        page: currentPage,
        limit,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
      });

      if (res.success && res.data) {
        setUsers(res.data.users || []);
        setTotalPages(res.data.pagination.pages || 1);
      } else {
        setUsers([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    }
  };

  const openConfirmModal = (user: IUser) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleConfirmToggle = async () => {
    if (!selectedUser) return;
  
    try {
      console.log("selected",selectedUser)
      const res = await adminAuthService.toggleUserStatus(selectedUser._id);
      if (res.success) {
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === selectedUser._id
              ? {
                  ...user,
                  status: user.status === "Active" ? "InActive" : "Active",
                }
              : user
          )
        );
      } else {
        console.error(res.message);
      }
    } catch (error) {
      console.error("Failed to toggle status:", error);
    } finally {
      setModalOpen(false);
      setSelectedUser(null);
    }
  };
  

  const columns: Column<IUser>[] = [
    {
      key: "serial",
      label: "S.No",
      render: (_item, index) => index + 1,
    },
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <span
          className={`px-2 py-1 rounded-full text-sm font-medium ${
            item.status === "Active"
              ? "bg-green-100 text-green-700"
              : item.status === "InActive"
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (item: IUser) => (
        <Button
          variant={item.status === "Active" ? "secondary" : "primary"}
          size="sm"
          onClick={() => openConfirmModal(item)}
        >
          {item.status === "Active" ? "Block" : "Unblock"}
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-white">Students</h1>

        <div className="mb-6 flex flex-col lg:flex-row justify-between items-end gap-4">
          <div className="relative w-full lg:w-1/3">
            <Search
              value={searchTerm}
              onChange={(val) => {
                setCurrentPage(1);
                setSearchTerm(val);
              }}
              placeholder="Search by username or email"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-2/3 lg:justify-end">
            <div className="w-full sm:w-64">
              <DropdownFilter
                label="Filter by Status"
                value={statusFilter}
                onChange={(val) => {
                  setCurrentPage(1);
                  setStatusFilter(val);
                }}
                options={[
                  { value: "active", label: "Active" },
                  { value: "blocked", label: "Blocked" },
                ]}
              />
            </div>
          </div>
        </div>

        <Table
          data={users}
          columns={columns}
          currentPage={currentPage}
          pageSize={limit}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />

        <ConfirmModal
          isOpen={modalOpen}
          title={
            selectedUser?.status === "Active" ? "Block User" : "Unblock User"
          }
          message={`Are you sure you want to ${
            selectedUser?.status === "Active" ? "block" : "unblock"
          } this user?`}
          confirmText={selectedUser?.status === "Active" ? "Block" : "Unblock"}
          onConfirm={handleConfirmToggle}
          onCancel={() => setModalOpen(false)}
        />
      </div>
    </AdminLayout>
  );
};
