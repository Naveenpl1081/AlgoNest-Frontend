import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CompilerComponent from "../../../component/user/CompilerComponent";
import ProblemDetailsComponent from "../../../component/user/ProblemDetailsComponent";
import ResultComponent from "../../../component/user/ResultComponent";
import UserLayout from "../../../layouts/UserLayout";
import { problemService } from "../../../service/problemService";
import ShimmerSkeleton from "../../../utils/shimmer/ProblemShimmer";

const SingleProblemPage = () => {
  const { problemId } = useParams();
  const [problemData, setProblemData] = useState(null);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [runError, setRunError] = useState(null);
  const [overallStatus, setOverallStatus] = useState(null);
  const [leftWidth, setLeftWidth] = useState(50);
  const [code, setCode] = useState("");
  const [consoleOutput, setConsoleOutput] = useState("");
  const [allSubmissions, setAllSubmissions] = useState(null);

  useEffect(() => {
    const fetchProblemData = async () => {
      try {
        setLoading(true);
        if (!problemId) {
          console.error("No problem ID provided!");
          return;
        }
        const response = await problemService.getSingleProblem(problemId);
        setProblemData(response.data.data);

        if (response.data.data.starterCode) {
          const starterCode =
            response.data.data.starterCode.javascript ||
            response.data.data.starterCode.python ||
            code;
          setCode(starterCode);
        }
      } catch (error) {
        console.error("Error fetching problem data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblemData();
  }, [problemId]);

  
  
  const handleRunCode = async (
    code: string,
    problemId: string,
    language: string
  ) => {
    try {
      setIsRunning(true);
      setRunError(null);
      setTestResults([]);
      setConsoleOutput("");

      const response = await problemService.runCode(code, problemId, language);

      console.log("Run code response:", response);

      if (response && response.success) {
        const results = response.testResults || [];
        const status = response.overallStatus || "unknown";
        const consoleOut = response.consoleOutput || "";
        console.log("resss", results);

        setTestResults(results);
        setOverallStatus(status);
        setConsoleOutput(consoleOut);

        if (status === "passed") {
          console.log("All tests passed!");
        }
      } else {
        const errorMessage = response?.message || "Code execution failed";
        setRunError(errorMessage);

        if (response.data?.testResults) {
          setTestResults(response.testResults);
          setOverallStatus(response.overallStatus || "failed");
          setConsoleOutput(response.data?.consoleOutput || "");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async (
    code: string,
    problemId: string,
    language: string
  ) => {
    try {
      setIsRunning(true);
      setRunError(null);
      setTestResults([]);
      setConsoleOutput("");

      const response = await problemService.submitCode(
        code,
        problemId,
        language
      );

      console.log("Run code response:", response);

      if (response && response.success) {
        console.log("hrlrorororo");

        const results = response.testResults || [];
        const status = response.overallStatus || "unknown";
        const consoleOut = response.consoleOutput || "";
        console.log("resss", results);

        setTestResults(results);
        setOverallStatus(status);
        setConsoleOutput(consoleOut);

        if (status === "passed") {
          console.log("All tests passed!");
        }
      } else {
        const errorMessage = response?.message || "Code execution failed";
        setRunError(errorMessage);

        if (response.data?.testResults) {
          setTestResults(response.testResults);
          setOverallStatus(response.overallStatus || "failed");
          setConsoleOutput(response.data?.consoleOutput || "");
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsRunning(false);
    }
  };

  const handleMouseDown = (e: any) => {
    e.preventDefault();
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: any) => {
    const newWidth = (e.clientX / window.innerWidth) * 100;
    setLeftWidth(Math.max(20, Math.min(80, newWidth)));
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  if (loading && !problemData) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center h-64">
          <ShimmerSkeleton />
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <div className="flex h-screen bg-gray-100">
        <div style={{ width: `${leftWidth}%` }} className="h-full">
          <ProblemDetailsComponent
            problemData={problemData}
            loading={loading}
            problemId={problemId}
          />
        </div>

        <div
          className="w-1 bg-gray-300 hover:bg-gray-400 cursor-col-resize transition-colors"
          onMouseDown={handleMouseDown}
        />

        <div
          style={{ width: `${100 - leftWidth}%` }}
          className="flex flex-col h-full"
        >
          <div className="flex-1">
            <CompilerComponent
              problemData={problemData}
              code={code}
              setCode={setCode}
              onRunCode={handleRunCode}
              onSubmitCode={handleSubmitCode}
              loading={isRunning || loading}
            />
          </div>

          <div className="h-64 border-t border-gray-300">
            <ResultComponent
              testResults={testResults}
              loading={isRunning}
              overallStatus={overallStatus}
              error={runError}
              consoleOutput={consoleOutput}
            />
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default SingleProblemPage;
