import React from "react";
import {
  MapPin,
  Clock,
  Users,
  DollarSign,
  Briefcase,
  Edit,
  Eye,
} from "lucide-react";

interface Job {
  _id: string;
  jobrole: string;
  workTime: string;
  workMode: string;
  jobLocation: string;
  minExperience: string;
  minSalary: string;
  maxSalary: string;
  status: string;
  requirements: string[];
  responsibilities: string[];
}

interface JobCardProps {
  job: Job;
  onView?: (jobId: string) => void;
  onUpdate?: (jobId: string) => void;
  toggleStatus?: (jobId: string) => void;
  showActions?: boolean;
  onApply?: (jobId: string) => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  job,
  onView,
  onUpdate,
  toggleStatus,
  onApply,
  showActions = true,
}) => {
  const getStatusColor = (status: string) => {
    return status === "Active"
      ? "bg-green-500/20 text-green-400"
      : "bg-red-500/20 text-red-400";
  };

  const isJobActive = job.status === "Active";

  return (
    <div className="bg-slate-700/40 backdrop-blur-md rounded-lg border border-slate-600/50 p-6 hover:border-slate-500/70 transition-all">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-white line-clamp-2 flex-1">
          {job.jobrole}
        </h3>
        <span
          className={`ml-2 px-2 py-1 rounded-lg text-xs font-semibold ${getStatusColor(
            job.status
          )}`}
        >
          {job.status}
        </span>
      </div>

      <div className="space-y-2 mb-6">
        <div className="flex items-center text-sm text-gray-300">
          <Clock className="w-4 h-4 mr-2 text-green-400" />
          <span className="capitalize">{job.workTime.replace("-", " ")}</span>
        </div>

        <div className="flex items-center text-sm text-gray-300">
          <Users className="w-4 h-4 mr-2 text-cyan-400" />
          <span className="capitalize">{job.workMode.replace("-", " ")}</span>
        </div>

        <div className="flex items-center text-sm text-gray-300">
          <MapPin className="w-4 h-4 mr-2 text-purple-400" />
          <span>{job.jobLocation}</span>
        </div>

        <div className="flex items-center text-sm text-gray-300">
          <DollarSign className="w-4 h-4 mr-2 text-emerald-400" />
          <span>
            {job.minSalary && job.maxSalary
              ? `${job.minSalary} - ${job.maxSalary} LPA`
              : "Not specified"}
          </span>
        </div>

        <div className="flex items-center text-sm text-gray-300">
          <Briefcase className="w-4 h-4 mr-2 text-orange-400" />
          <span>{job.minExperience}+ years</span>
        </div>
      </div>

      {showActions && (
        <div className="flex gap-2">
          {onView && (
            <button
              onClick={() => onView(job._id)}
              className="flex-1 px-4 py-2 bg-slate-800/50 border border-slate-600/50 rounded-lg hover:bg-slate-700/50 transition-all text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              View
            </button>
          )}

          {onUpdate && (
            <button
              onClick={() => onUpdate(job._id)}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all text-sm font-semibold flex items-center justify-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Update
            </button>
          )}

          {toggleStatus && (
            <button
              onClick={() => toggleStatus(job._id)}
              className={`flex-1 px-4 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all
              ${
                job.status === "Active"
                  ? "bg-green-600/80 hover:bg-green-700 text-white"
                  : "bg-red-600/80 hover:bg-red-700 text-white"
              }`}
            >
              {job.status === "Active" ? "Deactivate" : "Activate"}
            </button>
          )}

          {showActions && onApply && (
            <button
              onClick={() => isJobActive && onApply(job._id)}
              disabled={!isJobActive}
              className={`cursor-pointer w-full px-4 py-2 rounded-lg transition-all text-sm font-semibold flex items-center justify-center gap-2
                ${
                  isJobActive
                    ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500"
                    : "bg-gray-600 cursor-not-allowed opacity-50"
                }`}
            >
              {isJobActive ? "Apply Job" : "Job Inactive"}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
