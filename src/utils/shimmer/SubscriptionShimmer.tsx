// src/components/common/SubscriptionShimmer.tsx
import React from "react";

export const SubscriptionShimmer: React.FC = () => {
  const shimmerCards = Array(3).fill(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {shimmerCards.map((_, index) => (
        <div
          key={index}
          className="rounded-xl bg-slate-800/70 backdrop-blur-sm border border-slate-700/50 p-5 animate-pulse flex flex-col h-full"
        >
          {/* Plan name shimmer */}
          <div className="h-6 bg-slate-700 rounded w-2/3 mx-auto mb-4"></div>

          {/* Price shimmer */}
          <div className="flex flex-col items-center mb-4">
            <div className="h-8 w-1/3 bg-slate-700 rounded mb-2"></div>
            <div className="h-3 w-1/4 bg-slate-700 rounded"></div>
          </div>

          {/* Description shimmer list */}
          <ul className="space-y-2 mb-5 flex-1">
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <li key={i} className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-700"></div>
                  <div className="h-3 bg-slate-700 rounded w-5/6"></div>
                </li>
              ))}
          </ul>

          {/* Button shimmer */}
          <div className="h-9 w-full bg-slate-700 rounded-lg"></div>
        </div>
      ))}
    </div>
  );
};
