import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Settings, UserCircle, ChevronDown } from "lucide-react"; 
import logo from "../../../assets/icons/logo.svg";
import { getCurrentUserAPI, logout } from "../../auth/authServices"; 


// 1. Logo Component
const FastShipLogo = ({ navigateTo }) => {
  return (
    <div
      onClick={() => navigateTo("/user")}
      className="flex items-center space-x-2 cursor-pointer"
    >
      <img src={logo} alt="logo" className="h-10 w-auto object-contain" />
      <span className="text-xl font-extrabold text-gray-900">Logistic Web</span>
    </div>
  );
};


// 2. Profile Dropdown Component
const ProfileDropdown = ({ navigateTo }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // --- STATE ĐỂ LƯU THÔNG TIN NGƯỜI DÙNG TỪ API ---
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true)

  // --- LOGIC GỌI API LẤY THÔNG TIN NGƯỜI DÙNG (CHỈ GỌI 1 LẦN) ---
  useEffect(() => {
    const fetchUser = async () => {
      // Bỏ qua nếu không có token trong LocalStorage
      if (!localStorage.getItem('accessToken')) {
        setIsLoading(false);
        return;
      }

      try {
        const data = await getCurrentUserAPI(); 
        setUserData(data);
      } catch (error) {
        console.error("Lỗi lấy thông tin người dùng:", error);
        handleLogout(false); 
        navigateTo("/login");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUser();
  }, [navigateTo]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- HÀM XỬ LÝ ĐĂNG XUẤT ---
  const handleLogout = (shouldRedirect = true) => {
    logout(); 
    if (shouldRedirect) {
      navigateTo("/login");
    }
  };

  const userName = userData?.full_name || (isLoading ? "Đang tải..." : "Khách");
  const userEmail = userData?.email || (isLoading ? "..." : "Người dùng");
  
  const userInitial = userName.split(" ").slice(-1)[0].charAt(0).toUpperCase() || '?';
  
  if (isLoading && !userData) {
    return <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>;
  }

  const menuItems = [
    { label: "Hồ sơ cá nhân", icon: UserCircle, path: "/profile" },
    { label: "Cài đặt", icon: Settings, path: "/settings" },
    { label: "Đăng xuất", icon: LogOut, action: () => handleLogout(true), isLogout: true }, // Gọi hàm đăng xuất
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 p-1 pr-2 rounded-full border border-gray-200 bg-white hover:bg-gray-50 transition duration-200 focus:outline-none"
        disabled={isLoading} 
      >
        {/* Avatar/Initial */}
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-500 text-white font-medium text-sm shadow-sm">
          {userInitial} 
        </div>

        {/* Icon dropdown */}
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? "rotate-180" : "rotate-0"}`} 
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 z-50">
          <div className="p-4 border-b border-gray-100 flex items-center space-x-3">
            <UserCircle className="w-7 h-7 text-indigo-500" />
            <div>
              <p className="font-semibold text-gray-900">{userName}</p> 
              <p className="text-xs text-gray-500">{userEmail}</p> 
            </div>
          </div>

          <div className="p-1 space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => {
                  setIsOpen(false);
                  if (item.action) {
                    item.action();
                  } else {
                    navigateTo(item.path);
                  }
                }}
                className={`w-full text-left flex items-center p-3 rounded-lg text-sm transition ${
                  item.isLogout
                    ? "text-red-600 hover:bg-red-50"
                    : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};


// 3. Header Chính Component 
const HeaderUser = () => {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Trang chủ", path: "/user" },
    { label: "Theo dõi", path: "/transaction" },
    { label: "Quản lý kho", path: "/inventory" },
  ];

  const navigateTo = (path) => navigate(path);

  return (
    <header
      className="fixed top-0 left-0 w-full flex items-center justify-between px-10 py-4 z-50 
               bg-white shadow-lg border-b border-gray-100"
    >
      <FastShipLogo navigateTo={navigateTo} />

      <nav className="hidden md:flex gap-8 text-gray-800 font-medium">
        {menuItems.map((item, idx) => (
          <span
            key={idx}
            onClick={() => navigate(item.path)}
            className="relative group cursor-pointer hover:text-[#0089ed] transition"
          >
            {item.label}
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-[#0089ed] group-hover:w-full transition-all"></span>
          </span>
        ))}
      </nav>

      <div className="flex items-center gap-4">
        <ProfileDropdown navigateTo={navigateTo} />
      </div>
    </header>
  );
};

export default HeaderUser;
