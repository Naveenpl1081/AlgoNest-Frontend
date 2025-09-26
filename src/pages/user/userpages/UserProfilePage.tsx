// src/pages/user/ProfilePage.tsx

import React, { useEffect, useState } from "react";
import { userAuthService } from "../../../service/userAuth";
import UserDetails from "../../../component/user/UserDetails";
import { toast } from "react-toastify";
import UserLayout from "../../../layouts/UserLayout";
import UserDetailsSkeleton from "../../../utils/shimmer/UserDetailsSkeleton";
import { BarChart3, Trophy, Clock, Settings } from "lucide-react";
import UserLogout from "../../../component/user/UserLogout";
import { useNavigate } from "react-router-dom";
import UserStats from "../../../component/user/UserStats";
import { IUserStats } from "../../../models/user";


const ProfilePage: React.FC = () => {
  const [userStats, setUserStats] = useState<IUserStats | null>(null);
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    createdAt: "",
  });
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

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
  
      // Fetch user stats here
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
