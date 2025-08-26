import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import RecruiterPortal from "./RecruiterPortalPage";
import { recruiterAuthService } from "../../../service/RecruiterAuth";

const RecruiterPortalWrapper: React.FC = () => {
  // const location = useLocation();
  // const isVerified = location.state?.isVerified ?? false;
  // const status = location.state?.status ?? null;
  const [isVerified, setisVerified] = useState(false);
  const [status,setStatus] = useState("")

  const fetchRecruiterProfile = async () => {
    let response = await recruiterAuthService.getRecruiterProfile();
    console.log("response from recruiter portal page",response);
    if(response.success){
      setisVerified(response.data.isVerified);
      setStatus(response.data.status);
    }
  };

  useEffect(() => {
    fetchRecruiterProfile();
  }, []);

  console.log("Portal Access =>", { isVerified, status });

  const renderOverlay = () => {
    if (!status && !isVerified) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50">
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 text-center border border-white/20 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-4">
              Verify Your Account
            </h2>
            <p className="text-gray-300 mb-6">
              Please verify your company details to unlock full access.
            </p>
            <button
              onClick={() => (window.location.href = "/recruiter/verify")}
              className="px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-500 hover:to-purple-500 transition-all"
            >
              Verify Now
            </button>
          </div>
        </div>
      );
    }

    if (status === "Pending" && !isVerified) {
      return (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md z-50">
          <div className="bg-white rounded-2xl p-8 text-center shadow-xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Verification in Progress
            </h2>
            <p className="text-gray-600 mb-4">
              Your documents are under review. It may take up to 24 hours.
            </p>
            <p className="text-sm text-gray-500">
              Once approved, you’ll get full access automatically.
            </p>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="relative">
      <div className={isVerified ? "" : "blur-md pointer-events-none"}>
        <RecruiterPortal />
      </div>
      {renderOverlay()}
    </div>
  );
};

export default RecruiterPortalWrapper;
