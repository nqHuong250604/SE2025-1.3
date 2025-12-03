import React from "react";
import { ScanLine, Smartphone, Mail, Search } from "lucide-react";

export default function TrackingSection() {
  return (
    <section className="w-full bg-white py-20 flex flex-col items-center text-center">
      <h2 className="text-4xl font-bold">
        Theo dõi <span className="text-[#0089ed]">Đơn hàng</span>
      </h2>
      <p className="mt-3 text-gray-600 max-w-xl">
        Nhập mã vận đơn để kiểm tra trạng thái và vị trí hiện tại của hàng hóa
      </p>

      {/* Input + button */}
      <div className="mt-8 w-full max-w-3xl flex items-center gap-3 bg-white p-4 shadow-lg rounded-xl">
        <input
          type="text"
          placeholder="Nhập mã vận đơn (VD: VN123456789)"
          className="flex-1 border border-gray-300 rounded-md px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#0089ed]"
        />

        {/* Button with icon */}
        <button className="bg-[#0089ed] text-white px-6 py-3 rounded-md font-medium hover:opacity-90 flex items-center gap-2">
          <Search size={20} />
          Tra cứu ngay
        </button>
      </div>

      {/* Quick features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14 max-w-4xl w-full">
        {/* Scan QR */}
        <div className="flex items-center gap-4 group">
          <div className="w-14 h-14 bg-[#0089ed]/10 text-[#0089ed] flex items-center justify-center rounded-xl group-hover:bg-[#0089ed] group-hover:text-white transition">
            <ScanLine size={28} />
          </div>
          <div className="text-left">
            <p className="font-semibold">Quét mã QR</p>
            <p className="text-sm text-gray-500">
              Sử dụng camera để quét mã vận đơn
            </p>
          </div>
        </div>

        {/* Mobile App */}
        <div className="flex items-center gap-4 group">
          <div className="w-14 h-14 bg-[#0089ed]/10 text-[#0089ed] flex items-center justify-center rounded-xl group-hover:bg-[#0089ed] group-hover:text-white transition">
            <Smartphone size={28} />
          </div>
          <div className="text-left">
            <p className="font-semibold">Ứng dụng di động</p>
            <p className="text-sm text-gray-500">
              Theo dõi mọi lúc với app của chúng tôi
            </p>
          </div>
        </div>

        {/* Email Notification */}
        <div className="flex items-center gap-4 group">
          <div className="w-14 h-14 bg-[#0089ed]/10 text-[#0089ed] flex items-center justify-center rounded-xl group-hover:bg-[#0089ed] group-hover:text-white transition">
            <Mail size={28} />
          </div>
          <div className="text-left">
            <p className="font-semibold">Thông báo Email</p>
            <p className="text-sm text-gray-500">
              Nhận cập nhật tự động qua email
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
