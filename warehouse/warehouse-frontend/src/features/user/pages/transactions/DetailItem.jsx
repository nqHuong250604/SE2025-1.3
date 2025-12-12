import React from "react";

const DetailItem = ({ label, value, highlight, monospace, icon: Icon }) => (
  <div className="flex flex-col p-3 border rounded-xl bg-slate-50 transition duration-150 hover:bg-white">
    <span className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1">
      {Icon && <Icon className="w-4 h-4 text-indigo-400" />}
      {label}
    </span>

    <span
      className={`mt-1 ${monospace ? "font-mono" : ""} ${
        highlight
          ? "text-indigo-600 font-extrabold text-xl"
          : "text-slate-800 font-medium"
      }`}
    >
      {value}
    </span>
  </div>
);

export default DetailItem;
