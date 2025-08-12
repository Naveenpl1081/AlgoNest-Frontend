// src/pages/user/ProfilePage.tsx

import React, { useEffect, useState } from "react";
import { userAuthService } from "../../../service/userAuth";
import UserDetails from "../../../component/user/UserDetails";
import { toast } from "react-toastify";
import UserLayout from "../../../layouts/UserLayout";
import UserDetailsSkeleton from "../../../utils/shimmer/UserDetailsSkeleton";
import {
  BarChart3,
  Trophy,
  Clock,
  Settings,
  LogOut,
} from "lucide-react";
import UserLogout from "../../../component/user/UserLogout";
import { useNavigate } from "react-router-dom";

const ProfilePage: React.FC = () => {
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    createdAt: "",
  });
  const navigate=useNavigate()

  const [loading, setLoading] = useState(true);
  const [hoveredDifficulty, setHoveredDifficulty] = useState<null | "easy" | "medium" | "hard">(null);

  const stats = {
    problemsSolved: 247,
    acceptanceRate: 87,
    currentStreak: 25,
    totalSubmissions: 284,
    totalProblems: 3641,
    attempting: 5,
    easy: { solved: 156, total: 888 },
    medium: { solved: 78, total: 1894 },
    hard: { solved: 13, total: 859 },
  };

  const recentActivity = [
    { id: 1, problem: 'Binary Tree Maximum Path Sum', difficulty: 'Hard', status: 'Solved', date: '2 hours ago', runtime: '16ms' },
    { id: 2, problem: 'Sliding Window Maximum', difficulty: 'Hard', status: 'Solved', date: '5 hours ago', runtime: '24ms' },
    { id: 3, problem: 'Design Twitter', difficulty: 'Medium', status: 'Solved', date: '1 day ago', runtime: '45ms' },
    { id: 4, problem: 'Valid Parentheses', difficulty: 'Easy', status: 'Solved', date: '2 days ago', runtime: '8ms' }
  ];
  
  const fetchUserProfile = async () => {
    try {
      const data = await userAuthService.getUserProfile();
      console.log("dum dat", data);
      setUserInfo(data.data);
    } catch (error: any) {
      console.log("Fetch error:", error);
      const errorMessage = error?.response?.data?.message;
  
      if (error?.response?.status === 403 && errorMessage === "Invalid role to perform this action") {
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

  const circleProgress = {
    easy: {
      strokeDasharray: `${(stats.easy.solved / stats.easy.total) * 283} 283`,
      strokeDashoffset: 0,
    },
    medium: {
      strokeDasharray: `${(stats.medium.solved / stats.medium.total) * 283} 283`,
      strokeDashoffset: 0,
    },
    hard: {
      strokeDasharray: `${(stats.hard.solved / stats.hard.total) * 283} 283`,
      strokeDashoffset: 0,
    },
  };

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
        {/* Left Side */}
        <div className="xl:col-span-1 space-y-6">
          {loading ? (
           <UserDetailsSkeleton />
          ) : (
            <UserDetails userInfo={userInfo} />
          )}
          <UserLogout role="user" />
        </div>

        {/* Right Side */}
        <div className="xl:col-span-3 space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 shadow-2xl hover:border-cyan-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Problems Solved</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats.problemsSolved}</p>
                  <p className="text-emerald-400 text-xs font-medium">+12 this week</p>
                </div>
                <BarChart3 className="w-10 h-10 text-cyan-400" />
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 shadow-2xl hover:border-emerald-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Acceptance Rate</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats.acceptanceRate}%</p>
                  <p className="text-emerald-400 text-xs font-medium">Excellent</p>
                </div>
                <Trophy className="w-10 h-10 text-emerald-400" />
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 shadow-2xl hover:border-purple-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Current Streak</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats.currentStreak}</p>
                  <p className="text-amber-400 text-xs font-medium">🔥 On fire!</p>
                </div>
                <Clock className="w-10 h-10 text-purple-400" />
              </div>
            </div>

            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 shadow-2xl hover:border-amber-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Submissions</p>
                  <p className="text-3xl font-bold text-white mt-1">{stats.totalSubmissions}</p>
                  <p className="text-cyan-400 text-xs font-medium">High quality</p>
                </div>
                <Settings className="w-10 h-10 text-amber-400" />
              </div>
            </div>
          </div>

          {/* Circular Progress */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-semibold text-white mb-8 flex items-center space-x-2">
              <BarChart3 className="w-6 h-6 text-cyan-400" />
              <span>Problem Solving Progress</span>
            </h3>
            <div className="flex flex-col lg:flex-row items-center justify-between space-y-8 lg:space-y-0">
              <div className="relative w-80 h-80">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgb(51 65 85 / 0.3)" strokeWidth="6" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgb(16 185 129)" strokeWidth="6"
                    strokeDasharray={circleProgress.easy.strokeDasharray}
                    className="transition-all duration-1000 ease-in-out"
                    strokeLinecap="round" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgb(245 158 11)" strokeWidth="6"
                    strokeDasharray={circleProgress.medium.strokeDasharray}
                    className="transition-all duration-1000 ease-in-out"
                    strokeLinecap="round" />
                  <circle cx="50" cy="50" r="45" fill="none" stroke="rgb(244 63 94)" strokeWidth="6"
                    strokeDasharray={circleProgress.hard.strokeDasharray}
                    className="transition-all duration-1000 ease-in-out"
                    strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-5xl font-bold text-white mb-1">
                    {hoveredDifficulty === null ? stats.problemsSolved :
                      hoveredDifficulty === 'easy' ? stats.easy.solved :
                        hoveredDifficulty === 'medium' ? stats.medium.solved :
                          stats.hard.solved}
                  </div>
                  <div className="text-lg text-gray-400 mb-2">
                    /{hoveredDifficulty === null ? stats.totalProblems :
                      hoveredDifficulty === 'easy' ? stats.easy.total :
                        hoveredDifficulty === 'medium' ? stats.medium.total :
                          stats.hard.total}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-slate-800/60 border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
            <h3 className="text-2xl font-semibold text-white mb-8 flex items-center space-x-2">
              <Clock className="w-6 h-6 text-cyan-400" />
              <span>Recent Activity</span>
            </h3>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-6 bg-slate-700/30 hover:bg-slate-700/50 rounded-2xl transition-all hover:shadow-lg border border-slate-600/20">
                  <div className="flex items-center space-x-4">
                    <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
                    <div>
                      <p className="text-white font-semibold text-lg">{activity.problem}</p>
                      <div className="flex items-center space-x-3 mt-1">
                        <p className="text-gray-400 text-sm">{activity.date}</p>
                        <span className="text-gray-400">•</span>
                        <p className="text-emerald-400 text-sm font-medium">Runtime: {activity.runtime}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={`text-sm font-semibold px-4 py-2 rounded-full ${getDifficultyColor(activity.difficulty)}`}>
                      {activity.difficulty}
                    </span>
                    <span className="text-sm font-semibold px-4 py-2 rounded-full text-emerald-400 bg-emerald-400/10">
                      {activity.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default ProfilePage;
