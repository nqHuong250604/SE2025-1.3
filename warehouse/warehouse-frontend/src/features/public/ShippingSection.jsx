import React, { useState } from "react";
import { ShoppingCart } from "lucide-react";
import img1 from "../../assets/images/shipping1.jpg";
import img2 from "../../assets/images/shipping2.jpg";
import img3 from "../../assets/images/shipping3.jpg";
import img4 from "../../assets/images/shipping4.jpg";
import img5 from "../../assets/images/shipping5.jpg";
import img6 from "../../assets/images/shipping6.jpg";

export default function ShippingSection() {
  const categories = [
    "Tất cả",
    "Nội thành",
    "Liên tỉnh",
    "Hàng nặng",
    "Quốc tế",
  ];

  const [active, setActive] = useState("Tất cả");

  const services = [
    {
      img: img1,
      cate: "Nội thành",
      title: "Gói vận chuyển Tiêu chuẩn",
      desc: "Dịch vụ vận chuyển tiêu chuẩn trong nội thành, giao hàng trong 2-3 ngày",
      price: "50.000đ",
      kg: "0-5kg",
    },
    {
      img: img2,
      cate: "Nội thành",
      title: "Gói vận chuyển Nhanh",
      desc: "Dịch vụ vận chuyển nhanh trong nội thành, giao hàng trong 24 giờ",
      price: "80.000đ",
      kg: "0-5kg",
    },
    {
      img: img3,
      cate: "Liên tỉnh",
      title: "Gói vận chuyển Liên tỉnh",
      desc: "Dịch vụ vận chuyển liên tỉnh, giao hàng trong 3-5 ngày",
      price: "120.000đ",
      kg: "0-10kg",
    },
    {
      img: img4,
      cate: "Nội thành",
      title: "Gói vận chuyển Hỏa tốc",
      desc: "Dịch vụ vận chuyển hỏa tốc, giao hàng trong 4-6 giờ",
      price: "150.000đ",
      kg: "0-3kg",
    },
    {
      img: img5,
      cate: "Hàng nặng",
      title: "Gói vận chuyển Hàng nặng",
      desc: "Dịch vụ vận chuyển hàng nặng, trọng lượng 10-50kg",
      price: "200.000đ",
      kg: "10-50kg",
    },
    {
      img: img6,
      cate: "Quốc tế",
      title: "Gói vận chuyển Quốc tế",
      desc: "Dịch vụ vận chuyển quốc tế, giao hàng trong 7-14 ngày",
      price: "500.000đ",
      kg: "0-20kg",
    },
  ];

  const filtered =
    active === "Tất cả" ? services : services.filter((s) => s.cate === active);

  return (
    <section className="w-full py-20 bg-white">
      <h2 className="text-4xl font-extrabold text-center">
        Dịch vụ vận chuyển
      </h2>
      <p className="text-gray-600 text-center mt-3 mb-8">
        Chọn gói dịch vụ phù hợp với nhu cầu của bạn
      </p>

      {/* Categories */}
      <div className="flex justify-center gap-3 mb-12 flex-wrap">
        {categories.map((c, i) => (
          <button
            key={i}
            onClick={() => setActive(c)}
            className={`px-5 py-2 rounded-full border transition-all ${
              active === c
                ? "bg-[#0089ed] text-white border-[#0089ed]"
                : "bg-[#0089ed]/10 text-[#0089ed] border-[#0089ed]/30 hover:bg-[#0089ed]/20"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-6">
        {filtered.map((item, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border flex flex-col"
          >
            <img src={item.img} className="w-full h-56 object-cover" />

            <div className="p-5 flex flex-col flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm px-3 py-1 rounded-full bg-[#0089ed]/10 text-[#0089ed] font-medium">
                  {item.cate}
                </span>
                <span className="text-sm text-gray-500">{item.kg}</span>
              </div>

              <h3 className="text-lg font-bold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{item.desc}</p>

              {/* Dùng mt-auto để đẩy phần giá + nút xuống dưới */}
              <div className="flex justify-between items-center mt-auto">
                <p className="text-[#0089ed] font-bold text-xl leading-none">
                  {item.price}
                </p>

                <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0089ed] text-white hover:bg-[#0089ed]/90 transition">
                  <ShoppingCart size={18} />
                  Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
