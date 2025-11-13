import React, { useState, useEffect, useRef } from "react";
import { Search } from "../common/Search";
import Pagination from "../common/Pagination";
import { DropdownFilter } from "../common/DropDownFilter";
import QuestionCard from "./QuestionCard";
import { Link } from "react-router-dom";

interface Question {
  _id: string;
  userId: string;
  title: string;
  description: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  userDetails: {
    username: string;
  };
  answersCount: number;
  createdAt: string;
  updatedAt: string;
}

interface GetQuestionsProps {
  handleSubmit: (params: {
    page: number;
    limit: number;
    search?: string;
    tags?: string;
  }) => Promise<any>;
  onQuestionClick: (questionId: string) => Promise<any>;
}

const GetQuestions: React.FC<GetQuestionsProps> = ({
  handleSubmit,
  onQuestionClick,
}) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 4;
  const isInitialMount = useRef(true);

  const tagOptions = [
    { value: "javascript", label: "JavaScript" },
    { value: "react", label: "React" },
    { value: "nodejs", label: "Node.js" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "kubernetes", label: "Kubernetes" },
    { value: "google-cloud-platform", label: "Google Cloud Platform" },
  ];

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit,
      };

      if (search.trim()) {
        params.search = search.trim();
      }

      if (selectedTag) {
        params.tags = selectedTag;
      }

      const response = await handleSubmit(params);

      if (response?.success) {
        setQuestions(response.data.questions || []);
        setTotalPages(response.data.pagination.pages || 1);
        setTotal(response.data.pagination.total || 0);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  // Combined effect for search, tag changes, and pagination
  useEffect(() => {
    // Skip the debounce on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchQuestions();
      return;
    }

    // Debounce only for search and tag changes
    const debounceTimer = setTimeout(() => {
      setCurrentPage(1);
      fetchQuestions();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [search, selectedTag]);

  // Separate effect for page changes only
  useEffect(() => {
    if (!isInitialMount.current) {
      fetchQuestions();
    }
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleGetOneQuestion = async (questionId: string) => {
    try {
      await onQuestionClick(questionId);
    } catch (error) {
      console.error("Error handling question click:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Ask And Learn
          </h1>
          <Link to="/user/communityquestion">
            <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl">
              Ask Question
            </button>
          </Link>
        </div>

        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 w-full">
              <Search
                value={search}
                onChange={setSearch}
                placeholder="Search questions..."
                className="w-full"
              />
            </div>
            <DropdownFilter
              label=""
              options={tagOptions}
              value={selectedTag}
              onChange={setSelectedTag}
              className="w-full md:w-48"
            />
          </div>
        </div>

        {!loading && (
          <div className="mb-4 text-gray-400">
            Found {total} question{total !== 1 ? "s" : ""}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
          </div>
        ) : questions.length > 0 ? (
          <div className="space-y-6">
            {questions.map((question) => (
              <div
                key={question._id}
                onClick={() => handleGetOneQuestion(question._id)}
                className="cursor-pointer"
              >
                <QuestionCard
                  question={question}
                  isHighlighted={false}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No questions found</p>
            <p className="text-gray-500 mt-2">
              Try adjusting your search or filters
            </p>
          </div>
        )}

        {!loading && questions.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
};

export default GetQuestions;