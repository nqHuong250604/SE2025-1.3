import React from "react";
import { Search, PlusCircle } from "lucide-react";

const Topbar = () => {
  return (
    <div className="flex items-center justify-between bg-white px-6 py-3 shadow-sm">
      <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg w-1/3">
        <Search size={18} className="text-gray-500 mr-2" />
        <input
          className="bg-transparent outline-none text-sm w-full"
          placeholder="Search by Order ID, User name..."
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 bg-blue-500 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-600">
          <PlusCircle size={16} /> New Order
        </button>

        <div className="flex items-center gap-2">
          <img
            src="https://i.pravatar.cc/40"
            alt="avatar"
            className="rounded-full w-8 h-8"
          />
          <div>
            <p className="text-sm font-semibold">Harsh Vani</p>
            <p className="text-xs text-gray-500">Deportation Manager</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
