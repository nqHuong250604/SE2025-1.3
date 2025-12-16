import React from "react";
import { CheckCircle, XCircle, Settings, CornerDownLeft } from "lucide-react";

const Badge = ({ type }) => {
  const base =
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition duration-150";

  let content;
  let style;

  if (type === "IN") {
    style = `${base} bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300`;
    content = (
      <>
        <CheckCircle className="w-3 h-3 mr-1" />
        IN
      </>
    );
  } else if (type === "OUT") {
    style = `${base} bg-rose-100 text-rose-800 ring-1 ring-rose-300`;
    content = (
      <>
        <XCircle className="w-3 h-3 mr-1" />
        OUT
      </>
    );
  } else if (type === "ADJUSTMENT") {
    style = `${base} bg-amber-100 text-amber-800 ring-1 ring-amber-300`;
    content = (
      <>
        <Settings className="w-3 h-3 mr-1" />
        ADJUSTMENT
      </>
    );
  } else if (type === "RETURN") {
    style = `${base} bg-blue-100 text-blue-800 ring-1 ring-blue-300`;
    content = (
      <>
        <CornerDownLeft className="w-3 h-3 mr-1" />
        RETURN
      </>
    );
  } else {
    style = `${base} bg-slate-100 text-slate-700 ring-1 ring-slate-300`;
    content = type;
  }

  return <span className={style}>{content}</span>;
};

export default Badge;
