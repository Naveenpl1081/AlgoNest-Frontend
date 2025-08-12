import React from "react";
import Login from "../../../component/auth/Login";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { recruiterAuthService } from "../../../service/RecruiterAuth";
import { LoginFormData } from "../../../types/auth.types";
import Cookies from "js-cookie";

const RecruiterLogin: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSubmit = async (formData: LoginFormData) => {
    try {
      console.log("Login form data:", formData);

      const response = await recruiterAuthService.login(formData);
      console.log("Login response:", response);
      if (response.success) {
        const inOneHour = new Date(new Date().getTime() + 60 * 60 * 1000);
        Cookies.set("access_token", response.access_token, {
          expires: inOneHour,
        });

        toast.success(response.message || "Login successful!");
        navigate("/recruiter/portal");
      } else {
        toast.error(response.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Something went wrong.");
    }
  };

  return <Login role="RECRUITER" auth="Login" onSubmit={handleLoginSubmit} />;
};

export default RecruiterLogin;
