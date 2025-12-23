import React, { useState, useCallback } from "react";
import HeaderUser from "../components/HeaderUser";

import {
  FiSettings,
  FiLock,
  FiCreditCard,
  FiMapPin,
  FiPrinter,
  FiBell,
} from "react-icons/fi";
import { AiOutlineDown, AiOutlineUp } from "react-icons/ai";

const ICONS = {
  bank: FiCreditCard,
  address: FiMapPin,
  printer: FiPrinter,
  password: FiLock,
  noti: FiBell,
};

// ===================== SETTING ITEM =====================
const SettingItem = React.memo(
  ({ id, iconName, title, colorClass, children, openSection, toggleSection }) => {
    const IconComponent = ICONS[iconName];

    return (
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
        <button
          onClick={() => toggleSection(id)}
          className="w-full p-3 flex justify-between items-center"
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full bg-opacity-10 ${colorClass}`}>
              {IconComponent && <IconComponent size={20} />}
            </div>
            <span className="font-medium text-gray-800">{title}</span>
          </div>

          <span className="text-gray-500">
            {openSection === id ? <AiOutlineUp size={18} /> : <AiOutlineDown size={18} />}
          </span>
        </button>

        {openSection === id && (
          <div className="p-4 border-t border-gray-100 animate-fadeIn bg-gray-50 rounded-b-xl">
            {children}
          </div>
        )}
      </div>
    );
  }
);

// ===================== MAIN PAGE =====================
const SettingUser = () => {
  const [openSection, setOpenSection] = useState(null);

  const toggleSection = useCallback(
    (sec) => setOpenSection((prev) => (prev === sec ? null : sec)),
    []
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800 font-sans">
      <HeaderUser />

      <div className="pt-[100px] w-full max-w-3xl mx-auto p-4 pb-20">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Cài đặt tài khoản</h1>
          <p className="text-gray-500 mt-1">Quản lý thông tin vận chuyển và thanh toán</p>
        </div>

        <div className="space-y-4">
          {/* 1. COD */}
          <SettingItem
            id="bank"
            iconName="bank"
            title="Tài khoản nhận tiền COD"
            colorClass="text-green-600 bg-green-100"
            openSection={openSection}
            toggleSection={toggleSection}
          >
            <div className="space-y-3">
              <p className="text-sm text-gray-500 mb-2">
                Tiền thu hộ (COD) sẽ được chuyển định kỳ vào tài khoản này.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <select className="p-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-500 outline-none">
                  <option>Chọn ngân hàng</option>
                  <option>Vietcombank</option>
                  <option>Techcombank</option>
                  <option>MB Bank</option>
                </select>

                <input
                  type="text"
                  placeholder="Số tài khoản"
                  className="p-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>

              <input
                type="text"
                placeholder="Tên chủ tài khoản (Viết hoa không dấu)"
                className="w-full p-2 border rounded-lg bg-white focus:ring-2 focus:ring-green-500 outline-none uppercase"
              />

              <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">
                Lưu tài khoản
              </button>
            </div>
          </SettingItem>

          {/* 2. ĐỊA CHỈ */}
          <SettingItem
            id="address"
            iconName="address"
            title="Địa chỉ lấy & trả hàng"
            colorClass="text-orange-600 bg-orange-100"
            openSection={openSection}
            toggleSection={toggleSection}
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ lấy hàng mặc định
                </label>
                <input
                  type="text"
                  defaultValue="123 Đường Láng, Hà Nội"
                  className="w-full p-2 border rounded-lg bg-white outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ nhận hoàn hàng (nếu khác)
                </label>

                <label className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <input type="checkbox" className="w-4 h-4 text-orange-600" />
                  Giống địa chỉ lấy hàng
                </label>
              </div>

              <button className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition">
                Cập nhật địa chỉ
              </button>
            </div>
          </SettingItem>

          {/* 3. MÁY IN */}
          <SettingItem
            id="printer"
            iconName="printer"
            title="Cấu hình in vận đơn"
            colorClass="text-purple-600 bg-purple-100"
            openSection={openSection}
            toggleSection={toggleSection}
          >
            <div className="space-y-3">
              <p className="text-sm text-gray-500">
                Chọn khổ giấy mặc định khi bấm in đơn hàng loạt.
              </p>

              <div className="grid grid-cols-3 gap-4">
                {["A4 (Hóa đơn)", "A6 (Tem dán)", "A7 (Máy in nhiệt)"].map(
                  (size) => (
                    <button
                      key={size}
                      className="p-2 border rounded-lg hover:border-purple-500 hover:bg-purple-50 transition text-sm font-medium text-gray-700"
                    >
                      {size}
                    </button>
                  )
                )}
              </div>
            </div>
          </SettingItem>

          {/* 4. ĐỔI MẬT KHẨU */}
          <SettingItem
            id="password"
            iconName="password"
            title="Đổi mật khẩu & Bảo mật"
            colorClass="text-blue-600 bg-blue-100"
            openSection={openSection}
            toggleSection={toggleSection}
          >
            <div className="space-y-3">
              {["Mật khẩu hiện tại", "Mật khẩu mới", "Nhập lại mật khẩu mới"].map(
                (text) => (
                  <input
                    key={text}
                    type="password"
                    placeholder={text}
                    className="w-full p-2 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                )
              )}

              <button className="w-full py-2 mt-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm">
                Cập nhật mật khẩu
              </button>
            </div>
          </SettingItem>

          {/* 5. THÔNG BÁO */}
          <SettingItem
            id="noti"
            iconName="noti"
            title="Cài đặt thông báo"
            colorClass="text-red-500 bg-red-100"
            openSection={openSection}
            toggleSection={toggleSection}
          >
            <div className="space-y-3">
              {[
                {
                  label: "Nhận email khi có đơn hoàn",
                  defaultChecked: true,
                },
                {
                  label: "Nhận SMS khi có biến động số dư COD",
                  defaultChecked: false,
                },
              ].map((item, i) => (
                <label
                  key={i}
                  className="flex justify-between items-center p-2 border-b last:border-0 border-gray-200"
                >
                  <span>{item.label}</span>
                  <input
                    type="checkbox"
                    defaultChecked={item.defaultChecked}
                    className="w-5 h-5 text-red-600 rounded"
                  />
                </label>
              ))}
            </div>
          </SettingItem>
        </div>
      </div>
    </div>
  );
};

export default SettingUser;
