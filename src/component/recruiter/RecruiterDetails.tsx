import React, { JSX, useState } from "react";
import {
  Mail,
  Building,
  Calendar,
  Phone,
  FileBadge,
  CheckCircle2,
  XCircle,
  Timer,
  Ban,
  User,
  MapPin,
  Eye,
  X,
  Download,
  Building2,
  CalendarDays,
} from "lucide-react";
import { Buildimage } from "../../utils/cloudinary/cloudinary";


interface RecruiterDetailsProps {
  recruiterInfo: {
    username: string;
    email: string;
    phone?: number;
    companyName?: string;
    companyType?: string;
    yearEstablished?: string;
    registrationCertificate?: string;
    status: "Active" | "InActive" | "pending" | "reject";
    createdAt: string;
    profileImage?: string;
    location?: string;
  };
}

const RecruiterDetails: React.FC<RecruiterDetailsProps> = ({
  recruiterInfo,
}) => {
  const [showCertificate, setShowCertificate] = useState(false);

  // Status configuration
  const statusConfig: Record<
    string,
    { color: string; bgColor: string; label: string; icon: JSX.Element }
  > = {
    Active: {
      color: "text-green-400",
      bgColor: "bg-green-500/10 border-green-500/20",
      label: "Active",
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    InActive: {
      color: "text-gray-400",
      bgColor: "bg-gray-500/10 border-gray-500/20",
      label: "Inactive",
      icon: <Ban className="w-4 h-4" />,
    },
    pending: {
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10 border-yellow-500/20",
      label: "Pending Approval",
      icon: <Timer className="w-4 h-4" />,
    },
    reject: {
      color: "text-red-400",
      bgColor: "bg-red-500/10 border-red-500/20",
      label: "Rejected",
      icon: <XCircle className="w-4 h-4" />,
    },
  };

  const currentStatus = statusConfig[recruiterInfo.status];

  return (
    <>
      <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700 rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section with Profile */}
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 p-6 border-b border-slate-700">
          <div className="flex flex-col items-center text-center">
            {/* Profile Image */}
            <div className="relative mb-4">
              {recruiterInfo.profileImage ? (
                <img
                  src={Buildimage(recruiterInfo.profileImage)}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-slate-600 shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                  {recruiterInfo.username.charAt(0).toUpperCase()}
                </div>
              )}
            </div>

            {/* Name and Status */}
            <h2 className="text-2xl font-bold text-white mb-3">
              {recruiterInfo.username}
            </h2>
            
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${currentStatus.bgColor}`}>
              {currentStatus.icon}
              <span className={`text-sm font-medium ${currentStatus.color}`}>
                {currentStatus.label}
              </span>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="p-6 space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-400" />
              Personal Information
            </h3>
            
            <div className="grid gap-3">
              <div className="flex items-center gap-3 p-3 bg-slate-700/40 rounded-lg">
                <Mail className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Email</p>
                  <p className="text-gray-200 font-medium">{recruiterInfo.email}</p>
                </div>
              </div>

              {recruiterInfo.phone && (
                <div className="flex items-center gap-3 p-3 bg-slate-700/40 rounded-lg">
                  <Phone className="w-5 h-5 text-purple-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="text-gray-200 font-medium">{recruiterInfo.phone}</p>
                  </div>
                </div>
              )}

              {recruiterInfo.location && (
                <div className="flex items-center gap-3 p-3 bg-slate-700/40 rounded-lg">
                  <MapPin className="w-5 h-5 text-green-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="text-gray-200 font-medium">{recruiterInfo.location}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Company Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-400" />
              Company Information
            </h3>
            
            <div className="grid gap-3">
              <div className="flex items-center gap-3 p-3 bg-slate-700/40 rounded-lg">
                <Building2 className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <div>
                  <p className="text-sm text-gray-400">Company Name</p>
                  <p className="text-gray-200 font-medium">
                    {recruiterInfo.companyName || "Not specified"}
                  </p>
                </div>
              </div>

              {recruiterInfo.companyType && (
                <div className="flex items-center gap-3 p-3 bg-slate-700/40 rounded-lg">
                  <Building className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-400">Company Type</p>
                    <p className="text-gray-200 font-medium">{recruiterInfo.companyType}</p>
                  </div>
                </div>
              )}

              {recruiterInfo.yearEstablished && (
                <div className="flex items-center gap-3 p-3 bg-slate-700/40 rounded-lg">
                  <CalendarDays className="w-5 h-5 text-orange-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-400">Year Established</p>
                    <p className="text-gray-200 font-medium">{recruiterInfo.yearEstablished}</p>
                  </div>
                </div>
              )}

              {/* Registration Certificate */}
              {recruiterInfo.registrationCertificate && (
                <div className="p-3 bg-slate-700/40 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileBadge className="w-5 h-5 text-teal-400" />
                      <div>
                        <p className="text-sm text-gray-400">Registration Certificate</p>
                        <p className="text-gray-200 font-medium">Company Certificate</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setShowCertificate(true)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/20 rounded-lg text-indigo-400 text-sm font-medium transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                      View
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-200 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-yellow-400" />
              Account Information
            </h3>
            
            <div className="p-3 bg-slate-700/40 rounded-lg">
              <p className="text-sm text-gray-400 mb-1">Member Since</p>
              <p className="text-gray-200 font-medium">
                {new Date(recruiterInfo.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {showCertificate && recruiterInfo.registrationCertificate && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-slate-700">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-700">
              <h3 className="text-xl font-semibold text-white">Registration Certificate</h3>
              <button
                onClick={() => setShowCertificate(false)}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            {/* Certificate Content */}
            <div className="p-4">
              <div className="bg-white rounded-lg overflow-hidden">
                <img
                  src={Buildimage(recruiterInfo.registrationCertificate)}
                  alt="Registration Certificate"
                  className="w-full h-auto max-h-[70vh] object-contain"
                />
              </div>
              
              {/* Modal Actions */}
              <div className="flex justify-center gap-3 mt-4">
                <a
                  href={Buildimage(recruiterInfo.registrationCertificate)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download Certificate
                </a>
              </div>
            </div>
          </div>
         
        </div>
      )}
    </>
  );
};

export default RecruiterDetails;