import React from 'react';
import AuthLayout from '../../layouts/AuthLayouts';
import { OtpProps } from '../../types/auth.types';
import OtpForm from './OtpForm';

const Otp: React.FC<OtpProps> = ({ role, auth, onSubmit,onResend }) => {
  return (
    <AuthLayout role={role} auth={auth}>
      <OtpForm role={role} onSubmit={onSubmit} onResend={onResend} />
    </AuthLayout>
  );
};

export default Otp;
