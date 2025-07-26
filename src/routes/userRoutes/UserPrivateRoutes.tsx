import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { axiosInstance } from "../../config/axios.config";

export const UserPrivateRoutes = () => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const accessToken = Cookies.get("user_access_token");


    if (accessToken) {
      setIsAuth(true);
    } else {
      try {
          console.log("referes ethi")
        const res = await axiosInstance.get("/api/user/refresh-token");
        const newToken = res.data.access_token;
        Cookies.set("user_access_token", newToken);
        setIsAuth(true);
      } catch (err) {
        console.log("Refresh failed, redirecting to login.");
        setIsAuth(false);
      }
    }
  };

  if (isAuth === null) return <div className="text-white">Loading...</div>;

  return isAuth ? <Outlet /> : <Navigate to="/user/login" />;
};
