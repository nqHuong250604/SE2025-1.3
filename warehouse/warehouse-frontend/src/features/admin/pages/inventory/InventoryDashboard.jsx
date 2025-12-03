import React from "react";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import { FiSearch, FiFilter } from "react-icons/fi";
import { AiOutlineWarning } from "react-icons/ai";

const items = [
  {
    name: "Wireless Headphones",
    sku: "SKU001",
    category: "Electronics",
    stock: 245,
    status: "In Stock",
    price: 79.99,
    location: "Warehouse A1",
    updated: "2 hours ago",
  },
  {
    name: "Coffee Maker",
    sku: "SKU002",
    category: "Appliances",
    stock: 23,
    status: "Low Stock",
    price: 129.99,
    location: "Warehouse B2",
    updated: "1 hour ago",
  },
  {
    name: "Office Chair",
    sku: "SKU003",
    category: "Furniture",
    stock: 0,
    status: "Out of Stock",
    price: 199.99,
    location: "Warehouse C3",
    updated: "3 hours ago",
  },
  {
    name: "Laptop Stand",
    sku: "SKU004",
    category: "Accessories",
    stock: 156,
    status: "In Stock",
    price: 49.99,
    location: "Warehouse A1",
    updated: "30 min ago",
  },
];

const InventoryDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Topbar />

        <main className="flex-1 overflow-auto p-6 space-y-6">

          {/* TITLE */}
          <div>
            <h1 className="text-xl font-semibold">Inventory Management</h1>
            <p className="text-gray-500">
              Manage stock levels and warehouse inventory
            </p>
          </div>

          {/* STAT CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="bg-white shadow-sm rounded-xl border p-6">
              <p className="text-sm text-gray-500">Total Items</p>
              <h3 className="text-2xl font-bold">1,847</h3>
              <p className="text-sm text-green-600 mt-1">+5% from last month</p>
            </div>

            <div className="bg-white shadow-sm rounded-xl border p-6">
              <p className="text-sm text-gray-500">Low Stock</p>
              <h3 className="text-2xl font-bold">23</h3>
              <p className="text-sm text-red-600 mt-1">-2% from last month</p>
            </div>

            <div className="bg-white shadow-sm rounded-xl border p-6">
              <p className="text-sm text-gray-500">Out of Stock</p>
              <h3 className="text-2xl font-bold">7</h3>
              <p className="text-sm text-orange-600 mt-1">+1% from last month</p>
            </div>

            <div className="bg-white shadow-sm rounded-xl border p-6">
              <p className="text-sm text-gray-500">Total Value</p>
              <h3 className="text-2xl font-bold">$2.4M</h3>
              <p className="text-sm text-green-600 mt-1">+8% from last month</p>
            </div>

          </div>

          {/* SEARCH + FILTER */}
          <div className="bg-white border rounded-xl p-4 flex items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
              <FiSearch className="text-gray-500 text-lg" />
              <input
                type="text"
                placeholder="Search items by name, SKU, or category..."
                className="w-full outline-none"
              />
            </div>

            <button className="flex items-center gap-2 border px-4 py-2 rounded-lg hover:bg-gray-100">
              <FiFilter />
              Filter
            </button>
          </div>

          {/* TABLE */}
          <div className="bg-white border rounded-xl shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 border-b text-gray-600 text-sm">
                  <th className="p-4">Item</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Stock</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Last Updated</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {items.map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">{item.sku}</p>
                    </td>

                    <td className="p-4">{item.category}</td>

                    <td className="p-4 flex items-center gap-1">
                      {item.stock}
                      {(item.stock < 30 || item.stock === 0) && (
                        <AiOutlineWarning className="text-yellow-500 text-lg" />
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-3 py-1 text-sm rounded-full ${
                          item.status === "In Stock"
                            ? "bg-green-100 text-green-700"
                            : item.status === "Low Stock"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>

                    <td className="p-4 font-medium">${item.price.toFixed(2)}</td>

                    <td className="p-4">{item.location}</td>

                    <td className="p-4 text-gray-500">{item.updated}</td>

                    <td className="p-4 space-x-2">
                      <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
                        Edit
                      </button>
                      <button className="px-3 py-1 border rounded-lg hover:bg-gray-100">
                        Restock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* LOW STOCK ALERTS */}
          <div className="bg-white border rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4">Low Stock Alerts</h2>

            <div className="space-y-4">
              {items
                .filter((i) => i.stock < 30)
                .map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center bg-yellow-50 border border-yellow-200 p-4 rounded-xl"
                  >
                    <div>
                      <h3 className="font-medium flex items-center gap-2">
                        <AiOutlineWarning className="text-yellow-500 text-xl" />
                        {item.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Only {item.stock} left (threshold: 25)
                      </p>
                    </div>

                    <button className="bg-black text-white px-4 py-2 rounded-lg">
                      Reorder
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InventoryDashboard;
