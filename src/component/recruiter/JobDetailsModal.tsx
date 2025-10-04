import { Building, CheckCircle, Clock, DollarSign, MapPin, X } from "lucide-react";
import { Job } from "../../models/recruiter";

export const JobDetailsModal = ({ job, onClose }: { job: Job | null; onClose: () => void }) => {
    if (!job) return null;
  
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-slate-600/50 shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-lg p-2 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            <h2 className="text-3xl font-bold text-white mb-2">{job.jobrole}</h2>
            <div className="flex items-center gap-4 text-white/90">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                job.status === 'active' ? 'bg-green-500/30' : 'bg-red-500/30'
              }`}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </span>
            </div>
          </div>
  

          <div className="overflow-y-auto max-h-[calc(90vh-140px)] p-6">
   
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <h3 className="font-semibold text-white">Location</h3>
                </div>
                <p className="text-gray-300">{job.jobLocation}</p>
              </div>
  
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  <h3 className="font-semibold text-white">Work Time</h3>
                </div>
                <p className="text-gray-300">{job.workTime}</p>
              </div>
  
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                <div className="flex items-center gap-3 mb-2">
                  <Building className="w-5 h-5 text-green-400" />
                  <h3 className="font-semibold text-white">Work Mode</h3>
                </div>
                <p className="text-gray-300">{job.workMode}</p>
              </div>
  
              <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
                <div className="flex items-center gap-3 mb-2">
                  <DollarSign className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-semibold text-white">Salary Range</h3>
                </div>
                <p className="text-gray-300">
                  ${job.minSalary} - ${job.maxSalary}
                </p>
              </div>
            </div>
  
            {/* Experience */}
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50 mb-6">
              <h3 className="font-semibold text-white mb-2">Minimum Experience</h3>
              <p className="text-gray-300">{job.minExperience} years</p>
            </div>
  
            {/* Requirements */}
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50 mb-6">
              <h3 className="font-semibold text-white mb-4 text-lg">Requirements</h3>
              <ul className="space-y-2">
                {job.requirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{req}</span>
                  </li>
                ))}
              </ul>
            </div>
  
            {/* Responsibilities */}
            <div className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50">
              <h3 className="font-semibold text-white mb-4 text-lg">Responsibilities</h3>
              <ul className="space-y-2">
                {job.responsibilities.map((resp, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
  
          {/* Footer */}
          <div className="bg-slate-700/50 p-4 border-t border-slate-600/50">
            <button
              onClick={onClose}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold text-white hover:from-blue-500 hover:to-purple-500 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };