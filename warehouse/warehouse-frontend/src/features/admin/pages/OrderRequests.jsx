import React from "react";

const orders = [
  {
    id: "ORDER01",
    pickup: "41 Sector 15, Sef, Delhi",
    destination: "C6, Shah Colony, Mumbai",
    customer: "Raj Industries",
    date: "17 July 2024 18:00",
  },
  {
    id: "ORDER02",
    pickup: "Plot 45, Delhi",
    destination: "Sector 9, Mumbai",
    customer: "Raj Industries",
    date: "18 July 2024 16:00",
  },
];

const OrderRequests = () => (
  <div className="bg-white p-4 rounded-2xl shadow-sm h-fit">
    <h3 className="font-semibold mb-3">Order Requests</h3>
    <div className="space-y-3">
      {orders.map((o) => (
        <div key={o.id} className="bg-red-50 p-3 rounded-lg border border-red-100">
          <div className="flex justify-between items-center mb-2">
            <p className="font-semibold text-sm">{o.id}</p>
            <p className="text-xs text-gray-500">{o.date}</p>
          </div>
          <div className="text-xs text-gray-700">
            <p>📍 Pickup: {o.pickup}</p>
            <p>🏁 Destination: {o.destination}</p>
            <p>👤 Customer: <b>{o.customer}</b></p>
          </div>
          <button className="text-blue-600 text-xs mt-2 hover:underline">
            View Details
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default OrderRequests;
