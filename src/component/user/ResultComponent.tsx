import React, { useState } from "react";
import {
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Terminal,
  Sparkles,
} from "lucide-react";
import { ResultComponentProps } from "../../types/component.types";

const ResultComponent: React.FC<ResultComponentProps> = ({
  testResults,
  loading,
  overallStatus,
  error,
  consoleOutput,
  onExplainError,
  userCode,
  problemData,
}) => {
  const [activeTab, setActiveTab] = useState("testcases");

  console.log("testResults", testResults);
  console.log("cnsolelog", consoleOutput);

  const getStatusDetails = (result: any) => {
    const status =
      result?.status || (result?.passed ? "accepted" : "wrong_answer");

    switch (status) {
      case "accepted":
        return {
          color: "text-green-400",
          bgColor: "bg-green-900",
          borderColor: "border-green-700",
          icon: CheckCircle,
          label: "Accepted",
        };
      case "wrong_answer":
        return {
          color: "text-red-400",
          bgColor: "bg-red-900",
          borderColor: "border-red-700",
          icon: XCircle,
          label: "Wrong Answer",
        };
      case "timeout":
        return {
          color: "text-yellow-400",
          bgColor: "bg-yellow-900",
          borderColor: "border-yellow-700",
          icon: Clock,
          label: "Time Limit Exceeded",
        };
      case "memory_exceeded":
        return {
          color: "text-purple-400",
          bgColor: "bg-purple-900",
          borderColor: "border-purple-700",
          icon: AlertTriangle,
          label: "Memory Limit Exceeded",
        };
      case "runtime_error":
        return {
          color: "text-orange-400",
          bgColor: "bg-orange-900",
          borderColor: "border-orange-700",
          icon: AlertTriangle,
          label: "Runtime Error",
        };
      case "system_error":
      case "network_error":
      case "execution_error":
        return {
          color: "text-red-400",
          bgColor: "bg-red-900",
          borderColor: "border-red-700",
          icon: AlertCircle,
          label: "System Error",
        };
      case "rejected":
        return {
          color: "text-gray-400",
          bgColor: "bg-gray-900",
          borderColor: "border-gray-700",
          icon: XCircle,
          label: "Rejected",
        };
      default:
        return {
          color: "text-gray-400",
          bgColor: "bg-gray-900",
          borderColor: "border-gray-700",
          icon: AlertCircle,
          label: "Unknown",
        };
    }
  };

  const getOverallStatusDetails = () => {
    switch (overallStatus) {
      case "passed":
        return {
          color: "text-green-400",
          bgColor: "bg-green-900",
          borderColor: "border-green-700",
          icon: CheckCircle,
        };
      case "failed":
        return {
          color: "text-red-400",
          bgColor: "bg-red-900",
          borderColor: "border-red-700",
          icon: XCircle,
        };
      case "error":
        return {
          color: "text-red-400",
          bgColor: "bg-red-900",
          borderColor: "border-red-700",
          icon: AlertCircle,
        };
      default:
        return {
          color: "text-gray-400",
          bgColor: "bg-gray-800",
          borderColor: "border-gray-600",
          icon: AlertCircle,
        };
    }
  };

  const formatConsoleOutput = (output: string) => {
    if (!output) return "";

    const parts = output.split("\n\n");
    const cleanedParts = parts
      .map((part) => part.trim())
      .filter((part) => part.length > 0)
      .map((part) => {
        try {
          if (part.startsWith("[") && part.endsWith("]")) {
            const parsed = JSON.parse(part);
            return JSON.stringify(parsed);
          }
          if (part.startsWith("{") && part.endsWith("}")) {
            const parsed = JSON.parse(part);

            const keys = Object.keys(parsed);
            if (keys.length <= 2) {
              return JSON.stringify(parsed);
            } else {
              return JSON.stringify(parsed, null, 2);
            }
          }
        } catch (e) {}
        return part;
      });

    return cleanedParts;
  };

  const hasConsoleOutput = () => {
    if (consoleOutput && consoleOutput.trim()) return true;
    if (
      testResults &&
      testResults.some((r: any) => r.consoleOutput && r.consoleOutput.trim())
    )
      return true;
    return false;
  };

  const tabs = [
    { id: "testcases", label: "Test Cases", count: testResults?.length || 0 },
    {
      id: "console",
      label: "Console",
      hasOutput: hasConsoleOutput(),
    },
    { id: "output", label: "Output" },
  ];

  const renderTestCases = () => {
    if (loading) {
      return (
        <div className="p-4">
          <div className="animate-pulse space-y-3">
            <div className="h-16 bg-gray-700 rounded-lg"></div>
            <div className="h-24 bg-gray-700 rounded-lg"></div>
            <div className="h-20 bg-gray-700 rounded-lg"></div>
          </div>
          <div className="text-center mt-4">
            <div className="inline-flex items-center gap-2 text-blue-400">
              <div className="w-5 h-5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Running your code...</span>
            </div>
          </div>
        </div>
      );
    }

    if (error && (!testResults || testResults.length === 0)) {
      return (
        <div className="p-4">
          <div className="bg-red-900 border border-red-700 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="font-semibold text-red-300">
                Execution Failed
              </span>
            </div>
            <div className="text-red-200 text-sm">{error}</div>
          </div>
        </div>
      );
    }

    if (!testResults || testResults.length === 0) {
      return (
        <div className="p-4 text-gray-400 text-center">
          <div className="text-lg mb-2">No test results yet</div>
          <div className="text-sm">
            Click "Run" to execute your code against test cases
          </div>
        </div>
      );
    }

    const passedTests = testResults.filter(
      (result: any) => result.passed
    ).length;
    const totalTests = testResults.length;
    const allPassed = passedTests === totalTests;
    const overallDetails = getOverallStatusDetails();
    const OverallIcon = overallDetails.icon;

    return (
      <div className="p-4">
        <div
          className={`mb-4 p-3 rounded-lg border ${overallDetails.bgColor} ${overallDetails.borderColor}`}
        >
          <div className="flex items-center gap-3 mb-2">
            <OverallIcon className={`w-5 h-5 ${overallDetails.color}`} />
            <div className={`font-semibold ${overallDetails.color}`}>
              {allPassed
                ? "All tests passed!"
                : overallStatus === "error"
                ? "Execution Error"
                : `${totalTests - passedTests} of ${totalTests} tests failed`}
            </div>
          </div>
          <div className="text-sm text-gray-300">
            {overallStatus === "error"
              ? error || "An error occurred during execution"
              : `${passedTests}/${totalTests} test cases passed`}
          </div>
        </div>
        {overallStatus !== "passed" && (
          <button
            onClick={() =>
              onExplainError &&
              onExplainError({
                code: userCode || "",
                errorLog: error || consoleOutput || "",
                problemStatement: problemData?.description || "",
              })
            }
            className="fixed top-3 right-108 z-50 group flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 hover:from-purple-700 hover:via-blue-700 hover:to-purple-700 rounded-full text-white font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 border border-purple-500/20"
            style={{
              background: "linear-gradient(135deg, #8B5CF6, #3B82F6, #8B5CF6)",
              backgroundSize: "200% 200%",
              animation: "gradient-shift 3s ease infinite",
            }}
          >
            <Sparkles className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-semibold">AI Explain</span>
            <div className="absolute inset-0 rounded-full bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        )}
        <style>{`
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`}</style>

        <div className="space-y-3">
          {testResults.map((result: any, index: number) => {
            const statusDetails = getStatusDetails(result);
            const StatusIcon = statusDetails.icon;

            return (
              <div
                key={index}
                className={`border rounded-lg overflow-hidden ${statusDetails.borderColor}`}
              >
                <div
                  className={`p-3 flex items-center gap-3 ${statusDetails.bgColor}`}
                >
                  <StatusIcon className={`w-5 h-5 ${statusDetails.color}`} />
                  <span className="font-medium">Case {result.caseNumber}</span>
                  <span
                    className={`text-sm px-2 py-1 rounded font-medium ${statusDetails.color}`}
                  >
                    {statusDetails.label}
                  </span>
                  {result.executionTime && (
                    <span className="text-xs text-gray-400 ml-auto">
                      {result.executionTime}ms
                    </span>
                  )}
                </div>

                <div className="p-3 bg-gray-800 space-y-2 text-sm">
                  <div>
                    <span className="text-gray-400">Input: </span>
                    <span className="font-mono text-white break-all">
                      {result.input}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400">Output: </span>
                    <span
                      className={`font-mono break-all ${
                        result.passed
                          ? "text-green-300"
                          : result.status === "timeout"
                          ? "text-yellow-300"
                          : result.status === "memory_exceeded"
                          ? "text-purple-300"
                          : "text-red-300"
                      }`}
                    >
                      {result.output || "No output"}
                    </span>
                  </div>

                  <div>
                    <span className="text-gray-400">Expected: </span>
                    <span className="font-mono text-green-300 break-all">
                      {result.expected}
                    </span>
                  </div>

                  {result.error && (
                    <div>
                      <span className="text-gray-400">Error: </span>
                      <span className="font-mono text-red-300 break-all">
                        {result.error}
                      </span>
                    </div>
                  )}

                  {result.status &&
                    result.status !== "accepted" &&
                    result.status !== "wrong_answer" && (
                      <div className="mt-3 p-2 bg-gray-700 rounded text-xs">
                        <span className="text-gray-400">Status Details: </span>
                        <span className={statusDetails.color}>
                          {result.status === "timeout" &&
                            "Your code took too long to execute. Consider optimizing your algorithm or check for infinite loops."}
                          {result.status === "memory_exceeded" &&
                            "Your code used too much memory. Try to optimize memory usage."}
                          {result.status === "runtime_error" &&
                            "Your code encountered a runtime error during execution."}
                          {result.status === "system_error" &&
                            "A system error occurred while executing your code."}
                          {result.status === "rejected" &&
                            "Your code was rejected due to obvious issues."}
                        </span>
                      </div>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderConsole = () => {
    let primaryConsoleOutput = consoleOutput || "";

    if (!primaryConsoleOutput && testResults && testResults.length > 0) {
      primaryConsoleOutput = testResults[0].consoleOutput || "";
    }

    const formattedOutput = formatConsoleOutput(primaryConsoleOutput);

    return (
      <div className="p-4">
        <div className="bg-gray-900 border border-gray-600 rounded-lg overflow-hidden">
          <div className="bg-gray-800 px-4 py-2 border-b border-gray-600">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium text-gray-300">
                Console Output
              </span>
              {loading && (
                <div className="ml-auto flex items-center gap-2 text-blue-400">
                  <div className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs">Running...</span>
                </div>
              )}
            </div>
          </div>

          <div className="p-4 font-mono text-sm min-h-32 max-h-64 overflow-y-auto bg-gray-900">
            {loading ? (
              <div className="text-blue-300 flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
                <span className="ml-2">Executing code...</span>
              </div>
            ) : error && !formattedOutput.length ? (
              <div className="text-red-300">
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4" />
                  <span className="font-semibold">Execution Error</span>
                </div>
                <div className="text-red-200">{error}</div>
              </div>
            ) : formattedOutput.length > 0 ? (
              <div className="space-y-3">
                {formattedOutput ||
                  [].map((output: any, index: number) => (
                    <div key={index} className="console-output-block">
                      {index > 0 && (
                        <div className="border-t border-gray-700 my-2"></div>
                      )}
                      <div className="text-green-300 whitespace-pre-wrap font-mono text-sm">
                        {output}
                      </div>
                    </div>
                  ))}

                {testResults &&
                  testResults.some((r: any) => r.executionTime) && (
                    <div className="text-gray-500 text-xs mt-3 pt-2 border-t border-gray-700">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        <span>
                          Execution time:{" "}
                          {testResults.reduce(
                            (sum: any, r: any) => sum + (r.executionTime || 0),
                            0
                          )}
                          ms
                        </span>
                      </div>
                    </div>
                  )}
              </div>
            ) : testResults && testResults.length > 0 ? (
              <div className="text-gray-400">
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>Code executed successfully</span>
                </div>
                <div className="text-gray-500 text-xs">No console output</div>
                {testResults.some((r: any) => r.executionTime) && (
                  <div className="text-gray-500 text-xs mt-1">
                    Execution time:{" "}
                    {testResults.reduce(
                      (sum: any, r: any) => sum + (r.executionTime || 0),
                      0
                    )}
                    ms
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-500 flex items-center justify-center h-20">
                <div className="text-center">
                  <Terminal className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <div>Ready for execution</div>
                  <div className="text-xs mt-1">
                    Run your code to see console output here
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderOutput = () => {
    return (
      <div className="p-4">
        <div className="bg-gray-800 p-3 rounded font-mono text-sm min-h-32 max-h-64 overflow-y-auto">
          <div className="text-gray-400 mb-2">Program Output:</div>
          {loading ? (
            <div className="text-blue-300">Running...</div>
          ) : testResults && testResults.length > 0 ? (
            <div className="text-white space-y-1">
              {testResults.map((result: any, index: number) => (
                <div key={index} className="text-xs">
                  <span className="text-gray-400">
                    Test {result.caseNumber}:
                  </span>
                  <span
                    className={`ml-2 ${
                      result.passed ? "text-green-300" : "text-red-300"
                    }`}
                  >
                    {result.output}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500">No output yet</div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col">
      <div className="bg-gray-800 border-b border-gray-600">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? "text-blue-400 border-blue-400"
                  : "text-gray-400 border-transparent hover:text-white hover:border-gray-500"
              }`}
            >
              {tab.label}
              {tab.count !== undefined && tab.count > 0 && (
                <span
                  className={`px-1.5 py-0.5 text-xs rounded-full ${
                    activeTab === tab.id
                      ? "bg-blue-400 text-gray-900"
                      : "bg-gray-600 text-gray-300"
                  }`}
                >
                  {tab.count}
                </span>
              )}
              {tab.id === "console" && tab.hasOutput && (
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {activeTab === "testcases" && renderTestCases()}
        {activeTab === "console" && renderConsole()}
        {activeTab === "output" && renderOutput()}
      </div>
    </div>
  );
};

export default ResultComponent;
