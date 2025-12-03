import React from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import SettingsContent from "./SettingContend";

const SettingDashboard = () => {
  return (
    <div>
      <div className="flex h-screen bg-gray-100 overflow-hidden">
        <Sidebar />

        <div className="flex flex-col flex-1">
          <Topbar />
          <SettingsContent />
        </div>
      </div>
    </div>
  );
};

export default SettingDashboard;
