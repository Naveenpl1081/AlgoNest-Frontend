import React, { useState } from "react";
import InputField from "../common/InputField";
import Button from "../common/Button";
import { UserLikeRoles } from "../../types/auth.types";

interface ForgotPasswordFormProps {
  onSubmit: (email: string) => void;
  role?: UserLikeRoles;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  role = "User",
}) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSubmit(email);
    setIsLoading(false);
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
          Forgot Password
        </h1>
        <p className="text-gray-300 text-lg">
          Enter your registered email to reset password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
        <InputField
          label="Email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="primary"
          size="lg"
          disabled={isLoading}
          className={isLoading ? "opacity-75 cursor-not-allowed" : ""}
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Checking...
            </div>
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
