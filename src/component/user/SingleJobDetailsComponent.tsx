import React from "react";
import {
  MapPin,
  Clock,
  Briefcase,
  DollarSign,
  Calendar,
  Building2,
} from "lucide-react";
import { Job } from "../../models/recruiter";

interface SingleJobDetailsComponentProps {
  job: Job;
}

const SingleJobDetailsComponent: React.FC<SingleJobDetailsComponentProps> = ({
  job,
}) => {
  const responsibilities = Array.isArray(job.responsibilities)
    ? job.responsibilities
    : [];
  const requirements = Array.isArray(job.requirements) ? job.requirements : [];

  const salaryDisplay =
    job.minSalary && job.maxSalary
      ? `${job.minSalary} - ${job.maxSalary} LPA`
      : "Not specified";

  const experienceDisplay =
    job.minExperience !== undefined
      ? `${job.minExperience}+ Years`
      : "Not specified";

  return (
    <div className="bg-slate-700/30 backdrop-blur-md rounded-lg border border-slate-600/50 p-6 mb-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">
          {job.jobrole || "Job Title"}
        </h1>
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
          <Building2 className="w-4 h-4" />
          <span>{job.recruiterId?.companyName || "Company Name"}</span>
          {job.recruiterId?.companyType && (
            <>
              <span>•</span>
              <span>{job.recruiterId.companyType}</span>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
          <div className="flex items-center gap-3 text-gray-300">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Work Time</p>
              <p className="font-medium capitalize">
                {job.workTime || "Not specified"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-300">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Work Mode</p>
              <p className="font-medium capitalize">
                {job.workMode || "Not specified"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-300">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Location</p>
              <p className="font-medium">
                {job.jobLocation || "Not specified"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-300">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Salary</p>
              <p className="font-medium">{salaryDisplay}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-gray-300">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Experience</p>
              <p className="font-medium">{experienceDisplay}</p>
            </div>
          </div>
        </div>
      </div>

      {responsibilities.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-blue-500 rounded-full"></span>
            Responsibilities
          </h2>
          <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600/30">
            <ul className="space-y-3">
              {responsibilities.map((item, index) => (
                <li
                  key={index}
                  className="text-gray-300 flex items-start gap-3"
                >
                  <span className="text-blue-400 mt-1 flex-shrink-0">▸</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {requirements.length > 0 && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
            <span className="w-1 h-6 bg-emerald-500 rounded-full"></span>
            Requirements
          </h2>
          <div className="bg-slate-800/30 rounded-lg p-4 border border-slate-600/30">
            <ul className="space-y-3">
              {requirements.map((item, index) => (
                <li
                  key={index}
                  className="text-gray-300 flex items-start gap-3"
                >
                  <span className="text-emerald-400 mt-1 flex-shrink-0">✓</span>
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="bg-gradient-to-r from-slate-800/40 to-slate-700/40 rounded-lg p-6 border border-slate-600/30">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-purple-500 rounded-full"></span>
          Company Overview
        </h2>
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0 shadow-lg">
            {job.recruiterId?.companyName?.charAt(0).toUpperCase() || "C"}
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-white mb-1">
              {job.recruiterId?.companyName || "Company"}
            </h3>
            {job.recruiterId?.companyType && (
              <p className="text-blue-400 text-sm font-medium mb-3">
                {job.recruiterId.companyType}
              </p>
            )}
            <p className="text-gray-300 leading-relaxed">
              At {job.recruiterId?.companyName || "our company"}, we specialize
              in building innovative software products that empower businesses
              to thrive in the digital age. Join our team as a {job.jobrole} and
              contribute to cutting-edge projects that make a real difference.
            </p>
          </div>
        </div>
      </div>

      {job.status && (
        <div className="mt-4 flex justify-end">
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              job.status === "Active"
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-gray-500/20 text-gray-400 border border-gray-500/30"
            }`}
          >
            {job.status}
          </span>
        </div>
      )}
    </div>
  );
};

export default SingleJobDetailsComponent;
