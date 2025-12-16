import React from "react";
import { Search, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { logout } from "../../auth/authServices"; 

const Topbar = ({ username = "Admin" }) => { 
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      // 1. GỌI HÀM LOGOUT THỰC TẾ (Xóa token khỏi LocalStorage)
      logout(); 
      
      // 2. CHUYỂN HƯỚNG về trang đăng nhập
      navigate("/login");

    } catch (error) {
      console.error("Logout failed:", error);
      // Xử lý lỗi nếu cần (thường không cần vì logout đơn giản)
    }
  };

  return (
    <div className="flex items-center justify-between bg-white px-6 py-3 shadow-sm">
      {/* Search */}
      <div className="flex items-center bg-gray-100 px-4 py-2 rounded-xl w-1/3">
        <Search size={18} className="text-gray-500 mr-2" />
        <input
          className="bg-transparent outline-none text-sm w-full"
          placeholder="Search by Order ID, User name..."
        />
      </div>

      {/* Right - Modern */}
      <div className="group flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-2xl border hover:shadow-md transition">
        {/* Avatar */}
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-gray-200 to-gray-300">
          <User size={18} className="text-gray-700" />
        </div>

        {/* Name */}
        <span className="text-sm font-medium text-gray-800">
          {username}
        </span>

        {/* Logout (hover) */}
        <button
          onClick={handleLogout}
          className="ml-2 opacity-0 group-hover:opacity-100 transition text-red-500 hover:text-red-600"
          title="Đăng xuất"
        >
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
};

export default Topbar;