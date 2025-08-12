import React from "react";
import { Bell, UserCircle } from "lucide-react";

export const AdminNavbar:React.FC = () => {
  return (
    <header className="w-full h-16 bg-slate-900/80 backdrop-blur-md border-b border-slate-700/50 flex items-center justify-between px-6">
 
      <h1 className="text-2xl font-bold text-white">AlgoNest</h1>

     
      <div className="flex items-center space-x-4">
      
        <button className="p-2 rounded-full hover:bg-slate-800/50 text-slate-400 hover:text-white transition">
          <Bell className="w-6 h-6" />
        </button>

       
        <button className="p-2 rounded-full hover:bg-slate-800/50 text-slate-400 hover:text-white transition">
          <UserCircle className="w-8 h-8" />
        </button>
      </div>
    </header>
  );
};
