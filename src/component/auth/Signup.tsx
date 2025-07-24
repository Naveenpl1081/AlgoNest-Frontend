import React from 'react';
import AuthLayouts from '../../layouts/AuthLayouts';
import SignupForm from './SignupForm';
import { SignupProps } from '../../types/auth.types';

const Signup: React.FC<SignupProps> = ({ role ,auth,onSubmit}) => {
  return (
    <AuthLayouts role={role} auth={auth}>
      <SignupForm role={role} onSubmit={onSubmit}/>
    </AuthLayouts>
  );
};

export default Signup;