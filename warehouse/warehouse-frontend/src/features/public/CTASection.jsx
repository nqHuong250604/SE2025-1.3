// CTASection.jsx
import React from "react";

export default function CTASection() {
  return (
    <section className="w-full bg-[#0a1128] text-center py-24 px-4">
      <h2 className="text-3xl md:text-4xl font-bold text-white">
        Sẵn sàng bắt đầu với <span className="text-[#0089ed]">FastShip?</span>
      </h2>

      <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
        Đăng ký ngay hôm nay để trải nghiệm dịch vụ logistics chuyên nghiệp và
        nhận ưu đãi đặc biệt dành cho khách hàng mới
      </p>

      <div className="flex justify-center gap-4 mt-8">
        <button className="px-6 py-3 bg-[#0089ed] text-white font-semibold rounded-lg hover:opacity-90 transition">
          Đăng ký miễn phí
        </button>

        <button className="px-6 py-3 bg-[#1b233f] text-white border border-gray-500 rounded-lg hover:bg-[#222c4a] transition">
          Tìm hiểu thêm
        </button>
      </div>
    </section>
  );
}
