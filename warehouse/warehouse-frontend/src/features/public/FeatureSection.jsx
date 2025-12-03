import React from "react";
import {
  Clock,
  Grid,
  Bell,
  BarChart2,
  ShieldCheck,
  Headphones,
} from "lucide-react";

export default function FeatureSection() {
  const features = [
    {
      icon: <Clock className="w-6 h-6 text-teal-500" />,
      title: "Theo dõi thời gian thực",
      desc: "Cập nhật vị trí đơn hàng liên tục với công nghệ GPS hiện đại, giúp bạn nắm rõ hành trình vận chuyển",
    },
    {
      icon: <Grid className="w-6 h-6 text-teal-500" />,
      title: "Dashboard quản lý",
      desc: "Giao diện trực quan với biểu đồ và thống kê chi tiết, dễ dàng quản lý toàn bộ đơn hàng của bạn",
    },
    {
      icon: <Bell className="w-6 h-6 text-teal-500" />,
      title: "Thông báo tức thì",
      desc: "Nhận cảnh báo ngay lập tức về trạng thái đơn hàng qua email, SMS và ứng dụng di động",
    },
    {
      icon: <BarChart2 className="w-6 h-6 text-teal-500" />,
      title: "Báo cáo chi tiết",
      desc: "Phân tích dữ liệu vận chuyển với báo cáo tùy chỉnh, hỗ trợ ra quyết định kinh doanh hiệu quả",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-teal-500" />,
      title: "Bảo mật cao",
      desc: "Mã hóa dữ liệu đa lớp và xác thực hai yếu tố, đảm bảo thông tin của bạn luôn an toàn",
    },
    {
      icon: <Headphones className="w-6 h-6 text-teal-500" />,
      title: "Hỗ trợ 24/7",
      desc: "Đội ngũ chăm sóc khách hàng chuyên nghiệp sẵn sàng hỗ trợ bạn mọi lúc, mọi nơi",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-extrabold mb-4">
          Tính năng <span style={{ color: "#0089ed" }}>Vượt trội</span>
        </h2>
        <p className="mb-12 text-gray-600 max-w-2xl mx-auto">
          Nền tảng logistics hiện đại với đầy đủ công cụ cần thiết để quản lý và
          tối ưu hóa quy trình vận chuyển của bạn
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition-all duration-300 cursor-pointer group hover:bg-[#0089ed]/10"
            >
              {/* Icon */}
              <div className="w-12 h-12 flex items-center justify-center mb-4 bg-[#0089ed]/10 rounded-md mx-auto transition-colors duration-300 group-hover:bg-[#0089ed]">
                {React.cloneElement(feature.icon, {
                  className: `${feature.icon.props.className} text-[#0089ed] group-hover:text-white transition-colors duration-300`,
                })}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>

              {/* Description */}
              <p className="text-gray-500">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
