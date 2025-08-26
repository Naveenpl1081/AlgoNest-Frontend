// pages/recruiter/RecruiterProfilePage.tsx
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, Shield } from "lucide-react";
import RecruiterLayout from "../../../layouts/RecruiterLayouts";
import { recruiterAuthService } from "../../../service/RecruiterAuth";
import RecruiterDetails from "../../../component/recruiter/RecruiterDetails";
import RecruiterDetailsSkeleton from "../../../utils/shimmer/RecruiterDetailsSkeleton";
import UserLogout from "../../../component/user/UserLogout";

const RecruiterProfilePage: React.FC = () => {
  const [recruiterInfo, setRecruiterInfo] = useState({
    username: "",
    email: "",
    phone: undefined,
    companyName: "",
    companyType: "",
    yearEstablished: "",
    registrationCertificate: "",
    status: "pending" as "Active" | "InActive" | "pending" | "reject",
    createdAt: "",
    profileImage: "",
    location: "",
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchRecruiterProfile = async () => {
    try {
      const data = await recruiterAuthService.getRecruiterProfile();
      console.log("Recruiter data:", data);
      // Ensure we pass correct structure
      setRecruiterInfo(data.data);
    } catch (error: any) {
      console.log("Fetch error:", error);
      const errorMessage = error?.response?.data?.message;
      if (
        error?.response?.status === 403 &&
        errorMessage === "Invalid role to perform this action"
      ) {
        toast.error("Unauthorized access. Redirecting to login.");
        navigate("/recruiter/login");
      } else {
        toast.error("Failed to load profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecruiterProfile();
  }, []);

  return (
    <RecruiterLayout>
      <div className="min-h-screen bg-slate-900">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700">
         
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Details */}
            <div className="lg:col-span-2">
              {loading ? (
                <RecruiterDetailsSkeleton />
              ) : (
                <RecruiterDetails recruiterInfo={recruiterInfo} />
              )}
            </div>

            {/* Additional Info Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-slate-700">
                    <span className="text-gray-400">Profile Completion</span>
                    <span className="text-indigo-400 font-medium">
                      {loading ? "..." : 
                        Math.round(
                          ((recruiterInfo.username ? 1 : 0) +
                          (recruiterInfo.email ? 1 : 0) +
                          (recruiterInfo.phone ? 1 : 0) +
                          (recruiterInfo.companyName ? 1 : 0) +
                          (recruiterInfo.companyType ? 1 : 0) +
                          (recruiterInfo.yearEstablished ? 1 : 0) +
                          (recruiterInfo.registrationCertificate ? 1 : 0)) / 7 * 100
                        )
                      }%
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-slate-700">
                    <span className="text-gray-400">Account Status</span>
                    <span className={`font-medium ${
                      recruiterInfo.status === "Active" ? "text-green-400" :
                      recruiterInfo.status === "pending" ? "text-yellow-400" :
                      recruiterInfo.status === "reject" ? "text-red-400" :
                      "text-gray-400"
                    }`}>
                      {loading ? "..." : 
                        recruiterInfo.status === "Active" ? "Active" :
                        recruiterInfo.status === "pending" ? "Pending" :
                        recruiterInfo.status === "reject" ? "Rejected" :
                        "Inactive"
                      }
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400">Member Since</span>
                    <span className="text-purple-400 font-medium">
                      {loading ? "..." : new Date(recruiterInfo.createdAt).getFullYear()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Profile Tips */}
              <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-gray-200 mb-4">Profile Tips</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm">
                      Complete all sections to improve your profile visibility
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm">
                      Upload a professional profile image
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm">
                      Keep your registration certificate updated
                    </p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-300 text-sm">
                      Provide accurate company information
                    </p>
                  </div>
                </div>
              </div>

              {/* Account Security & Actions */}
              <div className="bg-slate-800/90 backdrop-blur-md border border-slate-700 rounded-2xl p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Shield className="w-5 h-5 text-orange-400" />
                  <h3 className="text-lg font-semibold text-gray-200">Account Security</h3>
                </div>
                
                <div className="space-y-4">
                  {/* Security Info */}
                  <div className="bg-slate-700/30 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <span className="text-sm font-medium text-gray-300">Account Secured</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Your account is protected with secure authentication
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    {/* Professional Logout Button */}
                    <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
                          <LogOut className="w-5 h-5 text-orange-400" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-200">Sign Out</h4>
                          <p className="text-xs text-gray-400">
                            Securely logout from your account
                          </p>
                        </div>
                      </div>
                      
                      {/* Using your existing UserLogout component */}
                      <UserLogout role="recruiter" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Support */}
              {recruiterInfo.status === "reject" && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-red-400 mb-3">Account Status</h3>
                  <p className="text-gray-300 text-sm mb-4">
                    Your account has been rejected. Please contact support for assistance.
                  </p>
                  <button className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">
                    Contact Support
                  </button>
                </div>
              )}

              {recruiterInfo.status === "pending" && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-6">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-3">Pending Approval</h3>
                  <p className="text-gray-300 text-sm">
                    Your account is currently under review. You'll be notified once approved.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </RecruiterLayout>
  );
};

export default RecruiterProfilePage;