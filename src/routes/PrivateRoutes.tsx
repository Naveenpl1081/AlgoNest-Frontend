import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { newAccessToken } from "../config/axios.config";
import { Role } from "../types/auth.types";

interface DecodedToken {
  userId: string;
  role: string;
  exp: number;
}

interface PrivateRouteProps {
  Role: Role;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ Role }) => {
  const [isChecking, setIsChecking] = useState(true);

  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    console.log("keeri in the begining");
    checkAuth();
  }, []);

  const checkAuth = async () => {
    let token = Cookies.get("access_token");

    if (token && isRoleMatch(token, Role)) {
      setIsAuth(true);

      setIsChecking(false);

      return;
    }

    try {
      token = await newAccessToken();
      console.log("tokennnn",token)

      if (token && isRoleMatch(token, Role)) {
        setIsAuth(true);
      } else {
        setIsAuth(false);
      }
    } catch {
      setIsAuth(false);
    }
    setIsChecking(false);
  };

  const isRoleMatch = (token: string, role: Role) => {
    try {
      const decoded = jwtDecode<DecodedToken>(token);

      return decoded.role?.toUpperCase() === role;
    } catch {
      return false;
    }
  };

  if (isChecking) {
    return <p className="text-center">Please wait while processing...</p>;
  }

  if (!isAuth) {
    return <Navigate to={`/${Role.toLowerCase()}/login`} />;
  }

  return <Outlet />;
};

export const UserPrivateRoutes: React.FC = () => <PrivateRoute Role="USER" />;
export const RecruiterPrivateRoutes: React.FC = () => (
  <PrivateRoute Role="RECRUITER" />
);
export const AdminPrivateRoutes: React.FC = () => <PrivateRoute Role="ADMIN" />;
