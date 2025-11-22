import React, { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { AdminLayout } from "../../../layouts/AdminLayouts";
import { adminAuthService } from "../../../service/adminAuth";
import { IRecruiter } from "../../../models/recruiter";
import { ConfirmModal } from "../../../component/common/ConfirmModal";
import {
  FileText,
  User,
  Mail,
  Phone,
  Building2,
  Calendar,
  X,
  ArrowLeft,
  Eye,
  Factory,
  Loader2,
} from "lucide-react";
import { Buildimage } from "../../../utils/cloudinary/cloudinary";

export const ApplicantDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();

  const [applicant, setApplicant] = useState<IRecruiter | null>(
    location.state?.applicant || null
  );

  
  const user=location.state?.user || null
  console.log("applicanttttt",user)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [rejectReasonModalOpen, setRejectReasonModalOpen] = useState(false);
  const [actionType, setActionType] = useState<"accept" | "reject" | null>(null);
  const [imagePreviewOpen, setImagePreviewOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const openConfirmModal = (type: "accept" | "reject") => {
    setActionType(type);
    if (type === "reject") {
      setRejectReasonModalOpen(true);
    } else {
      setConfirmModalOpen(true);
    }
  };

  const handleRejectReasonSubmit = () => {
    if (rejectReason.trim() === "") return;
    setRejectReasonModalOpen(false);
    setConfirmModalOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!applicant || !actionType) return;

    setIsLoading(true);
    try {
      const res =
        actionType === "accept"
          ? await adminAuthService.acceptApplicant(applicant.id)
          : await adminAuthService.rejectApplicant(applicant.id, rejectReason);

      if (res.success) {
        navigate("/admin/applicants");
      }
    } catch (error) {
      console.error("Failed to update applicant:", error);
    } finally {
      setIsLoading(false);
      setConfirmModalOpen(false);
      setRejectReasonModalOpen(false);
      setActionType(null);
      setRejectReason("");
    }
  };

  const handleCancel = () => {
    setConfirmModalOpen(false);
    setRejectReasonModalOpen(false);
    setActionType(null);
    setRejectReason("");
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "InActive":
        return "bg-red-50 text-red-700 border-red-200";
      default:
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
  };

  if (!applicant) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(`/admin/${user}`)}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Applicants</span>
          </button>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 bg-cyan-400 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-400">Applicant Details</span>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Certificate */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span>Registration Certificate</span>
              </h3>
              <div className="relative group">
                <div className="aspect-square rounded-xl overflow-hidden shadow-lg border border-slate-600/50">
                  {applicant.registrationCertificate ? (
                    <img
                      src={Buildimage(applicant.registrationCertificate)}
                      alt="Registration Certificate"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="bg-slate-700 flex items-center justify-center h-full">
                      <FileText className="w-12 h-12 text-slate-400" />
                    </div>
                  )}
                </div>
                {applicant.registrationCertificate && (
                  <button
                    onClick={() => setImagePreviewOpen(true)}
                    className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition rounded-xl flex items-center justify-center"
                  >
                    <Eye className="w-8 h-8 text-white" />
                  </button>
                )}
              </div>
            </div>

            {/* Status */}
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-white mb-4">
                Application Status
              </h3>
              <div className="flex items-center justify-center">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusStyles(
                    applicant.status
                  )}`}
                >
                  {applicant.status}
                </span>
              </div>
              <div className="mt-4 pt-4 border-t border-slate-700/50 text-sm text-gray-400 flex items-center justify-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>
                  Applied on{" "}
                  {new Date(applicant.createdAt).toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2">
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-8 pb-4 border-b border-slate-700/50">
                Applicant Information
              </h2>

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-6">
                  <InfoCard label="Username" value={applicant.username} icon={<User className="w-5 h-5 text-cyan-400" />} />
                  <InfoCard label="Email Address" value={applicant.email} icon={<Mail className="w-5 h-5 text-cyan-400" />} />
                  <InfoCard label="Company Type" value={applicant.companyType || "N/A"} icon={<Factory className="w-5 h-5 text-cyan-400" />} />
                </div>
                <div className="space-y-6">
                  <InfoCard label="Company Name" value={applicant.companyName || "N/A"} icon={<Building2 className="w-5 h-5 text-cyan-400" />} />
                  <InfoCard label="Phone Number" value={applicant.phone?.toString() ||"N/A"} icon={<Phone className="w-5 h-5 text-cyan-400" />} />
                  <InfoCard label="Year Established" value={applicant.yearEstablished || "N/A"} icon={<Calendar className="w-5 h-5 text-cyan-400" />} />
                </div>
              </div>

           
              {applicant.status.toLowerCase() === "pending" && (
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-700/50">
                  <button
                    onClick={() => openConfirmModal("accept")}
                    className="flex-1 px-6 py-3 bg-linear-to-r from-emerald-500 to-green-600 text-white rounded-xl hover:from-emerald-600 hover:to-green-700"
                  >
                    Accept Applicant
                  </button>
                  <button
                    onClick={() => openConfirmModal("reject")}
                    className="flex-1 px-6 py-3 bg-linear-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700"
                  >
                    Reject Applicant
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Reject Reason Modal */}
        {rejectReasonModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
            <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-3">Reject Applicant</h2>
              <p className="text-slate-300 mb-4">Please provide a reason for rejection:</p>
              
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Enter rejection reason..."
                className="w-full p-3 rounded-lg bg-slate-700 text-white border border-slate-600 focus:outline-none focus:ring-2 focus:ring-red-500 mb-6"
                rows={4}
              />
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectReasonSubmit}
                  disabled={rejectReason.trim() === ""}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Modal */}
        <ConfirmModal
          isOpen={confirmModalOpen}
          title={actionType === "accept" ? "Accept Applicant" : "Reject Applicant"}
          message={
            actionType === "accept"
              ? "Are you sure you want to accept this applicant?"
              : `Are you sure you want to reject this applicant?\n\nReason: ${rejectReason}`
          }
          confirmText={
            isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Processing...
              </span>
            ) : actionType === "accept" ? (
              "Accept"
            ) : (
              "Reject"
            )
          }
          cancelText="Cancel"
          onConfirm={handleConfirmAction}
          onCancel={handleCancel}
          disableConfirm={isLoading}
        />

        {/* Image Preview */}
        {imagePreviewOpen && applicant.registrationCertificate && (
          <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4">
            <div className="relative max-w-6xl w-full max-h-[95vh]">
              <button
                className="absolute -top-12 right-0 bg-white/10 text-white rounded-full p-3 hover:bg-white/20"
                onClick={() => setImagePreviewOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
              <div className="bg-white rounded-2xl overflow-hidden">
                <img
                  src={Buildimage(applicant.registrationCertificate)}
                  alt="Certificate Full View"
                  className="w-full h-auto max-h-[90vh] object-contain"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

const InfoCard: React.FC<{ label: string; value: string; icon: React.ReactNode }> = ({
  label,
  value,
  icon,
}) => (
  <div className="flex items-start space-x-4 p-4 rounded-xl bg-slate-700/30">
    <div className="p-2 rounded-lg bg-cyan-500/20">{icon}</div>
    <div>
      <label className="text-sm font-medium text-gray-400">{label}</label>
      <p className="text-white font-medium mt-1">{value}</p>
    </div>
  </div>
);
