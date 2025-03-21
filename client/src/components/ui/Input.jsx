import { forwardRef, InputHTMLAttributes } from "react";

const Input = ({ label, error, className = "", ...props }, ref) => {
  return (
    <div className="mb-2">
      <label className="block text-sm font-medium text-gray-800 mb-1">
        {label}
      </label>
      <input
        className={`py-2 px-2 border bg-bg rounded-lg w-full text-sm focus:ring-0 focus:outline-none focus:border-button-hover ${
          error ? "border-red-600" : "border-gray-300"
        } ${className}`}
        ref={ref}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600 font-thin">{error}</p>}
    </div>
  );
};

Input.displayName = "Input";

export default Input;
