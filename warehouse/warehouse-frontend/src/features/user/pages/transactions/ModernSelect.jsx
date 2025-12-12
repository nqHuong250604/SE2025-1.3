import React from "react";

const ModernSelect = (props) => (
  <select
    {...props}
    className="w-full p-3 border border-slate-200 rounded-xl bg-white text-slate-700 appearance-none pr-10 transition duration-150 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    style={{
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>')`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 0.75rem center",
      backgroundSize: "1.5em 1.5em",
    }}
  />
);

export default ModernSelect;
