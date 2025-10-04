import React from "react";
import { Route, Routes } from "react-router-dom";
import RecruiterSignup from "../pages/Recruiter/auth/RecruiterSignup";
import RecruiterLogin from "../pages/Recruiter/auth/RecruiterLogin";
import RecruiterOtp from "../pages/Recruiter/auth/RecruiterOtp";
import RecruiterForgotPassword from "../pages/Recruiter/auth/RecruiterForgotPassword";
import RecruiterResetPassword from "../pages/Recruiter/auth/RecruiterResetPassword";
import RecruiterVerifyPage from "../pages/Recruiter/recruiterPages/RecruiterVerifyPage";
import RecruiterPortalWrapper from "../pages/Recruiter/recruiterPages/RecruiterPortalWrapper";
import { RecruiterPrivateRoutes } from "./PrivateRoutes";
import { RecruiterPublicRoutes } from "./PublicRoutes";
import RecruiterProfilePage from "../pages/Recruiter/recruiterPages/RecruiterProfilePage";
import JobPostPage from "../pages/Recruiter/recruiterPages/JobPostPage";
import ViewAllJobs from "../pages/Recruiter/recruiterPages/ViewAllJobs";

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
        <Route path="/recruiter/portal" element={<RecruiterPortalWrapper />} />
        <Route path='/recruiter/verify' element={<RecruiterVerifyPage/>}/>
        <Route path='/recruiter/profile' element={<RecruiterProfilePage/>}/>
        <Route path="/recruiter/jobpost" element={<JobPostPage/>}/>
        <Route path="/recruiter/viewallpost" element={<ViewAllJobs/>}/>
      </Route>
    </Routes>
  );
};

export default RecruiterRoutes;
