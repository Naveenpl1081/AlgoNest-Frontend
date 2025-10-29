import React, { useState } from "react";
import { X } from "lucide-react";

interface InterviewResultModalProps {
  isOpen: boolean;
  candidateName: string;
  candidateEmail: string;
  jobTitle: string;
  onClose: () => void;
  onSend: (resultData: { result: string; message: string }) => void;
}

const InterviewResultModal: React.FC<InterviewResultModalProps> = ({
  isOpen,
  candidateName,
  candidateEmail,
  jobTitle,
  onClose,
  onSend,
}) => {
  const [result, setResult] = useState<"selected" | "rejected" | "">("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ result?: string; message?: string }>({});

  if (!isOpen) return null;

  const handleSubmit = () => {
    const newErrors: { result?: string; message?: string } = {};
    
    if (!result) {
      newErrors.result = "Please select a result";
    }
    
    if (!message.trim()) {
      newErrors.message = "Please enter a message";
    } else if (message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSend({ result, message: message.trim() });
    
    setResult("");
    setMessage("");
    setErrors({});
  };

  const handleClose = () => {
    setResult("");
    setMessage("");
    setErrors({});
    onClose();
  };

  const getResultTemplate = (resultType: "selected" | "rejected") => {
    if (resultType === "selected") {
      return `Dear ${candidateName},

Congratulations! We are pleased to inform you that you have been selected for the position of ${jobTitle}.

We were impressed by your skills and experience during the interview. Our HR team will contact you soon with the next steps.

Welcome aboard!

Best regards,
Recruitment Team`;
    } else {
      return `Dear ${candidateName},

Thank you for taking the time to interview for the position of ${jobTitle}.

After careful consideration, we have decided to move forward with other candidates whose qualifications more closely match our current needs.

We appreciate your interest in our company and wish you the best in your job search.

Best regards,
Recruitment Team`;
    }
  };

  const handleResultChange = (value: "selected" | "rejected") => {
    setResult(value);
    setMessage(getResultTemplate(value));
    setErrors({});
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white">Send Interview Result</h2>
            <p className="text-sm text-gray-400 mt-1">
              To: {candidateEmail}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="bg-gray-700 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Candidate:</span>
              <span className="text-white font-medium">{candidateName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Position:</span>
              <span className="text-white font-medium">{jobTitle}</span>
            </div>
          </div>

          <div>
            <label className="block text-white font-medium mb-3">
              Interview Result <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleResultChange("selected")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  result === "selected"
                    ? "border-green-500 bg-green-500/20 text-green-400"
                    : "border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500"
                }`}
              >
                <div className="text-lg font-semibold">✓ Selected</div>
                <div className="text-sm mt-1 opacity-80">
                  Candidate passed the interview
                </div>
              </button>

              <button
                type="button"
                onClick={() => handleResultChange("rejected")}
                className={`p-4 rounded-lg border-2 transition-all ${
                  result === "rejected"
                    ? "border-red-500 bg-red-500/20 text-red-400"
                    : "border-gray-600 bg-gray-700 text-gray-300 hover:border-gray-500"
                }`}
              >
                <div className="text-lg font-semibold">✗ Rejected</div>
                <div className="text-sm mt-1 opacity-80">
                  Candidate did not meet requirements
                </div>
              </button>
            </div>
            {errors.result && (
              <p className="text-red-500 text-sm mt-2">{errors.result}</p>
            )}
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Message to Candidate <span className="text-red-500">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                setErrors({ ...errors, message: undefined });
              }}
              placeholder="Enter your message here..."
              className={`w-full px-4 py-3 bg-gray-700 border ${
                errors.message ? "border-red-500" : "border-gray-600"
              } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none`}
              rows={12}
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-2">{errors.message}</p>
            )}
            <p className="text-gray-400 text-sm mt-2">
              {message.length} characters
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className={`px-6 py-2 rounded-lg transition-colors ${
                result === "selected"
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : result === "rejected"
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              Send Result Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewResultModal;