"use client";

import { forwardRef, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, className = "", ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm  text-black font-display font-thin! mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full px-4 py-3.5 text-base 
              ${icon ? "pl-12" : ""}
              bg-gray-50
              border border-gray-200 
              rounded-xl 
              text-gray-900 
              placeholder:text-gray-400
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-300 focus:bg-white
              hover:border-gray-300 hover:bg-gray-100/50
              ${error ? "border-red-300 focus:ring-red-100 bg-red-50/50" : ""}
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
