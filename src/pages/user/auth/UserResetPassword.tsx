// pages/user/UserResetPassword.tsx

import React from 'react';
import ResetPassword from '../../../component/auth/ResetPassword';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from "react-toastify";
import { userAuthService } from "../../../service/userAuth";

const UserResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email;

  const handleResetSubmit = async (password: string, confirmPassword: string) => {
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      const res = await userAuthService.resetPassword(email, password);
      if (res.success) {
        toast.success(res.message);
        navigate("/user/login");
      } else {
        toast.error(res.message || "Reset failed. Try again.");
      }
    } catch (error) {
      console.log(error)
      toast.error("Something went wrong.");
    }
  };

  return <ResetPassword role="USER" auth="Login" onSubmit={handleResetSubmit} />;
};

export default UserResetPassword;
