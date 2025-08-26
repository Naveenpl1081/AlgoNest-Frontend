// utils/shimmer/RecruiterDetailsSkeleton.tsx
import React from "react";

const RecruiterDetailsSkeleton: React.FC = () => {
  return (
    <div className="animate-pulse bg-slate-800/50 rounded-2xl p-6">
      <div className="w-24 h-24 bg-slate-700 rounded-full mx-auto mb-4"></div>
      <div className="h-4 bg-slate-700 rounded w-32 mx-auto mb-2"></div>
      <div className="h-3 bg-slate-700 rounded w-24 mx-auto mb-6"></div>
      <div className="space-y-2">
        <div className="h-3 bg-slate-700 rounded w-3/4 mx-auto"></div>
        <div className="h-3 bg-slate-700 rounded w-2/3 mx-auto"></div>
        <div className="h-3 bg-slate-700 rounded w-1/2 mx-auto"></div>
      </div>
    </div>
  );
};

export default RecruiterDetailsSkeleton;
