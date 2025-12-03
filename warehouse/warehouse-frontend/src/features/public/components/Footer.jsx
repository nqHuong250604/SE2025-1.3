// Footer.jsx
import React from "react";
import {
  Facebook,
  Twitter,
  Linkedin,
  MapPin,
  Phone,
  Mail,
  Car,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white pt-16 pb-6 border-t">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-6">
        {/* Logo + mô tả */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-[#0089ed] flex items-center justify-center rounded-lg text-white">
              <Car size={22} />
            </div>

            <h3 className="text-xl font-bold">FastShip</h3>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed">
            Giải pháp logistics hàng đầu Việt Nam với công nghệ hiện đại và dịch
            vụ chuyên nghiệp
          </p>

          {/* Social */}
          <div className="flex gap-3 mt-4">
            <div
              className="w-9 h-9 bg-gray-100 flex items-center justify-center rounded-lg cursor-pointer 
                  hover:bg-[#0089ed] transition group"
            >
              <Facebook
                size={18}
                className="text-gray-600 group-hover:text-white transition"
              />
            </div>

            <div
              className="w-9 h-9 bg-gray-100 flex items-center justify-center rounded-lg cursor-pointer 
                  hover:bg-[#0089ed] transition group"
            >
              <Twitter
                size={18}
                className="text-gray-600 group-hover:text-white transition"
              />
            </div>

            <div
              className="w-9 h-9 bg-gray-100 flex items-center justify-center rounded-lg cursor-pointer 
                  hover:bg-[#0089ed] transition group"
            >
              <Linkedin
                size={18}
                className="text-gray-600 group-hover:text-white transition"
              />
            </div>
          </div>
        </div>

        {/* Dịch vụ */}
        <div>
          <h4 className="font-semibold mb-3">Dịch vụ</h4>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li className="hover:text-[#0089ed] transition cursor-pointer">
              Giao hàng nhanh
            </li>
            <li className="hover:text-[#0089ed] transition cursor-pointer">
              Vận chuyển quốc tế
            </li>
            <li className="hover:text-[#0089ed] transition cursor-pointer">
              Kho bãi & Lưu trữ
            </li>
            <li className="hover:text-[#0089ed] transition cursor-pointer">
              Tư vấn logistics
            </li>
          </ul>
        </div>

        {/* Công ty */}
        <div>
          <h4 className="font-semibold mb-3">Công ty</h4>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li className="hover:text-[#0089ed] transition cursor-pointer">
              Về chúng tôi
            </li>
            <li className="hover:text-[#0089ed] transition cursor-pointer">
              Tin tức
            </li>
            <li className="hover:text-[#0089ed] transition cursor-pointer">
              Tuyển dụng
            </li>
            <li className="hover:text-[#0089ed] transition cursor-pointer">
              Liên hệ
            </li>
          </ul>
        </div>

        {/* Liên hệ */}
        <div>
          <h4 className="font-semibold mb-3">Liên hệ</h4>

          <ul className="space-y-3 text-gray-600 text-sm">
            <li className="flex items-center gap-2 group cursor-pointer">
              <MapPin
                size={18}
                className="text-[#0089ed] group-hover:text-[#0089ed] transition"
              />
              <span className="group-hover:text-[#0089ed] transition">
                123 Đường Nguyễn Huệ, Q.1, TP.HCM
              </span>
            </li>

            <li className="flex items-center gap-2 group cursor-pointer">
              <Phone
                size={18}
                className="text-[#0089ed] group-hover:text-[#0089ed] transition"
              />
              <span className="group-hover:text-[#0089ed] transition">
                1900 1234
              </span>
            </li>

            <li className="flex items-center gap-2 group cursor-pointer">
              <Mail
                size={18}
                className="text-[#0089ed] group-hover:text-[#0089ed] transition"
              />
              <span className="group-hover:text-[#0089ed] transition">
                support@fastship.vn
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-10 border-t pt-5 text-center text-sm text-gray-500">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between px-6">
          <p>© 2024 FastShip. All rights reserved.</p>

          <div className="flex gap-6 mt-3 md:mt-0">
            <span className="cursor-pointer transition hover:text-[#0089ed]">
              Chính sách bảo mật
            </span>
            <span className="cursor-pointer transition hover:text-[#0089ed]">
              Điều khoản sử dụng
            </span>
            <span className="cursor-pointer transition hover:text-[#0089ed]">
              Powered by Readdy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
