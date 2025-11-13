import React, { useEffect, useState } from "react";
import Table from "../common/Table";
import { IProblem, Column } from "../../types/component.types";
import { problemService } from "../../service/problemService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Play, Trophy } from "lucide-react";
import { aiAuthService } from "../../service/AiService";
import { SubscriptionModal } from "./SubscriptionModal";
interface ProblemListProps {
  searchTerm: string;
  statusFilter: string;
}

const ProblemList: React.FC<ProblemListProps> = ({
  searchTerm,
  statusFilter,
}) => {
  const [problems, setProblems] = useState<IProblem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchProblems = async () => {
    try {
      setLoading(true);
      const response = await problemService.getProblems({
        visible: true,
        query: searchTerm,
        difficulty: statusFilter,
      });
      if (response.success) {
        setProblems(response.data);
      } else {
        toast.error(response.message || "Failed to fetch problems");
      }
    } catch (error) {
      console.error("Error fetching problems:", error);
      toast.error("Failed to load problems");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchProblems();
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, statusFilter]);

  useEffect(() => {
    const handler = setTimeout(() => {
      fetchProblems();
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, statusFilter]);

  const handleProblemClick = async (problemId: string, isPremium: boolean) => {
    if (isPremium) {
      const response = await aiAuthService.checkBasic();

      if (response.data.success) {
        navigate(`/user/singleproblem/${problemId}`);
      } else {
        setIsModalOpen(true);
      }
    } else {
      navigate(`/user/singleproblem/${problemId}`);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-400 bg-green-400/10";
      case "medium":
        return "text-yellow-400 bg-yellow-400/10";
      case "hard":
        return "text-red-400 bg-red-400/10";
      default:
        return "text-gray-300 bg-gray-500/10";
    }
  };

  const columns: Column<IProblem>[] = [
    {
      key: "serial",
      label: "#",
      render: (problem, index) => (
        <span className="text-slate-300 bg-slate-700/50 px-2 py-1 rounded text-sm">
          {problem.problemId}
        </span>
      ),
    },
    {
      key: "title",
      label: "Problem Title",
      render: (problem) => (
        <button
          onClick={() => handleProblemClick(problem._id, problem.isPremium)}
          className="text-cyan-400 hover:text-cyan-300 font-semibold text-sm transition duration-200 hover:underline"
        >
          {problem.title}
        </button>
      ),
    },
    {
      key: "difficulty",
      label: "Difficulty",
      render: (problem) => (
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${getDifficultyColor(
            problem.difficulty
          )}`}
        >
          {problem.difficulty}
        </span>
      ),
    },
    {
      key: "category",
      label: "Category",
      render: (problem) => (
        <span className="text-slate-300 bg-slate-700/50 px-2 py-1 rounded text-sm">
          {problem.category?.name || "General"}
        </span>
      ),
    },
    {
      key: "isPremium",
      label: "Access",
      render: (problem) => (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${
            problem.isPremium
              ? "text-amber-400 bg-amber-400/10"
              : "text-green-400 bg-green-400/10"
          }`}
        >
          {problem.isPremium ? <Trophy size={12} /> : null}
          {problem.isPremium ? "Premium" : "Free"}
        </span>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (problem) => (
        <button
          onClick={() => handleProblemClick(problem._id, problem.isPremium)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition duration-200 flex items-center gap-2"
        >
          <Play size={16} />
          Solve
        </button>
      ),
    },
  ];

  // Loading skeleton UI
  const LoadingSkeleton = () => (
    <div className="space-y-4 p-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="animate-pulse bg-slate-800 rounded-lg p-4">
          <div className="flex items-center justify-between space-x-4">
            <div className="h-4 w-6 bg-slate-700 rounded"></div>
            <div className="h-4 w-32 bg-slate-700 rounded"></div>
            <div className="h-4 w-20 bg-slate-700 rounded"></div>
            <div className="h-4 w-24 bg-slate-700 rounded"></div>
            <div className="h-8 w-24 bg-slate-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden">
        {loading ? (
          <LoadingSkeleton />
        ) : problems.length === 0 ? (
          <div className="text-center py-12">
            <Trophy className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-400 mb-2">
              No Problems Found
            </h3>
            <p className="text-slate-500">
              Check back later for new challenges!
            </p>
          </div>
        ) : (
          <Table
            data={problems}
            columns={columns}
            currentPage={1}
            pageSize={10}
          />
        )}
        {isModalOpen && (
          <SubscriptionModal
            isOpen={true}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ProblemList;
