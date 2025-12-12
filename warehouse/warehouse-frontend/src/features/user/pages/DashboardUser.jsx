import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import HeaderUser from "../components/HeaderUser";
import {
  listRawInventory,
  getProductDetail,
  listTransactions,
} from "../services/userService";

import { Truck, Package, DollarSign, Calendar } from "lucide-react";

const DashboardUser = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalInventory: 0,
    recentTransactions: [],
    revenue: 0,
  });

  const [loading, setLoading] = useState(true);

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const calculateRevenue = async (transactions) => {
    let total = 0;
    const priceCache = new Map();

    for (const t of transactions) {
      if (t.transaction_type !== "OUT") continue;

      try {
        let price;

        if (priceCache.has(t.product_id)) {
          price = priceCache.get(t.product_id);
        } else {
          const productRes = await getProductDetail(t.product_id);
          price = productRes.data.price || 0;
          priceCache.set(t.product_id, price);
        }

        total += price * t.quantity;
      } catch (err) {
        console.error("Lỗi khi tính doanh thu", err);
      }
    }

    return total;
  };

  const fetchData = async () => {
    setLoading(true);

    try {
      const allTransRes = await listTransactions(1000);
      const allTransactions = allTransRes.data.items || [];

      const revenue = await calculateRevenue(allTransactions);

      const recentTransactions = allTransactions
        .slice()
        .sort((a, b) => b.id - a.id)
        .slice(0, 5);

      const inventoryRes = await listRawInventory();
      const inventoryList = inventoryRes.data || [];
      const inventoryTotal = inventoryList.reduce(
        (sum, item) => sum + (item.available_quantity || 0),
        0
      );

      setStats({
        totalOrders: allTransactions.length,
        totalInventory: inventoryTotal,
        recentTransactions,
        revenue,
      });
    } catch (error) {
      console.error("Lỗi Dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ============================
  //      Dashboard Card
  // ============================

  const DashboardCard = ({ title, value, subtext, icon, iconColor }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 transition duration-300 hover:shadow-md hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold text-gray-800 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-full bg-opacity-10 ${iconColor}`}>
          {icon}
        </div>
      </div>
      {subtext && <p className="text-xs text-gray-500 mt-3">{subtext}</p>}
    </div>
  );

  DashboardCard.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    subtext: PropTypes.string,
    icon: PropTypes.node.isRequired,
    iconColor: PropTypes.string.isRequired,
  };

  // ============================
  //    Recent Transaction Table
  // ============================

  const RecentTransactionsTable = ({ transactions }) => (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 rounded-lg">
        <thead className="bg-gray-50 rounded-t-lg">
          <tr>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Mã GD
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Loại
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Sản phẩm
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Số lượng
            </th>
            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
              Ngày
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-100">
          {transactions.map((t) => (
            <tr key={t.id} className="hover:bg-gray-50 transition duration-150">
              <td className="px-4 py-3 text-sm font-mono text-gray-700">
                {t.reference_number}
              </td>
              <td className="px-4 py-3">
                <span
                  className={`px-2 text-xs font-medium rounded-full ${
                    t.transaction_type === "IN"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {t.transaction_type}
                </span>
              </td>
              <td className="px-4 py-3 text-sm text-gray-700">
                {t.product_name || `ID: ${t.product_id}`}
              </td>
              <td className="px-4 py-3 text-sm text-center">{t.quantity}</td>
              <td className="px-4 py-3 text-sm text-gray-500">
                {t.created_at ? t.created_at.split("T")[0] : "N/A"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  RecentTransactionsTable.propTypes = {
    transactions: PropTypes.array.isRequired,
  };

  // ============================
  //         RETURN UI
  // ============================

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <HeaderUser />

      <main className="flex-1 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16 flex flex-col gap-6">
          {/* ===== PHẦN TIÊU ĐỀ DASHBOARD ===== */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex flex-col gap-2 shadow-sm">
            <div className="flex items-center gap-3">
              <Truck className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-extrabold text-slate-900">
                Tổng quan
              </h1>
            </div>
            <p className="text-base text-slate-500">
              Thống kê nhanh số lượng tồn kho, giao dịch và doanh thu
            </p>
          </div>

          {loading ? (
            <div className="p-8 text-center text-indigo-500">
              Đang tải dữ liệu...
            </div>
          ) : (
            <>
              {/* ===== DASHBOARD CARDS ===== */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <DashboardCard
                  title="Tổng Giao Dịch"
                  value={stats.totalOrders}
                  subtext="Tổng số giao dịch gần đây"
                  icon={<Truck className="w-6 h-6 text-indigo-600" />}
                  iconColor="text-indigo-600"
                />

                <DashboardCard
                  title="Tổng Số Lượng Tồn Kho"
                  value={`${stats.totalInventory} SP`}
                  subtext="Tổng số lượng sản phẩm trong kho"
                  icon={<Package className="w-6 h-6 text-teal-600" />}
                  iconColor="text-teal-600"
                />

                <DashboardCard
                  title="Doanh Thu Ước Tính"
                  value={formatCurrency(stats.revenue)}
                  subtext="Dựa trên giá trị xuất kho (OUT)"
                  icon={<DollarSign className="w-6 h-6 text-green-600" />}
                  iconColor="text-green-600"
                />
              </div>

              {/* ===== BẢNG GIAO DỊCH GẦN ĐÂY ===== */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-xl font-medium text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-indigo-500" />5 Giao dịch
                  Gần đây
                </h2>

                {stats.recentTransactions.length > 0 ? (
                  <RecentTransactionsTable
                    transactions={stats.recentTransactions}
                  />
                ) : (
                  <div className="p-8 text-center text-gray-500 border border-dashed rounded-lg">
                    Không có giao dịch gần đây nào.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default DashboardUser;
