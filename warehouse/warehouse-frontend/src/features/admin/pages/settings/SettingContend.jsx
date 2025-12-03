import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

const SettingsContent = () => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <div className="p-6 w-full overflow-y-auto">
      {/* ========= PAGE TITLE ========= */}
      <h1 className="text-xl font-bold">Settings</h1>
      <p className="text-gray-600 mt-1 text-sm">
        Configure your system preferences and account settings
      </p>

      {/* ========= TABS ========= */}
      <div className="flex bg-gray-200 rounded-full p-1 w-full mt-4">
        {[
          "General",
          "Notifications",
          "Security",
          "Appearance",
          "Integrations",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`flex-1 py-1.5 rounded-full text-xs font-medium transition-all
                ${
                  activeTab === tab.toLowerCase()
                    ? "bg-white shadow text-black"
                    : "text-gray-600"
                }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ----------- TAB CONTENT ----------- */}
      <div className="mt-4 space-y-4">
        {/* ================ GENERAL TAB ================ */}
        {activeTab === "general" && (
          <>
            {/* Company Info */}
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="text-base font-semibold mb-3">
                Company Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="font-medium text-xs">Company Name</label>
                  <input
                    className="w-full p-2 bg-gray-100 rounded text-sm"
                    defaultValue="LogiTrack Solutions"
                  />
                </div>
                <div>
                  <label className="font-medium text-xs">Email</label>
                  <input
                    className="w-full p-2 bg-gray-100 rounded text-sm"
                    defaultValue="admin@logitrack.com"
                  />
                </div>
                <div>
                  <label className="font-medium text-xs">Phone</label>
                  <input
                    className="w-full p-2 bg-gray-100 rounded text-sm"
                    defaultValue="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="font-medium text-xs">Timezone</label>
                  <select className="w-full p-2 bg-gray-100 rounded text-sm">
                    <option>Eastern Time (UTC-5)</option>
                    <option>Pacific Time (UTC-8)</option>
                  </select>
                </div>
              </div>
              <div className="mt-3">
                <label className="font-medium text-xs">Address</label>
                <input
                  className="w-full p-2 bg-gray-100 rounded text-sm"
                  defaultValue="123 Business Ave, New York, NY 10001"
                />
              </div>
              <button className="w-full bg-black text-white py-2 mt-4 rounded-md text-sm">
                Save Changes
              </button>
            </div>

            {/* System Preferences */}
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="text-base font-semibold mb-3">
                System Preferences
              </h2>
              {[
                {
                  title: "Auto-save changes",
                  desc: "Automatically save changes as you type",
                },
                {
                  title: "Enable audit logging",
                  desc: "Track all system changes and user actions",
                },
                {
                  title: "Data backup",
                  desc: "Enable automatic daily backups",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b last:border-none"
                >
                  <div>
                    <p className="font-medium text-sm">{item.title}</p>
                    <p className="text-gray-500 text-xs">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      defaultChecked
                      className="sr-only peer"
                    />
                    <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-black peer transition-all"></div>
                    <div className="absolute left-1 top-0.5 w-3.5 h-3.5 bg-white rounded-full peer-checked:translate-x-5 transition-all"></div>
                  </label>
                </div>
              ))}
            </div>
          </>
        )}
        {/* ================ NOTIFICATIONS TAB ================ */}
        {activeTab === "notifications" && (
          <div className="bg-white rounded-xl shadow p-4">
            <h2 className="text-base font-semibold mb-3">
              Notification Settings
            </h2>
            {[
              {
                title: "Email notifications",
                desc: "Receive updates via email",
              },
              {
                title: "Push notifications",
                desc: "Browser push notifications",
              },
              { title: "SMS alerts", desc: "Critical alerts via SMS" },
              {
                title: "Low stock alerts",
                desc: "Notify when inventory is low",
              },
              {
                title: "Delivery updates",
                desc: "Updates on package deliveries",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b last:border-none"
              >
                <div>
                  <p className="font-medium text-sm">{item.title}</p>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked={i !== 2}
                  />
                  <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-black transition-all"></div>
                  <div className="absolute left-1 top-0.5 w-3.5 h-3.5 bg-white rounded-full peer-checked:translate-x-5 transition-all"></div>
                </label>
              </div>
            ))}
          </div>
        )}
        {/* ================ SECURITY TAB ================ */}
        {activeTab === "security" && (
          <>
            {/* Password */}
            <div className="bg-white rounded-xl shadow p-4">
              <h2 className="text-base font-semibold mb-3">
                Security Settings
              </h2>
              <label className="font-medium text-xs">Current Password</label>
              <input
                type="password"
                className="w-full p-2 bg-gray-100 rounded text-sm mt-1"
              />
              <label className="font-medium text-xs mt-3 block">
                New Password
              </label>
              <input
                type="password"
                className="w-full p-2 bg-gray-100 rounded text-sm mt-1"
              />
              <label className="font-medium text-xs mt-3 block">
                Confirm New Password
              </label>
              <input
                type="password"
                className="w-full p-2 bg-gray-100 rounded text-sm mt-1"
              />
              <button className="mt-3 bg-black text-white py-2 px-4 rounded-md text-sm">
                Update Password
              </button>
            </div>

            {/* 2FA */}
            <div className="bg-white rounded-xl shadow p-4 mt-4">
              <h2 className="text-base font-semibold mb-2">
                Two-Factor Authentication
              </h2>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Enable 2FA</p>
                  <p className="text-gray-500 text-xs">
                    Add an extra layer of security
                  </p>
                </div>
                <label className="relative inline-flex cursor-pointer items-center">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-10 h-5 bg-gray-300 rounded-full peer-checked:bg-black transition-all"></div>
                  <div className="absolute left-1 top-0.5 w-3.5 h-3.5 bg-white rounded-full peer-checked:translate-x-5 transition-all"></div>
                </label>
              </div>
              <button className="mt-2 border px-3 py-1 rounded-md text-sm">
                Setup Authenticator App
              </button>
            </div>
          </>
        )}
        {/* ================ APPEARANCE TAB ================ */}
        {activeTab === "appearance" && (
          <div className="bg-white rounded-xl shadow p-4 space-y-2">
            <h2 className="text-base font-semibold text-gray-700 mb-2">
              Appearance Settings
            </h2>

            {[
              { label: "Theme", options: ["Light", "Dark", "System Default"] },
              {
                label: "Language",
                options: ["English", "Vietnamese", "Spanish", "French"],
              },
              {
                label: "Date Format",
                options: ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY/MM/DD"],
              },
            ].map((item, i) => (
              <div key={i} className="max-w-xs">
                {/* label ngắn hơn */}
                <label className="font-medium text-xs w-18 inline-block">
                  {item.label}
                </label>

                <div className="relative">
                  <select className="p-2 pr-10 bg-gray-100 rounded text-sm appearance-none w-full">
                    {item.options.map((opt) => (
                      <option key={opt}>{opt}</option>
                    ))}
                  </select>

                  <ChevronDown
                    size={16}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================ INTEGRATIONS TAB ================ */}
        {activeTab === "integrations" && (
          <div className="bg-white rounded-xl shadow p-4 space-y-2">
            <h2 className="text-base font-normal mb-2">API Integrations</h2>
            {[
              {
                title: "Shipping API",
                desc: "Connect with shipping providers",
                status: "Connected",
                connected: true,
              },
              {
                title: "Payment Gateway",
                desc: "Process payments and invoices",
                status: "Connect",
                connected: false,
              },
              {
                title: "Warehouse Management",
                desc: "Sync with warehouse systems",
                status: "Connect",
                connected: false,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center justify-between border p-3 rounded-md"
              >
                <div>
                  <p className="font-normal text-sm">{item.title}</p>
                  <p className="text-gray-500 text-xs">{item.desc}</p>
                </div>
                <button
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    item.connected
                      ? "bg-green-100 text-green-700 cursor-default"
                      : "bg-black text-white hover:opacity-80"
                  }`}
                >
                  {item.status}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsContent;
