import React from "react";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";

import {
  FiAlertTriangle,
  FiClock,
  FiBell,
  FiCheckCircle,
  FiPackage,
  FiTruck,
  FiCpu,
} from "react-icons/fi";

const notifications = [
  {
    title: "Package Delivered",
    message:
      "Order #ORD001 has been successfully delivered to Acme Corporation",
    time: "2 minutes ago",
    type: "normal",
    icon: <FiCheckCircle className="text-green-600 text-xl" />,
    priority: "normal",
    unread: true,
  },
  {
    title: "Low Stock Alert",
    message: "Coffee Maker (SKU002) is running low. Only 23 units remaining.",
    time: "1 hour ago",
    type: "high",
    icon: <FiAlertTriangle className="text-red-500 text-xl" />,
    priority: "high",
    unread: true,
  },
  {
    title: "New Order Received",
    message: "Order #ORD005 from Metro Supplies has been placed",
    time: "3 hours ago",
    type: "normal",
    icon: <FiPackage className="text-blue-500 text-xl" />,
    priority: "normal",
    unread: false,
  },
  {
    title: "Shipment Delayed",
    message:
      "Order #ORD004 delivery has been delayed due to weather conditions",
    time: "5 hours ago",
    type: "medium",
    icon: <FiClock className="text-yellow-500 text-xl" />,
    priority: "medium",
    unread: false,
  },
  {
    title: "System Maintenance",
    message: "Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM",
    time: "1 day ago",
    type: "low",
    icon: <FiCpu className="text-purple-500 text-xl" />,
    priority: "low",
    unread: false,
  },
];

const SummaryCard = ({ icon, label, count }) => (
  <div className="border rounded-2xl p-6 flex flex-col gap-1 bg-white shadow-sm">
    <div className="text-2xl">{icon}</div>
    <p className="font-medium">{label}</p>
    <p className="text-gray-500">{count} unread</p>
  </div>
);

const NotificationDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Topbar />

        <main className="flex-1 overflow-auto p-6 space-y-8">
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-semibold">Notifications</h1>
              <p className="text-gray-500">
                Stay updated with alerts and system notifications
              </p>
            </div>

            <div className="flex gap-3">
              <button className="px-4 py-2 rounded-lg border hover:bg-gray-50">
                Mark All Read
              </button>
              <button className="px-4 py-2 rounded-lg border hover:bg-gray-50">
                Settings
              </button>
            </div>
          </div>

          {/* SUMMARY CARDS */}
          <div className="grid grid-cols-3 gap-4">
            <SummaryCard
              icon={<FiAlertTriangle className="text-red-500" />}
              label="High Priority"
              count={2}
            />
            <SummaryCard
              icon={<FiClock className="text-yellow-500" />}
              label="Medium Priority"
              count={1}
            />
            <SummaryCard
              icon={<FiBell className="text-blue-600" />}
              label="Total Notifications"
              count={3}
            />
          </div>

          {/* RECENT NOTIFICATIONS */}
          <div className="bg-white border rounded-2xl p-6 space-y-4">
            <h2 className="font-semibold text-lg">Recent Notifications</h2>

            {notifications.map((n, idx) => (
              <div
                key={idx}
                className={`border rounded-xl p-5 flex justify-between items-start ${
                  n.unread ? "bg-blue-50" : "bg-white"
                }`}
              >
                <div className="flex gap-4">
                  {n.icon}
                  <div>
                    <p className="font-medium">{n.title}</p>
                    <p className="text-gray-600 text-sm">{n.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                  </div>
                </div>

                <div className="flex flex-row items-end gap-3">
                  <span
                    className={`
                        px-2 py-[2px] text-xs rounded-full capitalize self-start
                        ${
                        n.priority === "high"
                            ? "bg-red-100 text-red-600"
                            : n.priority === "medium"
                            ? "bg-yellow-100 text-yellow-600"
                            : n.priority === "low"
                            ? "bg-green-100 text-green-600"
                            : "bg-gray-200 text-gray-600"
                        }
                    `}
                  >
                    {n.priority}
                  </span>

                  {n.unread && (
                    <span className="w-2 h-2 bg-blue-600 rounded-full self-start mt-1"></span>
                  )}

                  <button
                    className="text-black text-sm px-3 py-1 rounded
             hover:bg-gray-200 transition-all duration-150"
                  >
                    Mark Read
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* NOTIFICATION PREFERENCES */}
          <div className="bg-white border rounded-2xl p-6 space-y-6">
            <h2 className="font-semibold text-lg">Notification Preferences</h2>

            {[
              {
                label: "Email Notifications",
                desc: "Receive notifications via email",
              },
              {
                label: "Push Notifications",
                desc: "Receive browser push notifications",
              },
              { label: "SMS Alerts", desc: "Receive critical alerts via SMS" },
            ].map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center border-b pb-4 last:border-none last:pb-0"
              >
                <div>
                  <p className="font-medium">{item.label}</p>
                  <p className="text-gray-500 text-sm">{item.desc}</p>
                </div>
                <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
                  Configure
                </button>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationDashboard;
