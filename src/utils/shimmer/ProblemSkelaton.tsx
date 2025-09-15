export const ProblemSkeleton: React.FC = () => {
    return (
      <div className="h-full bg-gray-800 text-white overflow-y-auto animate-pulse">
        <div className="p-6 space-y-8">
          
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="h-6 bg-gray-700 rounded w-1/3"></div>
              <div className="h-6 bg-gray-700 rounded w-20"></div>
            </div>
          </div>
  
          {/* Description */}
          <div>
            <div className="h-5 bg-gray-700 rounded w-1/4 mb-3"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-700 rounded w-full"></div>
              <div className="h-4 bg-gray-700 rounded w-5/6"></div>
              <div className="h-4 bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-700 rounded w-2/3"></div>
            </div>
          </div>
  
          {/* Examples */}
          <div>
            <div className="h-5 bg-gray-700 rounded w-1/4 mb-3"></div>
            {[1, 2].map((_, index) => (
              <div key={index} className="mb-4 bg-gray-700 p-4 rounded-lg space-y-2">
                <div className="h-4 bg-gray-600 rounded w-1/3"></div>
                <div className="h-3 bg-gray-600 rounded w-full"></div>
                <div className="h-3 bg-gray-600 rounded w-4/5"></div>
              </div>
            ))}
          </div>
  
          {/* Constraints */}
          <div>
            <div className="h-5 bg-gray-700 rounded w-1/4 mb-3"></div>
            <ul className="space-y-2">
              {[1, 2, 3].map((_, index) => (
                <li key={index} className="h-3 bg-gray-600 rounded w-3/4"></li>
              ))}
            </ul>
          </div>
  
          {/* Tags */}
          <div>
            <div className="h-5 bg-gray-700 rounded w-1/4 mb-3"></div>
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3].map((_, index) => (
                <div key={index} className="h-6 bg-gray-600 rounded w-20"></div>
              ))}
            </div>
          </div>
  
          {/* Hints */}
          <div>
            <div className="h-5 bg-gray-700 rounded w-1/4 mb-3"></div>
            <div className="flex flex-wrap gap-2">
              {[1, 2].map((_, index) => (
                <div key={index} className="h-6 bg-blue-900 rounded w-32"></div>
              ))}
            </div>
          </div>
  
        </div>
      </div>
    );
  };