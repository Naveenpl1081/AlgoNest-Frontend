import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import AnswerComponent from "../../../component/user/AnswerComponent";
import UserLayout from "../../../layouts/UserLayout";
import { communityService } from "../../../service/communityService";

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

interface ApiAnswer {
  _id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  questionId: string;
  userId: {
    _id: string;
    username: string;
    email: string;
  };
  likes?: string[];
  dislikes?: string[];
  __v?: number;
}

interface TransformedAnswer {
  id: string;
  username: string;
  role: string;
  content: string;
  upvotes: number;
  downvotes: number;
  createdAt: Date;
  isBestAnswer?: boolean;
}

interface PaginationData {
  total: number;
  page: number;
  pages: number;
  limit: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const CommunityAnswer = () => {
  const { questionId } = useParams<{ questionId: string }>();
  const location = useLocation();
  const [questionData, setQuestionData] = useState<QuestionData | null>(
    location.state?.questionData || null
  );
  const [loading, setLoading] = useState(!questionData);
  const [answers, setAnswers] = useState<TransformedAnswer[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  
  const fetchAnswers = async (page: number) => {
    if (!questionId) return;

    try {
      const { answers: answersData, pagination: paginationData } =
        await communityService.getAnswersByQuestionId(questionId, page, 4);

      console.log("Fetched answers:", answersData);
      console.log("Pagination:", paginationData);

      if (answersData && Array.isArray(answersData)) {
        const transformedAnswers: TransformedAnswer[] = answersData.map(
          (answer: ApiAnswer) => ({
            id: answer._id,
            username: answer.userId?.username || "Anonymous",
            role: answer.userId?.email || "User",
            content: answer.body,
           
            upvotes: answer.likes?.length || 0,
            downvotes: answer.dislikes?.length || 0,
            createdAt: new Date(answer.createdAt),
            isBestAnswer: false,
          })
        );
        setAnswers(transformedAnswers);
        setPagination(paginationData);
      } else {
        setAnswers([]);
        setPagination(null);
      }
    } catch (error) {
      console.error("Error fetching answers:", error);
      setAnswers([]);
      setPagination(null);
    }
  };

  useEffect(() => {
    if (questionId) {
      if (!questionData) {
        fetchQuestionData();
      }
      fetchAnswers(currentPage);
    }
  }, [questionId, currentPage]); 

  const fetchQuestionData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await communityService.getQuestionById(questionId!);
      if (response?.data) {
        setQuestionData(response.data);
      } else {
        setError("Question not found");
      }
    } catch (error) {
      console.error("Error fetching question details:", error);
      setError("Failed to fetch question details");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async (questionId: string, answerText: string) => {
    if (!answerText.trim()) return;

    try {
      setSubmitting(true);
      const res = await communityService.addAnswer({
        questionId,
        body: answerText,
      });

      console.log("Answer submitted:", res);

      if (res.success || res) {
       
        await fetchQuestionData(); 
       
        setCurrentPage(1);
        await fetchAnswers(1);
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      
      console.error("Failed to submit answer. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

 
  const handleAnswerUpdate = () => {
    
    fetchAnswers(currentPage);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  if (loading) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <div className="text-xl text-white">Loading question...</div>
        </div>
      </UserLayout>
    );
  }

  if (error || !questionData) {
    return (
      <UserLayout>
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
          <div className="text-xl text-red-500">
            {error || "Question not found"}
          </div>
        </div>
      </UserLayout>
    );
  }

  return (
    <UserLayout>
      <AnswerComponent
        questionData={questionData}
        onSubmitAnswer={handleSubmitAnswer}
        answers={answers}
        submitting={submitting}
        pagination={pagination}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onAnswerUpdate={handleAnswerUpdate}
      />
    </UserLayout>
  );
};

export default CommunityAnswer;