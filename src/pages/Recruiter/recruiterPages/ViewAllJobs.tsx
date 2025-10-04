import React, { useState, useEffect } from "react";
import { Briefcase } from "lucide-react";

import { JobsLoadingSkeleton } from "../../../utils/shimmer/JobCardSkeleton";
import RecruiterLayout from "../../../layouts/RecruiterLayouts";
import { jobService } from "../../../service/jobService";
import { Search } from "../../../component/common/Search";
import { DropdownFilter } from "../../../component/common/DropDownFilter";
import { JobCard } from "../../../component/common/CardComponent";
import Pagination from "../../../component/common/Pagination";
import { Link } from "react-router-dom";
import { JobDetailsModal } from "../../../component/recruiter/JobDetailsModal";
import { useNavigate } from "react-router-dom";

import { Job } from "../../../models/recruiter";
import { ConfirmModal } from "../../../component/common/ConfirmModal";

interface PaginationData {
  total: number;
  page: number;
  pages: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const ViewAllJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const navigate = useNavigate();
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    pages: 1,
    limit: 6,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    workmode: "",
    worktime: "",
  });
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [jobToToggle, setJobToToggle] = useState<Job | null>(null);

  useEffect(() => {
    if (searchTerm.trim() !== "") {
      const delayDebounce = setTimeout(() => {
        fetchJobs();
      }, 500);

      return () => clearTimeout(delayDebounce);
    } else {
      fetchJobs();
    }
  }, [searchTerm]);
  const limit = 6;

  useEffect(() => {
    fetchJobs(); //
  }, [currentPage, filters.status, filters.workmode, filters.worktime]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobService.viewAllJobs({
        page: currentPage,
        limit,
        search: searchTerm || undefined,
        status: filters.status || undefined,
        workmode: filters.workmode || undefined,
        worktime: filters.worktime || undefined,
      });

      console.log("viewAllJobs", response);

      if (response.data.success && response.data.data) {
        setJobs(response.data.data.jobs || []);
        setPagination(response.data.data.pagination || pagination);
      } else {
        setJobs([]);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (value: string) => {
    setCurrentPage(1);
    setSearchTerm(value);
  };

  const handleFilterChange = (key: string, value: string) => {
    setCurrentPage(1);
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
  };

  const handleUpdate = (job: Job) => {
    navigate(`/recruiter/jobpost`, { state: { jobs: job } });
  };

  const openConfirmModal = (job: Job) => {
    setJobToToggle(job);
    setModalOpen(true);
  };
  const handleConfirmToggle = async () => {
    if (!jobToToggle) return;
  
    try {
      const response = await jobService.toggleJobStatus(jobToToggle._id);
      console.log("jobResponse:", response);
      
      
      if (response.data && response.data._id) {
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job._id === response.data._id
              ? {
                  ...job,
                  status: response.data.status,
                }
              : job
          )
        );
      }
    } catch (error) {
      console.error("Error toggling job status:", error);
    } finally {
      setModalOpen(false);
      setJobToToggle(null);
    }
  };

  const handleView = (jobId: string) => {
    const job = jobs.find((j) => j._id === jobId);
    if (job) {
      setSelectedJob(job);
    }
  };

  const handleCloseModal = () => {
    setSelectedJob(null);
  };

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "blocked", label: "Inactive" },
  ];

  const workModeOptions = [
    { value: "remote", label: "Remote" },
    { value: "on-site", label: "On Site" },
    { value: "hybrid", label: "Hybrid" },
  ];

  const workTimeOptions = [
    { value: "full-time", label: "Full Time" },
    { value: "part-time", label: "Part Time" },
    { value: "contract", label: "Contract" },
    { value: "internship", label: "Internship" },
  ];

  if (loading) {
    return (
      <RecruiterLayout>
        <JobsLoadingSkeleton />
      </RecruiterLayout>
    );
  }

  return (
    <RecruiterLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Posted Jobs
              </h1>
              <p className="text-gray-300">
                Manage and track all your job postings
              </p>
            </div>

            <Link to="/recruiter/jobpost">
              <button className="flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:from-blue-500 hover:to-purple-500 transition-all duration-200 group-hover:scale-105">
                Post a Job
              </button>
            </Link>
          </div>

          <div className="bg-slate-700/30 backdrop-blur-md rounded-lg border border-slate-600/50 p-6 mb-6">
            <div className="mb-4">
              <Search
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search for job titles..."
                className="max-w-2xl"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <DropdownFilter
                label="Status"
                options={statusOptions}
                value={filters.status}
                onChange={(value) => handleFilterChange("status", value)}
              />
              <DropdownFilter
                label="Work Mode"
                options={workModeOptions}
                value={filters.workmode}
                onChange={(value) => handleFilterChange("workmode", value)}
              />
              <DropdownFilter
                label="Work Time"
                options={workTimeOptions}
                value={filters.worktime}
                onChange={(value) => handleFilterChange("worktime", value)}
              />
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-4">
            <p className="text-gray-400">
              Showing{" "}
              <span className="font-semibold text-white">{jobs.length}</span> of{" "}
              <span className="font-semibold text-white">
                {pagination.total}
              </span>{" "}
              jobs
            </p>
          </div>

          {/* Job Cards */}
          {jobs.length === 0 ? (
            <div className="bg-slate-700/30 backdrop-blur-md rounded-lg border border-slate-600/50 p-12 text-center">
              <Briefcase className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">
                No Jobs Found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onView={handleView}
                  onUpdate={() => {
                    handleUpdate(job);
                  }}
                  toggleStatus={() => openConfirmModal(job)}
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
      </div>
      {/* Job Details Modal */}
      {selectedJob && (
        <JobDetailsModal job={selectedJob} onClose={handleCloseModal} />
      )}
      <ConfirmModal
        isOpen={modalOpen}
        title={
          jobToToggle?.status === "Active" ? "Deactivate Job" : "Activate Job"
        }
        message={`Are you sure you want to ${
          jobToToggle?.status === "Active" ? "deactivate" : "activate"
        } this job?`}
        confirmText={
          jobToToggle?.status === "Active" ? "Deactivate" : "Activate"
        }
        onConfirm={handleConfirmToggle}
        onCancel={() => setModalOpen(false)}
      />
    </RecruiterLayout>
  );
};

export default ViewAllJobs;
