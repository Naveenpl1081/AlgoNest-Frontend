// src/pages/user/ProfilePage.tsx

import React, { useEffect, useState } from "react";
import { userAuthService } from "../../../service/userAuth";
import UserDetails from "../../../component/user/UserDetails";
import { toast } from "react-toastify";
import UserLayout from "../../../layouts/UserLayout";
import UserDetailsSkeleton from "../../../utils/shimmer/UserDetailsSkeleton";
import { BarChart3, Trophy, Clock, Settings, Sparkles, Crown } from "lucide-react";
import UserLogout from "../../../component/user/UserLogout";
import { useNavigate, useLocation } from "react-router-dom";
import UserStats from "../../../component/user/UserStats";
import { IUserStats } from "../../../models/user";


const ProfilePage: React.FC = () => {
  const [userStats, setUserStats] = useState<IUserStats | null>(null);
  const [userInfo, setUserInfo] = useState({
    _id:"",
    username: "",
    email: "",
    createdAt: "",
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Check if coming from subscription success page
  useEffect(() => {
    if (location.state?.showSubscriptionSuccess) {
      setShowSuccessPopup(true);
      // Clear the state to prevent showing popup on refresh
      window.history.replaceState({}, document.title);
      
      // Auto-hide popup after 5 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 5000);
    }
  }, [location]);

  const recentActivity = [
    {
      id: 1,
      problem: "Binary Tree Maximum Path Sum",
      difficulty: "Hard",
      status: "Solved",
      date: "2 hours ago",
      runtime: "16ms",
    },
    {
      id: 2,
      problem: "Sliding Window Maximum",
      difficulty: "Hard",
      status: "Solved",
      date: "5 hours ago",
      runtime: "24ms",
    },
    {
      id: 3,
      problem: "Design Twitter",
      difficulty: "Medium",
      status: "Solved",
      date: "1 day ago",
      runtime: "45ms",
    },
    {
      id: 4,
      problem: "Valid Parentheses",
      difficulty: "Easy",
      status: "Solved",
      date: "2 days ago",
      runtime: "8ms",
    },
  ];

  const fetchUserProfile = async () => {
    try {
      const profileData = await userAuthService.getUserProfile();
      setUserInfo(profileData.data);
  
      console.log("userInfo",profileData.data)
      const statsData = await userAuthService.getUserStats();
      console.log("statedata",statsData)
      setUserStats(statsData.data);
  
    } catch (error: unknown) {
      console.log("Fetch error:", error);
  
      const axiosError = error as {
        response?: { status?: number; data?: { message?: string } };
      };
      const errorMessage = axiosError.response?.data?.message;
  
      if (
        axiosError?.response?.status === 403 &&
        errorMessage === "Invalid role to perform this action"
      ) {
        toast.error("Unauthorized access. Redirecting to login.");
        navigate("/user/login");
      } else {
        toast.error("Failed to load profile. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);


  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-400 bg-green-400/10";
      case "Medium":
        return "text-yellow-400 bg-yellow-400/10";
      case "Hard":
        return "text-red-400 bg-red-400/10";
      default:
        return "text-gray-300 bg-gray-500/10";
    }
  };

  return (
    <UserLayout>
      {/* Success Popup Modal */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="relative bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border-2 border-blue-500/30 rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 animate-in zoom-in duration-500">
            {/* Close button */}
            <button
              onClick={() => setShowSuccessPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-3xl pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl animate-pulse delay-75"></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Icon with animation */}
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/50">
                    <Crown className="w-12 h-12 text-white animate-bounce" />
                  </div>
                  <div className="absolute inset-0 w-24 h-24 border-4 border-blue-400/30 rounded-full animate-ping"></div>
                  <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-400 animate-pulse" />
                </div>
              </div>

              {/* Success message */}
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Welcome to Premium! 🎉
                </h2>
                <p className="text-gray-300 text-lg leading-relaxed">
                  Your subscription has been successfully activated. Enjoy all premium features!
                </p>
              </div>

              {/* Premium features list */}
              <div className="bg-slate-900/50 rounded-2xl p-6 mb-6 border border-slate-700/50">
                <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  <span>Premium Benefits Unlocked:</span>
                </h3>
                <ul className="space-y-3">
                  {[
                    "Unlimited problem submissions",
                    "Advanced code analysis",
                    "Priority support access",
                    "Exclusive premium challenges"
                  ].map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-3 text-gray-300 animate-in slide-in-from-left duration-500" style={{ animationDelay: `${index * 100}ms` }}>
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action button */}
              <button
                onClick={() => setShowSuccessPopup(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/30"
              >
                Start Exploring
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing profile content */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-10 px-6 py-10 max-w-7xl mx-auto">
        <div className="xl:col-span-1 space-y-6">
          {loading ? (
            <UserDetailsSkeleton />
          ) : (
            <UserDetails userInfo={userInfo} />
          )}
          <UserLogout role="user" />
        </div>

        <div className="xl:col-span-3 space-y-8 -mt-6 ">
          <UserStats stats={userStats} loading={loading}/>
          {/* Recent Activity */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-semibold text-white mb-8 flex items-center space-x-2">
              <Clock className="w-6 h-6 text-cyan-400" />
              <span>Recent Activity</span>
            </h3>
            <div className="space-y-4">
              {userStats?.recentSubmissions?.length ? (
                userStats.recentSubmissions.map((submission: any, index: number) => (
                  <div
                    key={submission.problemId || index}
                    className="flex items-center justify-between p-6 bg-slate-700/30 hover:bg-slate-700/50 rounded-2xl transition-all hover:shadow-lg border border-slate-600/20"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                      <div>
                        <p className="text-white font-semibold text-lg">
                          {submission.problemTitle}
                        </p>
                        <div className="flex items-center space-x-3 mt-1">
                          <p className="text-gray-400 text-sm">
                            {new Date(submission.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span
                        className={`text-sm font-semibold px-4 py-2 rounded-full ${getDifficultyColor(
                          submission.difficulty
                        )}`}
                      >
                        {submission.difficulty}
                      </span>
                      <span
                        className={`text-sm font-semibold px-4 py-2 rounded-full ${
                          submission.overallStatus === "passed"
                            ? "text-emerald-400 bg-emerald-400/10"
                            : "text-red-400 bg-red-400/10"
                        }`}
                      >
                        {submission.overallStatus === "passed" ? "Solved" : "Failed"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-center">No recent activity</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default ProfilePage;