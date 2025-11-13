import React from 'react';
import { useNavigate } from 'react-router-dom';
import GetQuestions from '../../../component/user/GetQuestions';
import UserLayout from '../../../layouts/UserLayout';
import { communityService } from '../../../service/communityService';

const CommunityPage = () => {
  const navigate = useNavigate();

  const handleSubmit = async (params: {
    page: number;
    limit: number;
    search?: string;
    tags?: string;
  }) => {
    try {
      const response = await communityService.getAllQuestions(params);
      return response;
    } catch (error) {
      console.error('Error fetching questions:', error);
      return {
        success: false,
        message: 'Failed to fetch questions',
      };
    }
  };

  const getOneQuestion = async (questionId: string) => {
    try {
      const response = await communityService.getQuestionById(questionId);
      if (response?.data) {
        console.log('Question details fetched:', response.data);
      }
      navigate(`/user/answerpage/${questionId}`, {
        state: { questionData: response.data }
      });
    } catch (error) {
      console.error('Error fetching question details:', error);
      return {
        success: false,
        message: 'Failed to fetch question details',
      };
    }
  };

  return (
    <UserLayout>
      <GetQuestions handleSubmit={handleSubmit} onQuestionClick={getOneQuestion} />
    </UserLayout>
  );
};

export default CommunityPage;