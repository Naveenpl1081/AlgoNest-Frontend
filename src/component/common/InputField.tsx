import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const InputField: React.FC<{
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
  required?: boolean;
  toggleable?: boolean;
}> = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
  required,
  toggleable,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const inputType =
    toggleable && type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      <div className="relative">
        <input
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`w-full px-4 py-3 bg-slate-600 border rounded-xl text-white placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 ${
            error
              ? "border-red-500 focus:ring-red-400"
              : isFocused
              ? "border-blue-400 focus:ring-blue-400"
              : "border-slate-500 hover:border-slate-400"
          }`}
          required={required}
        />
        {toggleable && type === "password" && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      {error && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
