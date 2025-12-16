import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const SettingsContent = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="p-6 w-full overflow-y-auto">
      {/* ========= PAGE TITLE ========= */}
      <h1 className="text-2xl font-bold text-gray-800">Cài đặt</h1>
      <p className="text-sm text-gray-500">
        Cấu hình hệ thống và thiết lập tài khoản của bạn
      </p>

      {/* ========= TABS ========= */}
      <div className="flex bg-gray-200 rounded-full p-1 w-full mt-4">
        {[
          "Chung",
          "Thông báo",
          "Bảo mật",
          "Giao diện",
          "Tích hợp",
        ].map((tab, idx) => {
          const keys = ["general", "notifications", "security", "appearance", "integrations"];
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(keys[idx])}
              className={`flex-1 py-1.5 rounded-full text-xs font-medium transition-all
                ${
                  activeTab === keys[idx]
                    ? "bg-white shadow text-black"
                    : "text-gray-600"
                }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* ----------- TAB CONTENT ----------- */}
      <div className="mt-4 space-y-4">
        {/* ================ GENERAL TAB ================ */}
        {activeTab === "general" && (
          <>
            {/* Company Info */}
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="text-base font-semibold mb-3">
                Thông tin công ty
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-xs">Tên công ty</label>
                  <input
                    className="w-full p-2 bg-gray-100 rounded text-sm"
                    defaultValue="LogiTrack Solutions"
                  />
                </div>

                <div>
                  <label className="font-medium text-xs">Email</label>
                  <input
                    className="w-full p-2 bg-gray-100 rounded text-sm"
                    defaultValue="admin@logitrack.com"
                  />
                </div>

                <div>
                  <label className="font-medium text-xs">Số điện thoại</label>
                  <input
                    className="w-full p-2 bg-gray-100 rounded text-sm"
                    defaultValue="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="font-medium text-xs">Múi giờ</label>
                  <select className="w-full p-2 bg-gray-100 rounded text-sm">
                    <option>Giờ miền Đông (UTC-5)</option>
                    <option>Giờ miền Tây (UTC-8)</option>
                  </select>
                </div>
              </div>

              <div className="mt-3">
                <label className="font-medium text-xs">Địa chỉ</label>
                <input
                  className="w-full p-2 bg-gray-100 rounded text-sm"
                  defaultValue="123 Business Ave, New York, NY 10001"
                />
              </div>

              <button className="w-full bg-black text-white py-2 mt-4 rounded-md text-sm">
                Lưu thay đổi
              </button>
            </div>

            {/* System Preferences */}
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="text-base font-semibold mb-3">
                Tuỳ chọn hệ thống
              </h2>

              {[
                {
                  title: "Tự động lưu thay đổi",
                  desc: "Tự động lưu khi bạn chỉnh sửa",
                },
                {
                  title: "Bật ghi log kiểm toán",
                  desc: "Theo dõi toàn bộ thay đổi và hành động người dùng",
                },
                {
                  title: "Sao lưu dữ liệu",
                  desc: "Tự động sao lưu dữ liệu hàng ngày",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b last:border-none"
                >
                  <div>
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-gray-500 text-xs">{item.desc}</p>
                  </div>

                  <label className="relative inline-flex cursor-pointer items-center">
                    <input type="checkbox" defaultChecked className="sr-only peer" />
                    <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-black transition-all"></div>
                    <div className="absolute left-1 top-0.5 w-3.5 h-3.5 bg-white rounded-full peer-checked:translate-x-5 transition-all"></div>
                  </label>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ================ NOTIFICATIONS TAB ================ */}
        {activeTab === "notifications" && (
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-base font-semibold mb-3">
              Cài đặt thông báo
            </h2>

            {[
              { title: "Thông báo Email", desc: "Nhận thông tin qua email" },
              { title: "Thông báo đẩy", desc: "Thông báo trên trình duyệt" },
              { title: "Cảnh báo SMS", desc: "Thông báo quan trọng qua SMS" },
              { title: "Cảnh báo tồn kho thấp", desc: "Thông báo khi sắp hết hàng" },
              { title: "Cập nhật giao hàng", desc: "Trạng thái giao nhận đơn hàng" },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b last:border-none"
              >
                <div>
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked={i !== 2}
                  />
                  <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-black transition-all"></div>
                  <div className="absolute left-1 top-0.5 w-3.5 h-3.5 bg-white rounded-full peer-checked:translate-x-5 transition-all"></div>
                </label>
              </div>
            ))}
          </div>
        )}

        {/* ================ SECURITY TAB ================ */}
        {activeTab === "security" && (
          <>
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="text-base font-semibold mb-3">
                Cài đặt bảo mật
              </h2>

              <label className="font-medium text-xs">Mật khẩu hiện tại</label>
              <input type="password" className="w-full p-2 bg-gray-100 rounded text-sm mt-1" />

              <label className="font-medium text-xs mt-3 block">Mật khẩu mới</label>
              <input type="password" className="w-full p-2 bg-gray-100 rounded text-sm mt-1" />

              <label className="font-medium text-xs mt-3 block">Xác nhận mật khẩu mới</label>
              <input type="password" className="w-full p-2 bg-gray-100 rounded text-sm mt-1" />

              <button className="mt-3 bg-black text-white py-2 px-4 rounded-md text-sm">
                Cập nhật mật khẩu
              </button>
            </div>

            <div className="bg-white rounded-xl shadow p-4 mt-4">
              <h2 className="text-base font-semibold mb-2">
                Xác thực hai lớp (2FA)
              </h2>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Bật 2FA</p>
                  <p className="text-gray-500 text-xs">
                    Tăng cường bảo mật tài khoản
                  </p>
                </div>

                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-black transition-all"></div>
                  <div className="absolute left-1 top-0.5 w-3.5 h-3.5 bg-white rounded-full peer-checked:translate-x-5 transition-all"></div>
                </label>
              </div>

              <button className="mt-2 border px-3 py-1 rounded-md text-sm">
                Thiết lập ứng dụng xác thực
              </button>
            </div>
          </>
        )}

        {/* ================ APPEARANCE TAB ================ */}
        {activeTab === "appearance" && (
          <div className="bg-white rounded-xl shadow p-4 space-y-2">
            <h2 className="text-base font-semibold mb-2">
              Cài đặt giao diện
            </h2>

            {[
              { label: "Chủ đề", options: ["Sáng", "Tối", "Mặc định"] },
              { label: "Ngôn ngữ", options: ["Tiếng Anh", "Tiếng Việt", "Tây Ban Nha", "Pháp"] },
              { label: "Định dạng ngày", options: ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY/MM/DD"] },
            ].map((item, i) => (
              <div key={i} className="max-w-xs">
                <label className="font-medium text-xs">{item.label}</label>
                <div className="relative">
                  <select className="p-2 pr-10 bg-gray-100 rounded text-sm appearance-none w-full">
                    {item.options.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>
                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================ INTEGRATIONS TAB ================ */}
        {activeTab === "integrations" && (
          <div className="bg-white rounded-xl shadow p-4 space-y-2">
            <h2 className="text-base font-normal mb-2">
              Tích hợp API
            </h2>

            {[
              {
                title: "API vận chuyển",
                desc: "Kết nối với đơn vị giao hàng",
                status: "Đã kết nối",
                connected: true,
              },
              {
                title: "Cổng thanh toán",
                desc: "Xử lý thanh toán và hoá đơn",
                status: "Kết nối",
                connected: false,
              },
              {
                title: "Quản lý kho",
                desc: "Đồng bộ hệ thống kho",
                status: "Kết nối",
                connected: false,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between border p-3 rounded-md"
              >
                <div>
                  <p className="text-sm">{item.title}</p>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>

                <button
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    item.connected
                      ? "bg-green-100 text-green-700 cursor-default"
                      : "bg-black text-white hover:opacity-80"
                  }`}
                >
                  {item.status}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsContent;
