import React from "react";

const shipments = [
  { id: "ORDER01", status: "Delivered", customer: "Raj Industries", from: "Delhi", to: "Mumbai", date: "17 Jul 2024" },
  { id: "ORDER02", status: "Active", customer: "Raj Industries", from: "Delhi", to: "Mumbai", date: "17 Jul 2024" },
  { id: "ORDER03", status: "Canceled", customer: "Raj Industries", from: "Delhi", to: "Mumbai", date: "17 Jul 2024" },
];

const getStatusColor = (status) => {
  switch (status) {
    case "Delivered": return "bg-blue-100 text-blue-600";
    case "Active": return "bg-green-100 text-green-600";
    case "Canceled": return "bg-red-100 text-red-600";
    default: return "bg-gray-100 text-gray-600";
  }
};

const LatestShipping = () => (
  <div className="bg-white p-4 rounded-2xl shadow-sm">
    <div className="flex justify-between items-center mb-3">
      <h3 className="font-semibold">Latest Shipping</h3>
      <button className="text-blue-600 text-sm hover:underline">View All</button>
    </div>

    <table className="w-full text-sm">
      <thead>
        <tr className="text-left border-b">
          <th className="py-2">Order ID</th>
          <th>Status</th>
          <th>Customer</th>
          <th>Departure</th>
          <th>Arrival</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {shipments.map((s) => (
          <tr key={s.id} className="border-b">
            <td className="py-2">{s.id}</td>
            <td><span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(s.status)}`}>{s.status}</span></td>
            <td>{s.customer}</td>
            <td>{s.from}</td>
            <td>{s.to}</td>
            <td>{s.date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default LatestShipping;
