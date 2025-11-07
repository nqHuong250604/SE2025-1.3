import React from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer
} from "recharts";

const doanhThuThang = [
  { thang: "Jan", doanhThu: 120000000 },
  { thang: "Feb", doanhThu: 95000000 },
  { thang: "Mar", doanhThu: 135000000 },
  { thang: "Apr", doanhThu: 160000000 },
  { thang: "May", doanhThu: 180000000 },
  { thang: "Jun", doanhThu: 210000000 },
];

const donHangTheoTrangThai = [
  { trangThai: "Đang xử lý", soLuong: 120 },
  { trangThai: "Vận chuyển", soLuong: 90 },
  { trangThai: "Hoàn thành", soLuong: 420 },
  { trangThai: "Hủy", soLuong: 35 },
];

const tonKho = [
  { sanPham: "Gạo ST25", soLuong: 12 },
  { sanPham: "Dầu ăn Neptune", soLuong: 8 },
  { sanPham: "Nước mắm Nam Ngư", soLuong: 5 },
  { sanPham: "Đường trắng", soLuong: 25 },
  { sanPham: "Bột giặt Omo", soLuong: 9 },
];

const hieuSuatNhanVien = [
  { ten: "Nguyễn Văn A", thanhCong: 120, tre: 10, huy: 5 },
  { ten: "Trần Văn B", thanhCong: 140, tre: 15, huy: 3 },
  { ten: "Lê Thị C", thanhCong: 100, tre: 8, huy: 2 },
];

const topKhachHang = [
  { ten: "Minh Phạm", don: 35 },
  { ten: "Lan Nguyễn", don: 30 },
  { ten: "Tuấn Lê", don: 28 },
  { ten: "Hương Trần", don: 26 },
  { ten: "Hoàng Đỗ", don: 22 },
];

const COLORS = ["#22c55e", "#3b82f6", "#facc15", "#ef4444"];

const ReportsDashboard = () => {
  return (
    <div className="p-8 bg-gray-50 min-h-screen space-y-8">
      {/* === KPI Tổng quan === */}
      <div className="grid grid-cols-5 gap-4">
        <KpiCard title="Doanh thu tháng" value="210.000.000₫" color="text-green-600" />
        <KpiCard title="Đơn hoàn thành" value="420" color="text-blue-600" />
        <KpiCard title="Tỷ lệ giao đúng hạn" value="95%" color="text-green-500" />
        <KpiCard title="Sản phẩm tồn kho thấp" value="5" color="text-red-500" />
        <KpiCard title="Tổng khách hàng" value="1.240" color="text-yellow-500" />
      </div>

      {/* === Biểu đồ doanh thu === */}
      <Card title="Doanh thu theo tháng">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={doanhThuThang}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="thang" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="doanhThu" stroke="#3b82f6" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* === Biểu đồ đơn hàng + Tồn kho === */}
      <div className="grid grid-cols-2 gap-6">
        <Card title="Phân bố đơn hàng theo trạng thái">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={donHangTheoTrangThai}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="trangThai" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="soLuong" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Tỷ lệ đơn hàng theo trạng thái">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={donHangTheoTrangThai}
                dataKey="soLuong"
                nameKey="trangThai"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {donHangTheoTrangThai.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* === Tồn kho thấp === */}
      <Card title="Top sản phẩm tồn kho thấp">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-2 px-3">Sản phẩm</th>
              <th className="py-2 px-3 text-center">Số lượng</th>
            </tr>
          </thead>
          <tbody>
            {tonKho.map((sp, index) => (
              <tr key={index} className="border-b">
                <td className="py-2 px-3">{sp.sanPham}</td>
                <td
                  className={`py-2 px-3 text-center font-semibold ${
                    sp.soLuong < 10 ? "text-red-500" : "text-gray-800"
                  }`}
                >
                  {sp.soLuong}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* === Hiệu suất nhân viên === */}
      <Card title="Hiệu suất giao hàng theo nhân viên">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={hieuSuatNhanVien}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="ten" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="thanhCong" fill="#22c55e" />
            <Bar dataKey="tre" fill="#facc15" />
            <Bar dataKey="huy" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* === Top khách hàng === */}
      <Card title="Top 5 khách hàng có nhiều đơn nhất">
        <ul className="divide-y">
          {topKhachHang.map((kh, index) => (
            <li key={index} className="flex justify-between py-2">
              <span>{kh.ten}</span>
              <span className="font-semibold text-blue-600">{kh.don} đơn</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* === Xuất báo cáo === */}
      <div className="flex justify-end mt-6">
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          📊 Xuất PDF
        </button>
        <button className="ml-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
          💾 Xuất Excel
        </button>
      </div>
    </div>
  );
};

// ==== COMPONENT PHỤ ====
const KpiCard = ({ title, value, color }) => (
  <div className="bg-white rounded-2xl shadow p-4 text-center">
    <h3 className="text-gray-500 text-sm">{title}</h3>
    <p className={`text-2xl font-bold ${color}`}>{value}</p>
  </div>
);

const Card = ({ title, children }) => (
  <div className="bg-white p-5 rounded-2xl shadow">
    <h2 className="text-lg font-semibold mb-3 text-gray-700">{title}</h2>
    {children}
  </div>
);

export default ReportsDashboard;
