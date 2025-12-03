import React from "react";
import { Users, PackageCheck, Building2, CheckCircle2 } from "lucide-react";

export default function StatsSection() {
  const stats = [
    {
      value: "500k+",
      label: "Khách hàng tin dùng",
      icon: <Users size={32} />,
    },
    {
      value: "50k+",
      label: "Đơn hàng mỗi ngày",
      icon: <PackageCheck size={32} />,
    },
    {
      value: "200+",
      label: "Đối tác toàn quốc",
      icon: <Building2 size={32} />,
    },
    {
      value: "99.8%",
      label: "Tỉ lệ giao đúng hẹn",
      icon: <CheckCircle2 size={32} />,
    },
  ];

  return (
    <section className="w-full py-20 bg-[#f0f6ff]">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
        {stats.map((item, idx) => (
          <div key={idx} className="flex flex-col items-center">

            {/* ICON — nền đậm + icon trắng */}
            <div className="w-16 h-16 bg-[#0089ed] text-white flex items-center justify-center rounded-2xl mb-4 shadow-lg">
              {item.icon}
            </div>

            {/* VALUE — chữ trắng */}
            <h3 className="text-4xl font-extrabold text-[#0089ed]">
              {item.value}
            </h3>

            {/* LABEL */}
            <p className="text-gray-600 mt-2 text-sm md:text-base">
              {item.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
