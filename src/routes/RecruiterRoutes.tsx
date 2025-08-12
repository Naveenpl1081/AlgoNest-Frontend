import React from "react";
import { Route, Routes } from "react-router-dom";
import RecruiterSignup from "../pages/Recruiter/auth/RecruiterSignup";
import RecruiterLogin from "../pages/Recruiter/auth/RecruiterLogin";
import RecruiterOtp from "../pages/Recruiter/auth/RecruiterOtp";
import RecruiterForgotPassword from "../pages/Recruiter/auth/RecruiterForgotPassword";
import RecruiterResetPassword from "../pages/Recruiter/auth/RecruiterResetPassword";
import RecruiterPortal from "../pages/Recruiter/recruiterPages/RecruiterPortalPage";
import { RecruiterPrivateRoutes } from "./PrivateRoutes";
import { RecruiterPublicRoutes } from "./PublicRoutes";

const RecruiterRoutes:React.FC = () => {
  return (
    <Routes>
      <Route element={<RecruiterPublicRoutes />}>
        <Route path="/recruiter/signup" element={<RecruiterSignup />} />
        <Route path="/recruiter/login" element={<RecruiterLogin />} />
        <Route path="/recruiter/otp" element={<RecruiterOtp />} />
        <Route
          path="/recruiter/forgot-password"
          element={<RecruiterForgotPassword />}
        />
        <Route
          path="/recruiter/reset-password"
          element={<RecruiterResetPassword />}
        />
      </Route>

      <Route element={<RecruiterPrivateRoutes />}>
        <Route path="/recruiter/portal" element={<RecruiterPortal />} />
      </Route>
    </Routes>
  );
};

export default RecruiterRoutes;
