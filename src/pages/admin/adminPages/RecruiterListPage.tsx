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
import { IRecruiter } from "../../../models/recruiter";
import { useNavigate } from "react-router-dom";


interface ApplicantsListPageProps {
  user: string;
}

export const RecruiterListPage: React.FC<ApplicantsListPageProps> = ({user}) => {
  const [users, setUsers] = useState<IRecruiter[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IRecruiter | null>(null);
  const navigate=useNavigate()
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchUsers = async () => {
    try {
      const res = await adminAuthService.getAllRecruiter({
        page: currentPage,
        limit,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
      });

      console.log("recruiter",res)

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

  const openConfirmModal = (user: IRecruiter) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const handleConfirmToggle = async () => {
    if (!selectedUser) return;

    try {
      const res = await adminAuthService.toggleRecruiterStatus(selectedUser._id);
      if (res.success) {
        await fetchUsers();
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

  const columns: Column<IRecruiter>[] = [
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
      render: (item) => (  <span
        className={`px-3 py-1 rounded-full text-sm font-medium ${
          item.status === "Active"
            ? "bg-green-100 text-green-700"
            : item.status === "InActive"
            ? "bg-red-100 text-red-700"
            : "bg-yellow-100 text-yellow-700"
        }`}
      >
        {item.status}
      </span>),
    },
    {
      key: "action",
      label: "Action",
      render: (item: IRecruiter) => (
        <Button
          variant={item.status === "Active" ? "secondary" : "primary"}
          size="sm"
          onClick={() => openConfirmModal(item)}
        >
          {item.status === "Active" ? "Block" : "Unblock"}
        </Button>
      ),
    },
    {
      key: "action",
      label: "Actions",
      render: (item) => (
        <Button
        className="bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() =>
            navigate(`/admin/applicants/${item._id}`, {
              state: { applicant: item,user: user },
            })
          }
        >
          View Details
        </Button>
      ),
    }
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-white">Recruiters</h1>

        <div className="w-full sm:w-1/2 lg:w-1/3">
          <Search
            value={searchTerm}
            onChange={(val) => {
              setCurrentPage(1);
              setSearchTerm(val);
            }}
            placeholder="Search by username or email"
          />
        </div>

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
