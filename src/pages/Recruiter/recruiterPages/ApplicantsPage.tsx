import React, { useEffect, useState } from "react";
import RecruiterLayout from "../../../layouts/RecruiterLayouts";
import Table from "../../../component/common/Table";
import Button from "../../../component/common/Button";
import { Search } from "../../../component/common/Search";
import { ConfirmModal } from "../../../component/common/ConfirmModal";
import Pagination from "../../../component/common/Pagination";
import { Column } from "../../../types/component.types";
import { DropdownFilter } from "../../../component/common/DropDownFilter";
import { applicationService } from "../../../service/ApplicationService";
import {
  IJobApplication,
  IPopulatedJobApplication,
} from "../../../models/recruiter";
import { useNavigate } from "react-router-dom";
import ApplicantDetailsModal from "../../../component/recruiter/ApplicantDetailsModal";
import AiShortlistModal from "../../../component/recruiter/AiShortlistModalProps";

interface JobTitle {
  jobrole: string;
  jobId: string;
}

const ApplicantsPage: React.FC = () => {
  const [applicants, setApplicants] = useState<IJobApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] =
    useState<IJobApplication | null>(null);
  const [actionType, setActionType] = useState<
    "shortlist" | "reject" | "accept" | null
  >(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewApplicant, setViewApplicant] = useState<IJobApplication | null>(
    null
  );
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiJobTitle, setAiJobTitle] = useState<string>("");
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [threshold, setThreshold] = useState<string>("");
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const limit = 5;

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchApplicants();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [currentPage, searchTerm, statusFilter]);

  useEffect(() => {
    if (showSuccessToast || showErrorToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
        setShowErrorToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast, showErrorToast]);

  const fetchApplicants = async () => {
    try {
      const res = await applicationService.getAllApplicants({
        page: currentPage,
        limit,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
      });

      console.log("response from all applicants", res);
      if (res.success && res.data) {
        setApplicants(res.data.applications || []);
        setTotalPages(res.data.pagination.pages || 1);

        const uniqueJobs = new Map<string, JobTitle>();
        
        res.data.applications.forEach((app: IPopulatedJobApplication) => {
          if (app.jobId?.jobrole && app.jobId?._id) {
            const jobId = app.jobId._id;
            if (!uniqueJobs.has(jobId)) {
              uniqueJobs.set(jobId, {
                jobrole: app.jobId.jobrole,
                jobId: jobId
              });
            }
          }
        });

        const titles = Array.from(uniqueJobs.values());
        console.log("Extracted job titles:", titles);
        setJobTitles(titles);
      } else {
        setApplicants([]);
        setTotalPages(1);
        setJobTitles([]);
      }
    } catch (error) {
      console.error("Error fetching applicants:", error);
      setApplicants([]);
    }
  };

  const fetchAiShortlist = async () => {
    try {
      if (!aiJobTitle) {
        setToastMessage("Please select a job position");
        setShowErrorToast(true);
        return;
      }
      
      if (!selectedJobId) {
        setToastMessage("Job ID is missing. Please select a position again.");
        setShowErrorToast(true);
        return;
      }

      if (!threshold || parseFloat(threshold) <= 0 || parseFloat(threshold) > 100) {
        setToastMessage("Please enter a valid threshold between 1 and 100");
        setShowErrorToast(true);
        return;
      }

      setIsProcessing(true);

      console.log("Selected Job ID:", selectedJobId);
      console.log("Threshold:", threshold);
      
      const res = await applicationService.applicationShortlist(
        selectedJobId,
        threshold
      );
      
      if (res.success) {
        setToastMessage("AI shortlisting completed successfully!");
        setShowSuccessToast(true);
        fetchApplicants();
        handleCloseAiModal();
      }
    } catch (error) {
      console.error("Error in AI shortlist:", error);
      setToastMessage("Failed to perform AI shortlist. Please try again.");
      setShowErrorToast(true);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCloseAiModal = () => {
    if (!isProcessing) {
      setAiModalOpen(false);
      setAiJobTitle("");
      setSelectedJobId("");
      setThreshold("");
    }
  };

  const handleJobTitleChange = (jobTitle: string, jobId: string) => {
    setAiJobTitle(jobTitle);
    setSelectedJobId(jobId);
    console.log("Selected Job:", { jobTitle, jobId });
  };

  const openConfirmModal = (
    applicant: IJobApplication,
    action: "shortlist" | "reject" | "accept"
  ) => {
    setSelectedApplicant(applicant);
    setActionType(action);
    setModalOpen(true);
  };

  const handleConfirmAction = async () => {
    //     if (!selectedApplicant || !actionType) return;
    //     try {
    //       const res = await recruiterAuthService.updateApplicationStatus(
    //         selectedApplicant._id,
    //         actionType
    //       );
    //       if (res.success) {
    //         setApplicants((prevApplicants) =>
    //           prevApplicants.map((app) =>
    //             app._id === selectedApplicant._id
    //               ? { ...app, status: actionType }
    //               : app
    //           )
    //         );
    //       } else {
    //         console.error(res.message);
    //       }
    //     } catch (error) {
    //       console.error("Failed to update status:", error);
    //     } finally {
    //       setModalOpen(false);
    //       setSelectedApplicant(null);
    //       setActionType(null);
    //     }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "reviewed":
        return "bg-blue-100 text-blue-700";
      case "shortlisted":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "accepted":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const columns: Column<IJobApplication>[] = [
    {
      key: "serial",
      label: "S.No",
      render: (_item, index) => (currentPage - 1) * limit + index + 1,
    },
    {
      key: "name",
      label: "Name",
      render: (item) => item.name || "N/A",
    },
    {
      key: "contactNo",
      label: "Contact No",
      render: (item) => item.contactNo || "N/A",
    },
    {
      key: "email",
      label: "Email",
      render: (item) => item.email || "N/A",
    },
    {
      key: "status",
      label: "Status",
      render: (item) => (
        <span
          className={`px-2 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(
            item.status
          )}`}
        >
          {item.status}
        </span>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (item: IJobApplication) => (
        <div className="flex gap-2">
          {item.status === "pending" && (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => openConfirmModal(item, "shortlist")}
              >
                Shortlist
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => openConfirmModal(item, "reject")}
              >
                Reject
              </Button>
            </>
          )}
          {item.status === "shortlisted" && (
            <>
              <Button
                variant="primary"
                size="sm"
                onClick={() => openConfirmModal(item, "accept")}
              >
                Accept
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => openConfirmModal(item, "reject")}
              >
                Reject
              </Button>
            </>
          )}
          {(item.status === "rejected" || item.status === "accepted") && (
            <span className="text-sm text-gray-500">No actions</span>
          )}
        </div>
      ),
    },
    {
      key: "viewDetails",
      label: "Details",
      render: (item) => (
        <Button
          variant="primary"
          size="sm"
          onClick={() => {
            setViewApplicant(item);
            setViewModalOpen(true);
          }}
          className="px-4 py-2 font-medium"
        >
          Details
        </Button>
      ),
    },
  ];

  const getModalContent = () => {
    if (!actionType) return { title: "", message: "", confirmText: "" };

    switch (actionType) {
      case "shortlist":
        return {
          title: "Shortlist Applicant",
          message: "Are you sure you want to shortlist this applicant?",
          confirmText: "Shortlist",
        };
      case "reject":
        return {
          title: "Reject Applicant",
          message: "Are you sure you want to reject this applicant?",
          confirmText: "Reject",
        };
      case "accept":
        return {
          title: "Accept Applicant",
          message: "Are you sure you want to accept this applicant?",
          confirmText: "Accept",
        };
      default:
        return { title: "", message: "", confirmText: "" };
    }
  };

  const modalContent = getModalContent();

  return (
    <RecruiterLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-3xl font-bold text-white">Applicants</h1>
        <p className="text-gray-400">
          Total Applications: {applicants.length > 0 ? totalPages * limit : 0}
        </p>
        <Button
          variant="primary"
          size="md"
          onClick={() => setAiModalOpen(true)}
          className="flex items-center gap-2"
        >
          <svg
            className="w-5 h-5"
            fill="url(#gradient)"
            stroke="url(#gradient)"
            viewBox="0 0 24 24"
          >
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="100%" y2="0">
                <stop offset="0%" stopColor="#9f7aea" />
                <stop offset="100%" stopColor="#4f46e5" />
              </linearGradient>
            </defs>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
          AI Shortlist
        </Button>

        <div className="mb-6 flex flex-col lg:flex-row justify-between items-end gap-4">
          <div className="relative w-full lg:w-1/3">
            <Search
              value={searchTerm}
              onChange={(val) => {
                setCurrentPage(1);
                setSearchTerm(val);
              }}
              placeholder="Search by name, email or contact"
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
                  { value: "pending", label: "Pending" },
                  { value: "shortlisted", label: "Shortlisted" },
                  { value: "rejected", label: "Rejected" },
                  { value: "accepted", label: "Accepted" },
                  { value: "scheduled", label: "Scheduled" },
                ]}
              />
            </div>
          </div>
        </div>

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

        <ConfirmModal
          isOpen={modalOpen}
          title={modalContent.title}
          message={modalContent.message}
          confirmText={modalContent.confirmText}
          onConfirm={handleConfirmAction}
          onCancel={() => {
            setModalOpen(false);
            setSelectedApplicant(null);
            setActionType(null);
          }}
        />

        <ApplicantDetailsModal
          isOpen={viewModalOpen}
          applicant={viewApplicant}
          onClose={() => {
            setViewModalOpen(false);
            setViewApplicant(null);
          }}
        />

        <AiShortlistModal
          isOpen={aiModalOpen}
          jobTitles={jobTitles}
          aiJobTitle={aiJobTitle}
          selectedJobId={selectedJobId}
          threshold={threshold}
          isProcessing={isProcessing}
          onJobTitleChange={handleJobTitleChange}
          onThresholdChange={setThreshold}
          onApply={fetchAiShortlist}
          onClose={handleCloseAiModal}
        />

        {showSuccessToast && (
          <div className="fixed top-4 right-4 z-50 animate-slide-in">
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px]">
              <svg
                className="w-6 h-6 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="font-medium">{toastMessage}</p>
            </div>
          </div>
        )}

        {showErrorToast && (
          <div className="fixed top-4 right-4 z-50 animate-slide-in">
            <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 min-w-[300px]">
              <svg
                className="w-6 h-6 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="font-medium">{toastMessage}</p>
            </div>
          </div>
        )}
      </div>
    </RecruiterLayout>
  );
};

export default ApplicantsPage;