import Cookies from "js-cookie";
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Role } from "../types/auth.types";

interface DecodedToken {
  userId: string;
  role: string;
  exp: number;
}

interface PublicRoutesProps {
  Role: Role;
  redirectTo: string;
}

export const PublicRoute: React.FC<PublicRoutesProps> = ({ Role,redirectTo }) => {
  const token = Cookies.get("access_token");

  let role: string | undefined;

  if (token) {
    try {
      const decoded = jwtDecode<DecodedToken>(token);
      role = decoded.role?.toUpperCase();
    } catch (err) {
      console.error("Invalid token", err);
    }
  }

  if (token && role?.toUpperCase() === Role) {
    return <Navigate to={redirectTo} />;
  }

  return <Outlet />;
};

export const UserPublicRoutes: React.FC = () => {
  return <PublicRoute Role="USER" redirectTo="/user/home" />;
};

export const RecruiterPublicRoutes: React.FC = () => {
  return <PublicRoute Role="RECRUITER" redirectTo="/recruiter/portal" />;
};

export const AdminPublicRoutes: React.FC = () => {
  return <PublicRoute Role="ADMIN" redirectTo="/admin/dashboard" />;
};
