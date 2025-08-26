import React, { useEffect, useState } from "react";
import { adminAuthService } from "../../../service/adminAuth";
import { AdminLayout } from "../../../layouts/AdminLayouts";
import Table from "../../../component/common/Table";
import Pagination from "../../../component/common/Pagination";
import { Column } from "../../../types/component.types";
import { IRecruiter } from "../../../models/recruiter";
import { useNavigate } from "react-router-dom";

interface ApplicantsListPageProps {
  user: string;
}

export const ApplicantsListPage: React.FC<ApplicantsListPageProps> = ({user}) => {
  const [applicants, setApplicants] = useState<IRecruiter[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;
  const navigate = useNavigate();

  useEffect(() => {
    fetchApplicants();
  }, [currentPage]);

  const fetchApplicants = async () => {
    try {
      const res = await adminAuthService.getAllApplicants({
        page: currentPage,
        limit,
      });
      console.log(res)

      if (res.success && res.data) {
        setApplicants(res.data.users || []);
        setTotalPages(res.data.pagination.pages || 1);
      } else {
        setApplicants([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Error fetching applicants:", error);
      setApplicants([]);
    }
  };

  const columns: Column<IRecruiter>[] = [
    {
      key: "username",
      label: "Recruiter",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
            {item.username.charAt(0).toUpperCase()}
          </div>

          <div>
            <p className="font-medium text-white">{item.username}</p>
            <p className="text-sm text-gray-400">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "companyName",
      label: "Company",
      render: (item) => (
        <div>
          <p className="font-medium text-white">{item.companyName}</p>
          <p className="text-sm text-gray-400">{item.companyType}</p>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
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
      key: "serial",
      label: "Applied Date",
      render: (item) => {
        const date = new Date(item.createdAt);
        return (
          <span className="text-gray-300">{date.toLocaleDateString()}</span>
        );
      },
    },
    {
      key: "action",
      label: "Actions",
      render: (item) => (
        <button
          className="text-blue-500 hover:underline"
          onClick={() =>
            navigate(`/admin/applicants/${item._id}`, {
              state: { applicant: item, user:user},
            })
          }
        >
          View Details
        </button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-white">Applicants</h1>

        <Table
          data={applicants}
          columns={columns}
          currentPage={currentPage}
          pageSize={limit}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>
    </AdminLayout>
  );
};
