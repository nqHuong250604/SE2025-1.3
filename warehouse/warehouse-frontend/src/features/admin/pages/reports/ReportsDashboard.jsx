import React from "react";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import useFetchData from "../../services/useFetchData";
import {
  getDashboardKPIs,
  getProcessedChartData,
} from "../../services/adminServices";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

// Hàm format tiền tệ (VNĐ – hiển thị chuẩn)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const ReportsDashboard = () => {
  // 1. Lấy dữ liệu KPI
  const { loading: kpiLoading } = useFetchData(getDashboardKPIs);

  // 2. Lấy dữ liệu biểu đồ
  const {
    data: chartData,
    loading: chartLoading,
    error: chartError,
  } = useFetchData(getProcessedChartData);

  // --- Chuẩn bị dữ liệu hiển thị ---
  const revenueData = chartData?.revenueData || [];
  const categoryData = chartData?.categoryData || [];

  const totalCategoryValue = categoryData.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const totalForProgress = totalCategoryValue > 0 ? totalCategoryValue : 1;

  // Tính tăng trưởng & số liệu tháng gần nhất
  const lastMonth = revenueData[revenueData.length - 1] || {};
  const prevMonth = revenueData[revenueData.length - 2] || {};

  const currentRevenue = lastMonth.revenue || 0;
  const currentOrders = lastMonth.orders || 0;

  const revenueGrowth = prevMonth.revenue
    ? (
        ((currentRevenue - prevMonth.revenue) / prevMonth.revenue) *
        100
      ).toFixed(1)
    : 0;
  const isRevenueUp = revenueGrowth >= 0;

  const prevOrders = prevMonth.orders || 0;
  const ordersGrowth = prevOrders
    ? (((currentOrders - prevOrders) / prevOrders) * 100).toFixed(1)
    : 0;
  const isOrdersUp = ordersGrowth >= 0;

  if (kpiLoading || chartLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Đang tải dữ liệu báo cáo...
      </div>
    );
  }

  if (chartError) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        Lỗi: {chartError.message}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 min-w-0 overflow-x-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <Topbar />

        <main className="flex-1 overflow-auto min-w-0">
          <div className="p-6 space-y-6 min-w-0">
            <div>
              <h1 className="text-xl font-semibold">Báo cáo & Phân tích</h1>
              <p className="text-gray-500">
                Hiệu suất và phân tích hoạt động kinh doanh
              </p>
            </div>

            {/* Thẻ thống kê */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-w-0">
              {/* Doanh thu tháng này */}
              <div className="bg-white shadow-sm rounded-xl border p-6 min-w-0">
                <p className="text-sm text-gray-500">
                  Doanh thu (Tháng này)
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {formatCurrency(currentRevenue)}
                </h3>
                <p
                  className={`text-sm mt-1 ${
                    isRevenueUp ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isRevenueUp ? "+" : ""}
                  {revenueGrowth}% so với tháng trước
                </p>
              </div>

              {/* Đơn hàng tháng này */}
              <div className="bg-white shadow-sm rounded-xl border p-6 min-w-0">
                <p className="text-sm text-gray-500">
                  Đơn hàng (Tháng này)
                </p>
                <h3 className="text-2xl font-bold mt-1">
                  {currentOrders}
                </h3>
                <p
                  className={`text-sm mt-1 ${
                    isOrdersUp ? "text-blue-600" : "text-red-600"
                  }`}
                >
                  {isOrdersUp ? "+" : ""}
                  {ordersGrowth}% so với tháng trước
                </p>
              </div>
            </div>

            {/* Biểu đồ doanh thu */}
            <div className="grid grid-cols-1 gap-6 min-w-0">
              <div className="bg-white border rounded-xl p-6 shadow-sm min-w-0">
                <h2 className="text-lg font-semibold mb-4">
                  Xu hướng doanh thu theo tháng
                </h2>
                <div className="min-w-0 h-72 min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis
                        tickFormatter={(val) =>
                          `${(val / 1_000_000).toFixed(1)}M`
                        }
                      />
                      <Tooltip
                        formatter={(value) => [
                          formatCurrency(value),
                          "Doanh thu",
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#6366f1"
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Biểu đồ tròn & danh mục bán chạy */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
              <div className="bg-white border rounded-xl p-6 shadow-sm min-w-0">
                <h2 className="text-lg font-semibold mb-4">
                  Phân bổ theo danh mục
                </h2>
                <div className="min-w-0 h-72 min-h-[300px] flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={100}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                      >
                        {categoryData.map((entry, idx) => (
                          <Cell key={idx} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white border rounded-xl p-6 shadow-sm min-w-0">
                <h2 className="text-lg font-semibold mb-4">
                  Danh mục bán chạy nhất
                </h2>
                <div className="space-y-6">
                  {categoryData
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 4)
                    .map((item, idx) => {
                      const percent =
                        (item.value / totalForProgress) * 100;
                      const safeWidth = Math.min(percent, 100).toFixed(2);

                      return (
                        <div key={idx}>
                          <div className="flex justify-between text-sm font-medium">
                            <span>{item.name}</span>
                            <span>{item.value} sản phẩm</span>
                          </div>
                          <div className="w-full h-3 bg-gray-200 rounded-full mt-1">
                            <div
                              className="h-3 rounded-full"
                              style={{
                                width: `${safeWidth}%`,
                                backgroundColor: item.color,
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  {categoryData.length === 0 && (
                    <p className="text-gray-400">
                      Chưa có dữ liệu bán hàng
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ReportsDashboard;
