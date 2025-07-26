// pages/user/UserForgotPassword.tsx
import React from 'react';
import ForgotePassword from '../../../component/auth/ForgotePassword';
import { userAuthService } from "../../../service/userAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const UserForgotPassword: React.FC = () => {
  const navigate = useNavigate();

  const handleForgotSubmit = async (email: string) => {
    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    const res = await userAuthService.checkUserExists(email);

    if (res.success) {
      toast.success("User exists. Please set a new password.");
      navigate("/user/otp", { state: { email,purpose: "FORGOT_PASSWORD" } });
    } else {
      toast.error(res.message || "User not found.");
    }
  };

  return (
    <ForgotePassword
      role="USER"
      auth="Login"
      onSubmit={handleForgotSubmit}
    />
  );
};

export default UserForgotPassword;
