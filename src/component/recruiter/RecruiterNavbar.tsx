// components/RecruiterNavbar.tsx
import React from "react";
import { Link } from "react-router-dom";
import { Layers, User } from "lucide-react";

const RecruiterNavbar: React.FC = () => {
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
            <a
              href="#"
              className="text-white hover:text-indigo-400 transition-colors font-medium border-b-2 border-indigo-500 pb-1"
            >
              Home
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Jobs
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Interview
            </a>
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
