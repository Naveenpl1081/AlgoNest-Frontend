import React from 'react';

const ProblemDetailsComponent = ({ problemData, loading }) => {
  if (loading) {
    return (
      <div className="p-6 h-full bg-gray-800 text-white">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded mb-4"></div>
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-700 rounded mb-2"></div>
          <div className="h-4 bg-gray-700 rounded mb-4"></div>
        </div>
      </div>
    );
  }

  if (!problemData) {
    return (
      <div className="p-6 h-full bg-gray-800 text-white flex items-center justify-center">
        <div className="text-red-400">Failed to load problem details</div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty:string) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-green-400 bg-green-900/50';
      case 'medium': return 'text-yellow-400 bg-yellow-900/50';
      case 'hard': return 'text-red-400 bg-red-900/50';
      default: return 'text-gray-400 bg-gray-900/50';
    }
  };

  return (
    <div className="h-full bg-gray-800 text-white overflow-y-auto">
      <div className="p-6 space-y-8">
  
        <div>
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-bold">{problemData.problemId}. {problemData.title}</h1>
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(problemData.difficulty)}`}>
              {problemData.difficulty}
            </div>
          </div>
        </div>

        
        <div>
          <h2 className="text-xl font-semibold mb-3 text-gray-100">Description</h2>
          <div className="text-gray-300 whitespace-pre-line leading-relaxed prose prose-invert max-w-none">
            {problemData.description}
          </div>
        </div>

     
        {problemData.examples && problemData.examples.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-100">Examples</h2>
            {problemData.examples.map((example:any, index:number) => (
              <div key={index} className="mb-4 bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">Example {index + 1}:</h3>
                <div className="font-mono text-sm space-y-2">
                  <div>
                    <span className="text-gray-400">Input: </span>
                    <span className="text-white">{example.input}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Output: </span>
                    <span className="text-white">{example.output}</span>
                  </div>
                  {example.explanation && (
                    <div>
                      <span className="text-gray-400">Explanation: </span>
                      <span className="text-gray-300">{example.explanation}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

  
        {problemData.constraints && problemData.constraints.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-100">Constraints</h2>
            <ul className="text-gray-300 text-sm list-disc list-inside space-y-1">
              {problemData.constraints.map((constraint:string, index:number) => (
                <li key={index}>{constraint}</li>
              ))}
            </ul>
          </div>
        )}

    
        {problemData.tags && problemData.tags.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-100">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {problemData.tags.map((tag:string, index:number) => (
                <span key={index} className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

   
        {problemData.hints && problemData.hints.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-100">Hints</h2>
            <div className="flex flex-wrap gap-2">
              {problemData.hints.map((hint:string, index:number) => (
                <span key={index} className="px-3 py-1 bg-blue-900 rounded-full text-sm text-blue-200">
                  {hint}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProblemDetailsComponent;