import React from "react";

const RecruiterFooter: React.FC = () => {
  return (
    <footer className="w-full bg-slate-900/80 border-t border-slate-700/50 py-4 mt-8">
      <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center text-sm text-slate-400">
        <p>© {new Date().getFullYear()} Recruiter Portal. All rights reserved.</p>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <a href="#" className="hover:text-white transition">Privacy</a>
          <a href="#" className="hover:text-white transition">Terms</a>
          <a href="#" className="hover:text-white transition">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default RecruiterFooter;
