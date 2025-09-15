export const CodeEditorSkeleton: React.FC = () => {
    return (
      <div className="h-full bg-gray-900 text-white flex flex-col animate-pulse">
        {/* Header */}
        <div className="bg-gray-800 p-3 border-b border-gray-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-6 bg-gray-700 rounded w-24"></div>
              <div className="h-6 bg-gray-700 rounded w-20"></div>
              <div className="h-6 bg-gray-700 rounded w-20"></div>
              <div className="h-6 bg-gray-700 rounded w-20"></div>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 bg-blue-600 rounded w-20"></div>
              <div className="h-8 bg-green-600 rounded w-20"></div>
            </div>
          </div>
        </div>
  
        {/* Editor Area */}
        <div className="flex-1 flex">
          <div className="bg-gray-800 p-4 pr-2 text-gray-500 text-right min-w-[50px] border-r border-gray-600">
            <div className="space-y-1">
              {[...Array(10)].map((_, index) => (
                <div key={index} className="h-4 bg-gray-700 rounded w-8 mx-auto"></div>
              ))}
            </div>
          </div>
          <div className="flex-1 p-4">
            {[...Array(10)].map((_, index) => (
              <div key={index} className="h-4 bg-gray-700 rounded w-full mb-3"></div>
            ))}
          </div>
        </div>
  
        {/* Footer */}
        <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 border-t border-gray-600 flex justify-between">
          <div className="h-4 bg-gray-700 rounded w-16"></div>
          <div className="h-4 bg-gray-700 rounded w-24"></div>
        </div>
      </div>
    );
  };