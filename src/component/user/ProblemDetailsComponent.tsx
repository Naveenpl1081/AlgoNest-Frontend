import React, { useState, useEffect } from "react";
import { ProblemDetailsProps } from "../../types/component.types";
import { problemService } from "../../service/problemService";// Adjust import path as needed
import { PerformanceChart } from "./PerformanceChart";

const ProblemDetailsComponent: React.FC<ProblemDetailsProps> = ({
  problemData,
  loading,
  problemId 
}) => {
  const [showSubmissions, setShowSubmissions] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<any>(null);
  const [allSubmissions, setAllSubmissions] = useState<any[]>([]);
  const [submissionsLoading, setSubmissionsLoading] = useState(false);
  const [submissionsError, setSubmissionsError] = useState<string | null>(null);
  const [performanceStats, setPerformanceStats] = useState({ runtime: 0, memory: 0 });

  const getAllSubmissions = async () => {
    try {
      if (!problemId) {
        console.error("No problem ID provided!");
        return;
      }
      
      setSubmissionsLoading(true);
      setSubmissionsError(null);
      
      const submissions = await problemService.allSubmissions(problemId);
      console.log("allSubmissions", submissions);
      setAllSubmissions(submissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      setSubmissionsError("Failed to load submissions");
    } finally {
      setSubmissionsLoading(false);
    }
  };

  const calculateBeatsPercentage = (currentValue: number, allValues: number[]) => {
    if (!allValues || allValues.length <= 1 || typeof currentValue !== 'number' || isNaN(currentValue)) return 0;
    
    const validValues = allValues.filter(value => typeof value === 'number' && !isNaN(value) && isFinite(value));
    if (validValues.length === 0) return 0;
    
    const betterCount = validValues.filter(value => value > currentValue).length;
    return Math.round((betterCount / validValues.length) * 10000) / 100; // Round to 2 decimal places
  };

  const handleAllSubmissions = async () => {
    if (!showSubmissions) {
      if (allSubmissions.length === 0) {
        await getAllSubmissions();
      }
    }
    setShowSubmissions(!showSubmissions);
    setSelectedSubmission(null);
  };

  const handleSubmissionClick = (submission: any) => {
    setSelectedSubmission(submission);
    

    if (submission.testResults && submission.testResults.length > 0) {
      const avgRuntime = submission.testResults.reduce((acc: number, test: any) => 
        acc + (test.executionTime || 0), 0) / submission.testResults.length;
      const avgMemory = submission.testResults.reduce((acc: number, test: any) => 
        acc + (test.memoryUsed || 0), 0) / submission.testResults.length;
      
      setPerformanceStats({ runtime: avgRuntime, memory: avgMemory });
    }
  };

  const handleBackToSubmissions = () => {
    setSelectedSubmission(null);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "passed":
      case "accepted":
        return "text-green-400";
      case "failed":
        return "text-red-400";
      case "error":
        return "text-orange-400";
      default:
        return "text-gray-400";
    }
  };

  const formatDate = (date: string | Date) => {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric"
    });
  };

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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-400 bg-green-900/50";
      case "medium":
        return "text-yellow-400 bg-yellow-900/50";
      case "hard":
        return "text-red-400 bg-red-900/50";
      default:
        return "text-gray-400 bg-gray-900/50";
    }
  };

  if (selectedSubmission) {
    const passedTests = selectedSubmission.testResults.filter((test: any) => test.passed).length;
    const totalTests = selectedSubmission.testResults.length;
    const avgRuntime = selectedSubmission.testResults.reduce((acc: number, test: any) => 
      acc + (test.executionTime || 0), 0) / selectedSubmission.testResults.length;
    const avgMemory = selectedSubmission.testResults.reduce((acc: number, test: any) => 
      acc + (test.memoryUsed || 0), 0) / selectedSubmission.testResults.length;


    const allRuntimes = allSubmissions
      .filter(sub => sub.testResults && sub.testResults.length > 0)
      .map(sub => sub.testResults.reduce((acc: number, test: any) => 
        acc + (test.executionTime || 0), 0) / sub.testResults.length)
      .filter(runtime => runtime > 0);
    
    const allMemories = allSubmissions
      .filter(sub => sub.testResults && sub.testResults.length > 0)
      .map(sub => sub.testResults.reduce((acc: number, test: any) => 
        acc + (test.memoryUsed || 0), 0) / sub.testResults.length)
      .filter(memory => memory > 0);

    const runtimeBeats = calculateBeatsPercentage(avgRuntime, allRuntimes);
    const memoryBeats = calculateBeatsPercentage(avgMemory, allMemories);

    return (
      <div className="h-full bg-gray-800 text-white overflow-y-auto">
        <div className="p-6">
        
          <div className="mb-6">
            <button
              onClick={handleBackToSubmissions}
              className="flex items-center gap-2 text-gray-300 hover:text-white text-sm mb-4 transition-colors"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"/>
              </svg>
              Back to Submissions
            </button>
            
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <span className={`text-lg font-bold ${getStatusColor(selectedSubmission.overallStatus)}`}>
                    {selectedSubmission.overallStatus === "passed" ? "Accepted" : selectedSubmission.overallStatus}
                  </span>
                  {selectedSubmission.overallStatus === "passed" && (
                    <span className="text-gray-400">
                      {passedTests}/{totalTests} testcases passed
                    </span>
                  )}
                </div>
                <p className="text-gray-400 text-sm">
                  submitted at {formatDate(selectedSubmission.createdAt)} {new Date(selectedSubmission.createdAt).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>

   
          <div className="grid grid-cols-2 gap-6 mb-8">
         
            <div className="bg-gray-700 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M16.2,16.2L11,13V7H12.5V12.2L17,14.4L16.2,16.2Z"/>
                </svg>
                <h3 className="text-lg font-semibold">Runtime</h3>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">{Math.round(avgRuntime)} ms</div>
                <div className="text-sm text-gray-400">
                  Beats <span className={`font-medium ${runtimeBeats > 50 ? 'text-green-400' : 'text-orange-400'}`}>
                    {runtimeBeats.toFixed(2)}%
                  </span>
                  {allRuntimes.length > 1 && (
                    <span className="text-xs ml-1">of {allRuntimes.length} submissions</span>
                  )}
                </div>
                <button className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"/>
                  </svg>
                  Analyze Complexity
                </button>
              </div>
            </div>

        
            <div className="bg-gray-700 p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17,10.5V7A1,1 0 0,0 16,6H4A1,1 0 0,0 3,7V10.5A1,1 0 0,0 4,11.5H16A1,1 0 0,0 17,10.5M20,2H8A2,2 0 0,0 6,4V6H4A2,2 0 0,0 2,8V16A2,2 0 0,0 4,18H6V20A2,2 0 0,0 8,22H20A2,2 0 0,0 22,20V4A2,2 0 0,0 20,2Z"/>
                </svg>
                <h3 className="text-lg font-semibold">Memory</h3>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold">
                  {(avgMemory / (1024 * 1024)).toFixed(2)} MB
                </div>
                <div className="text-sm text-gray-400">
                  Beats <span className={`font-medium ${memoryBeats > 50 ? 'text-green-400' : 'text-orange-400'}`}>
                    {memoryBeats.toFixed(2)}%
                  </span>
                  {allMemories.length > 1 && (
                    <span className="text-xs ml-1">of {allMemories.length} submissions</span>
                  )}
                </div>
              </div>
            </div>
          </div>

    
          <div className="mb-8">
            <PerformanceChart 
              currentRuntime={avgRuntime}
              currentMemory={avgMemory}
              allSubmissions={allSubmissions}
            />
          </div>


          {selectedSubmission.testResults.length > 0 && (
            <div className="bg-gray-700 p-6 rounded-lg mb-8">
              <h3 className="text-lg font-semibold mb-4">Test Results</h3>
              <div className="space-y-3">
                {selectedSubmission.testResults.map((test: any, index: number) => (
                  <div 
                    key={index} 
                    className={`p-4 rounded-lg border-l-4 ${
                      test.passed 
                        ? 'bg-green-900/20 border-green-500' 
                        : 'bg-red-900/20 border-red-500'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Test Case {test.caseNumber}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          test.passed 
                            ? 'bg-green-600 text-green-100' 
                            : 'bg-red-600 text-red-100'
                        }`}>
                          {test.passed ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>
                      <div className="text-xs text-gray-400">
                        {test.executionTime}ms | {(test.memoryUsed / (1024 * 1024)).toFixed(1)}MB
                      </div>
                    </div>
                    <div className="text-sm space-y-1">
                      <div><span className="text-gray-400">Input:</span> {test.input}</div>
                      <div><span className="text-gray-400">Expected:</span> {test.expected}</div>
                      <div><span className="text-gray-400">Output:</span> {test.output}</div>
                      {test.error && (
                        <div className="text-red-400"><span className="text-gray-400">Error:</span> {test.error}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

      
          <div className="bg-gray-700 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Code</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 capitalize">{selectedSubmission.language}</span>
                <button className="text-gray-400 hover:text-white">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"/>
                  </svg>
                </button>
              </div>
            </div>
            <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
              <code className="text-green-400">{selectedSubmission.code}</code>
            </pre>
          </div>
        </div>
      </div>
    );
  }

 
  if (showSubmissions) {
    return (
      <div className="h-full bg-gray-800 text-white overflow-y-auto">
        <div className="p-6 space-y-4">
   
          <div className="flex items-center justify-between mb-6">
            <div>
              <button
                onClick={handleAllSubmissions}
                className="flex items-center gap-2 text-gray-300 hover:text-white text-sm mb-2 transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20 11H7.83L13.42 5.41L12 4L4 12L12 20L13.41 18.59L7.83 13H20V11Z"/>
                </svg>
                Back to Problem
              </button>
              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9M19 9H14V4H5V21H19V9Z"/>
                </svg>
                <h1 className="text-2xl font-bold">Submissions</h1>
              </div>
              <p className="text-gray-400 mt-1">
                {problemData.problemId}. {problemData.title}
              </p>
            </div>
          </div>


          {submissionsLoading && (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span className="ml-3 text-gray-400">Loading submissions...</span>
            </div>
          )}

   
          {submissionsError && (
            <div className="text-center py-12">
              <div className="text-red-400 mb-4">{submissionsError}</div>
              <button
                onClick={getAllSubmissions}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

   
          {!submissionsLoading && !submissionsError && (
            <>
            
              <div className="grid grid-cols-5 gap-4 py-3 px-4 bg-gray-700 rounded-lg text-sm font-medium text-gray-300">
                <div>Status</div>
                <div>Language</div>
                <div>Runtime</div>
                <div>Memory</div>
                <div>Submitted</div>
              </div>

       
              {allSubmissions && allSubmissions.length > 0 ? (
                <div className="space-y-2">
                  {allSubmissions.map((submission: any, index: number) => (
                    <div
                      key={submission._id || index}
                      className="grid grid-cols-5 gap-4 py-4 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors cursor-pointer"
                      onClick={() => handleSubmissionClick(submission)}
                    >
                
                      <div className="flex flex-col">
                        <span className={`font-medium capitalize ${getStatusColor(submission.overallStatus)}`}>
                          {submission.overallStatus === "passed" ? "Accepted" : submission.overallStatus}
                        </span>
                        <span className="text-xs text-gray-400">
                          {formatDate(submission.createdAt)}
                        </span>
                      </div>

                
                      <div>
                        <span className="px-3 py-1 bg-gray-600 rounded-full text-sm capitalize">
                          {submission.language}
                        </span>
                      </div>

               
                      <div className="text-sm">
                        {submission.testResults && submission.testResults[0]?.executionTime ? (
                          <span>{submission.testResults[0].executionTime} ms</span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </div>

                 
                      <div className="text-sm">
                        {submission.testResults && submission.testResults[0]?.memoryUsed ? (
                          <span>{(submission.testResults[0].memoryUsed / (1024 * 1024)).toFixed(1)} MB</span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </div>

               
                      <div className="text-sm text-gray-400">
                        {new Date(submission.createdAt).toLocaleTimeString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400">
                  <p>No submissions found for this problem.</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-800 text-white overflow-y-auto">
      <div className="p-6 space-y-8">
        <div>
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold mb-2">
                {problemData.problemId}. {problemData.title}
              </h1>
              <button 
                onClick={handleAllSubmissions}
                className="flex items-center gap-2 text-gray-300 hover:text-white text-sm transition-colors w-fit"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.9 1 3 1.9 3 3V21C3 22.1 3.9 23 5 23H19C20.1 23 21 22.1 21 21V9M19 9H14V4H5V21H19V9Z"/>
                </svg>
                Submissions
              </button>
            </div>
            <div
              className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                problemData.difficulty
              )}`}
            >
              {problemData.difficulty}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-3 text-gray-100">
            Description
          </h2>
          <div className="text-gray-300 whitespace-pre-line leading-relaxed prose prose-invert max-w-none">
            {problemData.description}
          </div>
        </div>

        {problemData.examples && problemData.examples.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-100">
              Examples
            </h2>
            {problemData.examples.map((example: any, index: number) => (
              <div key={index} className="mb-4 bg-gray-700 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2">
                  Example {index + 1}:
                </h3>
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
                      <span className="text-gray-300">
                        {example.explanation}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {problemData.constraints && problemData.constraints.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-100">
              Constraints
            </h2>
            <ul className="text-gray-300 text-sm list-disc list-inside space-y-1">
              {problemData.constraints.map(
                (constraint: string, index: number) => (
                  <li key={index}>{constraint}</li>
                )
              )}
            </ul>
          </div>
        )}

        {problemData.tags && problemData.tags.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-3 text-gray-100">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {problemData.tags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-700 rounded-full text-sm text-gray-300"
                >
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
              {problemData.hints.map((hint: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-900 rounded-full text-sm text-blue-200"
                >
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