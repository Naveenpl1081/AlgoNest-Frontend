import React from "react";
import { Route, Routes } from "react-router-dom";
import { AdminPrivateRoutes } from "./PrivateRoutes";
import { AdminPublicRoutes } from "./PublicRoutes";
import AdminLogin from "../pages/admin/auth/AdminLogin";
import { AdminDashboardPage } from "../pages/admin/adminPages/DashBoardPage";
import { UsersListPage } from "../pages/admin/adminPages/UsersListPage";

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route element={<AdminPublicRoutes />}>
        <Route path="/admin/login" element={<AdminLogin />} />
      </Route>

      <Route element={<AdminPrivateRoutes />}>
         <Route path="/admin/dashboard" element={<AdminDashboardPage/>} />
         <Route path="/admin/users" element={<UsersListPage/>} />

      </Route>
    </Routes>
  );
};

export default AdminRoutes;
