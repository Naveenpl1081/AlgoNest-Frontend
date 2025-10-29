import React, { useEffect, useState } from "react";
import RecruiterLayout from "../../../layouts/RecruiterLayouts";
import Table from "../../../component/common/Table";
import Button from "../../../component/common/Button";
import { Search } from "../../../component/common/Search";
import Pagination from "../../../component/common/Pagination";
import { Column } from "../../../types/component.types";
import { applicationService } from "../../../service/ApplicationService";
import {
  IJobApplication,
  IPopulatedJobApplication,
} from "../../../models/recruiter";
import { useNavigate } from "react-router-dom";
import ApplicantDetailsModal from "../../../component/recruiter/ApplicantDetailsModal";
import InterviewScheduleModal from "../../../component/recruiter/InterviewScheduleModal";
import { interviewService } from "../../../service/interviewService";

interface JobTitle {
  jobrole: string;
  jobId: string;
}

const ShortlistCandidatesPage: React.FC = () => {
  const [applicants, setApplicants] = useState<IJobApplication[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
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
  const [interviewModalOpen, setInterviewModalOpen] = useState(false);
  const [selectedApplicant, setSelectedApplicant] =
    useState<IJobApplication | null>(null);
  const [jobTitles, setJobTitles] = useState<JobTitle[]>([]);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);

  const limit = 5;

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchShortlistApplicants();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [currentPage, searchTerm]);

  useEffect(() => {
    if (showSuccessToast || showErrorToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
        setShowErrorToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast, showErrorToast]);

  const fetchShortlistApplicants = async () => {
    try {
      const res = await applicationService.getAllShortlistApplicants({
        page: currentPage,
        limit,
        search: searchTerm || undefined,
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
                jobId: jobId,
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "shortlisted":
        return "bg-green-100 text-green-700";
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      case "accepted":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleConductInterview = (applicant: IJobApplication) => {
    setSelectedApplicant(applicant);
    setInterviewModalOpen(true);
  };

  const handleScheduleInterview = async (interviewData: any) => {
    if (!selectedApplicant) return;

    try {
      const response = await interviewService.scheduleInterview({
        applicationId: selectedApplicant._id,
        ...interviewData,
      });

      console.log("Interview scheduled:", response);

      setShowSuccessToast(true);
      setInterviewModalOpen(false);
      setSelectedApplicant(null);
      fetchShortlistApplicants();
    } catch (error) {
      console.error("Error scheduling interview:", error);
      setShowErrorToast(true);
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
      label: "Actions",
      render: (item) => (
        <div className="flex gap-2">
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

          {item.status === "scheduled" ? (
            <Button
              variant="secondary"
              size="sm"
              disabled
              className="px-4 py-2 font-medium bg-green-600 text-white cursor-not-allowed opacity-100"
            >
              Interview Scheduled
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleConductInterview(item)}
              className="px-4 py-2 font-medium bg-blue-600 hover:bg-blue-700 text-white"
            >
              Conduct Interview
            </Button>
          )}
        </div>
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
        <h1 className="text-3xl font-bold text-white">
          Shortlisted Candidates
        </h1>

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

        <ApplicantDetailsModal
          isOpen={viewModalOpen}
          applicant={viewApplicant}
          onClose={() => {
            setViewModalOpen(false);
            setViewApplicant(null);
          }}
        />

        <InterviewScheduleModal
          isOpen={interviewModalOpen}
          applicant={selectedApplicant}
          onClose={() => {
            setInterviewModalOpen(false);
            setSelectedApplicant(null);
          }}
          onSchedule={handleScheduleInterview}
        />

        {showSuccessToast && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
            Interview scheduled successfully!
          </div>
        )}

        {showErrorToast && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg">
            Failed to schedule interview. Please try again.
          </div>
        )}
      </div>
    </RecruiterLayout>
  );
};

export default ShortlistCandidatesPage;
