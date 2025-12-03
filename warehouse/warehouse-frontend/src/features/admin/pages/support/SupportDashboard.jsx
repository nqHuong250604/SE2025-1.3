import React, { useState } from "react";
import Sidebar from "../../components/Sidebar";
import Topbar from "../../components/Topbar";
import {
  Search,
  Mail,
  Phone,
  MessageCircle,
  Book,
  PlayCircle,
  FileText,
  Code,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function SupportDashboard() {
  const faqs = [
    {
      question: "How do I track a shipment?",
      answer:
        "You can track a shipment by entering the tracking number in the 'Shipment Tracking' page. The system will display real-time updates on the package location and delivery status.",
    },
    {
      question: "How do I add new inventory items?",
      answer:
        "Navigate to the 'Inventory Management' page and click the 'Add Item' button. Fill in the required information including SKU, name, category, stock level, and location.",
    },
    {
      question: "Can I export reports?",
      answer:
        "Yes, you can export reports from the 'Reports & Analytics' page. Click on any chart or table and select the export option to download data in CSV or PDF format.",
    },
    {
      question: "How do I reset my password?",
      answer:
        "Go to Settings > Security and use the password reset form. You'll need to enter your current password and create a new one.",
    },
    {
      question: "How do I manage user permissions?",
      answer:
        "Only administrators can manage user permissions. Go to 'User Management' and click 'Edit' next to any user to modify their role and permissions.",
    },
  ];

  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden text-[14px]">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-y-auto">
        <Topbar />

        {/* MAIN CONTENT */}
        <div className="p-4 space-y-5">
          {/* Page Header */}
          <div className="mb-2">
            <h1 className="text-xl font-semibold">Help & Support</h1>
            <p className="text-gray-600 text-sm">
              Find answers and get assistance with LogiTrack
            </p>
          </div>

          {/* Search Box */}
          <div className="bg-white p-3 shadow-sm rounded-lg flex items-center gap-3">
            {/* Input with icon */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search help articles..."
                className="w-full pl-9 pr-3 py-1 bg-gray-100 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button className="px-4 py-1 bg-black text-white text-sm rounded-md hover:bg-gray-800">
              Search
            </button>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            {/* LEFT SIDE */}
            <div className="col-span-2 space-y-5">
              {/* Quick Links */}
              <div className="bg-white p-4 shadow-sm rounded-lg space-y-3">
                <h2 className="font-normal text-base mb-5">Quick Links</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <QuickItem
                    icon={<Book />}
                    title="Getting Started Guide"
                    desc="Basics of using the system"
                  />
                  <QuickItem
                    icon={<FileText />}
                    title="User Manual"
                    desc="Documentation for all features"
                  />
                  <QuickItem
                    icon={<PlayCircle />}
                    title="Video Tutorials"
                    desc="Step-by-step guides"
                  />
                  <QuickItem
                    icon={<Code />}
                    title="API Documentation"
                    desc="Developer API reference"
                  />
                </div>
              </div>

              {/* FAQ */}
              <div className="bg-white p-4 shadow-sm rounded-lg">
                <h2 className="font-normal text-base mb-5">
                  Frequently Asked Questions
                </h2>
                <div className="divide-y text-sm">
                  {faqs.map((faq, idx) => (
                    <div key={idx}>
                      <button
                        className="w-full flex justify-between items-center py-3.5 px-2 
                     hover:bg-gray-50 hover:underline font-medium cursor-pointer"
                        onClick={() => toggleFAQ(idx)}
                      >
                        <span>{faq.question}</span>
                        {openIndex === idx ? (
                          <ChevronUp className="w-4 h-4 text-gray-500" />
                        ) : (
                          <ChevronDown className="w-4 h-4 text-gray-500" />
                        )}
                      </button>
                      {openIndex === idx && (
                        <div
                          className={`overflow-hidden transition-all duration-300 text-gray-600 px-2 ${
                            openIndex === idx ? "max-h-96 py-2" : "max-h-0"
                          }`}
                        >
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* System Status */}
              <div className="bg-white p-4 shadow-sm rounded-lg">
                <h2 className="font-normal text-base mb-5">System Status</h2>
                <div className="space-y-2 text-sm">
                  <StatusItem
                    label="All Systems Operational"
                    status="Healthy"
                  />
                  <StatusItem label="API Services" status="Online" />
                  <StatusItem label="Database" status="Connected" />
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="col-span-1 space-y-5">
              {/* Contact Support */}
              <div className="bg-white p-4 shadow-sm rounded-lg space-y-4">
                <h2 className="font-normal text-base mb-5">Contact Support</h2>

                <div className="flex flex-col items-center gap-3 w-full">
                  <MiniButton icon={<MessageCircle />} label="Live Chat" />
                  <MiniButton icon={<Mail />} label="Email Support" />
                  <MiniButton icon={<Phone />} label="Call Support" />
                </div>

                <div className="bg-gray-100 p-3 rounded-md text-xs text-gray-600 w-full">
                  <p className="font-semibold text-sm">Support Hours:</p>
                  <p>Mon - Fri: 9 AM - 6 PM</p>
                  <p>Sat: 10 AM - 4 PM</p>
                </div>
              </div>

              {/* Recent Updates */}
              <div className="bg-white p-4 shadow-sm rounded-lg">
                <h2 className="font-normal text-base mb-3">Recent Updates</h2>
                <div className="space-y-3 text-sm">
                  <UpdateItem
                    version="2.1.0"
                    date="March 8, 2024"
                    desc="Enhanced tracking features"
                  />
                  <UpdateItem
                    version="2.0.5"
                    date="Feb 28, 2024"
                    desc="Bug fixes and improvements"
                  />
                  <UpdateItem
                    version="2.0.0"
                    date="Feb 15, 2024"
                    desc="Major UI overhaul"
                  />
                </div>
              </div>

              {/* Feedback */}
              <div className="bg-white p-4 shadow-sm rounded-lg">
                <h2 className="font-normal text-base mb-3">Feedback</h2>
                <p className="text-xs text-gray-600 mb-2">
                  Help us improve the system by sharing your feedback.
                </p>

                <button className="w-full p-2 bg-white text-black text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-200 transition-colors">
                  Send Feedback
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ----------------- COMPONENTS ----------------- */

const QuickItem = ({ icon, title, desc }) => (
  <div className="border p-3 rounded-md hover:bg-gray-50 cursor-pointer flex items-start gap-2 text-sm">
    {React.cloneElement(icon, { className: "w-4 h-4 text-gray-600 mt-0.5" })}
    <div>
      <p className="font-medium">{title}</p>
      <p className="text-xs text-gray-500">{desc}</p>
    </div>
  </div>
);

const MiniButton = ({ icon, label }) => (
  <button
    className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50 
               justify-center w-full text-sm"
  >
    {React.cloneElement(icon, { className: "w-4 h-4 text-gray-500" })}
    {label}
  </button>
);

const StatusItem = ({ label, status }) => (
  <div className="flex items-center justify-between p-2 border rounded-md text-sm">
    <div className="flex items-center gap-2">
      <span className="w-2.5 h-2.5 bg-green-500 rounded-full"></span>
      <span>{label}</span>
    </div>
    <span className="text-green-800 text-xs font-medium bg-green-100 px-2 py-1 rounded">
      {status}
    </span>
  </div>
);

const UpdateItem = ({ version, date, desc }) => (
  <div className="p-2.5 border rounded-md text-sm">
    <p className="font-semibold text-sm">Version {version}</p>
    <p className="text-[11px] text-gray-500 mb-1">{date}</p>
    <p className="text-gray-600 text-xs">{desc}</p>
  </div>
);
