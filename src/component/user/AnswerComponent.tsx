import React, { useState } from "react";
import { format } from "date-fns";
import { communityService } from "../../service/communityService";

interface QuestionData {
  _id: string;
  userDetails: {
    _id: string;
    username: string;
    email: string;
  };
  title: string;
  description: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  answersCount: number;
  createdAt: Date;
  updatedAt: Date;
}

interface PaginationData {
  total: number;
  page: number;
  pages: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface Answer {
  id: string;
  username: string;
  role: string;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  isBestAnswer?: boolean;
}

interface AnswerComponentProps {
  questionData: QuestionData;
  onSubmitAnswer: (questionId: string, answerText: string) => Promise<void>;
  answers: Answer[];
  submitting?: boolean;
  pagination: PaginationData | null;
  currentPage: number;
  onPageChange: (page: number) => void;
 
  onAnswerUpdate: () => void;
}


const ThumbsUpIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
    />
  </svg>
);

const ThumbsDownIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
    />
  </svg>
);

const MessageSquareIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

const ClockIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const TrophyIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M5.166 2.621v.858c-1.035.148-2.059.33-3.071.543a.75.75 0 00-.584.859 6.753 6.753 0 006.138 5.6 6.73 6.73 0 002.743 1.346A6.707 6.707 0 019.279 15H8.54c-1.036 0-1.875.84-1.875 1.875V19.5h-.75a2.25 2.25 0 00-2.25 2.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75 2.25 2.25 0 00-2.25-2.25h-.75v-2.625c0-1.036-.84-1.875-1.875-1.875h-.739a6.706 6.706 0 01-1.112-3.173 6.73 6.73 0 002.743-1.347 6.753 6.753 0 006.139-5.6.75.75 0 00-.585-.858 47.077 47.077 0 00-3.07-.543V2.62a.75.75 0 00-.658-.744 49.22 49.22 0 00-6.093-.377c-2.063 0-4.096.128-6.093.377a.75.75 0 00-.657.744z" />
  </svg>
);

const ChevronLeftIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

const ChevronRightIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

const AnswerComponent: React.FC<AnswerComponentProps> = ({
  questionData,
  onSubmitAnswer,
  answers,
  submitting = false,
  pagination,
  currentPage,
  onPageChange,

  onAnswerUpdate, 
}) => {
  const [answerText, setAnswerText] = useState<string>("");

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!answerText.trim()) return;

    await onSubmitAnswer(questionData._id, answerText);
    setAnswerText("");
  };

  const handleLike = async (answerId: string) => {
    try {
      const response = await communityService.handleLike(answerId);
      console.log("respo", response);
      
      onAnswerUpdate(); 
    } catch (error) {
        console.error("Error liking answer:", error);
    }
  };
  
  const handleDislike = async (answerId: string) => {
    try {
      const response = await communityService.handledisLike(answerId);
      console.log("respoh", response);
    
      onAnswerUpdate(); 
    } catch (error) {
        console.error("Error disliking answer:", error);
    }
  };

  const formatDate = (date: Date): string => {
    try {
      return format(new Date(date), "MMM dd, yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const getInitials = (name: string): string => {
    if (!name) return "??";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderPagination = () => {
    if (!pagination || pagination.pages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.pages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex justify-center items-center gap-2 mb-10">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!pagination.hasPrevPage}
          className="w-10 h-10 rounded-xl font-bold transition-all bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 border border-slate-700/50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>

        {startPage > 1 && (
          <>
            <button
              onClick={() => onPageChange(1)}
              className="w-10 h-10 rounded-xl font-bold transition-all bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 border border-slate-700/50"
            >
              1
            </button>
            {startPage > 2 && <span className="text-slate-500 px-2">...</span>}
          </>
        )}

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded-xl font-bold transition-all ${
              page === currentPage
                ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg shadow-emerald-500/30 scale-110"
                : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 border border-slate-700/50"
            }`}
          >
            {page}
          </button>
        ))}

        {endPage < pagination.pages && (
          <>
            {endPage < pagination.pages - 1 && (
              <span className="text-slate-500 px-2">...</span>
            )}
            <button
              onClick={() => onPageChange(pagination.pages)}
              className="w-10 h-10 rounded-xl font-bold transition-all bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 border border-slate-700/50"
            >
              {pagination.pages}
            </button>
          </>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className="w-10 h-10 rounded-xl font-bold transition-all bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 border border-slate-700/50 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Question Card */}
        <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-slate-700/50 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-start gap-6 mb-8">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-emerald-500/30">
                  {getInitials(questionData.userDetails.username)}
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-slate-900"></div>
              </div>

              <div className="flex-1">
                <h3 className="text-white font-bold text-xl mb-1">
                  {questionData.userDetails.username}
                </h3>
                <p className="text-slate-400 text-sm mb-1">
                  {questionData.userDetails.email}
                </p>
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <ClockIcon className="w-4 h-4" />
                  <span>Asked {formatDate(questionData.createdAt)}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 justify-end">
                {questionData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-gradient-to-r from-slate-700/80 to-slate-600/80 text-slate-200 rounded-full text-sm font-medium border border-slate-600/50 hover:border-slate-500/50 transition-all"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent mb-6 leading-tight">
              {questionData.title}
            </h1>

            <p className="text-slate-300 text-lg leading-relaxed mb-8">
              {questionData.description}
            </p>

            <div className="flex items-center gap-8 p-4 bg-slate-900/50 rounded-2xl border border-slate-700/30">
              <button className="flex items-center gap-3 text-slate-300 hover:text-emerald-400 transition-all group">
                <div className="p-2 bg-slate-800/50 rounded-xl group-hover:bg-emerald-500/20 transition-all">
                  <ThumbsUpIcon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold">
                    {questionData.upvotes}
                  </div>
                  <div className="text-xs text-slate-500">Upvotes</div>
                </div>
              </button>

              <button className="flex items-center gap-3 text-slate-300 hover:text-red-400 transition-all group">
                <div className="p-2 bg-slate-800/50 rounded-xl group-hover:bg-red-500/20 transition-all">
                  <ThumbsDownIcon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold">
                    {questionData.downvotes}
                  </div>
                  <div className="text-xs text-slate-500">Downvotes</div>
                </div>
              </button>

              <div className="flex items-center gap-3 text-slate-300">
                <div className="p-2 bg-slate-800/50 rounded-xl">
                  <MessageSquareIcon className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="text-sm font-semibold">
                    {pagination?.total || questionData.answersCount}
                  </div>
                  <div className="text-xs text-slate-500">Answers</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Answers Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent flex-1"></div>
            <h2 className="text-3xl font-bold text-white flex items-center gap-3">
              <MessageSquareIcon className="w-8 h-8 text-emerald-400" />
              {pagination?.total || answers.length}{" "}
              {(pagination?.total || answers.length) === 1
                ? "Answer"
                : "Answers"}
            </h2>
            <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent flex-1"></div>
          </div>

          {answers.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquareIcon className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400 text-lg">
                No answers yet. Be the first to answer!
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-6">
                {answers.map((answer) => (
                  <div key={answer.id} className="relative group">
                    <div
                      className={`relative bg-gradient-to-br ${
                        answer.isBestAnswer
                          ? "from-emerald-900/30 to-slate-900/90 border-emerald-500/50"
                          : "from-slate-800/70 to-slate-900/70 border-slate-700/30"
                      } backdrop-blur-xl rounded-2xl p-6 border hover:border-slate-600/50 transition-all shadow-lg`}
                    >
                      {answer.isBestAnswer && (
                        <div className="absolute -top-3 left-6 px-4 py-1 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center gap-2 shadow-lg shadow-emerald-500/30">
                          <TrophyIcon className="w-4 h-4 text-white" />
                          <span className="text-white text-xs font-bold">
                            Best Answer
                          </span>
                        </div>
                      )}

                      <div className="flex gap-5">
                        <div className="flex-shrink-0">
                          <div
                            className={`w-14 h-14 bg-gradient-to-br ${
                              answer.isBestAnswer
                                ? "from-emerald-400 to-cyan-500"
                                : "from-blue-400 to-purple-500"
                            } rounded-xl flex items-center justify-center text-lg font-bold text-white shadow-lg`}
                          >
                            {getInitials(answer.username)}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-white font-bold text-lg mb-1">
                                {answer.username}
                              </h4>
                              <p className="text-slate-400 text-sm mb-2">
                                {answer.role}
                              </p>
                              <div className="flex items-center gap-2 text-slate-500 text-xs">
                                <ClockIcon className="w-3 h-3" />
                                <span>{formatDate(answer.createdAt)}</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-slate-300 leading-relaxed mb-5 text-base whitespace-pre-wrap">
                            {answer.content}
                          </p>

                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => handleLike(answer.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400 rounded-xl transition-all border border-slate-700/50 hover:border-emerald-500/50"
                            >
                              <ThumbsUpIcon className="w-4 h-4" />
                              <span className="font-semibold">
                                {answer.upvotes}
                              </span>
                            </button>

                            <button
                              onClick={() => handleDislike(answer.id)}
                              className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 hover:bg-red-500/20 text-slate-300 hover:text-red-400 rounded-xl transition-all border border-slate-700/50 hover:border-red-500/50"
                            >
                              <ThumbsDownIcon className="w-4 h-4" />
                              <span className="font-semibold">
                                {answer.downvotes}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

    
              {renderPagination()}
            </>
          )}
        </div>

 
        <div className="relative bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-xl rounded-3xl p-8 border border-slate-700/50 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-1 h-8 bg-gradient-to-b from-emerald-400 to-cyan-500 rounded-full"></div>
              <h2 className="text-3xl font-bold text-white">Your Answer</h2>
            </div>

            <p className="text-slate-400 mb-6">
              Share your knowledge and help others. Please provide detailed,
              accurate answers that follow our community guidelines.
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="relative">
                <textarea
                  value={answerText}
                  onChange={(e) => setAnswerText(e.target.value)}
                  placeholder="Write your answer here..."
                  className="w-full h-48 bg-slate-900/70 text-white rounded-2xl p-6 border border-slate-700/50 focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none placeholder:text-slate-500"
                  disabled={submitting}
                />
              </div>

              <div className="flex justify-between items-center">
                <p className="text-slate-500 text-sm">
                  {answerText.length} characters
                  {answerText.length < 10 && answerText.length > 0 && (
                    <span className="text-amber-500 ml-2">
                      (min 10 characters recommended)
                    </span>
                  )}
                </p>

                <button
                  type="submit"
                  disabled={!answerText.trim() || submitting}
                  className={`px-10 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 
      hover:from-emerald-600 hover:to-cyan-600 
      text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl 
      transform hover:scale-105 
      disabled:cursor-not-allowed disabled:transform-none
      ${
        answerText.length < 10
          ? "blur-[1px] brightness-90 pointer-events-none"
          : ""
      }`}
                >
                  {submitting ? "POSTING..." : "POST ANSWER"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnswerComponent;