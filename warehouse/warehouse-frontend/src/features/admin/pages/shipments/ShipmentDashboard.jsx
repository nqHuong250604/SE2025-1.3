import React from "react";
import { Package } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";

const shipments = [
  {
    id: "TRK987654321",
    customer: "Tech Solutions Inc",
    location: "Seattle, WA",
    date: "Mar 8, 2024",
    status: "Delivered",
  },
  {
    id: "TRK456789123",
    customer: "Global Imports",
    location: "Miami, FL",
    date: "Mar 10, 2024",
    status: "In Transit",
  },
  {
    id: "TRK789123456",
    customer: "Metro Supplies",
    location: "Chicago, IL",
    date: "Mar 12, 2024",
    status: "Processing",
  },
];

const ShipmentDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Topbar />

        <main className="flex-1 overflow-auto p-8 space-y-10">
          {/* TITLE */}
          <div>
            <h1 className="text-xl font-semibold">Shipments Tracking</h1>
            <p className="text-gray-500">Track packages and monitor delivery status</p>
          </div>

          {/* TRACK A SHIPMENT CARD */}
          <div className="bg-white border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Track a Shipment</h2>

            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Enter tracking number..."
                className="flex-1 px-4 py-3 bg-gray-100 rounded-xl outline-none"
              />
              <button className="px-6 py-3 bg-black text-white rounded-xl">
                Track
              </button>
            </div>
          </div>

          {/* RECENT SHIPMENTS */}
          <div className="bg-white border rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Recent Shipments</h2>

            <div className="space-y-3">
              {shipments.map((item, i) => (
                <div
                  key={i}
                  className="bg-white border rounded-xl p-4 flex items-center justify-between hover:bg-gray-50"
                >
                  {/* LEFT */}
                  <div className="flex items-start gap-4">
                    <div className="text-gray-600">
                      <Package size={24} />
                    </div>

                    <div>
                      <p className="font-semibold text-lg">{item.id}</p>
                      <p className="text-gray-500">{item.customer}</p>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="text-right">
                    <p className="font-medium">{item.location}</p>
                    <p className="text-gray-500 text-sm">{item.date}</p>
                  </div>

                  {/* STATUS BADGE */}
                  <span
                    className={`px-3 py-1 rounded-full text-sm ml-6
                      ${
                        item.status === "Delivered"
                          ? "bg-green-100 text-green-700"
                          : item.status === "In Transit"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }
                    `}
                  >
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>
    </div>
  );
};

export default ShipmentDashboard;
