import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  Truck,
  Box,
  ShoppingCart,
  Users,
  BarChart,
  Bell,
  Settings,
  UserPlus,
  HelpCircle,
  Menu,
} from "lucide-react";
import logo from "../../../assets/icons/logo.svg";

const Sidebar = () => {
  const navigate = useNavigate();

  // 👉 Đọc trạng thái sidebar từ localStorage khi khởi tạo
  const [isOpen, setIsOpen] = useState(() => {
    return localStorage.getItem("sidebar_open") === "true";
  });

  // 👉 Mỗi lần thay đổi isOpen → lưu vào localStorage
  useEffect(() => {
    localStorage.setItem("sidebar_open", isOpen);
  }, [isOpen]);

  const menu = [
    { label: "Dashboard", icon: <Home size={18} /> },
    { label: "Reports & Analytics", icon: <BarChart size={18} /> },
    { label: "Shipments Tracking", icon: <Truck size={18} /> },
    { label: "Orders", icon: <ShoppingCart size={18} /> },
    { label: "Inventory", icon: <Box size={18} /> },
    { label: "Customers", icon: <Users size={18} /> },
    { label: "Notifications", icon: <Bell size={18} /> },
    { label: "User Management", icon: <UserPlus size={18} /> },
    { label: "Settings", icon: <Settings size={18} /> },
    { label: "Help & Support", icon: <HelpCircle size={18} /> },
  ];

  const routeMap = {
    Dashboard: "/admin/dashboard",
    "Reports & Analytics": "/admin/report",
    "Shipments Tracking": "/admin/shipments",
    Orders: "/admin/orders",
    Inventory: "/admin/inventory",
    Customers: "/admin/customers",
    Notifications: "/admin/notifications",
    Settings: "/admin/settings",
    "User Management": "/admin/users",
    "Help & Support": "/admin/support",
  };

  return (
    <div
      className={`h-screen bg-white shadow-md border-r transition-all duration-300 flex flex-col
        ${isOpen ? "w-56" : "w-16"}`}
    >
      {/* Header */}
      <div className="flex flex-col items-center border-b border-gray-200">
        <div
          className="flex items-center gap-2 p-3 w-full cursor-pointer hover:bg-gray-100 transition"
          onClick={() => navigate("/admin")}
        >
          <img src={logo} alt="Logo" className="w-8 h-8" />
          {isOpen && (
            <span className="font-semibold text-base select-none">
              Logistic Management
            </span>
          )}
        </div>

        {/* Toggle button */}
        <div
          className="p-3 flex items-center justify-center w-full cursor-pointer hover:bg-gray-100 transition"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Menu size={18} />
        </div>
      </div>

      {/* Menu items */}
      <ul className="mt-2 flex flex-col gap-1 flex-1">
        {menu.map((item, idx) => (
          <li
            key={idx}
            onClick={() => navigate(routeMap[item.label])}
            className="flex items-center gap-3 px-3 py-2 hover:bg-gray-100 cursor-pointer rounded-md"
          >
            <div className="w-6 h-6 flex items-center justify-center">
              {item.icon}
            </div>

            <span
              className={`text-sm font-medium whitespace-nowrap transition-all duration-200 
                ${isOpen ? "opacity-100" : "opacity-0 w-0"}`}
            >
              {item.label}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
