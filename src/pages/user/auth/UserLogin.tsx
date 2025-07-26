import React from "react";
import Login from "../../../component/auth/Login";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userAuthService } from "../../../service/userAuth";
import { LoginFormData } from "../../../types/auth.types";
import Cookies from "js-cookie";

const UserLogin: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSubmit = async (formData: LoginFormData) => {
    try {
      console.log("Login form data:", formData);

      const response = await userAuthService.login(formData);
      console.log("Login response:", response);
      if (response.success) {
        const inOneHour = new Date(new Date().getTime() + 60 * 60 * 1000);
        Cookies.set("user_access_token", response.access_token, {
          expires: inOneHour,
        });

        toast.success(response.message || "Login successful!");
        navigate("/user/home");
      } else {
        toast.error(response.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Something went wrong.");
    }
  };

  return <Login role="USER" auth="Login" onSubmit={handleLoginSubmit} />;
};

export default UserLogin;
