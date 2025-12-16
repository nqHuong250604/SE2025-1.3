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

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const ReportsDashboard = () => {
  const { loading: kpiLoading } = useFetchData(getDashboardKPIs);
  const {
    data: chartData,
    loading: chartLoading,
    error: chartError,
  } = useFetchData(getProcessedChartData);

  const revenueData = chartData?.revenueData || [];
  const categoryData = chartData?.categoryData || [];

  const totalCategoryValue = categoryData.reduce(
    (sum, item) => sum + item.value,
    0
  );
  const totalForProgress = totalCategoryValue > 0 ? totalCategoryValue : 1;

  const lastMonth = revenueData[revenueData.length - 1] || {};
  const prevMonth = revenueData[revenueData.length - 2] || {};

  // CÁC BIẾN LOGIC RIÊNG BIỆT
  const currentRevenue = lastMonth.revenue || 0;
  const currentQty = lastMonth.totalQty || 0; // Biến cho Doanh số
  const currentOrders = lastMonth.orders || 0;

  const revenueGrowth = prevMonth.revenue
    ? (
        ((currentRevenue - prevMonth.revenue) / prevMonth.revenue) *
        100
      ).toFixed(1)
    : 0;
  const isRevenueUp = revenueGrowth >= 0;

  const qtyGrowth = prevMonth.totalQty
    ? (((currentQty - prevMonth.totalQty) / prevMonth.totalQty) * 100).toFixed(
        1
      )
    : 0;
  const isQtyUp = qtyGrowth >= 0;

  if (kpiLoading || chartLoading)
    return (
      <div className="flex h-screen items-center justify-center font-medium">
        Đang tải dữ liệu báo cáo...
      </div>
    );
  if (chartError)
    return (
      <div className="flex h-screen items-center justify-center text-red-500 font-medium">
        Lỗi: {chartError.message}
      </div>
    );

  return (
    <div className="flex h-screen bg-gray-100 min-w-0 overflow-x-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar />
        <main className="flex-1 overflow-auto min-w-0">
          <div className="p-6 space-y-6 min-w-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Báo cáo & phân tích
              </h1>
              <p className="text-gray-500 text-sm">
                Hiệu suất hoạt động dựa trên dữ liệu thực tế
              </p>
            </div>

            {/* Thẻ thống kê */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 min-w-0">
              {/* Doanh thu (Tiền) */}
              <div className="bg-white shadow-sm rounded-xl border p-6 min-w-0">
                <p className="text-sm text-gray-500 font-medium text-uppercase">
                  Doanh thu (Tháng này)
                </p>
                <h3 className="text-2xl font-bold mt-1 text-indigo-600">
                  {formatCurrency(currentRevenue)}
                </h3>
                <p
                  className={`text-sm mt-1 ${
                    isRevenueUp ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isRevenueUp ? "↑" : "↓"} {Math.abs(revenueGrowth)}% so với
                  tháng trước
                </p>
              </div>

              {/* Doanh số (Số lượng sản phẩm) */}
              <div className="bg-white shadow-sm rounded-xl border p-6 min-w-0">
                <p className="text-sm text-gray-500 font-medium text-uppercase">
                  Doanh số (Sản phẩm bán ra)
                </p>
                <h3 className="text-2xl font-bold mt-1 text-gray-800">
                  {currentQty}{" "}
                  <span className="text-lg font-normal text-gray-400">sp</span>
                </h3>
                <p
                  className={`text-sm mt-1 ${
                    isQtyUp ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {isQtyUp ? "↑" : "↓"} {Math.abs(qtyGrowth)}% so với tháng
                  trước
                </p>
              </div>

              {/* Đơn hàng (Số đơn) */}
              <div className="bg-white shadow-sm rounded-xl border p-6 min-w-0">
                <p className="text-sm text-gray-500 font-medium text-uppercase">
                  Đơn hàng (Tháng này)
                </p>
                <h3 className="text-2xl font-bold mt-1 text-gray-800">
                  {currentOrders}{" "}
                  <span className="text-lg font-normal text-gray-400">đơn</span>
                </h3>
                <div className="mt-1 h-5 overflow-hidden">
                  <p className="text-xs text-gray-400 italic">
                    Tổng số giao dịch thành công
                  </p>
                </div>
              </div>
            </div>

            {/* Biểu đồ doanh thu */}
            <div className="grid grid-cols-1 gap-6 min-w-0">
              <div className="bg-white border rounded-xl p-6 shadow-sm min-w-0">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-semibold text-gray-700">
                    Xu hướng doanh thu 6 tháng gần nhất
                  </h2>
                  <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md font-medium uppercase">
                    Dữ liệu thời gian thực
                  </span>
                </div>
                <div className="min-w-0 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={revenueData}
                      margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
                    >
                      <defs>
                        <linearGradient
                          id="colorRevenue"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#6366f1"
                            stopOpacity={0.1}
                          />
                          <stop
                            offset="95%"
                            stopColor="#6366f1"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#f0f0f0"
                      />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#9ca3af", fontSize: 12 }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#9ca3af", fontSize: 12 }}
                        tickFormatter={(val) =>
                          `${(val / 1000000).toFixed(0)}M`
                        }
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "10px",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                        }}
                        formatter={(value) => [
                          formatCurrency(value),
                          "Doanh thu",
                        ]}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#6366f1"
                        strokeWidth={4}
                        dot={{
                          r: 6,
                          fill: "#6366f1",
                          strokeWidth: 2,
                          stroke: "#fff",
                        }}
                        activeDot={{ r: 8, strokeWidth: 0 }}
                        animationDuration={1500} // Hiệu ứng vẽ biểu đồ khi load
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Biểu đồ tròn & danh mục bán chạy */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">
              {/* Phân bổ danh mục */}
              <div className="bg-white border rounded-xl p-6 shadow-sm min-w-0">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">
                  Phân bổ doanh số theo danh mục
                </h2>
                <div className="min-w-0 h-72 min-h-[300px] flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
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

              {/* Danh sách danh mục hot nhất */}
              <div className="bg-white border rounded-xl p-6 shadow-sm min-w-0">
                <h2 className="text-lg font-semibold mb-4 text-gray-700">
                  Xếp hạng danh mục bán chạy
                </h2>
                <div className="space-y-6">
                  {categoryData
                    .sort((a, b) => b.value - a.value)
                    .slice(0, 5)
                    .map((item, idx) => {
                      const percent = (item.value / totalForProgress) * 100;
                      return (
                        <div key={idx}>
                          <div className="flex justify-between text-sm font-medium mb-1">
                            <span className="text-gray-700">{item.name}</span>
                            <span className="text-indigo-600">
                              {item.value} sản phẩm
                            </span>
                          </div>
                          <div className="w-full h-2.5 bg-gray-100 rounded-full">
                            <div
                              className="h-2.5 rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min(percent, 100).toFixed(1)}%`,
                                backgroundColor: item.color,
                              }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  {categoryData.length === 0 && (
                    <p className="text-gray-400 italic text-center py-10">
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
