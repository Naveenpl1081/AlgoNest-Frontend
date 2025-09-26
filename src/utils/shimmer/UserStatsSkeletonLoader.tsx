import React from "react";

const UserStatsSkeletonLoader: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-12">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="relative overflow-hidden bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-6"
            >
              {/* Shimmer overlay */}
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
              
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-slate-700/50 rounded-2xl animate-pulse"></div>
                  <div className="text-right">
                    <div className="w-16 h-3 bg-slate-700/50 rounded animate-pulse"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="w-20 h-8 bg-slate-700/50 rounded animate-pulse"></div>
                  <div className="w-32 h-4 bg-slate-700/50 rounded animate-pulse"></div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-slate-700/50 rounded animate-pulse"></div>
                    <div className="w-24 h-4 bg-slate-700/50 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Progress Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 shadow-2xl">
          {/* Shimmer overlay */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2.5s_infinite] bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
          
          <div className="relative">
            <div className="flex items-center justify-between mb-8">
              <div>
                <div className="w-64 h-8 bg-slate-700/50 rounded animate-pulse mb-2"></div>
                <div className="w-48 h-5 bg-slate-700/50 rounded animate-pulse"></div>
              </div>
              <div className="text-right">
                <div className="w-20 h-8 bg-slate-700/50 rounded animate-pulse mb-2"></div>
                <div className="w-32 h-4 bg-slate-700/50 rounded animate-pulse"></div>
              </div>
            </div>

            <div className="flex flex-col xl:flex-row items-center justify-between space-y-8 xl:space-y-0 xl:space-x-12">
              {/* Circular Progress Skeleton */}
              <div className="relative">
                <div className="relative w-80 h-80 flex items-center justify-center">
                  {/* Outer circle skeleton */}
                  <div className="absolute inset-0 rounded-full border-4 border-slate-700/30 animate-pulse"></div>
                  
                  {/* Center content skeleton */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-20 h-16 bg-slate-700/50 rounded animate-pulse mb-2"></div>
                    <div className="w-16 h-6 bg-slate-700/50 rounded animate-pulse mb-1"></div>
                    <div className="w-24 h-4 bg-slate-700/50 rounded animate-pulse"></div>
                  </div>
                </div>
              </div>

              {/* Difficulty Progress Bars */}
              <div className="flex flex-col space-y-4 min-w-0 flex-1">
                {[...Array(3)].map((_, index) => (
                  <div
                    key={index}
                    className="relative overflow-hidden bg-slate-700/30 border border-slate-600/30 rounded-2xl p-6"
                  >
                    {/* Shimmer overlay */}
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/3 to-transparent" style={{ animationDelay: `${index * 0.5}s` }}></div>
                    
                    <div className="relative">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="w-3 h-3 rounded-full bg-slate-600/50 animate-pulse"></div>
                          <div>
                            <div className="w-16 h-5 bg-slate-700/50 rounded animate-pulse mb-2"></div>
                            <div className="w-32 h-4 bg-slate-700/50 rounded animate-pulse"></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="w-16 h-6 bg-slate-700/50 rounded animate-pulse mb-1"></div>
                          <div className="w-12 h-4 bg-slate-700/50 rounded animate-pulse"></div>
                        </div>
                      </div>
                      <div className="mt-4 bg-slate-800/50 rounded-full h-2 overflow-hidden">
                        <div className="w-full h-full bg-slate-700/30 animate-pulse rounded-full"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style >{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
};

export default UserStatsSkeletonLoader;