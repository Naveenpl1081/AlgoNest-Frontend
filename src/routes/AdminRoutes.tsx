import React from "react";
import { Route, Routes } from "react-router-dom";
import { AdminPrivateRoutes } from "./PrivateRoutes";
import { AdminPublicRoutes } from "./PublicRoutes";
import AdminLogin from "../pages/admin/auth/AdminLogin";
import { AdminDashboardPage } from "../pages/admin/adminPages/DashBoardPage";
import { UsersListPage } from "../pages/admin/adminPages/UsersListPage";
import { RecruiterListPage } from "../pages/admin/adminPages/RecruiterListPage";
import { ApplicantsListPage } from "../pages/admin/adminPages/ApplicantsListPage";
import { ApplicantDetails } from "../pages/admin/adminPages/ApplicantDetails";

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AdminPublicRoutes />}>
        <Route path="/admin/login" element={<AdminLogin />} />
      </Route>

      <Route element={<AdminPrivateRoutes />}>
         <Route path="/admin/dashboard" element={<AdminDashboardPage/>} />
         <Route path="/admin/users" element={<UsersListPage/>} />
         <Route path="/admin/recruiter" element={<RecruiterListPage/>} />
         <Route path="/admin/applicants" element={<ApplicantsListPage/>} />
         <Route path="/admin/applicants/:id" element={<ApplicantDetails/>} />

      </Route>
    </Routes>
  );
};

export default AdminRoutes;
