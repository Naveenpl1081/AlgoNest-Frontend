// components/UserNavbar.tsx
import React from "react";
import { Link } from "react-router-dom";
import { User } from "lucide-react";
const UserNavbar: React.FC = () => {
  return (
    <div className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
        <Link to="/user/home">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            AlgoNest
          </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-white hover:text-blue-400 transition-colors font-medium border-b-2 border-blue-500 pb-1"
            >
              Problems
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Community
            </a>
            <a
              href="#"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Interview
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <Link to="/user/profile">
              <User className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer transition-colors" />
            </Link>
            <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-lg">
              Premium
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNavbar;
