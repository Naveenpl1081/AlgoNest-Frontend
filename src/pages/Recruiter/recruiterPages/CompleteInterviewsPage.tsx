import React, { useEffect, useState } from "react";
import RecruiterLayout from "../../../layouts/RecruiterLayouts";
import Table from "../../../component/common/Table";
import Button from "../../../component/common/Button";
import { Search } from "../../../component/common/Search";
import Pagination from "../../../component/common/Pagination";
import { Column } from "../../../types/component.types";
import { interviewService } from "../../../service/interviewService";
import InterviewResultModal from "../../../component/recruiter/InterviewResultModalProps";

export interface ICompletedInterview {
  _id: string;
  recruiterId: string;
  candidateId: string;
  candidateName?: string;
  candidateEmail?: string;
  jobId?: string;
  jobTitle?: string;
  date: Date;
  time: string;
  duration: string;
  instructions?: string;
  roomId: string;
  status: "scheduled" | "completed" | "cancelled";
  createdAt?: Date;
  updatedAt?: Date;
}

const CompletedInterviewsPage: React.FC = () => {
  const [interviews, setInterviews] = useState<ICompletedInterview[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const [isResultModalOpen, setIsResultModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] =
    useState<ICompletedInterview | null>(null);

  const limit = 5;

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchCompletedInterviews();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [currentPage, searchTerm]);

  useEffect(() => {
    if (showSuccessToast || showErrorToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(false);
        setShowErrorToast(false);
        setToastMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast, showErrorToast]);

  const fetchCompletedInterviews = async () => {
    setLoading(true);
    try {
      const res = await interviewService.getAllCompleteInterviews({
        page: currentPage,
        limit,
        search: searchTerm || undefined,
      });

      console.log("Completed interviews response:", res);

      if (res.success && res.data) {
        setInterviews(res.data.interview || []);
        setTotalPages(res.data.pagination.pages || 1);
        setTotalCount(res.data.pagination.total || 0);
      } else {
        setInterviews([]);
        setTotalPages(1);
        setTotalCount(0);
      }
    } catch (error) {
      console.error("Error fetching completed interviews:", error);
      setInterviews([]);
      setTotalPages(1);
      setTotalCount(0);
      setToastMessage("Failed to fetch interviews");
      setShowErrorToast(true);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenResultModal = (interview: ICompletedInterview) => {
    setSelectedInterview(interview);
    setIsResultModalOpen(true);
  };

  const handleSendResult = async (resultData: {
    result: string;
    message: string;
  }) => {
    if (!selectedInterview) return;

    try {
      const response = await interviewService.sendInterviewResult({
        interviewId: selectedInterview._id,
        candidateEmail: selectedInterview.candidateEmail!,
        candidateName: selectedInterview.candidateName!,
        result: resultData.result,
        message: resultData.message,
      });

      if (response.success) {
        setToastMessage(
          `Result email sent successfully to ${selectedInterview.candidateName}`
        );
        setShowSuccessToast(true);
        setIsResultModalOpen(false);
        setSelectedInterview(null);
      } else {
        setToastMessage(response.message || "Failed to send result email");
        setShowErrorToast(true);
      }
    } catch (error) {
      console.error("Error sending result:", error);
      setToastMessage("Failed to send result email");
      setShowErrorToast(true);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const columns: Column<ICompletedInterview>[] = [
    {
      key: "serial",
      label: "S.No",
      render: (_item, index) => (currentPage - 1) * limit + index + 1,
    },
    {
      key: "candidateName",
      label: "Candidate Name",
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-medium text-white">
            {item.candidateName || "N/A"}
          </span>
          <span className="text-sm text-gray-400">{item.candidateEmail}</span>
        </div>
      ),
    },
    {
      key: "jobTitle",
      label: "Job Role",
      render: (item) => (
        <span className="text-white">{item.jobTitle || "N/A"}</span>
      ),
    },
    {
      key: "date",
      label: "Interview Date",
      render: (item) => (
        <div className="flex flex-col">
          <span className="text-white">{formatDate(item.date)}</span>
          <span className="text-sm text-gray-400">{item.time}</span>
        </div>
      ),
    },
    {
      key: "duration",
      label: "Duration",
      render: (item) => (
        <span className="text-white">{item.duration || "N/A"}</span>
      ),
    },
    {
      key: "action",
      label: "Actions",
      render: (item) => (
        <Button
          variant="primary"
          size="sm"
          onClick={() => handleOpenResultModal(item)}
          className="px-4 py-2 font-medium bg-green-600 hover:bg-green-700 text-white"
        >
          Send Result
        </Button>
      ),
    },
  ];

  return (
    <RecruiterLayout>
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">
            Completed Interviews
          </h1>
          <div className="text-sm text-gray-400">
            Total: {totalCount} interviews
          </div>
        </div>

        <div className="mb-6 flex flex-col lg:flex-row justify-between items-end gap-4">
          <div className="relative w-full lg:w-1/3">
            <Search
              value={searchTerm}
              onChange={(val) => {
                setCurrentPage(1);
                setSearchTerm(val);
              }}
              placeholder="Search by name, email or job role"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        ) : interviews.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-gray-400 text-lg">
              {searchTerm
                ? "No interviews found matching your search"
                : "No completed interviews found"}
            </p>
          </div>
        ) : (
          <>
            <Table
              data={interviews}
              columns={columns}
              currentPage={currentPage}
              pageSize={limit}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </>
        )}

        {selectedInterview && (
          <InterviewResultModal
            isOpen={isResultModalOpen}
            candidateName={selectedInterview.candidateName || "Candidate"}
            candidateEmail={selectedInterview.candidateEmail || ""}
            jobTitle={selectedInterview.jobTitle || "Position"}
            onClose={() => {
              setIsResultModalOpen(false);
              setSelectedInterview(null);
            }}
            onSend={handleSendResult}
          />
        )}

        {showSuccessToast && (
          <div className="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {toastMessage}
          </div>
        )}

        {showErrorToast && (
          <div className="fixed bottom-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg z-50">
            {toastMessage}
          </div>
        )}
      </div>
    </RecruiterLayout>
  );
};

export default CompletedInterviewsPage;
