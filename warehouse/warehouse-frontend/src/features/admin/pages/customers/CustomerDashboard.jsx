import React from "react";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import { FiSearch } from "react-icons/fi";

const customers = [
  {
    name: "Acme Corporation",
    code: "CUST001",
    email: "contact@acme.com",
    phone: "+1 555-0123",
    orders: 45,
    spent: 12450,
    status: "Active",
    lastOrder: "2024-03-10",
  },
  {
    name: "Tech Solutions Inc",
    code: "CUST002",
    email: "orders@techsolutions.com",
    phone: "+1 555-0456",
    orders: 32,
    spent: 8920,
    status: "Active",
    lastOrder: "2024-03-09",
  },
  {
    name: "Global Imports",
    code: "CUST003",
    email: "purchasing@globalimports.com",
    phone: "+1 555-0789",
    orders: 18,
    spent: 15230,
    status: "Inactive",
    lastOrder: "2024-02-14",
  }
];

const CustomerDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Topbar />

        <main className="flex-1 overflow-auto p-6 space-y-6">

          {/* TIÊU ĐỀ + NÚT THÊM */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Quản lý khách hàng</h1>
              <p className="text-gray-500 text-sm">
                Quản lý thông tin và mối quan hệ khách hàng
              </p>
            </div>

            <button className="bg-black text-white px-4 py-2 rounded-lg shadow hover:bg-gray-900">
              + Thêm khách hàng
            </button>
          </div>

          {/* KHỐI TÌM KIẾM + BẢNG */}
          <div className="bg-white border rounded-xl shadow-sm">

            {/* Ô TÌM KIẾM */}
            <div className="p-4 flex items-center gap-3 border-b">
              <FiSearch className="text-gray-500 text-lg" />
              <input
                type="text"
                placeholder="Tìm kiếm khách hàng..."
                className="w-full outline-none"
              />
            </div>

            {/* BẢNG KHÁCH HÀNG */}
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b text-gray-600 text-sm">
                  <th className="p-4">Khách hàng</th>
                  <th className="p-4">Liên hệ</th>
                  <th className="p-4">Đơn hàng</th>
                  <th className="p-4">Tổng chi tiêu</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4">Đơn hàng gần nhất</th>
                  <th className="p-4">Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {customers.map((c, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">

                    <td className="p-4">
                      <p className="font-medium">{c.name}</p>
                      <p className="text-sm text-gray-500">{c.code}</p>
                    </td>

                    <td className="p-4">
                      <p className="text-sm">{c.email}</p>
                      <p className="text-sm text-gray-500">{c.phone}</p>
                    </td>

                    <td className="p-4">{c.orders}</td>

                    <td className="p-4 font-medium">
                      ${c.spent.toLocaleString()}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${
                          c.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {c.status === "Active" ? "Đang hoạt động" : "Ngừng hoạt động"}
                      </span>
                    </td>

                    <td className="p-4 text-gray-500">{c.lastOrder}</td>

                    <td className="p-4 space-x-2">
                      <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
                        Xem
                      </button>
                      <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
                        Sửa
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard;
