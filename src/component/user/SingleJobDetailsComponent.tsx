import React from "react";
import { MapPin, Clock, Briefcase, DollarSign, Calendar } from "lucide-react";
import { Job } from "../../models/recruiter";



interface SingleJobDetailsComponentProps {
  job: Job;
}

const SingleJobDetailsComponent: React.FC<SingleJobDetailsComponentProps> = ({
  job,
}) => {
  return (
    <div className="bg-slate-700/30 backdrop-blur-md rounded-lg border border-slate-600/50 p-6 mb-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-4">{job.jobrole}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-300">
            <Clock className="w-5 h-5 text-blue-400" />
            <span className="font-medium">Work Time:</span>
            <span className="capitalize">{job.workTime}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <Briefcase className="w-5 h-5 text-blue-400" />
            <span className="font-medium">Work Mode:</span>
            <span className="capitalize">{job.workMode}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <MapPin className="w-5 h-5 text-blue-400" />
            <span className="font-medium">Location:</span>
            <span>{job.jobLocation}</span>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <DollarSign className="w-5 h-5 text-blue-400" />
            <span className="font-medium">Salary:</span>
            <span>
              {job.minSalary} - {job.maxSalary} LPA
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-300">
            <Calendar className="w-5 h-5 text-blue-400" />
            <span className="font-medium">Experience:</span>
            <span>
              {job.minExperience} - {job.minExperience + 2} Years
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-3">
          Responsibilities
        </h2>
        <ul className="space-y-2">
          {job.responsibilities.map((item, index) => (
            <li key={index} className="text-gray-300 flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white mb-3">Requirements</h2>
        <ul className="space-y-2">
          {job.requirements.map((item, index) => (
            <li key={index} className="text-gray-300 flex items-start">
              <span className="text-blue-400 mr-2">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-white mb-3">
          Company Overview
        </h2>
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-800 font-bold text-xl">
            {job.recruiterId.companyName.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">
              {job.recruiterId.companyName}
            </h3>
            <p className="text-gray-400 text-sm">
              {job.recruiterId.companyType}
            </p>
            <p className="text-gray-300 mt-2">
              At {job.recruiterId.companyName}, we specialize in building
              innovative software products that empower businesses to thrive in
              the digital age. Join our team as a {job.jobrole} and contribute
              to cutting-edge projects that make a real difference.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleJobDetailsComponent;
