import React, { useState, useEffect } from "react";
import { Briefcase, Video, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import RecruiterLayout from "../../../layouts/RecruiterLayouts";
import { interviewService } from "../../../service/interviewService";

import { JobsLoadingSkeleton } from "../../../utils/shimmer/JobCardSkeleton";
import InterviewCard from "../../../component/recruiter/InterviewCard";
import UserLayout from "../../../layouts/UserLayout";

interface Interview {
  _id: string;
  recruiterId: string;
  candidateId: {
    _id: string;
    username: string;
    email: string;
  } | string;
  jobId?: {
    _id: string;
    jobrole: string;
  } | string;
  date: string;
  time: string;
  duration: number;
  instructions?: string;
  roomId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationData {
  total: number;
  page: number;
  pages: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const UsersViewAllInterviews = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    pages: 1,
    limit: 6,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'cancel' | 'reschedule' | null>(null);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);
  const limit = 6;

  useEffect(() => {
    fetchScheduledInterview();
  }, [currentPage]);

  const fetchScheduledInterview = async () => {
    try {
      setLoading(true);
      const response = await interviewService.usersViewAllInterview({
        page: currentPage,
        limit,
      });
      
      console.log("viewAllInterview", response);
      
      if (response.data.success && response.data.data) {
        setInterviews(response.data.data.interview || []);
        setPagination(response.data.data.pagination || pagination);
      } else {
        setInterviews([]);
      }
    } catch (error) {
      console.error("Error fetching interviews:", error);
      setInterviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartCall = (roomId: string) => {
    console.log("Starting video call for room:", roomId);
  
    navigate(`/user/interviewcall/${roomId}`);
  };

  const handleCancelInterview = (interviewId: string) => {
    const interview = interviews.find(i => i._id === interviewId);
    setSelectedInterview(interview || null);
    setModalType('cancel');
    setShowModal(true);
  };

  const handleRescheduleInterview = (interviewId: string) => {
    const interview = interviews.find(i => i._id === interviewId);
    setSelectedInterview(interview || null);
    setModalType('reschedule');
    setShowModal(true);
  };

  const confirmCancel = async () => {
    if (selectedInterview) {
      try {
        
        console.log("Cancelling interview:", selectedInterview._id);
        
       
        setInterviews(prevInterviews =>
          prevInterviews.map(interview =>
            interview._id === selectedInterview._id
              ? { ...interview, status: 'cancelled' }
              : interview
          )
        );
        
        setShowModal(false);
        setSelectedInterview(null);
      } catch (error) {
        console.error("Error cancelling interview:", error);
      }
    }
  };

  const confirmReschedule = () => {
    if (selectedInterview) {
      console.log("Rescheduling interview:", selectedInterview._id);
      setShowModal(false);
      setSelectedInterview(null);
      // TODO: Navigate to reschedule page
      // navigate(`/recruiter/interview/reschedule/${selectedInterview._id}`);
    }
  };

  const Pagination = ({ currentPage, totalPages, onPageChange }: any) => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex justify-center items-center gap-2 mt-8">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-slate-700/50 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
        >
          Previous
        </button>
        <span className="px-4 py-2 text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-slate-700/50 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-700 transition-colors"
        >
          Next
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <UserLayout>
        <JobsLoadingSkeleton />
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <Video className="w-8 h-8 text-blue-400" />
                Scheduled Interviews
              </h1>
              <p className="text-gray-300">
                Manage and track all your scheduled interviews
              </p>
            </div>
            <div className="bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700/50">
              <span className="text-gray-400 text-sm">Total: </span>
              <span className="text-white font-semibold">{pagination.total}</span>
            </div>
          </div>

          {interviews.length === 0 ? (
            // Empty State
            <div className="bg-slate-800/30 backdrop-blur-md rounded-lg border border-slate-700/50 p-12 text-center">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No Interviews Found
              </h3>
              <p className="text-gray-500">
                Schedule your first interview to get started
              </p>
            </div>
          ) : (
           
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {interviews.map((interview) => (
                <InterviewCard
                  key={interview._id}
                  interview={interview}
                  onStartCall={handleStartCall}
                  onCancel={handleCancelInterview}
                  onReschedule={handleRescheduleInterview}
                  role="user"
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>

        {/* Confirmation Modal */}
        {showModal && selectedInterview && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 max-w-md w-full shadow-2xl">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-red-500/20 rounded-lg">
                  <AlertCircle className="w-6 h-6 text-red-400" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {modalType === 'cancel' ? 'Cancel Interview?' : 'Reschedule Interview?'}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {modalType === 'cancel'
                      ? 'Are you sure you want to cancel this interview? This action cannot be undone.'
                      : 'Are you sure you want to reschedule this interview? The candidate will be notified.'}
                  </p>
                </div>
              </div>
              
              <div className="bg-slate-900/50 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-400">Interview ID:</p>
                <p className="text-white font-medium">#{selectedInterview._id.slice(-8)}</p>
                <p className="text-sm text-gray-400 mt-2">Scheduled for:</p>
                <p className="text-white font-medium">
                  {new Date(selectedInterview.date).toLocaleDateString()} at {selectedInterview.time}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedInterview(null);
                  }}
                  className="flex-1 px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={modalType === 'cancel' ? confirmCancel : confirmReschedule}
                  className={`flex-1 px-4 py-2.5 rounded-lg font-medium transition-colors ${
                    modalType === 'cancel'
                      ? 'bg-red-600 hover:bg-red-500 text-white'
                      : 'bg-blue-600 hover:bg-blue-500 text-white'
                  }`}
                >
                  {modalType === 'cancel' ? 'Confirm Cancel' : 'Confirm Reschedule'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </UserLayout>
  );
};

export default UsersViewAllInterviews;