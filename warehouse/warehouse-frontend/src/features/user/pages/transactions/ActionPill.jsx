import React from "react";

const ActionPill = ({ children, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-semibold shadow-md transition duration-150 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 ${
      disabled
        ? "bg-indigo-300 cursor-not-allowed"
        : "bg-indigo-600 text-white hover:bg-indigo-700"
    }`}
  >
    {children}
  </button>
);

export default ActionPill;
