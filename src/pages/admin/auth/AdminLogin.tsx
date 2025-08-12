import React from "react";
import Login from "../../../component/auth/Login";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { adminAuthService } from "../../../service/adminAuth";
import { LoginFormData } from "../../../types/auth.types";
import Cookies from "js-cookie";

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSubmit = async (formData: LoginFormData) => {
    try {
      console.log("Admin login form data:", formData);

      const response = await adminAuthService.login(formData);
      console.log("Admin login response:", response);

      if (response.success) {
        const inOneHour = new Date(new Date().getTime() + 60 * 60 * 1000);
        Cookies.set("access_token", response.access_token, {
          expires: inOneHour,
        });
console.log("eroor got oit")
        toast.success(response.message || "Admin login successful!");
        navigate("/admin/dashboard");
      } else {
        toast.error(response.message || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Admin login error:", error);
      toast.error("Login failed. Something went wrong.");
    }
  };

  return <Login role="ADMIN" auth="Login" onSubmit={handleLoginSubmit} />;
};

export default AdminLogin;
