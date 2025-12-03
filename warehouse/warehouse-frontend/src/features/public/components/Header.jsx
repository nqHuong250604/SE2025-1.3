import React, { useEffect, useState } from "react";
import logo from "../../../assets/icons/logo.svg";
import { useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
const Header = ({ disableScrollEffect = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Dịch vụ", path: "/services" },
    { label: "Theo dõi", path: "/tracking" },
    { label: "Đơn hàng", path: "/orders" },
    { label: "Địa chỉ", path: "/contact" },
  ];

  const navigateTo = (path) => {
    navigate(path);
  };

  useEffect(() => {
    if (disableScrollEffect) {
      setIsScrolled(true); // luôn dùng background trắng
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [disableScrollEffect]);
  return (
    <div>
      {/* Header */}
      <header
        className={`fixed top-0 left-0 w-full flex items-center justify-between px-10 py-4 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white shadow-md" : "bg-transparent"
        }`}
      >
        <img
          onClick={() => navigateTo("/")}
          src={logo}
          alt="logo"
          className="h-10 w-auto object-contain cursor-pointer"
        />

        <nav
          className={`hidden md:flex gap-8 font-medium transition-colors duration-300 ${
            isScrolled ? "text-gray-800" : "text-white"
          }`}
        >
          {menuItems.map((item, idx) => (
            <span
              key={idx}
              onClick={() => navigate(item.path)}
              className="relative group cursor-pointer hover:text-[#0089ed] transition-colors duration-200"
            >
              {item.label}
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-[#0089ed] group-hover:w-full transition-all duration-200"></span>
            </span>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <ShoppingCart
            onClick={() => navigateTo("/cart")}
            className={`w-6 h-6 transition-colors duration-300 cursor-pointer ${
              isScrolled
                ? "text-gray-800 hover:text-[#0089ed]"
                : "text-white hover:text-[#0089ed]"
            }`}
          />

          <button
            onClick={() => navigateTo("/login")}
            className="text-white px-4 py-2 rounded-md hover:opacity-90 duration-150"
            style={{ backgroundColor: "#0089ed" }}
          >
            Đăng nhập
          </button>
        </div>
      </header>
    </div>
  );
};

export default Header;
