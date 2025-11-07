import React from "react";
import { TrendingUp } from "lucide-react";

const RecentOrders = () => {
  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">Recent Orders</h3>
        <select className="border rounded-md px-2 text-sm">
          <option>July</option>
          <option>July</option>
          <option>July</option>
          <option>July</option>
        </select>
      </div>

      <div className="text-sm">
        <p>Active Orders: <b>720</b></p>
        <p>Pending Requests: <b>120</b></p>
        <p>Accepted: <b>450</b></p>
      </div>

      <div className="flex items-center gap-2 mt-3 text-green-500">
        <TrendingUp size={16} /> <span>+40% since last month</span>
      </div>
    </div>
  );
};

export default RecentOrders;
