import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import {
  Search,
  Edit2,
  Trash2,
  Users,
  CheckCircle,
  Shield,
  AlertTriangle,
  Loader2,
  X,
  ChevronDown,
} from "lucide-react";
import {
  getUsers,
  deleteUser,
  createUser,
  updateUser,
} from "../../services/adminServices";

const UserManagementDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    email: "",
    full_name: "",
    role: "staff",
    password: "",
    is_active: true,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(Array.isArray(data) ? data : data.items || []);
    } catch (error) {
      alert("Lỗi tải danh sách: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        password: "",
        is_active: user.is_active,
      });
    } else {
      setEditingUser(null);
      setFormData({
        email: "",
        full_name: "",
        role: "staff",
        password: "",
        is_active: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
        alert("Cập nhật thành công!");
      } else {
        await createUser(formData);
        alert("Thêm người dùng thành công!");
      }
      setIsModalOpen(false);
      fetchUsers();
    } catch (error) {
      alert("Lỗi: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await deleteUser(id);
        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== id));
      } catch (error) {
        alert("Lỗi khi xóa: " + error.message);
      }
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100 font-sans overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <main className="p-6 overflow-y-auto h-[calc(100vh-80px)] space-y-6">
          {/* HEADER SECTION */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
                Quản lý người dùng
              </h1>
              <p className="text-gray-500 text-sm">
                Quản lý nhân viên và quyền truy cập hệ thống
              </p>
            </div>
            <button
              onClick={() => openModal()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2 text-sm font-semibold active:scale-95"
            >
              <Users size={18} /> Thêm nhân viên
            </button>
          </div>

          {/* STATS CARDS - ĐÃ ĐỒNG BỘ STYLE */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard
              title="Tổng số"
              value={users.length}
              color="blue"
              icon={<Users />}
            />
            <StatCard
              title="Quản trị viên"
              value={users.filter((u) => u.role === "admin").length}
              color="purple"
              icon={<Shield />}
            />
            <StatCard
              title="Nhân viên"
              value={users.filter((u) => u.role === "staff").length}
              color="green"
              icon={<CheckCircle />}
            />
            <StatCard
              title="Tạm khóa"
              value={users.filter((u) => !u.is_active).length}
              color="red"
              icon={<AlertTriangle />}
            />
          </div>

          {/* DATA TABLE SECTION */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50 bg-white">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Tìm tên hoặc email nhân viên..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-transparent rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center py-20 gap-3">
                <Loader2 className="animate-spin text-blue-600 w-10 h-10" />
                <p className="text-slate-400 text-sm font-medium">
                  Đang tải dữ liệu...
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 text-left w-[40%]">Nhân viên</th>
                      <th className="px-6 py-4 text-center w-[20%]">Vai trò</th>
                      <th className="px-6 py-4 text-center w-[20%]">
                        Trạng thái
                      </th>
                      <th className="px-6 py-4 text-center w-[20%]">
                        Hành động
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-slate-50 transition-colors group"
                      >
                        {/* NHÂN VIÊN */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm border border-blue-100 shrink-0">
                              {user.full_name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-800 truncate">
                                {user.full_name}
                              </p>
                              <p className="text-xs text-slate-400 truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* VAI TRÒ */}
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center">
                            <RoleBadge role={user.role} />
                          </div>
                        </td>

                        {/* TRẠNG THÁI */}
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center">
                            <StatusBadge active={user.is_active} />
                          </div>
                        </td>

                        {/* HÀNH ĐỘNG */}
                        <td className="px-6 py-4 text-center">
                          <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={() => openModal(user)}
                              className="p-2 rounded-lg hover:bg-blue-50 text-blue-600 transition"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(user.id)}
                              className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* MODAL THÊM/SỬA */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-300 border border-slate-100">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-base font-extrabold text-slate-800 tracking-tight">
                {editingUser ? "Chỉnh sửa" : "Thêm nhân viên"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-200 text-slate-400 transition-colors"
              >
                <X size={18} strokeWidth={2.5} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Họ và tên
                </label>
                <input
                  required
                  type="text"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
                  value={formData.full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, full_name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Email
                </label>
                <input
                  required
                  type="email"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm transition-all focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                    Vai trò
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 appearance-none outline-none cursor-pointer"
                      value={formData.role}
                      onChange={(e) =>
                        setFormData({ ...formData, role: e.target.value })
                      }
                    >
                      <option value="staff">Staff</option>
                      <option value="admin">Admin</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                    Trạng thái
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 appearance-none outline-none cursor-pointer"
                      value={formData.is_active}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          is_active: e.target.value === "true",
                        })
                      }
                    >
                      <option value="true">Active</option>
                      <option value="false">Locked</option>
                    </select>
                    <ChevronDown
                      size={14}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
                    />
                  </div>
                </div>
              </div>

              {!editingUser && (
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                    Mật khẩu
                  </label>
                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                  />
                </div>
              )}

              <div className="pt-4 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-[1.5] py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Xác nhận"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

/* HELPER COMPONENTS */
const StatCard = ({ title, value, color, icon }) => {
  const themes = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    purple: "bg-purple-50 text-purple-600 border-purple-100",
    green: "bg-green-50 text-green-600 border-green-100",
    red: "bg-red-50 text-red-600 border-red-100",
  };
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-between gap-4 transition-all hover:shadow-md group">
      <div>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">
          {title}
        </p>
        <p className="text-xl font-extrabold text-slate-800 leading-none">
          {value}
        </p>
      </div>
      <div className={`p-3 rounded-xl transition-colors ${themes[color]}`}>
        {React.cloneElement(icon, { size: 20, strokeWidth: 2.5 })}
      </div>
    </div>
  );
};

const RoleBadge = ({ role }) => (
  <span
    className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider border ${
      role === "admin"
        ? "bg-indigo-50 text-indigo-700 border-indigo-100"
        : "bg-slate-50 text-slate-600 border-slate-200"
    }`}
  >
    {role}
  </span>
);

const StatusBadge = ({ active }) => (
  <div className="flex items-center gap-2 bg-slate-50 w-fit px-2.5 py-1 rounded-lg border border-slate-100">
    <span
      className={`w-2 h-2 rounded-full ${
        active
          ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"
          : "bg-red-500"
      }`}
    ></span>
    <span
      className={`text-[11px] font-bold uppercase ${
        active ? "text-green-600" : "text-red-600"
      }`}
    >
      {active ? "Hoạt động" : "Bị khóa"}
    </span>
  </div>
);

export default UserManagementDashboard;
