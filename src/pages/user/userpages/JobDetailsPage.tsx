import React, { useState, useEffect } from "react";
import { Briefcase } from "lucide-react";

import { JobsLoadingSkeleton } from "../../../utils/shimmer/JobCardSkeleton";
import RecruiterLayout from "../../../layouts/RecruiterLayouts";
import { jobService } from "../../../service/jobService";
import { Search } from "../../../component/common/Search";
import { DropdownFilter } from "../../../component/common/DropDownFilter";
import { JobCard } from "../../../component/common/CardComponent";
import Pagination from "../../../component/common/Pagination";

import { useNavigate } from "react-router-dom";

import { Job } from "../../../models/recruiter";

import UserLayout from "../../../layouts/UserLayout";

interface PaginationData {
  total: number;
  page: number;
  pages: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const JobDetailsPage = () => {
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
    fetchJobs(); 
  }, [currentPage, filters.status, filters.workmode, filters.worktime]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await jobService.jobDetails({
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
    <UserLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8"></div>

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
                  showActions={true}
                  onApply={() => {
                    navigate('/user/job-apply', { state: { job } });
                  }}
                />
              ))}
            </div>
          )}

          {pagination.pages > 1 && (
            <Pagination
              currentPage={pagination.page}
              totalPages={pagination.pages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      </div>
    </UserLayout>
  );
};

export default JobDetailsPage;
