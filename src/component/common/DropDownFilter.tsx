import React from "react";

interface DropdownFilterProps {
  label?: string;
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const DropdownFilter: React.FC<DropdownFilterProps> = ({
  label,
  options,
  value,
  onChange,
  className,
}) => {
  return (
    <div className={`flex flex-col space-y-1 ${className || "w-48"}`}>
      {label && <span className="text-sm text-gray-300">{label}</span>}
      <select
        className="p-2 rounded-md bg-gray-800 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">All</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};
