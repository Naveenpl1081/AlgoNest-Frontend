import React from "react";
import {
  LayoutDashboard,
  Users,
  Code,
  MessageCircle,
  Briefcase,
  ChevronRight,
  BriefcaseBusiness
} from "lucide-react";
import { useLocation, NavLink } from "react-router-dom";

export const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/admin/dashboard",
    },
    { id: "students", label: "Stidents", icon: Users, path: "/admin/users" },
    { id: "recruiters", label: "Recruiters", icon: BriefcaseBusiness, path: "/admin/recruiter" },
    { id: "problems", label: "Problems", icon: Code, path: "/admin/problems" },
    {
      id: "community",
      label: "Community",
      icon: MessageCircle,
      path: "/admin/community",
    },
    { id: "jobs", label: "Job Posts", icon: Briefcase, path: "/admin/jobs" },
  ];

  return (
    <aside className="w-64 bg-slate-900/80 backdrop-blur-md border-r border-slate-700/50 h-screen p-6">
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/50"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};
