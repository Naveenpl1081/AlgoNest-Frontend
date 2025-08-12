
import React from "react";
import AuthLayouts from "../../layouts/AuthLayouts";
import ResetPasswordForm from "./ResetPasswordForm";
import { ResetProps } from "../../types/auth.types";

const ResetPassword: React.FC<ResetProps> = ({ role, auth, onSubmit }) => {
  return (
    <AuthLayouts role={role} auth={auth}>
      <ResetPasswordForm onSubmit={onSubmit} />
    </AuthLayouts>
  );
};

export default ResetPassword;
