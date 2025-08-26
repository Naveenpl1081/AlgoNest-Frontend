import React from "react";
import {
  LayoutDashboard,
  Users,
  Code,
  MessageCircle,
  Briefcase,
  ChevronRight,
  Layers,
  FileUser,
  IdCard,
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
    { id: "students", label: "Students", icon: Users, path: "/admin/users" },
    {
      id: "applicants",
      label: "Applicants",
      icon: FileUser,
      path: "/admin/applicants",
    },
    {
      id: "recruiters",
      label: "Recruiters",
      icon: IdCard,
      path: "/admin/recruiter",
    },
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
    <aside className="w-64 bg-slate-900/80 backdrop-blur-xl border-r border-slate-700/50 h-screen flex flex-col">
      <div className="flex items-center gap-2 px-6 py-5 border-b border-slate-700/50">
        <Layers className="w-7 h-7 text-cyan-400" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          AlgoNest
        </h1>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.id}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/40"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
              {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-6 py-4 border-t border-slate-700/50 text-xs text-slate-500">
        © {new Date().getFullYear()} AlgoNest
      </div>
    </aside>
  );
};
