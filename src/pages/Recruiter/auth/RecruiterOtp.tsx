import React from 'react';
import Otp from '../../../component/auth/Otp';
import { recruiterAuthService } from '../../../service/RecruiterAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const UserOtp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const purpose = location.state?.purpose || "REGISTRATION"; 

  const handleOtpSubmit = async (otp: string) => {
    try {
      const response = await recruiterAuthService.verifyOtp(otp, email, purpose);
      if (response.success) {
        toast.success(response.message);

        if (purpose === "FORGOT_PASSWORD") {
          navigate("/recruiter/reset-password", { state: { email } });
        } else {
          navigate("/recruiter/login");
        }
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      console.error(err);
      toast.error("OTP Verification failed. Try again.");
    }
  };

  const handleResendOtp = async () => {
    try {
      const response = await recruiterAuthService.resendOtp(email);
      if (response.success) {
        toast.success(response.message || "OTP resent successfully!");
      } else {
        toast.error(response.message || "Failed to resend OTP.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error resending OTP");
    }
  };

  return <Otp role="RECRUITER" auth="Signup" onSubmit={handleOtpSubmit} onResend={handleResendOtp} />;
};

export default UserOtp;
