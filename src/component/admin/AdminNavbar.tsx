import React, { useState, useRef, useEffect } from "react";
import { Bell, UserCircle, LogOut } from "lucide-react";
import UserLogout from "../user/UserLogout";

export const AdminNavbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="w-full h-16 bg-slate-900/70 backdrop-blur-md border-b border-slate-700/50 flex items-center justify-end px-6">
      <div className="flex items-center space-x-4 relative" ref={dropdownRef}>
        <button className="p-2 rounded-full hover:bg-slate-800/50 text-slate-400 hover:text-white transition">
          <Bell className="w-6 h-6" />
        </button>

        <button
          onClick={() => setOpen((prev) => !prev)}
          className="p-2 rounded-full hover:bg-slate-800/50 text-slate-400 hover:text-white transition"
        >
          <UserCircle className="w-8 h-8" />
        </button>

        {open && (
          <div className="absolute right-0 top-14 w-48 bg-slate-800 text-white rounded-xl shadow-lg border border-slate-700/50">
            <ul className="flex flex-col py-2">
              <li>
                <UserLogout role="admin" />
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};
