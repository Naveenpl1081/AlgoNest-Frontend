import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CompilarComponent from "../../../component/user/CompilarComponent";
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
  const [leftWidth, setLeftWidth] = useState(50);
  const [code, setCode] = useState(`var twoSum = function(nums, target) {
    for(let i = 0; i < nums.length; i++) {
        for(let j = i + 1; j < nums.length; j++) {
            if(nums[i] + nums[j] === target) return [i, j]
        }
    }
};`);

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
      } catch (error) {
        console.error("Error fetching problem data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProblemData();
  }, [problemId]);

  const handleRunCode = async (code:string,problemId:string,language:string) => {
    try {
      const response=await problemService.runCode({code,problemId,language})
      console.log(response)
    } catch (error) {
      console.error("Failed to run code:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitCode = async () => {};

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
        {/* Left Panel - Problem Details */}
        <div style={{ width: `${leftWidth}%` }} className="h-full">
          <ProblemDetailsComponent
            problemData={problemData}
            loading={loading}
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
            <CompilarComponent
              problemData={problemData}
              code={code}
              setCode={setCode}
              onRunCode={handleRunCode}
              onSubmitCode={handleSubmitCode}
              loading={loading}
            />
          </div>
          <div className="h-64 border-t border-gray-300">
            <ResultComponent testResults={testResults} loading={loading} />
          </div>
        </div>
      </div>
    </UserLayout>
  );
};

export default SingleProblemPage;
