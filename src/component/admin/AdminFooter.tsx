import React from "react";

export const AdminFooter:React.FC = () => {
  return (
    <footer className="w-full h-14 bg-slate-900/80 backdrop-blur-md border-t border-slate-700/50 flex items-center justify-center">
      <p className="text-slate-400 text-sm">
        © {new Date().getFullYear()} AlgoNest. All rights reserved.
      </p>
    </footer>
  );
};
