import React from "react";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const revenueData = [
  { month: "Jan", revenue: 45000 },
  { month: "Feb", revenue: 52000 },
  { month: "Mar", revenue: 48000 },
  { month: "Apr", revenue: 61000 },
  { month: "May", revenue: 55000 },
  { month: "Jun", revenue: 68000 },
];

const ordersData = [
  { month: "Jan", orders: 120, deliveries: 110 },
  { month: "Feb", orders: 140, deliveries: 135 },
  { month: "Mar", orders: 135, deliveries: 130 },
  { month: "Apr", orders: 160, deliveries: 150 },
  { month: "May", orders: 145, deliveries: 138 },
  { month: "Jun", orders: 180, deliveries: 175 },
];

const categoryData = [
  { name: "Electronics", value: 35, color: "#8b82ff" },
  { name: "Furniture", value: 25, color: "#8dd6a0" },
  { name: "Appliances", value: 20, color: "#ffc86b" },
  { name: "Accessories", value: 20, color: "#ff7c00" },
];

const kpiData = [
  { label: "Order Fulfillment Rate", value: 94 },
  { label: "Customer Satisfaction", value: 87 },
  { label: "On-Time Delivery", value: 92 },
  { label: "Inventory Turnover", value: 78 },
];

const ReportsDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100 min-w-0 overflow-x-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 min-w-0">
        <Topbar />

        <main className="flex-1 overflow-auto min-w-0">
          <div className="p-6 space-y-6 min-w-0">

            <div>
              <h1 className="text-xl font-semibold">Reports & Analytics</h1>
              <p className="text-gray-500">
                Performance insights and business analytics
              </p>
            </div>

            {/* Statistic Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 min-w-0">

              <div className="bg-white shadow-sm rounded-xl border p-6 min-w-0">
                <p className="text-sm text-gray-500">Monthly Revenue</p>
                <h3 className="text-2xl font-bold mt-1">$67,000</h3>
                <p className="text-sm text-green-600 mt-1">+12% from last month</p>
              </div>

              <div className="bg-white shadow-sm rounded-xl border p-6 min-w-0">
                <p className="text-sm text-gray-500">Total Orders</p>
                <h3 className="text-2xl font-bold mt-1">180</h3>
                <p className="text-sm text-blue-600 mt-1">+8% from last month</p>
              </div>

              <div className="bg-white shadow-sm rounded-xl border p-6 min-w-0">
                <p className="text-sm text-gray-500">Deliveries</p>
                <h3 className="text-2xl font-bold mt-1">175</h3>
                <p className="text-sm text-purple-600 mt-1">+5% from last month</p>
              </div>

              <div className="bg-white shadow-sm rounded-xl border p-6 min-w-0">
                <p className="text-sm text-gray-500">Delivery Rate</p>
                <h3 className="text-2xl font-bold mt-1">97.2%</h3>
                <p className="text-sm text-green-600 mt-1">+0.5% from last month</p>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">

              <div className="bg-white border rounded-xl p-6 shadow-sm min-w-0">
                <h2 className="text-lg font-semibold mb-4">Monthly Revenue Trend</h2>
                <div className="min-w-0 h-72 min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-white border rounded-xl p-6 shadow-sm min-w-0">
                <h2 className="text-lg font-semibold mb-4">Orders vs Deliveries</h2>
                <div className="min-w-0 h-72 min-h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ordersData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="orders" fill="#818cf8" />
                      <Bar dataKey="deliveries" fill="#4ade80" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>

            {/* New Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 min-w-0">

              <div className="bg-white border rounded-xl p-6 shadow-sm min-w-0">
                <h2 className="text-lg font-semibold mb-4">Category Distribution</h2>
                <div className="min-w-0 h-72 min-h-[300px] flex justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        outerRadius={100}
                        label={({ name, value }) => `${name} ${value}%`}
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
                <h2 className="text-lg font-semibold mb-4">Key Performance Indicators</h2>
                <div className="space-y-6">
                  {kpiData.map((item, idx) => (
                    <div key={idx}>
                      <div className="flex justify-between text-sm font-medium">
                        <span>{item.label}</span>
                        <span>{item.value}%</span>
                      </div>
                      <div className="w-full h-3 bg-gray-200 rounded-full mt-1">
                        <div
                          className="h-3 bg-black rounded-full"
                          style={{ width: `${item.value}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
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
