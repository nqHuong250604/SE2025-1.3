import React, { useState, useEffect } from "react";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import {
  FiAlertTriangle, FiPackage, FiRefreshCw,
  FiTrash2, FiCheck, FiBell, FiClock
} from "react-icons/fi";
import { getSystemNotifications } from "../../services/adminServices";

const NotificationDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getSystemNotifications();
      setNotifications(data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleMarkRead = (id) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  const handleDelete = (id) => {
    const deletedIds = JSON.parse(localStorage.getItem("deleted_notifications") || "[]");
    localStorage.setItem("deleted_notifications", JSON.stringify([...deletedIds, id]));
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const stats = {
    high: notifications.filter((n) => n.priority === "high" && n.unread).length,
    medium: notifications.filter((n) => n.priority === "medium" && n.unread).length,
    totalUnread: notifications.filter((n) => n.unread).length,
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />

        <main className="flex flex-col flex-1 max-w-5xl mx-auto w-full overflow-hidden">
          
          {/* HEADER & CARDS SECTION */}
          <div className="p-6 space-y-6 flex-shrink-0 bg-gray-50 z-10">
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Thông báo</h1>
                <p className="text-sm text-gray-500">Quản lý cảnh báo tồn kho và giao dịch hệ thống</p>
              </div>
              <button 
                onClick={loadData} 
                className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors bg-white px-3 py-2 rounded-lg border shadow-sm active:scale-95"
              >
                <FiRefreshCw className={loading ? "animate-spin" : ""} /> Làm mới
              </button>
            </div>

            {/* SUMMARY CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <SummaryCard 
                label="Nguy cấp" 
                count={stats.high} 
                icon={<FiAlertTriangle className="text-red-600" />} 
                color="border-red-500" 
              />
              <SummaryCard 
                label="Cảnh báo" 
                count={stats.medium} 
                icon={<FiClock className="text-amber-500" />} 
                color="border-amber-500" 
              />
              <SummaryCard 
                label="Chưa đọc" 
                count={stats.totalUnread} 
                icon={<FiBell className="text-indigo-600" />} 
                color="border-indigo-500" 
              />
            </div>
          </div>

          {/* LIST SECTION */}
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {loading ? (
                <div className="p-20 text-center text-gray-400 font-medium italic">Đang tải dữ liệu...</div>
              ) : notifications.length === 0 ? (
                <div className="p-20 text-center text-gray-400 font-medium italic">Không có thông báo nào</div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((n) => (
                    <div key={n.id} className={`group flex items-start gap-4 p-5 hover:bg-gray-50 transition-colors ${n.unread ? "bg-indigo-50/30" : ""}`}>
                      <div className={`mt-1 p-2 rounded-lg ${
                        n.priority === "high" ? "bg-red-100 text-red-600" : 
                        n.priority === "medium" ? "bg-amber-100 text-amber-600" : "bg-gray-100 text-gray-500"
                      }`}>
                        {n.type === "low_stock" ? <FiAlertTriangle /> : <FiPackage />}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-sm font-bold ${n.unread ? "text-gray-900" : "text-gray-500"}`}>
                            {n.title}
                          </span>
                          {n.unread && <span className="w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>}
                        </div>
                        <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">{n.message}</p>
                      </div>

                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {n.unread && (
                          <button 
                            onClick={() => handleMarkRead(n.id)} 
                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-white rounded-md shadow-sm border border-gray-100"
                            title="Đánh dấu đã đọc"
                          >
                            <FiCheck />
                          </button>
                        )}
                        <button 
                          onClick={() => handleDelete(n.id)} 
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-white rounded-md shadow-sm border border-gray-100"
                          title="Xóa"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

// Component Card thống kê
const SummaryCard = ({ label, count, icon, color }) => (
  <div className={`bg-white p-4 rounded-xl border-l-4 shadow-sm flex items-center gap-4 ${color}`}>
    <div className="text-xl p-2 bg-gray-50 rounded-lg shrink-0">{icon}</div>
    <div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none">{label}</p>
      <p className="text-xl font-bold text-gray-800 mt-1 leading-none">{count}</p>
    </div>
  </div>
);

export default NotificationDashboard;
