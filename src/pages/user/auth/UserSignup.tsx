import React from 'react';
import Signup from '../../../component/auth/Signup';
import { useNavigate } from 'react-router-dom';
import { SignupFormData } from '../../../types/auth.types';
import {userAuthService} from "../../../service/userAuth"
import { toast } from "react-toastify";
const UserSignup: React.FC = () => {
  const navigate = useNavigate();

  const handleSignupSubmit = async (formData: SignupFormData) => {
    try {
      console.log("enetring the handle submit function in the user sign up page");
      const response = await userAuthService.signup(formData);
      console.log("consoling before the response in user signup page");
      console.log("response:", response.success);
      if(response.success){
        navigate("/user/otp");
        toast.success(response.message);
      }else{
        toast.error(response.message || "Signup failed. Please try again.");
      }
    
      
    } catch (error) {
      console.error("Signup failed:", error);
      alert("Signup failed. Please try again.");
    }
  };
  return <Signup role="USER" auth="Signup" onSubmit={handleSignupSubmit}/>;
};

export default UserSignup;