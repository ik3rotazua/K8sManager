import React from "react";

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  rows?: number;
}

const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, error, className = "", rows = 6, ...props }, ref) => (
    <div>
      <label
        htmlFor={props.id || props.name}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <textarea
        ref={ref}
        rows={rows}
        className={`
          mt-1 block w-full rounded border bg-white bg-opacity-50 px-3 py-2 shadow-sm sm:text-sm
          ${error
            ? "border-red-200 focus:border-red-400 focus:ring-red-200"
            : "border-gray-200 focus:border-blue-200 focus:ring-blue-100"}
          focus:outline-none focus:ring-2
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
);

export default FormTextarea;