import React from "react";

const ModernInput = ({
  className = "",
  readOnly = false,
  onChange,
  value,
  ...props
}) => {
  // Nếu input có value nhưng không có onChange và không readOnly → tự thêm readOnly để tránh cảnh báo
  const isReadOnly = readOnly || (value !== undefined && !onChange);

  return (
    <input
      {...props}
      value={value}
      onChange={onChange}
      readOnly={isReadOnly}
      className={`w-full border border-slate-200 rounded-xl bg-white text-slate-700 transition duration-150 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-3 ${
        isReadOnly ? "bg-slate-100 cursor-not-allowed" : ""
      } ${className}`}
    />
  );
};

export default ModernInput;
