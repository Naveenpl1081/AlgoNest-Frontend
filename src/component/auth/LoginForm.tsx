import React, { useState } from "react";
import { LoginFormData, LoginFormProps } from "../../types/auth.types";
import InputField from "../common/InputField";
import Button from "../common/Button";
import SocialButton from "../common/SocialButton";
import { useNavigate } from "react-router-dom";
import { githubAuthService } from "../../service/githubAuth";
import { linkedinAuthService } from "../../service/linkedinAuth";

const LoginForm: React.FC<LoginFormProps> = ({ role = "User", onSubmit }) => {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<LoginFormData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange =
    (field: keyof LoginFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
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
    const newErrors: Partial<LoginFormData> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password.trim()) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
      } else {
        console.log("Login data:", { ...formData, role });
        await new Promise((resolve) => setTimeout(resolve, 1500));
        alert("Login successful! 🎉");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: "github" | "linkedin") => {
    if (provider === "github") {
      console.log(`GitHub login for ${role}`);
      githubAuthService.redirectToGitHub();
    } else {
      console.log(`${provider} login for ${role}`);
      linkedinAuthService.redirectToLinkedIn();
    }
  };

  const navigateToSignup = () => {
    console.log("role", role);
    navigate(`/${role.toLocaleLowerCase()}/signup`);
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
          Welcome Back
        </h1>
        <p className="text-gray-300 text-lg">
          Log in as a {role.toLowerCase()} and continue your journey
        </p>
      </div>

      <div className="space-y-6">
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
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange("password")}
          error={errors.password}
          required
          toggleable
        />
        <button
          onClick={() => navigate(`/${role.toLowerCase()}/forgot-password`)}
          className="text-blue-400 hover:text-blue-300 underline underline-offset-2 decoration-2 transition-all"
        >
          Forgot Password?
        </button>

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
                Logging In...
              </div>
            ) : (
              "Login"
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
            <span className="px-2 bg-slate-700 text-gray-400">
              Or continue with
            </span>
          </div>
        </div>

        <div className="mt-6 flex gap-4 justify-center">
          <SocialButton
            provider="github"
            onClick={() => handleSocialLogin("github")}
          />
          <SocialButton
            provider="linkedin"
            onClick={() => handleSocialLogin("linkedin")}
          />
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-gray-400">
          Don’t have an account?{" "}
          <button
            onClick={navigateToSignup}
            className="text-blue-400 hover:text-blue-300 font-medium underline underline-offset-4 decoration-2 hover:decoration-blue-300 transition-all duration-200"
          >
            Sign up here
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
