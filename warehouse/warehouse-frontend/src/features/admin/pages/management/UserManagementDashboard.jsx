import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { Search, Edit2, Trash2, Users, CheckCircle, DollarSign, AlertTriangle, Loader2 } from "lucide-react";
import { getUsers, deleteUser, createUser } from "../../services/adminServices";

const UserManagementDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Hàm tải dữ liệu từ API
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      // data trả về thường là { items: [], total: x } hoặc []. 
      // Dựa vào ảnh Swagger của bạn, nó trả về một mảng [].
      setUsers(Array.isArray(data) ? data : data.items || []);
    } catch (error) {
      console.error("Lỗi tải người dùng:", error);
      alert("Không thể kết nối đến server!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Hàm Xóa người dùng
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) {
      try {
        await deleteUser(id);
        setUsers(users.filter((u) => u.id !== id));
        alert("Xóa thành công!");
      } catch (error) {
        alert("Lỗi khi xóa: " + error.message);
      }
    }
  };

  // 3. Lọc người dùng theo tìm kiếm
  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />
        <div className="p-6 overflow-y-auto h-[calc(100vh-80px)] space-y-6">
          
          {/* HEADER */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
              <p className="text-gray-500 text-sm">Quản lý thành viên thực tế từ Database</p>
            </div>
            <button 
              onClick={() => alert("Chức năng thêm sẽ mở Modal Form")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
            >
              + Thêm người dùng
            </button>
          </div>

          {/* THỐNG KÊ (Dữ liệu thật từ mảng users) */}
          <div className="grid grid-cols-4 gap-4">
            <StatCard title="Tổng người dùng" value={users.length} color="blue" icon={<Users />} />
            <StatCard title="Quản trị viên" value={users.filter(u => u.role === 'admin').length} color="purple" icon={<DollarSign />} />
            <StatCard title="Nhân viên" value={users.filter(u => u.role === 'staff').length} color="green" icon={<CheckCircle />} />
            <StatCard title="Khác" value={users.filter(u => u.role !== 'admin' && u.role !== 'staff').length} color="yellow" icon={<AlertTriangle />} />
          </div>

          {/* BẢNG NGƯỜI DÙNG */}
          <div className="bg-white rounded-xl shadow p-5">
            <div className="flex gap-4 mb-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="Tìm theo tên hoặc email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg p-2 pl-10 text-sm bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              </div>
            </div>

            {loading ? (
              <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-500" /></div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b text-gray-500 uppercase text-[11px] font-bold">
                      <th className="py-3 px-2">ID</th>
                      <th className="py-3 px-2">Người dùng</th>
                      <th className="py-3 px-2">Vai trò</th>
                      <th className="py-3 px-2">Trạng thái</th>
                      <th className="py-3 px-2 text-right">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                        <td className="py-3 px-2 text-gray-400">#{user.id}</td>
                        <td className="py-3 px-2">
                          <p className="font-medium text-gray-800">{user.full_name}</p>
                          <p className="text-gray-400 text-xs">{user.email}</p>
                        </td>
                        <td className="py-3 px-2">
                          <RoleBadge role={user.role} />
                        </td>
                        <td className="py-3 px-2">
                          <StatusBadge status={user.is_active ? "Active" : "Inactive"} />
                        </td>
                        <td className="py-3 px-2">
                          <div className="flex justify-end gap-2">
                            <button className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-md border border-blue-100">
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => handleDelete(user.id)}
                              className="p-1.5 hover:bg-red-50 text-red-600 rounded-md border border-red-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 && (
                  <p className="text-center py-10 text-gray-500">Không tìm thấy người dùng nào.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===== COMPONENTS CON (Giữ nguyên hoặc tinh chỉnh màu sắc) ===== */
const StatCard = ({ title, value, color, icon }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-100",
    green: "text-green-600 bg-green-100",
    purple: "text-purple-600 bg-purple-100",
    yellow: "text-yellow-600 bg-yellow-100",
  };
  return (
    <div className="bg-white p-4 rounded-xl shadow flex items-center gap-3">
      <div className={`p-2 rounded-lg ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-gray-500 text-xs">{title}</p>
        <h3 className="font-bold text-lg text-gray-800">{value}</h3>
      </div>
    </div>
  );
};

const RoleBadge = ({ role }) => {
  const is_admin = role?.toLowerCase() === 'admin';
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${is_admin ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"}`}>
      {role || 'N/A'}
    </span>
  );
};

const StatusBadge = ({ status }) => {
  const active = status === "Active";
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
      {active ? "Hoạt động" : "Khóa"}
    </span>
  );
};

export default UserManagementDashboard;
