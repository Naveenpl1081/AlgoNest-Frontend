// components/UserDetailsSkeleton.tsx

import React from "react";

const UserDetailsSkeleton: React.FC = () => {
  return (
    <div className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 rounded-3xl p-6 shadow-2xl animate-pulse">
      {/* Avatar Circle */}
      <div className="text-center mb-6">
        <div className="w-28 h-28 rounded-full bg-slate-600 mx-auto mb-4" />
        {/* Username and pulse dot */}
        <div className="flex items-center justify-center space-x-2 mb-2">
          <div className="h-6 w-24 bg-slate-600 rounded-md" />
          <div className="w-4 h-4 bg-slate-600 rounded-full" />
        </div>
        {/* Rank badge */}
        <div className="flex items-center justify-center space-x-2 mb-4">
          <div className="px-4 py-2 bg-slate-600 rounded-full w-24 h-6" />
        </div>
      </div>

      {/* Email and Joined Date */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 bg-slate-600 rounded-full" />
          <div className="h-4 w-32 bg-slate-600 rounded-md" />
        </div>
        <div className="flex items-center space-x-3">
          <div className="w-4 h-4 bg-slate-600 rounded-full" />
          <div className="h-4 w-40 bg-slate-600 rounded-md" />
        </div>

        {/* Button shimmer */}
        <div className="flex justify-center mt-6">
          <div className="h-10 w-40 bg-slate-600 rounded-xl" />
        </div>
      </div>
    </div>
  );
};

export default UserDetailsSkeleton;
