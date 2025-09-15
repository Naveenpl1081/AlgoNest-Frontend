import React, { useState } from 'react';

const ResultComponent = ({ testResults, loading }) => {
  const [activeTab, setActiveTab] = useState('testcases');

  const getStatusColor = (passed) => {
    return passed ? 'text-green-400' : 'text-red-400';
  };

  const getStatusIcon = (passed) => {
    return passed ? '✓' : '✗';
  };

  const tabs = [
    { id: 'testcases', label: 'Test Cases' },
    { id: 'console', label: 'Console' },
    { id: 'output', label: 'Output' }
  ];

  const renderTestCases = () => {
    if (loading) {
      return (
        <div className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
            <div className="h-4 bg-gray-700 rounded mb-2"></div>
          </div>
        </div>
      );
    }

    if (!testResults || testResults.length === 0) {
      return (
        <div className="p-4 text-gray-400 text-center">
          <div className="text-lg mb-2">No test results yet</div>
          <div className="text-sm">Click "Run" to execute your code against test cases</div>
        </div>
      );
    }

    const passedTests = testResults.filter(result => result.passed).length;
    const totalTests = testResults.length;
    const allPassed = passedTests === totalTests;

    return (
      <div className="p-4">
        {/* Summary */}
        <div className={`mb-4 p-3 rounded ${allPassed ? 'bg-green-900 border-green-700' : 'bg-red-900 border-red-700'} border`}>
          <div className={`font-semibold ${allPassed ? 'text-green-300' : 'text-red-300'}`}>
            {allPassed ? '✓ All tests passed!' : `✗ ${totalTests - passedTests} of ${totalTests} tests failed`}
          </div>
          <div className="text-sm text-gray-300 mt-1">
            {passedTests}/{totalTests} test cases passed
          </div>
        </div>

        {/* Individual Test Cases */}
        <div className="space-y-3">
          {testResults.map((result, index) => (
            <div key={index} className="border border-gray-600 rounded-lg overflow-hidden">
              <div className={`p-3 flex items-center gap-3 ${result.passed ? 'bg-green-900' : 'bg-red-900'}`}>
                <span className={`text-lg ${getStatusColor(result.passed)}`}>
                  {getStatusIcon(result.passed)}
                </span>
                <span className="font-medium">Case {result.caseNumber}</span>
                <span className={`text-sm ${getStatusColor(result.passed)}`}>
                  {result.passed ? 'Passed' : 'Failed'}
                </span>
              </div>
              
              <div className="p-3 bg-gray-800 space-y-2 text-sm">
                <div>
                  <span className="text-gray-400">Input: </span>
                  <span className="font-mono text-white">{result.input}</span>
                </div>
                <div>
                  <span className="text-gray-400">Output: </span>
                  <span className={`font-mono ${result.passed ? 'text-white' : 'text-red-300'}`}>
                    {result.output}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Expected: </span>
                  <span className="font-mono text-green-300">{result.expected}</span>
                </div>
                {result.error && (
                  <div>
                    <span className="text-gray-400">Error: </span>
                    <span className="font-mono text-red-300">{result.error}</span>
                  </div>
                )}
                {result.executionTime && (
                  <div>
                    <span className="text-gray-400">Runtime: </span>
                    <span className="font-mono text-blue-300">{result.executionTime}ms</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderConsole = () => {
    return (
      <div className="p-4">
        <div className="bg-gray-800 p-3 rounded font-mono text-sm">
          <div className="text-gray-400 mb-2">Console Output:</div>
          <div className="text-white">
            {loading ? (
              <div className="text-blue-300">Executing code...</div>
            ) : (
              <div className="text-green-300">Ready for execution</div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderOutput = () => {
    return (
      <div className="p-4">
        <div className="bg-gray-800 p-3 rounded font-mono text-sm">
          <div className="text-gray-400 mb-2">Program Output:</div>
          {testResults && testResults.length > 0 ? (
            <div className="text-white">
              {testResults.map((result, index) => (
                <div key={index} className="mb-1">
                  Test {result.caseNumber}: {result.output}
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
      {/* Tab Navigation */}
      <div className="bg-gray-800 border-b border-gray-600">
        <div className="flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-400 border-blue-400'
                  : 'text-gray-400 border-transparent hover:text-white hover:border-gray-500'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'testcases' && renderTestCases()}
        {activeTab === 'console' && renderConsole()}
        {activeTab === 'output' && renderOutput()}
      </div>
    </div>
  );
};

export default ResultComponent;