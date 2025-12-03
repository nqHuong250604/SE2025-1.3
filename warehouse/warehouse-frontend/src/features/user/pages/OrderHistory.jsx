import React, { useState } from "react";
import Header from "../../public/components/Header";
import Footer from "../../public/components/Footer";
import { Search, RefreshCcw, Calendar, Barcode, MapPin, ShoppingCart } from "lucide-react";

export default function OrderHistory() {
  const [statusFilter, setStatusFilter] = useState("all");

  // ❗ Dữ liệu mẫu (replace bằng API thật sau)
  const orders = [
    {
      id: "ORD-2024-001",
      date: "15/1/2024",
      tracking: "VN123456789",
      status: "delivered",
      from: "Hà Nội",
      to: "Hồ Chí Minh",
      weight: "3kg",
      service: "Gói vận chuyển Nhanh",
      quantity: 1,
      price: 80000,
    },
    {
      id: "ORD-2024-002",
      date: "18/1/2024",
      tracking: "VN987654321",
      status: "shipping",
      from: "Đà Nẵng",
      to: "Cần Thơ",
      weight: "5kg",
      service: "Gói tiết kiệm",
      quantity: 2,
      price: 120000,
    },
    {
      id: "ORD-2024-003",
      date: "18/1/2024",
      tracking: "VN987654322",
      status: "processing",
      from: "Hà Nội",
      to: "Đà Nẵng",
      weight: "2kg",
      service: "Gói tiêu chuẩn",
      quantity: 1,
      price: 50000,
    },
  ];

  // ❗ THAY BẰNG AUTH THẬT
  const [isLoggedIn, setIsLoggedIn] = useState(false); // true nếu đã đăng nhập

  const filteredOrders =
    statusFilter === "all"
      ? orders
      : orders.filter((o) => o.status === statusFilter);

  return (
    <div className="min-h-screen bg-[#f0f6ff] flex flex-col">
      <Header disableScrollEffect />

      <div className="flex-1 max-w-7xl mx-auto px-6 md:px-8 pt-[120px] pb-20 w-full">
        <h1 className="text-3xl font-semibold text-[#0a2b47] mb-6">
          Lịch sử đơn hàng
        </h1>

        {!isLoggedIn ? (
          // Nếu chưa đăng nhập
          <div className="bg-white py-16 px-8 rounded-2xl shadow-md text-center border border-[#e7edf5]">
            <ShoppingCart size={60} className="mx-auto text-gray-400" />
            <h2 className="text-2xl font-semibold mt-4">Bạn chưa đăng nhập</h2>
            <p className="text-gray-500 mt-2">
              Vui lòng đăng nhập để xem lịch sử đơn hàng của bạn.
            </p>

            <div className="flex justify-center gap-4 mt-6">
              <button onClick={() => setIsLoggedIn(true)} className="px-6 py-3 bg-[#0089ed] text-white rounded-lg hover:opacity-90">
                Đăng nhập
              </button>

              <button className="px-6 py-3 border border-[#0089ed] text-[#0089ed] rounded-lg hover:bg-[#e7f5ff]">
                Tiếp tục mua hàng
              </button>
            </div>
          </div>
        ) : (
          // Nếu đã đăng nhập, hiển thị danh sách đơn hàng
          <>
            {/* ====================== THANH TÌM KIẾM + BỘ LỌC ====================== */}
            <div className="bg-white px-8 py-6 rounded-2xl shadow-md mb-8 border border-[#e7edf5]">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Tìm kiếm */}
                <div className="flex items-center gap-2 bg-[#f5f8fc] px-4 py-3 rounded-xl flex-1">
                  <Search className="text-gray-500 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Nhập mã đơn hàng hoặc mã vận đơn"
                    className="bg-transparent w-full outline-none"
                  />
                </div>

                {/* Trạng thái */}
                <div className="flex items-center gap-2 flex-wrap">
                  {[
                    { key: "all", label: "Tất cả", color: "bg-[#0089ed] text-white" },
                    { key: "processing", label: "Đang xử lý", color: "bg-orange-500 text-white" },
                    { key: "shipping", label: "Đang vận chuyển", color: "bg-blue-500 text-white" },
                    { key: "delivered", label: "Đã giao", color: "bg-green-500 text-white" },
                  ].map((filter) => (
                    <button
                      key={filter.key}
                      onClick={() => setStatusFilter(filter.key)}
                      className={`px-4 py-2 rounded-lg border border-gray-300 font-medium transition-colors duration-200
                        ${
                          statusFilter === filter.key
                            ? filter.color
                            : "bg-[#f2f6fa] text-gray-700 hover:bg-gray-100"
                        }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>

              <button className="mt-4 flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-[#f3f7fc] transition">
                <RefreshCcw size={16} /> Đặt lại bộ lọc
              </button>
            </div>

            {/* ====================== DANH SÁCH ĐƠN HÀNG ====================== */}
            {filteredOrders.map((order, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl shadow-md border border-[#e7edf5] mb-6 w-full"
              >
                {/* HEADER ĐƠN */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0">
                  <div>
                    <h2 className="text-lg font-semibold text-[#0a2b47]">
                      {order.id}
                    </h2>

                    <span
                      className={`mt-1 inline-block text-sm px-3 py-1 rounded-full font-medium ${
                        order.status === "delivered"
                          ? "bg-green-100 text-green-600"
                          : order.status === "shipping"
                          ? "bg-blue-100 text-blue-600"
                          : order.status === "processing"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {order.status === "delivered"
                        ? "Đã giao"
                        : order.status === "shipping"
                        ? "Đang vận chuyển"
                        : order.status === "processing"
                        ? "Đang xử lý"
                        : "Không xác định"}
                    </span>

                    <div className="flex flex-col md:flex-row md:items-center gap-4 mt-3 text-gray-600 text-sm">
                      <div className="flex items-center gap-1">
                        <Calendar size={16} /> {order.date}
                      </div>

                      <div className="flex items-center gap-1">
                        <Barcode size={16} /> {order.tracking}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-[#00994d] font-bold text-lg">
                      {order.price.toLocaleString()}đ
                    </p>
                    <p className="text-[#0089ed] text-sm cursor-pointer hover:underline">
                      Theo dõi đơn hàng →
                    </p>
                  </div>
                </div>

                {/* CHI TIẾT */}
                <hr className="border-t border-[#d9e3ee] my-6" />

                <div className="grid md:grid-cols-2 gap-8 mt-6">
                  {/* Vận chuyển */}
                  <div>
                    <h3 className="font-semibold text-[#0a2b47]">
                      Thông tin vận chuyển
                    </h3>

                    <div className="mt-3 space-y-2 text-gray-700">
                      <p className="flex items-center gap-2">
                        <MapPin size={16} className="text-[#0089ed]" /> Từ:{" "}
                        <span className="font-medium">{order.from}</span>
                      </p>

                      <p className="flex items-center gap-2">
                        <MapPin size={16} className="text-red-500" /> Đến:{" "}
                        <span className="font-medium">{order.to}</span>
                      </p>

                      <p>Trọng lượng: {order.weight}</p>
                    </div>
                  </div>

                  {/* Chi tiết đơn */}
                  <div>
                    <h3 className="font-semibold text-[#0a2b47]">
                      Chi tiết đơn hàng
                    </h3>

                    <div className="mt-3 flex justify-between text-gray-700">
                      <div>
                        <p>{order.service}</p>
                        <p>Số lượng: {order.quantity}</p>
                      </div>

                      {/* Giá tiền */}
                      <p className="font-semibold text-[#0a2b47]">
                        {order.price}đ
                      </p>
                    </div>
                  </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="grid md:grid-cols-3 gap-4 mt-6">
                  <button className="bg-[#0089ed] text-white py-3 rounded-xl font-medium hover:bg-[#0074c7] transition">
                    Theo dõi đơn hàng
                  </button>

                  <button className="bg-[#eef4fa] py-3 rounded-xl hover:bg-[#e4edf7] transition">
                    Đặt lại
                  </button>

                  <button className="bg-white py-3 border rounded-xl hover:bg-[#f8fafc] transition">
                    Chi tiết
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
