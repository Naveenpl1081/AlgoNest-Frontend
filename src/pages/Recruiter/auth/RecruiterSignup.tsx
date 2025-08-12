import React from "react";
import Signup from "../../../component/auth/Signup";
import { SignupFormData } from "../../../types/auth.types";
import { recruiterAuthService } from "../../../service/RecruiterAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RecruiterSignup: React.FC = () => {
  const navigate = useNavigate();

  const handleSignupSubmit = async (formData: SignupFormData) => {
    try {
      const response = await recruiterAuthService.signup(formData);

      const stateData = {
        email: response.email,
      };
      if (response.success) {
        navigate("/recruiter/otp", { state: stateData });
        toast.success(response.message);
      } else {
        toast.error(response.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed. Please try again.");
    }
  };

  return (
    <Signup role="RECRUITER" auth="Signup" onSubmit={handleSignupSubmit} />
  );
};

export default RecruiterSignup;
