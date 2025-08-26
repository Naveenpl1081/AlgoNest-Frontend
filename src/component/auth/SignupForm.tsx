import React, { useState } from "react";
import { SignupFormData, UserLikeRoles } from "../../types/auth.types";
import InputField from "../common/InputField";
import Button from "../common/Button";
import SocialButton from "../common/SocialButton";
import { SignupFormProps } from "../../types/auth.types";
import { useNavigate } from "react-router-dom";
import { validateSignupForm } from "../../utils/validations/ValidateSignupForm" ;

const SignupForm: React.FC<SignupFormProps> = ({ role , onSubmit }) => {
    const [formData, setFormData] = useState<SignupFormData>({
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    });

    const navigate=useNavigate()
  
    const [errors, setErrors] = useState<Partial<SignupFormData>>({});
    const [isLoading, setIsLoading] = useState(false);
  
    const handleChange = (field: keyof SignupFormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
      
      if (errors[field]) {
        setErrors((prev) => ({
          ...prev,
          [field]: undefined,
        }));
      }
    };
  
    const validateForm = (): boolean => {
      const newErrors = validateSignupForm(formData);
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
  
      if (!validateForm()) return;
  
      setIsLoading(true);
      try {
        if (onSubmit) {
          console.log("reached")
          await onSubmit(formData); 
        } else {
          console.log("Signup data:", { ...formData, role });
          await new Promise((resolve) => setTimeout(resolve, 2000));
          alert("Account created successfully! 🎉");
        }
      } catch (error) {
        console.error("Signup error:", error);
        alert("Signup failed. Please try again.");
      } finally {
        setIsLoading(false);
      }
    }
  
    const handleSocialLogin = (provider: "github" | "google") => {
      console.log(`${provider} login for ${role}`);
      alert(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login initiated for ${role}`);
    };
  
    const navigateToLogin = () => {
     navigate(`/${role.toLocaleLowerCase()}/login`)
    };
  
    return (
      <div className="w-full">
        <div className="text-center mb-8">
          <div className="mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl">
              <span className="text-2xl font-bold text-white">
                {role.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-gray-300 text-lg">
            Join as a {role.toLowerCase()} and start your journey
          </p>
        </div>
  
        <div className="space-y-6">
          <InputField
            label="Username"
            type="text"
            placeholder="Enter your username"
            value={formData.username}
            onChange={handleChange("username")}
            error={errors.username}
            required
          />
  
          <InputField
            label="Email"
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange("email")}
            error={errors.email}
            required
          />
  
          <InputField
            label="Password"
            type="password"
            placeholder="Create a strong password"
            value={formData.password}
            onChange={handleChange("password")}
            error={errors.password}
            required
            toggleable
          />
  
          <InputField
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange("confirmPassword")}
            error={errors.confirmPassword}
            required
            toggleable
          />
  
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isLoading}
              className={isLoading ? "opacity-75 cursor-not-allowed" : ""}
              onClick={(e) => {
                e.preventDefault();
                handleSubmit(e as any);
              }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Creating Account...
                </div>
              ) : (
                "Create Account"
              )}
            </Button>
          </div>
        </div>
  
        <div className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-700 text-gray-400">Or continue with</span>
            </div>
          </div>
  
          <div className="mt-6 flex gap-4 justify-center">
            <SocialButton
              provider="github"
              onClick={() => handleSocialLogin("github")}
            />
            <SocialButton
              provider="linkedin"
              onClick={() => handleSocialLogin("google")}
            />
          </div>
        </div>
  
        <div className="mt-8 text-center">
          <p className="text-gray-400">
            Already have an account?{" "}
            <button 
              onClick={navigateToLogin} 
              className="cursor-pointer text-blue-400 hover:text-blue-300 font-medium underline underline-offset-4 decoration-2 hover:decoration-blue-300 transition-all duration-200"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    );
  };

export default SignupForm;
