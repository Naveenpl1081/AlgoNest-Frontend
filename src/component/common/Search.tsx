import React from "react";

interface SearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const Search: React.FC<SearchProps> = ({
  value,
  onChange,
  placeholder = "Search...",
  className = "",
}) => {
  return (
    <input
      type="text"
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-4 py-2 rounded-lg border border-gray-500 bg-slate-800 text-white focus:outline-none focus:ring-2 focus:ring-slate-500 ${className}`}
    />
  );
};
