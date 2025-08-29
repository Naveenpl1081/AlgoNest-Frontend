import React, { useState } from "react";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Clock,
  BarChart3,
} from "lucide-react";
import UserLayout from "../../../layouts/UserLayout";

const UserHomePage = () => {
  const [selectedDate, setSelectedDate] = useState(4);
  const [currentMonth, setCurrentMonth] = useState("May");
  const [searchQuery, setSearchQuery] = useState("");

  const problems = [
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      acceptance: "49.2%",
      category: "Array",
    },
    {
      id: 2,
      title: "Add Two Numbers",
      difficulty: "Medium",
      acceptance: "38.4%",
      category: "Linked List",
    },
    {
      id: 3,
      title: "Longest Substring Without Repeating Characters",
      difficulty: "Medium",
      acceptance: "33.8%",
      category: "String",
    },
    {
      id: 4,
      title: "Median of Two Sorted Arrays",
      difficulty: "Hard",
      acceptance: "35.4%",
      category: "Array",
    },
    {
      id: 5,
      title: "Longest Palindromic Substring",
      difficulty: "Medium",
      acceptance: "32.7%",
      category: "String",
    },
    {
      id: 6,
      title: "Zigzag Conversion",
      difficulty: "Medium",
      acceptance: "42.1%",
      category: "String",
    },
    {
      id: 7,
      title: "Reverse Integer",
      difficulty: "Medium",
      acceptance: "27.3%",
      category: "Math",
    },
    {
      id: 8,
      title: "String to Integer (atoi)",
      difficulty: "Medium",
      acceptance: "16.4%",
      category: "String",
    },
    {
      id: 9,
      title: "Palindrome Number",
      difficulty: "Easy",
      acceptance: "52.8%",
      category: "Math",
    },
    {
      id: 10,
      title: "Regular Expression Matching",
      difficulty: "Hard",
      acceptance: "27.9%",
      category: "String",
    },
    {
      id: 11,
      title: "Container With Most Water",
      difficulty: "Medium",
      acceptance: "54.1%",
      category: "Array",
    },
    {
      id: 12,
      title: "Integer to Roman",
      difficulty: "Medium",
      acceptance: "59.2%",
      category: "String",
    },
    {
      id: 13,
      title: "Roman to Integer",
      difficulty: "Easy",
      acceptance: "58.4%",
      category: "String",
    },
    {
      id: 14,
      title: "Longest Common Prefix",
      difficulty: "Easy",
      acceptance: "40.1%",
      category: "String",
    },
    {
      id: 15,
      title: "3Sum",
      difficulty: "Medium",
      acceptance: "32.4%",
      category: "Array",
    },
    {
      id: 16,
      title: "3Sum Closest",
      difficulty: "Medium",
      acceptance: "46.2%",
      category: "Array",
    },
    {
      id: 17,
      title: "Letter Combinations of a Phone Number",
      difficulty: "Medium",
      acceptance: "55.8%",
      category: "Backtracking",
    },
  ];

  const getDifficultyColor = (difficulty:any) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-400 bg-green-400/10";
      case "Medium":
        return "text-yellow-400 bg-yellow-400/10";
      case "Hard":
        return "text-red-400 bg-red-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  const calendarDays = [
    [null, null, null, 1, 2, 3, 4],
    [5, 6, 7, 8, 9, 10, 11],
    [12, 13, 14, 15, 16, 17, 18],
    [19, 20, 21, 22, 23, 24, 25],
    [26, 27, 28, 29, null, null, null],
  ];

  const trendingCompanies = [
    "Google",
    "Microsoft",
    "Amazon",
    "Meta",
    "Apple",
    "Netflix",
  ];

  return (
    <UserLayout>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Daily Challenge Card */}
            <div className="bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-blue-600/20 border border-blue-500/30 rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Trophy className="w-6 h-6 text-blue-400" />
                    <h2 className="text-xl font-bold text-white">
                      Daily Challenge
                    </h2>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-300">
                    <Clock className="w-4 h-4" />
                    <span>24h remaining</span>
                  </div>
                </div>
                <div className="bg-slate-700/60 backdrop-blur-sm rounded-xl p-4 mb-4">
                  <h3 className="text-lg font-semibold text-white mb-2">
                    Two Sum
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Given an array of integers nums and an integer target,
                    return indices of the two numbers...
                  </p>
                </div>
                <button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-300">
                  Start Challenge
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-slate-700/40 border border-slate-600/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Problems Solved</p>
                    <p className="text-2xl font-bold text-white">47</p>
                  </div>
                  <BarChart3 className="w-8 h-8 text-blue-400" />
                </div>
              </div>
              <div className="bg-slate-700/40 border border-slate-600/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Acceptance Rate</p>
                    <p className="text-2xl font-bold text-white">73%</p>
                  </div>
                  <Trophy className="w-8 h-8 text-green-400" />
                </div>
              </div>
              <div className="bg-slate-700/40 border border-slate-600/30 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Current Streak</p>
                    <p className="text-2xl font-bold text-white">12</p>
                  </div>
                  <Clock className="w-8 h-8 text-purple-400" />
                </div>
              </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search problems..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-700/50 border border-slate-600/50 rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                />
              </div>
              <button className="bg-slate-700/50 border border-slate-600/50 rounded-xl px-4 py-3 hover:bg-slate-600/50 transition-colors flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-300" />
                <span className="text-gray-300 hidden sm:inline">Filter</span>
              </button>
            </div>

            {/* Problems Table Header */}
            <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl">
              <div className="grid grid-cols-12 gap-4 p-4 border-b border-slate-600/30 text-sm font-medium text-gray-300">
                <div className="col-span-1 text-center">#</div>
                <div className="col-span-5">Title</div>
                <div className="col-span-2 text-center">Difficulty</div>
                <div className="col-span-2 text-center">Acceptance</div>
                <div className="col-span-2 text-center">Category</div>
              </div>

              {/* Problems List */}
              <div className="divide-y divide-slate-600/20">
                {problems.map((problem) => (
                  <div
                    key={problem.id}
                    className="grid grid-cols-12 gap-4 p-4 hover:bg-slate-600/20 transition-all duration-200 cursor-pointer group"
                  >
                    <div className="col-span-1 flex items-center justify-center">
                      <span className="w-7 h-7 bg-slate-600/50 rounded-lg flex items-center justify-center text-sm font-medium text-gray-300">
                        {problem.id}
                      </span>
                    </div>
                    <div className="col-span-5 flex items-center">
                      <span className="text-white font-medium group-hover:text-blue-400 transition-colors">
                        {problem.title}
                      </span>
                    </div>
                    <div className="col-span-2 flex items-center justify-center">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(
                          problem.difficulty
                        )}`}
                      >
                        {problem.difficulty}
                      </span>
                    </div>
                    <div className="col-span-2 flex items-center justify-center">
                      <span className="text-gray-300 text-sm">
                        {problem.acceptance}
                      </span>
                    </div>
                    <div className="col-span-2 flex items-center justify-center">
                      <span className="text-gray-400 text-sm bg-slate-600/30 px-2 py-1 rounded-md">
                        {problem.category}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Calendar */}
            <div className="bg-slate-700/40 border border-slate-600/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">
                  {currentMonth} 2024
                </h3>
                <div className="flex items-center space-x-2">
                  <button className="p-1.5 hover:bg-slate-600/50 rounded-lg transition-colors">
                    <ChevronLeft className="w-4 h-4 text-gray-400" />
                  </button>
                  <button className="p-1.5 hover:bg-slate-600/50 rounded-lg transition-colors">
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-3">
                {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
                  <div
                    key={index}
                    className={`text-center text-xs font-medium py-2 ${
                      index === 0
                        ? "text-red-400"
                        : index === 6
                        ? "text-blue-400"
                        : "text-gray-400"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.flat().map((day, index) => (
                  <div
                    key={index}
                    onClick={() => day && setSelectedDate(day)}
                    className={`text-center text-sm py-2 rounded-lg cursor-pointer transition-all ${
                      day === null
                        ? ""
                        : day === selectedDate
                        ? "bg-blue-500 text-white font-medium"
                        : "text-gray-300 hover:bg-slate-600/50"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Companies */}
            <div className="bg-slate-700/40 border border-slate-600/30 rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Trending Companies
              </h3>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search companies"
                  className="w-full bg-slate-600/50 border border-slate-500/50 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-all"
                />
              </div>

              <div className="space-y-3">
                {trendingCompanies.map((company, index) => (
                  <div
                    key={index}
                    className="bg-slate-600/30 hover:bg-slate-600/50 rounded-lg px-4 py-3 transition-colors cursor-pointer flex items-center justify-between"
                  >
                    <span className="text-white font-medium">{company}</span>
                    <span className="text-xs text-gray-400">
                      {Math.floor(Math.random() * 50) + 20} questions
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default UserHomePage;
