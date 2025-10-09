import React, { useState, useEffect } from "react";
import { X, Calendar, Clock, FileText } from "lucide-react";
import { IJobApplication } from "../../models/recruiter";

interface InterviewScheduleModalProps {
  isOpen: boolean;
  applicant: IJobApplication | null;
  onClose: () => void;
  onSchedule: (data: InterviewData) => void;
}

interface InterviewData {
  date: string;
  time: string;
  duration: number;
  instructions: string;
}

const InterviewScheduleModal: React.FC<InterviewScheduleModalProps> = ({
  isOpen,
  applicant,
  onClose,
  onSchedule,
}) => {
  const [formData, setFormData] = useState<InterviewData>({
    date: "",
    time: "",
    duration: 30,
    instructions: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof InterviewData, string>>>({});

  useEffect(() => {
    if (isOpen) {
      setFormData({
        date: "",
        time: "",
        duration: 30,
        instructions: "",
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof InterviewData, string>> = {};

    if (!formData.date) {
      newErrors.date = "Date is required";
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        newErrors.date = "Date cannot be in the past";
      }
    }

    if (!formData.time) {
      newErrors.time = "Time is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSchedule(formData);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name as keyof InterviewData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  if (!isOpen) return null;

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-purple-500/20 shadow-2xl rounded-2xl max-w-lg w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-500/20 bg-gradient-to-r from-indigo-600/30 to-purple-600/30">
          <div>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
              Schedule Interview
            </h2>
            <p className="text-sm text-gray-300 mt-1">
              {applicant?.name} - {applicant?.email}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-purple-400 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              <Calendar className="inline mr-2 text-purple-400" size={16} />
              Interview Date *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={getMinDate()}
              className={`w-full px-4 py-2 bg-slate-800 text-white border ${
                errors.date ? "border-red-500" : "border-purple-500/30"
              } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            />
            {errors.date && <p className="text-red-400 text-xs mt-1">{errors.date}</p>}
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              <Clock className="inline mr-2 text-purple-400" size={16} />
              Interview Time *
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-slate-800 text-white border ${
                errors.time ? "border-red-500" : "border-purple-500/30"
              } rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent`}
            />
            {errors.time && <p className="text-red-400 text-xs mt-1">{errors.time}</p>}
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Duration
            </label>
            <select
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-slate-800 text-white border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={45}>45 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
          </div>

          {/* Instructions */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              <FileText className="inline mr-2 text-purple-400" size={16} />
              Instructions
            </label>
            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows={4}
              placeholder="Add any notes or guidelines for the candidate..."
              className="w-full px-4 py-2 bg-slate-800 text-white border border-purple-500/30 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-purple-500/20">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-purple-500/30 text-gray-300 rounded-lg hover:bg-purple-600/20 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all font-medium"
            >
              Schedule Interview
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InterviewScheduleModal;
