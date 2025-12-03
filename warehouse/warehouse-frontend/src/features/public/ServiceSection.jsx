import React from "react";
import { CheckCircle } from "lucide-react";
import service1 from "../../assets/images/service1.jpg";
import service2 from "../../assets/images/service2.jpg";
import service3 from "../../assets/images/service3.jpg";

export default function ServiceSection() {
  return (
    <section className="w-full py-20 bg-white">
      {/* Title */}
      <div className="text-center mb-14">
        <h2 className="text-4xl font-extrabold">
          Dịch vụ <span style={{ color: "#0089ed" }}>Chuyên nghiệp</span>
        </h2>
        <p className="mt-3 text-gray-600 max-w-xl mx-auto">
          Đa dạng giải pháp vận chuyển phù hợp với mọi nhu cầu từ cá nhân đến
          doanh nghiệp lớn
        </p>
      </div>

      {/* Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
        {/* Card Template */}
        {[
          {
            img: service1,
            title: "Giao hàng nhanh",
            desc: "Dịch vụ giao hàng trong ngày và giao hàng hoả tốc với cam kết thời gian cụ thể",
            items: [
              "Giao trong 2-4 giờ",
              "Theo dõi trực tiếp",
              "Bảo hiểm hàng hóa",
            ],
          },
          {
            img: service2,
            title: "Vận chuyển quốc tế",
            desc: "Kết nối toàn cầu với mạng lưới đối tác uy tín tại hơn 200 quốc gia và vùng lãnh thổ",
            items: [
              "Thủ tục hải quan",
              "Vận chuyển đa phương thức",
              "Tư vấn miễn phí",
            ],
          },
          {
            img: service3,
            title: "Kho bãi & Lưu trữ",
            desc: "Hệ thống kho bãi hiện đại với công nghệ quản lý tự động và bảo mật cao",
            items: [
              "Kho tiêu chuẩn quốc tế",
              "Kiểm soát nhiệt độ",
              "Camera 24/7",
            ],
          },
        ].map((card, index) => (
          <div
            key={index}
            className="group bg-white shadow-lg rounded-xl overflow-hidden border
                       hover:shadow-2xl transition-shadow duration-300"
          >
            <img
              src={card.img}
              className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />

            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{card.title}</h3>
              <p className="text-gray-600 mb-4">{card.desc}</p>

              <ul className="space-y-2">
                {card.items.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-[#0089ed]" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
