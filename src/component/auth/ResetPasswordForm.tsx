// component/auth/ResetPasswordForm.tsx

import React, { useState } from "react";
import InputField from "../common/InputField";
import Button from "../common/Button";

interface Props {
  onSubmit: (password: string, confirmPassword: string) => Promise<void>;
}

const ResetPasswordForm: React.FC<Props> = ({ onSubmit }) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await onSubmit(password, confirmPassword);
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-white text-center">
        Reset Password
      </h2>
      <InputField
        label="New Password"
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        toggleable
      />
      <InputField
        label="Confirm Password"
        type="password"
        placeholder="Confirm your password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
        toggleable
      />
      <Button type="submit" variant="primary" size="lg" disabled={isLoading}>
        {isLoading ? "Resetting..." : "Reset Password"}
      </Button>
    </form>
  );
};

export default ResetPasswordForm;
