import React from 'react';

const JobCardSkeleton = () => {
  return (
    <div className="bg-gradient-to-br from-slate-700/40 to-slate-600/30 backdrop-blur-md rounded-2xl p-6 border border-slate-600/50 animate-pulse">
      {/* Job Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1 pr-4">
            <div className="h-6 bg-slate-600/60 rounded-lg w-3/4 mb-2"></div>
            <div className="h-6 bg-slate-600/60 rounded-lg w-1/2"></div>
          </div>
          <div className="h-6 w-16 bg-slate-600/60 rounded-lg"></div>
        </div>
      </div>

      {/* Job Details */}
      <div className="space-y-3 mb-6">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center">
            <div className="w-4 h-4 bg-slate-600/60 rounded mr-2"></div>
            <div className="h-4 bg-slate-600/60 rounded w-32"></div>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <div className="flex-1 h-10 bg-slate-600/60 rounded-lg"></div>
        <div className="flex-1 h-10 bg-slate-600/60 rounded-lg"></div>
      </div>
    </div>
  );
};

export const JobsLoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-3/4 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <div className="h-12 bg-slate-700/40 rounded-lg w-96 mx-auto mb-4 animate-pulse"></div>
          <div className="h-12 bg-slate-700/40 rounded-lg w-80 mx-auto mb-6 animate-pulse"></div>
          <div className="h-6 bg-slate-700/40 rounded-lg w-96 mx-auto animate-pulse"></div>
        </div>

        {/* Search and Filter Bar Skeleton */}
        <div className="mb-8 bg-gradient-to-br from-slate-700/30 to-slate-600/20 backdrop-blur-md rounded-2xl p-6 border border-slate-600/50">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 flex gap-2">
              <div className="flex-1 h-12 bg-slate-700/50 rounded-xl animate-pulse"></div>
              <div className="w-24 h-12 bg-slate-700/50 rounded-xl animate-pulse"></div>
            </div>
            <div className="w-full lg:w-32 h-12 bg-slate-700/50 rounded-xl animate-pulse"></div>
          </div>
        </div>

        {/* Results Count Skeleton */}
        <div className="mb-6">
          <div className="h-5 bg-slate-700/40 rounded w-48 animate-pulse"></div>
        </div>

        {/* Job Cards Grid with Shimmer Effect */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="relative overflow-hidden">
              <JobCardSkeleton />
              {/* Shimmer overlay */}
              <div 
                className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/10 to-transparent"
                style={{
                  animationDelay: `${index * 0.1}s`
                }}
              ></div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-28 h-10 bg-slate-700/50 rounded-lg animate-pulse"></div>
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-10 h-10 bg-slate-700/50 rounded-lg animate-pulse"></div>
            ))}
          </div>
          <div className="w-24 h-10 bg-slate-700/50 rounded-lg animate-pulse"></div>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
};