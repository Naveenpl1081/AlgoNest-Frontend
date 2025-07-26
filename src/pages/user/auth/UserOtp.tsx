import React from 'react';
import Otp from '../../../component/auth/Otp';
import { userAuthService } from '../../../service/userAuth';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const UserOtp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;
  const purpose = location.state?.purpose || "REGISTRATION"; 

  const handleOtpSubmit = async (otp: string) => {
    try {
      const response = await userAuthService.verifyOtp(otp, email, purpose);
      if (response.success) {
        toast.success(response.message);

        if (purpose === "FORGOT_PASSWORD") {
          navigate("/user/reset-password", { state: { email } });
        } else {
          navigate("/user/login");
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
      const response = await userAuthService.resendOtp(email);
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

  return <Otp role="USER" auth="Signup" onSubmit={handleOtpSubmit} onResend={handleResendOtp} />;
};

export default UserOtp;
