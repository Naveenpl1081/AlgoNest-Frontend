import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Layers, User } from "lucide-react";

const RecruiterNavbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/recruiter/portal" className="flex items-center gap-2">
            <Layers className="w-7 h-7 text-cyan-400" />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              AlgoNest
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/recruiter/portal"
              className={`pb-1 transition-colors font-medium ${
                isActive("/recruiter/portal")
                  ? "text-white border-b-2 border-indigo-500"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Home
            </Link>

            <Link
              to="/recruiter/viewallpost"
              className={`pb-1 transition-colors font-medium ${
                isActive("/recruiter/viewallpost")
                  ? "text-white border-b-2 border-indigo-500"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Jobs
            </Link>

            <Link
              to="/recruiter/Applicants"
              className={`pb-1 transition-colors font-medium ${
                isActive("/recruiter/Applicants")
                  ? "text-white border-b-2 border-indigo-500"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Applicants
            </Link>

            <Link
              to="/recruiter/shortlist"
              className={`pb-1 transition-colors font-medium ${
                isActive("/recruiter/shortlist")
                  ? "text-white border-b-2 border-indigo-500"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Shortlist
            </Link>
            <Link
              to="/recruiter/interview"
              className={`pb-1 transition-colors font-medium ${
                isActive("/recruiter/interview")
                  ? "text-white border-b-2 border-indigo-500"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              Interview
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/recruiter/profile">
              <User className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer transition-colors" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterNavbar;
