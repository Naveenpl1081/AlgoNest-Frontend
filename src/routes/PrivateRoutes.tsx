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
  console.log("enterd to the private route");
  const [isChecking, setIsChecking] = useState(true);
  console.log("value of the isChecking in the bagining:", isChecking);
  const [isAuth, setIsAuth] = useState(false);
  console.log("value of the isAuth in the beigining:", isAuth);

  useEffect(() => {
    console.log("keeri in the begining");
    checkAuth();
  }, []);

  console.log("printing before the checkauth function");
  const checkAuth = async () => {
    console.log("begining of the check auth----->");
    let token = Cookies.get("access_token");
    console.log("token value in the check auth begining:", token);

    if (token && isRoleMatch(token, Role)) {
      console.log("check cheyyunnuuuuu");
      setIsAuth(true);
      console.log("isAuth:", isAuth);
      setIsChecking(false);
      console.log("isChecking:", isChecking);
      return;
    }

    try {
      console.log("before invoking the new access token function");
      token = await newAccessToken();
      console.log("token after invoking the token:", token);
      if (token && isRoleMatch(token, Role)) {
        console.log("keerunuu check aahkunnuu-------->");
        setIsAuth(true);
        console.log("isAuth:", isAuth);
      } else {
        console.log("keerunuu else block in the new access token function");
        setIsAuth(false);
        console.log("isAuth:", isAuth);
      }
    } catch {
      setIsAuth(false);
      console.log(
        "value of isAuth in the new access token catch block",
        isAuth
      );
    }
    setIsChecking(false);
    console.log(
      "final value of the isChecking in the checkauth function:",
      isChecking
    );
  };

  const isRoleMatch = (token: string, role: Role) => {
    try {
      console.log("keerunuu isROleMatch function");
      const decoded = jwtDecode<DecodedToken>(token);
      console.log("decoded value:", decoded);
      return decoded.role?.toUpperCase() === role;
    } catch {
      console.log("keerunuu catch block in the isROleMatch");
      return false;
    }
  };

  if (isChecking) {
    return <p className="text-center">Please wait while processing...</p>;
  }

  if (!isAuth) {
    console.log("keeriyoo isAuth:", isAuth);
    return <Navigate to={`/${Role.toLowerCase()}/login`} />;
  }
  console.log("keerunnuuu returning the outlet:------>");
  return <Outlet />;
};

export const UserPrivateRoutes: React.FC = () => <PrivateRoute Role="USER" />;
export const RecruiterPrivateRoutes: React.FC = () => (
  <PrivateRoute Role="RECRUITER" />
);
export const AdminPrivateRoutes: React.FC = () => <PrivateRoute Role="ADMIN" />;
