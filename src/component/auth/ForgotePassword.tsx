// component/auth/ForgotePassword.tsx
import React from 'react';
import AuthLayouts from '../../layouts/AuthLayouts';
import ForgotPasswordForm from './ForgotPasswordForm';
import { ForgotProps } from '../../types/auth.types';

const ForgotePassword: React.FC<ForgotProps> = ({ role, auth, onSubmit }) => {
  return (
    <AuthLayouts role={role} auth={auth}>
      <ForgotPasswordForm onSubmit={onSubmit} />
    </AuthLayouts>
  );
};

export default ForgotePassword;
