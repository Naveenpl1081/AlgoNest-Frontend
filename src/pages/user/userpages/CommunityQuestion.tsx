import React from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionComponent from '../../../component/user/QuestionComponent';
import UserLayout from '../../../layouts/UserLayout';
import { communityService } from '../../../service/communityService';

interface FormData {
  title: string;
  description: string;
  tags: string[];
  isDuplicate: boolean;
}

const CommunityQuestion: React.FC = () => {
  const navigate = useNavigate();

  const handleSubmit = async (formData: FormData): Promise<void> => {
    try {
      console.log('Submitting question:', formData);
      const response = await communityService.addQuestion(formData);
      
    
      navigate('/user/community');
    } catch (error) {
      console.error('Error submitting question:', error);
      alert('Failed to submit question. Please try again.');
    }
  };

  return (
    <div>
      <UserLayout>
        <QuestionComponent handleSubmit={handleSubmit} />
      </UserLayout>
    </div>
  );
};

export default CommunityQuestion;