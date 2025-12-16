import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import {
  Search,
  Edit2,
  Trash2,
  Users,
  CheckCircle,
  DollarSign,
  AlertTriangle,
} from "lucide-react";

const UserManagementDashboard = () => {
  const [users] = useState([
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@logitrack.com",
      role: "Admin",
      department: "Vận hành",
      status: "Active",
      lastLogin: "2024-03-10 14:30",
      permissions: "Toàn quyền truy cập",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah.j@logitrack.com",
      role: "Manager",
      department: "Hậu cần",
      status: "Active",
      lastLogin: "2024-03-10 13:15",
      permissions: "Quản lý đơn hàng, Xem báo cáo",
    },
    {
      id: 3,
      name: "Mike Davis",
      email: "mike.davis@logitrack.com",
      role: "Operator",
      department: "Kho",
      status: "Inactive",
      lastLogin: "2024-03-05 16:20",
      permissions: "Xem tồn kho, Cập nhật kho",
    },
    {
      id: 4,
      name: "Lisa Chen",
      email: "lisa.chen@logitrack.com",
      role: "Analyst",
      department: "Phân tích",
      status: "Active",
      lastLogin: "2024-03-10 11:45",
      permissions: "Xem báo cáo, Xuất dữ liệu",
    },
  ]);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />

        <div className="p-6 overflow-y-auto h-[calc(100vh-80px)] space-y-6">
          {/* HEADER */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
            <p className="text-gray-500 text-sm">
              Quản lý thành viên và phân quyền truy cập hệ thống
            </p>
          </div>

          {/* THỐNG KÊ */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard
              title="Tổng người dùng"
              value="24"
              color="blue"
              icon={<Users />}
            />
            <StatCard
              title="Đang hoạt động"
              value="21"
              color="green"
              icon={<CheckCircle />}
            />
            <StatCard
              title="Quản trị viên"
              value="3"
              color="purple"
              icon={<DollarSign />}
            />
            <StatCard
              title="Lời mời chờ duyệt"
              value="2"
              color="yellow"
              icon={<AlertTriangle />}
            />
          </div>

          {/* BẢNG NGƯỜI DÙNG */}
          <div className="bg-white rounded-xl shadow p-5">
            {/* TOOLBAR */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
              {/* TÌM KIẾM */}
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Tìm kiếm người dùng..."
                  className="w-full rounded-lg p-2 pl-10 text-sm bg-gray-200 text-gray-800 placeholder-gray-500 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              </div>

              {/* LỌC THEO VAI TRÒ */}
              <select className="border rounded-lg p-2 w-full md:w-48 text-sm bg-gray-200 text-gray-800 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="All">Tất cả vai trò</option>
                <option value="Admin">Quản trị viên</option>
                <option value="Manager">Quản lý</option>
                <option value="Operator">Nhân viên</option>
                <option value="Analyst">Phân tích</option>
              </select>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b text-gray-500">
                    <th className="py-3 px-2">Người dùng</th>
                    <th className="py-3 px-2">Vai trò</th>
                    <th className="py-3 px-2">Phòng ban</th>
                    <th className="py-3 px-2">Trạng thái</th>
                    <th className="py-3 px-2">Đăng nhập gần nhất</th>
                    <th className="py-3 px-2">Quyền hạn</th>
                    <th className="py-3 px-2">Thao tác</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-gray-400 text-xs">{user.email}</p>
                      </td>

                      <td className="py-3 px-2">
                        <RoleBadge role={user.role} />
                      </td>

                      <td className="py-3 px-2">{user.department}</td>

                      <td className="py-3 px-2">
                        <StatusBadge status={user.status} />
                      </td>

                      <td className="py-3 px-2">{user.lastLogin}</td>

                      <td className="py-3 px-2">{user.permissions}</td>

                      <td className="py-3 px-2 flex gap-2">
                        <button className="flex items-center gap-1 text-black border border-gray-300 rounded px-2 py-1 text-xs hover:bg-gray-100">
                          <Edit2 className="w-4 h-4" /> Sửa
                        </button>
                        <button className="flex items-center gap-1 text-red-600 border border-gray-300 rounded px-2 py-1 text-xs hover:bg-gray-100">
                          <Trash2 className="w-4 h-4" /> Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* PHÂN QUYỀN THEO VAI TRÒ */}
          <div className="bg-white rounded-xl shadow p-5">
            <h2 className="mb-3 text-sm text-gray-700">
              Quyền hạn theo vai trò
            </h2>

            <div className="grid grid-cols-4 gap-4">
              <RolePermissionCard
                title="Quản trị viên"
                permissions={[
                  "Toàn quyền hệ thống",
                  "Quản lý người dùng",
                  "Cài đặt hệ thống",
                  "Tất cả báo cáo",
                ]}
              />
              <RolePermissionCard
                title="Quản lý"
                permissions={[
                  "Quản lý đơn hàng",
                  "Xem báo cáo",
                  "Quản lý khách hàng",
                  "Giám sát kho",
                ]}
              />
              <RolePermissionCard
                title="Nhân viên"
                permissions={[
                  "Cập nhật tồn kho",
                  "Xử lý vận chuyển",
                  "Xem đơn hàng",
                  "Báo cáo cơ bản",
                ]}
              />
              <RolePermissionCard
                title="Phân tích"
                permissions={[
                  "Xem báo cáo",
                  "Xuất dữ liệu",
                  "Bảng phân tích",
                  "Chỉ số hiệu suất",
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===== COMPONENTS ===== */

const StatCard = ({ title, value, color, icon }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-100",
    green: "text-green-600 bg-green-100",
    purple: "text-purple-600 bg-purple-100",
    yellow: "text-yellow-600 bg-yellow-100",
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3 text-sm">
      <div className={`p-2 rounded-full ${colors[color]}`}>
        {React.cloneElement(icon, { className: "w-5 h-5" })}
      </div>
      <div>
        <p className="text-gray-500">{title}</p>
        <h3 className="font-semibold">{value}</h3>
      </div>
    </div>
  );
};

const RoleBadge = ({ role }) => {
  const map = {
    Admin: ["Quản trị viên", "bg-red-100 text-red-600"],
    Manager: ["Quản lý", "bg-blue-100 text-blue-600"],
    Operator: ["Nhân viên", "bg-green-100 text-green-600"],
    Analyst: ["Phân tích", "bg-purple-100 text-purple-600"],
  };

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium ${map[role][1]}`}>
      {map[role][0]}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const map = {
    Active: ["Đang hoạt động", "bg-green-100 text-green-600"],
    Inactive: ["Ngừng hoạt động", "bg-gray-100 text-gray-600"],
  };

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-medium ${map[status][1]}`}>
      {map[status][0]}
    </span>
  );
};

const RolePermissionCard = ({ title, permissions }) => (
  <div className="bg-white p-4 rounded-xl shadow text-sm">
    <h3 className="font-medium mb-1">{title}</h3>
    <ul className="list-disc list-inside text-gray-600">
      {permissions.map((perm, idx) => (
        <li key={idx}>{perm}</li>
      ))}
    </ul>
  </div>
);

export default UserManagementDashboard;
