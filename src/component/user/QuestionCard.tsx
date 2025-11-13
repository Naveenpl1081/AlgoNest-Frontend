import React from 'react';
import { formatDistanceToNow } from 'date-fns';

interface Question {
  _id: string;
  userId: string;
  title: string;
  description: string;
  tags: string[];
  upvotes: number;
  downvotes: number;
  userDetails:{
    username:string,
  },
  answersCount: number;
  createdAt: string;
  updatedAt: string;
}

interface QuestionCardProps {
  question: Question;
  isHighlighted?: boolean;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, isHighlighted }) => {

    console.log("questiosn from card",question)
  const formatDate = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return date;
    }
  };

  return (
    <div
      className={`rounded-xl p-6 transition-all duration-300 hover:scale-[1.02] ${
        isHighlighted
          ? 'bg-gradient-to-br from-slate-800 to-slate-700 border-2 border-blue-500 shadow-xl shadow-blue-500/20'
          : 'bg-slate-800/80 border border-slate-700 hover:border-slate-600'
      }`}
    >

      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold">
          {question.userDetails?.username.charAt(0)}
        </div>
        <span className="text-gray-300 font-medium">{question.userDetails?.username}</span>
      </div>

     
      <h3 className="text-xl font-bold text-white mb-3 hover:text-blue-400 cursor-pointer transition-colors">
        {question.title}
      </h3>

      
      <p className="text-gray-400 mb-4 line-clamp-2">{question.description}</p>

    
      <div className="flex flex-wrap gap-2 mb-4">
        {question.tags.map((tag, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-slate-700 text-gray-300 rounded-md text-sm hover:bg-slate-600 cursor-pointer transition-colors"
          >
            {tag}
          </span>
        ))}
      </div>


      <div className="flex justify-between items-center text-sm text-gray-400">
        <div className="flex gap-4">
          <span>Votes: {question.upvotes - question.downvotes}</span>
          <span>Answers: {question.answersCount}</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span>Asked: {formatDate(question.createdAt)}</span>
          <span>Modified: {formatDate(question.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;