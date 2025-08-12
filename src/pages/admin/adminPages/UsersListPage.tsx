import React, { useEffect, useState } from "react";
import { adminAuthService } from "../../../service/adminAuth";
import { AdminLayout } from "../../../layouts/AdminLayouts";
import { Table } from "../../../component/common/Table";
import Button from "../../../component/common/Button";
import { Search } from "../../../component/common/Search";
import { ConfirmModal } from "../../../component/common/ConfirmModal";

interface IUser {
  _id: string;
  username: string;
  email: string;
  status: "Active" | "Inactive";
  createdAt: string;
}

export const UsersListPage: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await adminAuthService.getAllUsers();
      const mappedUsers = (data.users || []).map((user: IUser) => ({
        ...user,
        status: user.status || "Active",
      }));
      setUsers(mappedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const openConfirmModal = (user: IUser) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleConfirmToggle = async () => {
    if (!selectedUser) return;

    try {
     
      await adminAuthService.toggleUserStatus(selectedUser._id);

     
      setUsers((prev) =>
        prev.map((u) =>
          u._id === selectedUser._id
            ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
            : u
        )
      );
    } catch (error) {
      console.error("Failed to toggle status:", error);
    } finally {
      setModalOpen(false);
      setSelectedUser(null);
    }
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { header: "Username", accessor: "username" as keyof IUser },
    { header: "Email", accessor: "email" as keyof IUser },
    {
      header: "Action",
      accessor: (row: IUser) => (
        <Button
          variant={row.status === "Active" ? "secondary" : "primary"}
          size="sm"
          onClick={() => openConfirmModal(row)}
        >
          {row.status === "Active" ? "Block" : "Unblock"}
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-white">Users</h1>

        <div className="w-1/3">
          <Search
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by username or email"
          />
        </div>

        <Table columns={columns} data={filteredUsers} />

        {/* Confirmation Modal */}
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
