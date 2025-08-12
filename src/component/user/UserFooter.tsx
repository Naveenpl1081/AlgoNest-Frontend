// components/UserFooter.tsx
import React from 'react';

const UserFooter: React.FC = () => {
  return (
    <footer className="bg-slate-800/50 border-t border-slate-700/50 mt-16">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-400">
          <div className="flex items-center space-x-6">
            <span>Copyright © 2025 AlgoNest</span>
            <a href="#" className="hover:text-white transition-colors">Help Center</a>
            <a href="#" className="hover:text-white transition-colors">Jobs</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default UserFooter;
