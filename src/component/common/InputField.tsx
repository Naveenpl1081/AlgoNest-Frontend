// src/component/common/InputField.tsx

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const InputField: React.FC<{
  label: string;
  name: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  error?: string;
  touched?: boolean;
  required?: boolean;
  className?: string;
  style?: React.CSSProperties;
  toggleable?: boolean; 
}> = ({
  label,
  name,
  type,
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required,
  className = "",
  style,
  toggleable = false,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const inputType =
    type === "password" && toggleable && showPassword ? "text" : type;

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-300">
        {label} {required && <span className="text-red-400">*</span>}
      </label>

      <div className="relative">
        <input
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setIsFocused(false);
            onBlur?.(e);
          }}
          onFocus={() => setIsFocused(true)}
          style={style}
          className={`w-full px-4 py-3 bg-slate-700 border rounded-xl text-white placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 ${
            error && touched
              ? "border-red-500 focus:ring-red-400"
              : isFocused
              ? "border-blue-400 focus:ring-blue-400"
              : "border-slate-600 hover:border-slate-500"
          } ${className}`}
          required={required}
        />

        {type === "password" && toggleable && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
      
      {/* THIS IS WHERE THE ERROR IS RENDERED */}
      {error && touched && <p className="text-red-400 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;