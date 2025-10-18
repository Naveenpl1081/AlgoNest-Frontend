// components/RecruiterNavbar.tsx
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Layers, User, Menu, X } from "lucide-react";

const RecruiterNavbar: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { path: "/recruiter/portal", label: "Home" },
    { path: "/recruiter/viewallpost", label: "Jobs" },
    { path: "/recruiter/Applicants", label: "Applicants" },
    { path: "/recruiter/shortlist", label: "Shortlist" },
    { path: "/recruiter/interview", label: "Interview" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="bg-slate-800/90 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/recruiter/portal" className="flex items-center gap-2">
          <Layers className="w-7 h-7 text-cyan-400" />
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            AlgoNest
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`pb-1 transition-colors font-medium ${
                isActive(item.path)
                  ? "text-white border-b-2 border-indigo-500"
                  : "text-gray-300 hover:text-white border-transparent hover:border-indigo-400/50"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-4">
          <Link to="/recruiter/profile">
            <User className="w-5 h-5 text-gray-300 hover:text-white cursor-pointer transition-colors" />
          </Link>

          {/* Mobile Menu Toggle */}
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
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)} // Close menu on link click
                className={`w-full transition-colors font-medium pb-1 border-b-2 ${
                  isActive(item.path)
                    ? "text-white border-indigo-500"
                    : "text-gray-300 hover:text-white border-transparent hover:border-indigo-400/50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export default RecruiterNavbar;
