import React from "react";
import { Home, BarChart, Truck, Settings, Bell } from "lucide-react";

const Sidebar = () => {
  const menu = [
    { icon: <Home size={20} />, label: "Dashboard" },
    { icon: <BarChart size={20} />, label: "Reports" },
    { icon: <Truck size={20} />, label: "Shipments" },
    { icon: <Bell size={20} />, label: "Notifications" },
    { icon: <Settings size={20} />, label: "Settings" },
  ];

  return (
    <div className="w-20 bg-white shadow-md flex flex-col items-center py-4 space-y-6">
      <div className="text-blue-500 font-bold text-lg">🚚</div>
      {menu.map((item, index) => (
        <button
          key={index}
          className="flex flex-col items-center text-gray-600 hover:text-blue-500"
        >
          {item.icon}
          <span className="text-[10px] mt-1">{item.label}</span>
        </button>
      ))}
    </div>
  );
};

export default Sidebar;
