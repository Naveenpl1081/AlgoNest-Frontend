import React from "react";
import { SubmitStatus } from "../../models/recruiter";

interface MessageModalProps {
  submitStatus: SubmitStatus;
  setSubmitStatus: React.Dispatch<React.SetStateAction<SubmitStatus | null>>;
}

const MessageModal: React.FC<MessageModalProps> = ({
  submitStatus,
  setSubmitStatus,
}) => {
  return (
    <div className="fixed top-4 right-4 z-50 max-w-md">
      <div
        className={`p-4 rounded-lg border shadow-lg ${
          submitStatus.type === "success"
            ? "bg-green-900/90 border-green-500 text-green-100"
            : "bg-red-900/90 border-red-500 text-red-100"
        }`}
      >
        <div className="flex items-start space-x-2">
          <div
            className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
              submitStatus.type === "success" ? "bg-green-400" : "bg-red-400"
            }`}
          ></div>
          <div className="flex-1">
            <span className="font-medium text-sm">{submitStatus.message}</span>
            <button
              onClick={() => setSubmitStatus(null)}
              className="ml-2 text-xs opacity-70 hover:opacity-100 underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageModal;
