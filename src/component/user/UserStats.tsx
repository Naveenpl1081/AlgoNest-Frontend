import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Trophy,
  Clock,
  Settings,
  TrendingUp,
  Target,
  Zap,
  Award,
} from "lucide-react";
import { IUserStats } from "../../models/user";
import UserStatsSkeletonLoader from "../../utils/shimmer/UserStatsSkeletonLoader";

interface UserStatsProps {
  stats: IUserStats | null;
  loading: boolean;
}

const UserStats: React.FC<UserStatsProps> = ({ stats, loading }) => {
  const [animationComplete, setAnimationComplete] = useState(false);
  const [hoveredDifficulty, setHoveredDifficulty] = useState<
    null | "easy" | "medium" | "hard"
  >(null);

  useEffect(() => {
    if (!loading && stats) {
      setTimeout(() => setAnimationComplete(true), 500);
    }
  }, [loading, stats]);

  if (loading || !stats) {
    return <UserStatsSkeletonLoader />;
  }

  const easyPercentage =
    stats.easy.total > 0 ? (stats.easy.solved / stats.easy.total) * 100 : 0;
  const mediumPercentage =
    stats.medium.total > 0
      ? (stats.medium.solved / stats.medium.total) * 100
      : 0;
  const hardPercentage =
    stats.hard.total > 0 ? (stats.hard.solved / stats.hard.total) * 100 : 0;
  const overallPercentage =
    ((stats.easy.solved + stats.medium.solved + stats.hard.solved) /
      (stats.easy.total + stats.medium.total + stats.hard.total)) *
    100;

  const circumference = 2 * Math.PI * 40;
  const totalProblemsForDisplay =
    stats.easy.total + stats.medium.total + stats.hard.total;

  const getDisplayData = () => {
    if (hoveredDifficulty === "easy") {
      return {
        solved: stats.easy.solved,
        total: stats.easy.total,
        label: "Easy Problems",
        color: "text-emerald-400",
        bgColor: "from-emerald-500/20",
      };
    } else if (hoveredDifficulty === "medium") {
      return {
        solved: stats.medium.solved,
        total: stats.medium.total,
        label: "Medium Problems",
        color: "text-amber-400",
        bgColor: "from-amber-500/20",
      };
    } else if (hoveredDifficulty === "hard") {
      return {
        solved: stats.hard.solved,
        total: stats.hard.total,
        label: "Hard Problems",
        color: "text-rose-400",
        bgColor: "from-rose-500/20",
      };
    }
    return {
      solved: stats.problemsSolved,
      total: totalProblemsForDisplay,
      label: "Total Solved",
      color: "text-cyan-400",
      bgColor: "from-cyan-500/20",
    };
  };

  const displayData = getDisplayData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          <div className="group relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 hover:border-cyan-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-cyan-500/20 to-cyan-600/20 rounded-2xl">
                  <BarChart3 className="w-6 h-6 text-cyan-400" />
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    Problems
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white">
                  {stats.problemsSolved}
                </div>
                <div className="text-sm text-gray-400">Solved Successfully</div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 text-sm font-medium">
                    +12 this week
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 hover:border-emerald-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-emerald-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 rounded-2xl">
                  <Target className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    Accuracy
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white">
                  {stats.acceptanceRate}%
                </div>
                <div className="text-sm text-gray-400">Success Rate</div>
                <div className="flex items-center space-x-2">
                  <Award className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 text-sm font-medium">
                    Excellent
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 hover:border-amber-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-amber-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-amber-500/20 to-amber-600/20 rounded-2xl">
                  <Zap className="w-6 h-6 text-amber-400" />
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    Streak
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white">
                  {stats.currentStreak}
                </div>
                <div className="text-sm text-gray-400">Days Active</div>
                <div className="flex items-center space-x-2">
                  <span className="text-amber-400 text-lg">🔥</span>
                  <span className="text-amber-400 text-sm font-medium">
                    Keep it up!
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6 hover:border-purple-500/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/10">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-2xl">
                  <Settings className="w-6 h-6 text-purple-400" />
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 uppercase tracking-wider font-semibold">
                    Activity
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-white">
                  {stats.totalSubmissions}
                </div>
                <div className="text-sm text-gray-400">Total Attempts</div>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400 text-sm font-medium">
                    High Activity
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-600/5 to-transparent"></div>
          <div className="relative">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  Problem Solving Progress
                </h3>
                <p className="text-gray-400">
                  Your journey across difficulty levels
                </p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                  {overallPercentage.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-400">Overall Progress</div>
              </div>
            </div>

            <div className="flex flex-col xl:flex-row items-center justify-between space-y-8 xl:space-y-0 xl:space-x-12">
              <div className="relative">
                <div className="relative w-80 h-80">
                  <svg
                    className="w-full h-full transform -rotate-90"
                    viewBox="0 0 100 100"
                  >
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="rgb(51 65 85 / 0.2)"
                      strokeWidth="6"
                    />

                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#easyGradient)"
                      strokeWidth="6"
                      strokeDasharray={circumference}
                      strokeDashoffset={
                        circumference -
                        (easyPercentage / 100) * (circumference * 0.33)
                      }
                      className={`transition-all duration-1000 ease-out ${
                        animationComplete ? "opacity-100" : "opacity-0"
                      }`}
                      strokeLinecap="round"
                      onMouseEnter={() => setHoveredDifficulty("easy")}
                      onMouseLeave={() => setHoveredDifficulty(null)}
                      style={{ cursor: "pointer" }}
                    />

                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#mediumGradient)"
                      strokeWidth="6"
                      strokeDasharray={circumference}
                      strokeDashoffset={
                        circumference -
                        (mediumPercentage / 100) * (circumference * 0.33)
                      }
                      className={`transition-all duration-1000 ease-out delay-300 ${
                        animationComplete ? "opacity-100" : "opacity-0"
                      }`}
                      strokeLinecap="round"
                      transform="rotate(120 50 50)"
                      onMouseEnter={() => setHoveredDifficulty("medium")}
                      onMouseLeave={() => setHoveredDifficulty(null)}
                      style={{ cursor: "pointer" }}
                    />

                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="url(#hardGradient)"
                      strokeWidth="6"
                      strokeDasharray={circumference}
                      strokeDashoffset={
                        circumference -
                        (hardPercentage / 100) * (circumference * 0.33)
                      }
                      className={`transition-all duration-1000 ease-out delay-500 ${
                        animationComplete ? "opacity-100" : "opacity-0"
                      }`}
                      strokeLinecap="round"
                      transform="rotate(240 50 50)"
                      onMouseEnter={() => setHoveredDifficulty("hard")}
                      onMouseLeave={() => setHoveredDifficulty(null)}
                      style={{ cursor: "pointer" }}
                    />

                    <defs>
                      <linearGradient
                        id="easyGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#34d399" />
                      </linearGradient>
                      <linearGradient
                        id="mediumGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#fbbf24" />
                      </linearGradient>
                      <linearGradient
                        id="hardGradient"
                        x1="0%"
                        y1="0%"
                        x2="100%"
                        y2="0%"
                      >
                        <stop offset="0%" stopColor="#ef4444" />
                        <stop offset="100%" stopColor="#f87171" />
                      </linearGradient>
                    </defs>
                  </svg>

                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div
                      className={`text-6xl font-bold text-white mb-2 transition-all duration-500 ${displayData.color}`}
                    >
                      {displayData.solved}
                    </div>
                    <div className="text-xl text-gray-400 mb-1">
                      / {displayData.total}
                    </div>
                    <div className="text-sm text-gray-500 text-center px-4">
                      {displayData.label}
                    </div>
                    {stats.attempting > 0 && (
                      <div className="text-xs text-amber-400 mt-3 px-3 py-1 bg-amber-500/10 rounded-full border border-amber-500/20">
                        {stats.attempting} in progress
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-4 min-w-0 flex-1">
                <div
                  className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 cursor-pointer border ${
                    hoveredDifficulty === "easy"
                      ? "bg-gradient-to-r from-emerald-500/10 to-emerald-600/5 border-emerald-500/50 shadow-lg shadow-emerald-500/20"
                      : "bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50"
                  }`}
                  onMouseEnter={() => setHoveredDifficulty("easy")}
                  onMouseLeave={() => setHoveredDifficulty(null)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 shadow-lg shadow-emerald-500/50"></div>
                      <div>
                        <div className="text-white font-semibold text-lg">
                          Easy
                        </div>
                        <div className="text-gray-400 text-sm">
                          Foundational problems
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white mb-1">
                        {stats.easy.solved}/{stats.easy.total}
                      </div>
                      <div className="text-emerald-400 text-sm font-medium">
                        {easyPercentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 bg-slate-800/50 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-1000 ease-out"
                      style={{ width: `${easyPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div
                  className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 cursor-pointer border ${
                    hoveredDifficulty === "medium"
                      ? "bg-gradient-to-r from-amber-500/10 to-amber-600/5 border-amber-500/50 shadow-lg shadow-amber-500/20"
                      : "bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50"
                  }`}
                  onMouseEnter={() => setHoveredDifficulty("medium")}
                  onMouseLeave={() => setHoveredDifficulty(null)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 shadow-lg shadow-amber-500/50"></div>
                      <div>
                        <div className="text-white font-semibold text-lg">
                          Medium
                        </div>
                        <div className="text-gray-400 text-sm">
                          Intermediate challenges
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white mb-1">
                        {stats.medium.solved}/{stats.medium.total}
                      </div>
                      <div className="text-amber-400 text-sm font-medium">
                        {mediumPercentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 bg-slate-800/50 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-1000 ease-out delay-200"
                      style={{ width: `${mediumPercentage}%` }}
                    ></div>
                  </div>
                </div>

                <div
                  className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300 cursor-pointer border ${
                    hoveredDifficulty === "hard"
                      ? "bg-gradient-to-r from-rose-500/10 to-rose-600/5 border-rose-500/50 shadow-lg shadow-rose-500/20"
                      : "bg-slate-700/30 border-slate-600/30 hover:bg-slate-700/50"
                  }`}
                  onMouseEnter={() => setHoveredDifficulty("hard")}
                  onMouseLeave={() => setHoveredDifficulty(null)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-rose-400 to-rose-500 shadow-lg shadow-rose-500/50"></div>
                      <div>
                        <div className="text-white font-semibold text-lg">
                          Hard
                        </div>
                        <div className="text-gray-400 text-sm">
                          Advanced algorithms
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white mb-1">
                        {stats.hard.solved}/{stats.hard.total}
                      </div>
                      <div className="text-rose-400 text-sm font-medium">
                        {hardPercentage.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 bg-slate-800/50 rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-rose-400 to-rose-500 transition-all duration-1000 ease-out delay-400"
                      style={{ width: `${hardPercentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStats;
