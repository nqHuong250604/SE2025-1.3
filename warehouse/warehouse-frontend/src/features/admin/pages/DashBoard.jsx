import React from "react";
import RecentOrders from "./RecentOrder";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import LoadingTrucks from "./LoadingTrucks";
import LatestShipping from "./LatestShipping";
import OrderRequests from "./OrderRequests";

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar bên trái */}
      <Sidebar />

      {/* Phần nội dung bên phải */}
      <div className="flex flex-col flex-1">
        {/* Thanh topbar */}
        <Topbar />

        {/* Nội dung chính */}
        <main className="p-6 overflow-y-auto">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <RecentOrders />
                <LoadingTrucks />
              </div>
              <LatestShipping />
            </div>
            <OrderRequests />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
