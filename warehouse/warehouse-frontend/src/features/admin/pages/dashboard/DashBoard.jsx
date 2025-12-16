import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import {
  Package,
  Users,
  DollarSign,
  PlusCircle,
  Search,
  UserPlus,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import {
  getAllTransactions,
  getDashboardKPIs,
  getRecentTransactions,
} from "../../services/adminServices";

/* ===== FORMAT TRANSACTION ===== */
const formatTransactionToShipment = (tx) => {
  const id = `Mã giao dịch: #${tx.id}`;

  const company = tx.performed_by || "Người dùng không xác định";

  const productName = tx.notes || "Không có ghi chú";

  let status, color;

  switch (tx.transaction_type) {
    case "OUT":
      status = "Xuất kho";
      color = "bg-blue-100 text-blue-600";
      break;
    case "IN":
      status = "Nhập kho";
      color = "bg-green-100 text-green-600";
      break;
    case "ADJUSTMENT":
      status = "Điều chỉnh";
      color = "bg-yellow-100 text-yellow-600";
      break;
    case "RETURN":
      status = "Hoàn trả";
      color = "bg-red-100 text-red-600";
      break;
    default:
      status = "Không xác định";
      color = "bg-gray-100 text-gray-600";
  }

  return { id, company, productName, status, color };
};

const Dashboard = () => {
  const [kpis, setKpis] = useState({
    totalShipments: "...",
    activeDeliveries: "...",
    totalCustomers: "...",
    revenue: "...",
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ===== FETCH KPI ===== */
  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const data = await getDashboardKPIs();
        const getAllTransaction = await getAllTransactions();
        setKpis({
          totalShipments: getAllTransaction.length
            ? getAllTransaction.length.toLocaleString()
            : "N/A",
          activeDeliveries: data.active_deliveries
            ? data.active_deliveries.toLocaleString()
            : "0",
          totalCustomers: data.total_customers
            ? data.total_customers.toLocaleString()
            : "N/A",
          revenue: data.revenue ? `${data.revenue.toLocaleString()} ₫` : "N/A",
        });
      } catch (err) {
        console.error("Lỗi tải dữ liệu dashboard:", err);
        setError("Không thể tải dữ liệu dashboard. Vui lòng thử lại.");
        setKpis({
          totalShipments: "Lỗi",
          activeDeliveries: "Lỗi",
          totalCustomers: "Lỗi",
          revenue: "Lỗi",
        });
      }
    };

    fetchKPIs();
  }, []);

  /* ===== FETCH RECENT TRANSACTIONS ===== */
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const params = { limit: 4 };
        const transactionsArray = await getRecentTransactions(params);
        const formattedTxs = transactionsArray.map(formatTransactionToShipment);
        setRecentTransactions(formattedTxs);
      } catch (err) {
        console.error("Lỗi tải giao dịch gần đây:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  /* ===== LOADING ===== */
  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar />
          <div className="p-6 text-center">
            Đang tải dữ liệu bảng điều khiển...
          </div>
        </div>
      </div>
    );
  }

  /* ===== ERROR ===== */
  if (error) {
    return (
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar />
          <div className="p-6 text-center text-red-600">{error}</div>
        </div>
      </div>
    );
  }

  /* ===== MAIN RENDER ===== */
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />

        <div className="p-6 overflow-y-auto h-[calc(100vh-80px)] space-y-6">
          {/* HEADER */}
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Trang chủ</h1>
            <p className="text-gray-500 text-sm">
              Tổng quan hoạt động logistics của hệ thống
            </p>
          </div>

          {/* STAT CARDS */}
          <div className="grid grid-cols-3 gap-4">
            <StatCard
              title="Tổng số giao dịch"
              value={kpis.totalShipments}
              change="+12% so với tháng trước"
              icon={<Package className="text-blue-500 w-8 h-8" />}
            />
            <StatCard
              title="Tổng số nhân viên kho"
              value={kpis.totalCustomers}
              change="+5% so với tháng trước"
              icon={<Users className="text-purple-600 w-8 h-8" />}
            />
            <StatCard
              title="Doanh thu (Chỉ tính với đơn OUT)"
              value={kpis.revenue}
              change="+15% so với tháng trước"
              icon={<DollarSign className="text-orange-500 w-8 h-8" />}
            />
          </div>

          {/* MAIN CONTENT */}
          <div className="grid grid-cols-[2fr_1fr] gap-6">
            {/* LEFT */}
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="font-semibold text-lg mb-4">Giao dịch gần đây</h2>

              {recentTransactions.length > 0 ? (
                recentTransactions.map((tx) => <Shipment key={tx.id} {...tx} />)
              ) : (
                <p className="text-gray-500 italic">
                  Không có giao dịch nào gần đây.
                </p>
              )}
            </div>

            {/* RIGHT */}
            <div className="space-y-6">
              <div className="bg-white shadow rounded-xl p-5">
                <h2 className="font-semibold text-lg mb-4">Thao tác nhanh</h2>
                <QuickAction
                  icon={<PlusCircle />}
                  title="Tạo đơn vận chuyển mới"
                />
                <QuickAction icon={<Search />} title="Theo dõi đơn hàng" />
                <QuickAction icon={<UserPlus />} title="Thêm khách hàng" />
              </div>

              <div className="bg-white shadow rounded-xl p-5">
                <h2 className="font-semibold text-lg mb-4">
                  Cảnh báo hệ thống
                </h2>
                <AlertItem
                  icon={<AlertTriangle />}
                  title="3 đơn hàng bị trễ"
                  subtitle="Cần xử lý"
                  color="bg-yellow-100 text-yellow-700"
                />
                <AlertItem
                  icon={<CheckCircle />}
                  title="12 đơn đã hoàn thành"
                  subtitle="Hôm nay"
                  color="bg-green-100 text-green-700"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ===== SUB COMPONENTS ===== */

const StatCard = ({ title, value, change, icon }) => (
  <div className="bg-white p-5 rounded-xl shadow flex items-center justify-between">
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-2xl font-semibold">{value}</h3>
      <p
        className={`text-sm ${
          value === "Lỗi" ? "text-red-500" : "text-green-600"
        }`}
      >
        {value === "Lỗi" ? "Không thể tải dữ liệu" : change}
      </p>
    </div>
    {icon}
  </div>
);

const Shipment = ({ id, company, productName, status, color }) => (
  <div className="flex items-center justify-between p-3 mb-3 border rounded-xl bg-white shadow-sm hover:shadow transition">
    {/* LEFT */}
    <div className="leading-tight">
      <p className="text-sm font-medium text-gray-700">{id}</p>
      <p className="text-xs text-gray-500">{company}</p>
    </div>

    {/* CENTER */}
    <div className="text-right mr-4 max-w-[220px]">
      <p className="text-sm text-gray-600 truncate">{productName}</p>
    </div>

    {/* STATUS */}
    <span
      className={`px-2.5 py-1 rounded-md text-[11px] font-medium whitespace-nowrap ${color}`}
    >
      {status}
    </span>
  </div>
);

const QuickAction = ({ icon, title }) => (
  <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer mb-3">
    {icon}
    <p>{title}</p>
  </div>
);

const AlertItem = ({ icon, title, subtitle, color }) => (
  <div className={`flex items-center gap-3 p-4 rounded-lg my-2 ${color}`}>
    {icon}
    <div>
      <p className="font-semibold">{title}</p>
      <p className="text-sm">{subtitle}</p>
    </div>
  </div>
);

export default Dashboard;
