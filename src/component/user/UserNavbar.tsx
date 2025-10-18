// components/UserNavbar.tsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Layers, Menu, X } from "lucide-react";

const UserNavbar: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: "/user/ai-tutor", label: "AI Tutor" },
    { path: "/user/home", label: "Problems" },
    { path: "/user/community", label: "Community" },
    { path: "/user/jobdetails", label: "JobPost" },
    { path: "/user/interview", label: "Interview" },
  ];

  return (
    <div className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/user/home" className="flex items-center gap-2">
          <Layers className="w-7 h-7 text-cyan-400" />
          <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            AlgoNest
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`transition-colors font-medium pb-1 border-b-2 ${
                  isActive
                    ? "text-white border-blue-500"
                    : "text-gray-300 hover:text-white border-transparent hover:border-blue-400/50"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <Link to="/user/profile">
            <User className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer transition-colors" />
          </Link>
          <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-lg hidden md:inline-block">
            Premium
          </span>

          {/* Hamburger Icon (for mobile) */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-slate-700/50">
          <nav className="flex flex-col items-start px-6 py-4 space-y-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)} // close menu on click
                  className={`w-full transition-colors font-medium pb-1 border-b-2 ${
                    isActive
                      ? "text-white border-blue-500"
                      : "text-gray-300 hover:text-white border-transparent hover:border-blue-400/50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <span className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-sm font-medium rounded-lg">
              Premium
            </span>
          </nav>
        </div>
      )}
    </div>
  );
};

export default UserNavbar;
