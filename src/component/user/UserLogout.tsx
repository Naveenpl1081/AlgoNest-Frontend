import React from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { axiosInstance } from "../../config/axios.config";
import { toast } from "react-toastify";


type RoleType = "user" | "recruiter" | "admin";

type UserLogoutProps = {
  role: RoleType;
};

const UserLogout: React.FC<UserLogoutProps> = ({ role }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      
      const res = await axiosInstance.post(`/api/${role}/logout`);

      
      Cookies.remove("access_token");

      toast.success(res.data.message || "Logged out successfully");

      navigate(`/${role}/login`);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Try again.");
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-400 font-semibold py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2 hover:shadow-lg"
    >
      <LogOut className="w-4 h-4" />
      <span>Logout</span>
    </button>
  );
};

export default UserLogout;
