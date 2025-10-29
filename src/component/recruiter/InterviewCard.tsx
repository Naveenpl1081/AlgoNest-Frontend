import React from 'react';
import { Video, X, Calendar, Clock, User, Briefcase, CheckCircle } from 'lucide-react';

interface InterviewCardProps {
  interview: {
    _id: string;
    candidateId: {
      _id: string;
      username: string;
      email: string;
    } | string;
    jobId?: {
      _id: string;
      jobrole: string;
    } | string;
    date: string;
    time: string;
    duration: number;
    instructions?: string;
    roomId: string;
    status: string;
    createdAt: string;
  };
  role: string;
  onStartCall: (roomId: string) => void;
  onCancel: (interviewId: string) => void;
  onFinished: (interviewId: string) => void;
  onReschedule: (interviewId: string) => void;
}

const InterviewCard: React.FC<InterviewCardProps> = ({
  interview,
  onStartCall,
  onCancel,
  onFinished,
  onReschedule,
  role,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'scheduled':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/50';
      case 'cancelled':
        return 'bg-red-500/20 text-red-400 border-red-500/50';
      case 'rescheduled':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/50';
    }
  };

  const isUpcoming = () => {
    const interviewDateTime = new Date(`${interview.date} ${interview.time}`);
    return interviewDateTime > new Date();
  };

  const getCandidateName = () => {
    console.log("candidate type", typeof interview.candidateId);
    if (typeof interview.candidateId === 'object') {
      return interview.candidateId.username;
    }
    return 'N/A';
  };

  const getJobRole = () => {
    if (typeof interview.jobId === 'object') {
      return interview.jobId.jobrole;
    }
    return null;
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-md rounded-xl border border-slate-700/50 overflow-hidden hover:border-slate-600 transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/50">

      <div className="bg-gradient-to-r from-slate-700/50 to-slate-800/50 p-4 border-b border-slate-700/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Video className="w-5 h-5 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white text-lg">
              Interview #{interview._id.slice(-6)}
            </h3>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
              interview.status
            )}`}
          >
            {interview.status.charAt(0).toUpperCase() + interview.status.slice(1)}
          </span>
        </div>
      </div>

      
      <div className="p-4 space-y-3">
     
        <div className="flex items-center gap-3 text-gray-300">
          <Calendar className="w-4 h-4 text-blue-400" />
          <span className="text-sm">{formatDate(interview.date)}</span>
        </div>

        <div className="flex items-center gap-3 text-gray-300">
          <Clock className="w-4 h-4 text-blue-400" />
          <span className="text-sm">
            {interview.time} • {interview.duration} mins
          </span>
        </div>

        <div className="flex items-center gap-3 text-gray-300">
          <User className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-white">
            {getCandidateName()}
          </span>
        </div>

        {getJobRole() && (
          <div className="flex items-center gap-3 text-gray-300">
            <Briefcase className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-white">
              {getJobRole()}
            </span>
          </div>
        )}

        {interview.instructions && (
          <div className="mt-3 p-3 bg-slate-700/30 rounded-lg">
            <p className="text-xs text-gray-400 mb-1 font-medium">Instructions:</p>
            <p className="text-sm text-gray-300 line-clamp-2">
              {interview.instructions}
            </p>
          </div>
        )}
      </div>

   
      <div className="p-4 bg-slate-900/30 border-t border-slate-700/50">
        {interview.status.toLowerCase() === 'scheduled' && (
          <div className="space-y-2">
           
            <button
              onClick={() => onStartCall(interview.roomId)}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white px-4 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg shadow-blue-900/30 hover:shadow-blue-900/50"
            >
              <Video className="w-4 h-4" />
              Start Call
            </button>

         
            {role === "recruiter" && (
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => onReschedule(interview._id)}
                  className="flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-gray-300 hover:text-white px-3 py-2 rounded-lg font-medium transition-all duration-200 border border-slate-600/50 hover:border-slate-500"
                >
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Reschedule</span>
                </button>

                <button
                  onClick={() => onFinished(interview._id)}
                  className="flex items-center justify-center gap-2 bg-green-600/20 hover:bg-green-600/30 text-green-400 hover:text-green-300 px-3 py-2 rounded-lg font-medium transition-all duration-200 border border-green-600/50 hover:border-green-500"
                  title="Mark as Finished"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm">Finish</span>
                </button>

                <button
                  onClick={() => onCancel(interview._id)}
                  className="flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 px-3 py-2 rounded-lg font-medium transition-all duration-200 border border-red-600/50 hover:border-red-500"
                >
                  <X className="w-4 h-4" />
                  <span className="text-sm">Cancel</span>
                </button>
              </div>
            )}
          </div>
        )}

        {interview.status.toLowerCase() === 'completed' && (
          <div className="flex items-center justify-center gap-2 py-2 text-green-400 font-medium">
            <CheckCircle className="w-5 h-5" />
            Interview Completed
          </div>
        )}

        {interview.status.toLowerCase() === 'cancelled' && (
          <div className="flex items-center justify-center gap-2 py-2 text-red-400 font-medium">
            <X className="w-5 h-5" />
            Interview Cancelled
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewCard;