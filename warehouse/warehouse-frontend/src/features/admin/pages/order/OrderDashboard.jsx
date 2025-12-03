import React from "react";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import {
  FiShoppingCart,
  FiClock,
  FiLoader,
  FiDollarSign,
  FiSearch,
} from "react-icons/fi";

const orders = [
  {
    id: "ORD001",
    customer: "Acme Corporation",
    address: "123 Business Ave, New York, USA",
    date: "2024-03-10",
    items: 5,
    total: 2450,
    status: "Processing",
    priority: "High",
  },
  {
    id: "ORD002",
    customer: "Tech Solutions Inc",
    address: "456 Tech Street, Seattle, WA",
    date: "2024-03-09",
    items: 3,
    total: 1280,
    status: "Shipped",
    priority: "Medium",
  },
  {
    id: "ORD003",
    customer: "Global Imports",
    address: "789 Import Blvd, Miami, FL",
    date: "2024-03-08",
    items: 12,
    total: 5670,
    status: "Delivered",
    priority: "Low",
  },
  {
    id: "ORD004",
    customer: "Metro Supplies",
    address: "321 Supply Lane, Chicago, IL",
    date: "2024-03-07",
    items: 8,
    total: 3200,
    status: "Pending",
    priority: "High",
  },
];

const OrderDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Topbar />

        <main className="flex-1 overflow-auto p-6 space-y-6">
          {/* TITLE */}
          <div>
            <h1 className="text-xl font-semibold">Order Management</h1>
            <p className="text-gray-500">Manage and track customer orders</p>
          </div>

          {/* TOP CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Orders */}
            <div className="bg-white shadow-sm rounded-xl border p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <h3 className="text-3xl font-bold mt-1">1,247</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-2xl">
                <FiShoppingCart />
              </div>
            </div>

            {/* Pending */}
            <div className="bg-white shadow-sm rounded-xl border p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Pending</p>
                <h3 className="text-3xl font-bold mt-1">34</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-2xl">
                <FiClock />
              </div>
            </div>

            {/* Processing */}
            <div className="bg-white shadow-sm rounded-xl border p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Processing</p>
                <h3 className="text-3xl font-bold mt-1">18</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-2xl">
                <FiLoader />
              </div>
            </div>

            {/* Revenue */}
            <div className="bg-white shadow-sm rounded-xl border p-6 flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-500">Revenue</p>
                <h3 className="text-3xl font-bold mt-1">$89,432</h3>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-2xl">
                <FiDollarSign />
              </div>
            </div>
          </div>

          {/* SEARCH + FILTER */}
          <div className="bg-white border rounded-xl p-4 flex items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
              <FiSearch className="text-gray-500 text-lg" />
              <input
                type="text"
                placeholder="Search orders by ID or customer..."
                className="w-full outline-none"
              />
            </div>

            <select className="border px-4 py-2 rounded-lg hover:bg-gray-100">
              <option>All Status</option>
              <option>Pending</option>
              <option>Processing</option>
              <option>Shipped</option>
              <option>Delivered</option>
            </select>
          </div>

          {/* ORDER TABLE */}
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b text-gray-600 text-sm">
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Customer</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((order, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-4">{order.id}</td>

                    <td className="p-4">
                      <p className="font-medium">{order.customer}</p>
                      <p className="text-gray-500 text-sm">{order.address}</p>
                    </td>

                    <td className="p-4">{order.date}</td>

                    <td className="p-4">{order.items} items</td>

                    <td className="p-4 font-semibold">
                      ${order.total.toLocaleString()}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm
                          ${
                            order.status === "Processing"
                              ? "bg-purple-100 text-purple-700"
                              : order.status === "Shipped"
                              ? "bg-blue-100 text-blue-700"
                              : order.status === "Delivered"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }
                        `}
                      >
                        {order.status}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm
                          ${
                            order.priority === "High"
                              ? "bg-red-100 text-red-700"
                              : order.priority === "Medium"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-green-100 text-green-700"
                          }
                        `}
                      >
                        {order.priority}
                      </span>
                    </td>

                    <td className="p-4 flex items-center gap-2">
                      <button className="px-3 py-1 border rounded-lg hover:bg-gray-100 flex items-center gap-1">
                        👁 View
                      </button>
                      <button className="px-3 py-1 border rounded-lg hover:bg-gray-100 flex items-center gap-1">
                        ✏️ Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* RECENT ACTIVITY */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">
              Recent Order Activity
            </h2>

            <div className="space-y-4">
              <div className="p-4 border rounded-xl bg-green-50">
                <h3 className="font-medium">Order ORD001 has been processed</h3>
                <p className="text-gray-500 text-sm">
                  Acme Corporation • 2 hours ago
                </p>
              </div>

              <div className="p-4 border rounded-xl bg-blue-50">
                <h3 className="font-medium">Order ORD002 has been shipped</h3>
                <p className="text-gray-500 text-sm">
                  Tech Solutions Inc • 4 hours ago
                </p>
              </div>

              <div className="p-4 border rounded-xl bg-yellow-50">
                <h3 className="font-medium">New order ORD005 created</h3>
                <p className="text-gray-500 text-sm">
                  Metro Supplies • 6 hours ago
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default OrderDashboard;
