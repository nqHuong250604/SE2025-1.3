import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

const data = [
  { name: "Active", value: 40 },
  { name: "Loading Delayed", value: 23 },
  { name: "Ready to Load", value: 12 },
  { name: "Unloading Delayed", value: 12 },
  { name: "Ready to Unload", value: 3 },
  { name: "Canceled", value: 3 },
];

const COLORS = ["#2563eb", "#facc15", "#10b981", "#f97316", "#06b6d4", "#ef4444"];

const LoadingTrucks = () => (
  <div className="bg-white p-4 rounded-2xl shadow-sm">
    <h3 className="font-semibold mb-3">Loading Trucks</h3>
    <div className="flex justify-center items-center">
      <PieChart width={220} height={220}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={80}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </div>
    <div className="text-center mt-2 text-sm">
      <b>120</b> Total Trucks
    </div>
  </div>
);

export default LoadingTrucks;
