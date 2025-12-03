import React from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import { Package, Truck, Users, DollarSign, PlusCircle, Search, UserPlus, AlertTriangle, CheckCircle } from "lucide-react";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Topbar />

        <div className="p-6 overflow-y-auto h-[calc(100vh-80px)] space-y-6">

          {/* HEADER */}
          <div>
            <h1 className="text-xl font-semibold">Dashboard</h1>
            <p className="text-gray-500 text-sm">
              Overview of your logistics operations
            </p>
          </div>

          {/* 4 STAT CARDS */}
          <div className="grid grid-cols-4 gap-4">
            {/* Total Shipments */}
            <StatCard
              title="Total Shipments"
              value="2,847"
              change="+12% from last month"
              icon={<Package className="text-blue-500 w-8 h-8" />}
            />

            {/* Active Deliveries */}
            <StatCard
              title="Active Deliveries"
              value="184"
              change="+8% from last month"
              icon={<Truck className="text-green-600 w-8 h-8" />}
            />

            {/* Total Customers */}
            <StatCard
              title="Total Customers"
              value="1,254"
              change="+5% from last month"
              icon={<Users className="text-purple-600 w-8 h-8" />}
            />

            {/* Revenue */}
            <StatCard
              title="Revenue"
              value="$89,432"
              change="+15% from last month"
              icon={<DollarSign className="text-orange-500 w-8 h-8" />}
            />
          </div>

          {/* MAIN CONTENT */}
          <div className="grid grid-cols-[2fr_1fr] gap-6">

            {/* LEFT SIDE – Recent Shipments */}
            <div className="bg-white rounded-xl shadow p-5">
              <h2 className="font-semibold text-lg mb-4">Recent Shipments</h2>

              <Shipment
                id="SH001"
                company="Acme Corp"
                location="New York"
                eta="2 days"
                status="In Transit"
                color="bg-blue-100 text-blue-600"
              />

              <Shipment
                id="SH002"
                company="Tech Solutions"
                location="Los Angeles"
                eta="Completed"
                status="Delivered"
                color="bg-green-100 text-green-600"
              />

              <Shipment
                id="SH003"
                company="Global Trade"
                location="Chicago"
                eta="3 days"
                status="Processing"
                color="bg-yellow-100 text-yellow-600"
              />

              <Shipment
                id="SH004"
                company="Metro Supplies"
                location="Miami"
                eta="5 days"
                status="Delayed"
                color="bg-red-100 text-red-600"
              />
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-white shadow rounded-xl p-5">
                <h2 className="font-semibold text-lg mb-4">Quick Actions</h2>

                <QuickAction icon={<PlusCircle />} title="Create New Shipment" />
                <QuickAction icon={<Search />} title="Track Package" />
                <QuickAction icon={<UserPlus />} title="Add Customer" />
              </div>

              {/* System Alerts */}
              <div className="bg-white shadow rounded-xl p-5">
                <h2 className="font-semibold text-lg mb-4">System Alerts</h2>

                <AlertItem
                  icon={<AlertTriangle />}
                  title="3 shipments delayed"
                  subtitle="Requires attention"
                  color="bg-yellow-100 text-yellow-700"
                />

                <AlertItem
                  icon={<CheckCircle />}
                  title="12 deliveries completed"
                  subtitle="Today"
                  color="bg-green-100 text-green-700"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* --- COMPONENTS --- */

const StatCard = ({ title, value, change, icon }) => (
  <div className="bg-white p-5 rounded-xl shadow flex items-center justify-between">
    <div>
      <p className="text-gray-500 text-sm">{title}</p>
      <h3 className="text-2xl font-semibold">{value}</h3>
      <p className="text-green-600 text-sm">{change}</p>
    </div>
    {icon}
  </div>
);

const Shipment = ({ id, company, location, eta, status, color }) => (
  <div className="flex items-center justify-between p-4 mb-3 border rounded-xl bg-white shadow-sm hover:shadow transition">

    {/* LEFT – ID + Company */}
    <div>
      <p className="font-semibold">{id}</p>
      <p className="text-gray-500 text-sm">{company}</p>
    </div>

    {/* MIDDLE – Location + ETA */}
    <div className="text-right mr-4">
      <p className="font-medium">{location}</p>
      <p className="text-gray-500 text-sm">ETA: {eta}</p>
    </div>

    {/* RIGHT – Status Badge */}
    <span className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap ${color}`}>
      {status}
    </span>
  </div>
);



const QuickAction = ({ icon, title }) => (
  <div className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer mb-3">
    {icon}
    <p>{title}</p>
  </div>
);


const AlertItem = ({ icon, title, subtitle, color }) => (
  <div className={`flex items-center gap-3 p-4 rounded-lg my-2 ${color}`}>
    {icon}
    <div>
      <p className="font-semibold">{title}</p>
      <p className="text-sm">{subtitle}</p>
    </div>
  </div>
);

export default Dashboard;
