import React, { useEffect, useState } from "react";
import {
  Filter,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Clock,
  BarChart3,
} from "lucide-react";
import { Search } from "../../../component/common/Search";
import UserLayout from "../../../layouts/UserLayout";
import ProblemList from "../../../component/user/ProblemList";
import { problemService } from "../../../service/problemService";
import { DropdownFilter } from "../../../component/common/DropDownFilter";

const UserHomePage = () => {
  const [selectedDate, setSelectedDate] = useState(4);
  const [currentMonth, setCurrentMonth] = useState("May");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

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

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1">
                <Search
                  value={searchTerm}
                  onChange={setSearchTerm}
                  placeholder="Search problems..."
                />
              </div>
             
                <DropdownFilter
                 
                  options={[
                    { value: "easy", label: "Easy" },
                    { value: "medium", label: "Medium" },
                    { value: "hard", label: "Hard" },
                  ]}
                  value={statusFilter}
                  onChange={setStatusFilter}
                />
                
            
            </div>

            <div className="bg-slate-700/30 border border-slate-600/30 rounded-xl">
              {/* Problems List */}
              <div className="divide-y divide-slate-600/20">
                <ProblemList searchTerm={searchTerm} statusFilter={statusFilter} />
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
              <div className="relative mb-4"></div>

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
