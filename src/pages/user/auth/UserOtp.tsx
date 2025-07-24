import React from 'react';
import Otp from '../../../component/auth/Otp';
import { userAuthService } from '../../../service/userAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

const UserOtp: React.FC = () => {
  const navigate = useNavigate();

  const handleOtpSubmit = async (otp: string) => {
    try {
      const response = await userAuthService.verifyOtp(otp);
      console.log("OTP verify response:", response);

      if (response.success) {
        toast.success(response.message);
        navigate("/user/login"); 
      } else {
        toast.error(response.message);
      }
    } catch (err) {
      console.error(err);
      alert(" OTP Verification failed. Try again.");
    }
  };

  return <Otp role="USER" auth="Signup" onSubmit={handleOtpSubmit} />;
};

export default UserOtp;
