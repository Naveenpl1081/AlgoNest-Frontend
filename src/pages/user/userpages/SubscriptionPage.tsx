// src/pages/SubscriptionSuccess.tsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../../config/axios.config";
import { USER_API } from "../../../utils/apiRoutes";

const SubscriptionSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState(false);
  
  const queryParams = new URLSearchParams(location.search);
  const success = queryParams.get("success");
  const sessionId = queryParams.get("session_id");

  useEffect(() => {
    const verifyPayment = async () => {
      if (success === "true" && sessionId) {
        try {
          setIsVerifying(true);
          const response = await axiosInstance.post(
            `${USER_API}/verify-payment/${sessionId}`
          );
          console.log("Payment verified:", response.data);
          setIsVerifying(false);
        } catch (err) {
          console.error(" Error verifying payment:", err);
          setVerificationError(true);
          setIsVerifying(false);
        }
      } else {
        setIsVerifying(false);
      }
    };

    verifyPayment();
  }, [success, sessionId]);

  const handleNavigateToProfile = () => {
    
    navigate("/user/profile", { 
      state: { showSubscriptionSuccess: true } 
    });
  };

  
  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          </div>
          <h2 className="mt-8 text-2xl font-semibold text-white">
            Verifying Your Payment
          </h2>
          <p className="mt-2 text-gray-400">Please wait a moment...</p>
        </div>
      </div>
    );
  }

  // Success state
  if (success === "true" && !verificationError) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        <div className="max-w-md w-full">
          {/* Success Card */}
          <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center">
                  <svg
                    className="w-12 h-12 text-green-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                {/* Animated ring */}
                <div className="absolute inset-0 w-24 h-24 border-4 border-green-500/30 rounded-full animate-ping"></div>
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-white mb-3">
                Payment Successful!
              </h1>
              <p className="text-gray-400 text-lg">
                Your subscription is now active. Welcome to premium!
              </p>
            </div>

            {/* Details */}
            <div className="bg-slate-900/50 rounded-lg p-4 mb-6 border border-slate-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Transaction ID:</span>
                <span className="text-gray-300 font-mono">
                  {sessionId?.slice(0, 16)}...
                </span>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleNavigateToProfile}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/30"
            >
              Go to Profile
            </button>

            {/* Additional Info */}
            <p className="text-center text-gray-500 text-sm mt-6">
              A confirmation email has been sent to your inbox
            </p>
          </div>

    
        </div>
      </div>
    );
  }

  // Failure state
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-md w-full">
        {/* Error Card */}
        <div className="bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
          {/* Error Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center">
              <svg
                className="w-12 h-12 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>

          {/* Error Message */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-3">
              Payment Failed
            </h1>
            <p className="text-gray-400 text-lg">
              {verificationError
                ? "We couldn't verify your payment. Please contact support."
                : "Your payment could not be processed. Please try again."}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate("/pricing")}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-blue-500/30"
            >
              Try Again
            </button>
            <button
              onClick={handleNavigateToProfile}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3.5 px-6 rounded-lg transition-all duration-200"
            >
              Go to Profile
            </button>
          </div>

          {/* Additional Info */}
          <p className="text-center text-gray-500 text-sm mt-6">
            No charges were made to your account
          </p>
        </div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-sm mt-6">
          Need assistance?{" "}
          <a href="/support" className="text-blue-400 hover:text-blue-300 underline">
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;