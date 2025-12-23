import React, { useState, useEffect } from "react";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import { 
  FiSearch, FiEdit3, FiRefreshCw, FiMapPin, 
  FiBox, FiAlertTriangle, FiCheckCircle, FiXOctagon 
} from "react-icons/fi";

import {
  getInventoryList,
  updateInventory,
  getProductList,
} from "../../services/adminServices";

const InventoryDashboard = () => {
  const [inventory, setInventory] = useState([]);
  const [productMap, setProductMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // State cho Modal chỉnh sửa
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  // State thống kê
  const [stats, setStats] = useState({
    total_items: 0,
    low_stock: 0,
    out_of_stock: 0,
    total_quantity: 0,
  });

  // Hàm load dữ liệu (Gọi song song cả Inventory và Product để ghép tên)
  const fetchData = async () => {
    setLoading(true);
    try {
      const [inventoryData, productsData] = await Promise.all([
        getInventoryList(),
        getProductList({ limit: 1000 }) // Lấy limit lớn để map đủ tên sản phẩm
      ]);

      // 1. Xử lý dữ liệu kho
      const invItems = Array.isArray(inventoryData) ? inventoryData : inventoryData.items || [];
      setInventory(invItems);
      calculateStats(invItems);

      // 2. Xử lý dữ liệu sản phẩm -> Chuyển sang dạng Map { id: productData } để tra cứu nhanh
      const prodItems = productsData.items || [];
      const map = {};
      prodItems.forEach(product => {
        map[product.id] = product;
      });
      setProductMap(map);

    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    } finally {
      setLoading(false);
    }
  };

  // Tính toán chỉ số thống kê
  const calculateStats = (items) => {
    const totalItems = items.length;
    const lowStock = items.filter((i) => i.available_quantity <= 10 && i.available_quantity > 0).length;
    const outOfStock = items.filter((i) => i.available_quantity === 0).length;
    const totalQty = items.reduce((sum, item) => sum + (item.quantity || 0), 0);

    setStats({
      total_items: totalItems,
      low_stock: lowStock,
      out_of_stock: outOfStock,
      total_quantity: totalQty,
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditClick = (item) => {
    setEditingItem({ ...item });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSaveChanges = async () => {
    if (!editingItem) return;
    try {
      const payload = {
        quantity: parseInt(editingItem.quantity),
        reserved_quantity: parseInt(editingItem.reserved_quantity),
        location: editingItem.location,
      };
      await updateInventory(editingItem.id, payload);
      handleCloseModal();
      fetchData();
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  // Lọc tìm kiếm (Cập nhật để tìm theo cả Tên sản phẩm và SKU)
  const filteredItems = inventory.filter((item) => {
    const product = productMap[item.product_id];
    const productName = product?.name?.toLowerCase() || "";
    const productSKU = product?.sku?.toLowerCase() || "";
    const search = searchTerm.toLowerCase();

    return (
      item.product_id.toString().includes(search) ||
      (item.location && item.location.toLowerCase().includes(search)) ||
      productName.includes(search) ||
      productSKU.includes(search)   
    );
  });

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="flex-1 overflow-auto p-6 space-y-6">
          
          {/* Header Section */}
          <div className="flex justify-between items-end">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Quản lý tồn kho</h1>
              <p className="text-gray-500 text-sm">Theo dõi tồn kho thực tế, hàng giữ và vị trí.</p>
            </div>
            <button 
              onClick={fetchData}
              className="flex items-center gap-2 px-4 py-2 bg-white border rounded-lg hover:bg-gray-50 text-gray-700 shadow-sm transition-all"
            >
              <FiRefreshCw className={loading ? "animate-spin" : ""} />
              Làm mới
            </button>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Tổng sản phẩm" 
              value={stats.total_items} 
              icon={<FiBox size={24} />}
              color="text-blue-600" 
              bg="bg-blue-50"
            />
            <StatCard 
              title="Tổng tồn kho" 
              value={stats.total_quantity.toLocaleString()} 
              icon={<FiCheckCircle size={24} />}
              color="text-green-600" 
              bg="bg-green-50"
            />
            <StatCard 
              title="Hàng sắp hết" 
              value={stats.low_stock} 
              icon={<FiAlertTriangle size={24} />}
              color="text-yellow-600" 
              bg="bg-yellow-50"
            />
            <StatCard 
              title="Hàng đã hết" 
              value={stats.out_of_stock} 
              icon={<FiXOctagon size={24} />}
              color="text-red-600" 
              bg="bg-red-50"
            />
          </div>

          {/* Search Bar */}
          <div className="bg-white border rounded-xl p-4 flex items-center gap-4 shadow-sm">
            <FiSearch className="text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Tìm kiếm theo Tên sản phẩm, SKU, ID hoặc Vị trí..."
              className="w-full outline-none text-gray-700 placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Main Table */}
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-600 text-xs uppercase font-semibold tracking-wider">
                <tr>
                  <th className="p-4 border-b">Sản phẩm</th>
                  <th className="p-4 border-b text-center">Tổng tồn kho</th>
                  <th className="p-4 border-b text-center">Số lượng đặt trước</th>
                  <th className="p-4 border-b text-center">Tồn kho sẵn có</th>
                  <th className="p-4 border-b">Vị trí</th>
                  <th className="p-4 border-b">Thời gian cập nhật</th>
                  <th className="p-4 border-b text-center">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="p-10 text-center text-gray-500">Đang tải dữ liệu...</td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-10 text-center text-gray-500">Không tìm thấy kết quả.</td>
                  </tr>
                ) : (
                  filteredItems.map((item) => {
                    const product = productMap[item.product_id];
                    return (
                      <tr key={item.id} className="hover:bg-blue-50 transition-colors duration-150">
                        <td className="p-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-gray-800 text-sm">
                              {product ? product.name : `Sản phẩm #${item.product_id}`}
                            </span>
                            <span className="text-xs text-gray-500 mt-0.5">
                              SKU: {product ? product.sku : "N/A"} | ID: {item.product_id}
                            </span>
                          </div>
                        </td>
                        <td className="p-4 text-center font-semibold text-gray-700">{item.quantity}</td>
                        <td className="p-4 text-center text-orange-600 font-medium">
                          {item.reserved_quantity > 0 ? item.reserved_quantity : "-"}
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              item.available_quantity === 0 ? "bg-red-100 text-red-600" :
                              item.available_quantity <= 10 ? "bg-yellow-100 text-yellow-700" :
                              "bg-green-100 text-green-700"
                          }`}>
                            {item.available_quantity}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600 text-sm">
                          <div className="flex items-center gap-2">
                            <FiMapPin className="text-gray-400" />
                            {item.location || <span className="text-gray-400 italic">--</span>}
                          </div>
                        </td>
                        <td className="p-4 text-xs text-gray-500">
                          {item.last_updated ? new Date(item.last_updated).toLocaleString("vi-VN") : "N/A"}
                        </td>
                        <td className="p-4 text-center">
                          <button onClick={() => handleEditClick(item)} className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors">
                            <FiEdit3 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* EDIT MODAL */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
            <div className="p-6 border-b bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Điều chỉnh kho hàng</h3>
              <div className="text-sm text-gray-500 mt-1">
                {productMap[editingItem.product_id]?.name || `Product #${editingItem.product_id}`}
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vị trí (Location)</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={editingItem.location || ""}
                  onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                  placeholder="Ví dụ: Kệ A-01..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tổng tồn kho (Qty)</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={editingItem.quantity}
                    onChange={(e) => setEditingItem({ ...editingItem, quantity: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Đặt trước (Reserved)</label>
                  <input
                    type="number"
                    min="0"
                    className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={editingItem.reserved_quantity}
                    onChange={(e) => setEditingItem({ ...editingItem, reserved_quantity: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg flex justify-between items-center border border-blue-100">
                <span className="text-sm text-blue-800 font-medium">Tồn kho còn lại:</span>
                <span className="text-xl font-bold text-blue-700">
                  {editingItem.quantity - editingItem.reserved_quantity}
                </span>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button onClick={handleCloseModal} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-200 rounded-lg">Hủy</button>
              <button onClick={handleSaveChanges} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 shadow-lg">Lưu lại</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Component StatCard đã được nâng cấp UI
const StatCard = ({ title, value, color, icon, bg }) => (
  <div className="bg-white shadow-sm hover:shadow-md transition-all duration-200 rounded-xl border p-5 flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
      <h3 className={`text-2xl font-bold ${color}`}>{value}</h3>
    </div>
    <div className={`p-3 rounded-lg ${bg} ${color} bg-opacity-20`}>
      {icon}
    </div>
  </div>
);

export default InventoryDashboard;
