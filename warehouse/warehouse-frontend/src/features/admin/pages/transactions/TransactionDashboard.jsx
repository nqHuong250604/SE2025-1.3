import React, { useState } from "react";
import Topbar from "../../components/Topbar";
import Sidebar from "../../components/Sidebar";
import {
  FiShoppingCart, FiArrowUpRight, FiArrowDownLeft, FiDollarSign,
  FiSearch, FiEye, FiLoader, FiTag, FiTrash2, FiX, FiUser, FiCalendar, FiPlus
} from "react-icons/fi";

import useFetchData from "../../services/useFetchData";
import {
  getRecentTransactions,
  getDashboardKPIs,
  deleteTransaction,
  createTransaction
} from "../../services/adminServices";

// ---------------- HELPERS ----------------

const formatCurrency = (amount = 0) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
  }).format(amount);
};

// ---------------- COMPONENT ----------------

export default function TransactionDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTxn, setSelectedTxn] = useState(null); // Quản lý modal chi tiết
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false); // Modal tạo mới

  // State cho Form tạo giao dịch mới
  const [formData, setFormData] = useState({
    product_id: "",
    transaction_type: "IN",
    quantity: "",
    unit_price: "",
    reference_number: "",
    notes: "",
    performed_by: ""
  });

  // 1. Fetch KPI
  const { data: kpiData, loading: kpiLoading } = useFetchData(getDashboardKPIs);

  // 2. Fetch toàn bộ giao dịch
  const {
    data: transactionData,
    loading: transactionLoading,
    reload 
  } = useFetchData(() =>
    getRecentTransactions({
      limit: 1000,
      sort: "created_at",
      order: "desc",
    })
  );

  const allTransactions = transactionData || [];

  // 3. Logic Xóa giao dịch
  const handleDelete = async (id) => {
    if (window.confirm("Cảnh báo: Thao tác này không thể hoàn tác. Bạn có chắc chắn muốn xóa giao dịch này?")) {
      try {
        await deleteTransaction(id);
        alert("Xóa giao dịch thành công!");
        if (reload) reload();
      } catch (error) {
        alert("Lỗi khi xóa: " + error.message);
      }
    }
  };

  // 4. Logic Tạo giao dịch mới 
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    
    // Tự động tạo mã tham chiếu và ghi chú giống logic bạn yêu cầu
    const autoReference = `ADM-TXN-${Date.now()}`;
    const autoNotes = formData.notes || `Admin transaction for Product ID: ${formData.product_id} (Qty: ${formData.quantity})`;

    try {
      const payload = {
        transaction_type: formData.transaction_type,
        product_id: parseInt(formData.product_id),
        quantity: parseInt(formData.quantity) || 1,
        unit_price: Math.max(0, parseFloat(formData.unit_price) || 0),
        reference_number: formData.reference_number || autoReference, // Ưu tiên mã nhập tay, nếu không có thì tự tạo
        notes: autoNotes,
        performed_by: formData.performed_by || "Admin",
      };

      await createTransaction(payload);
      alert("Tạo giao dịch thành công!");
      
      // Đóng modal và reset form
      setIsCreateModalOpen(false);
      setFormData({ 
        product_id: "", 
        transaction_type: "IN", 
        quantity: "", 
        unit_price: "", 
        reference_number: "", 
        notes: "", 
        performed_by: "" 
      });
      
      if (reload) reload();
    } catch (error) {
      console.error(error);
      alert("Tạo giao dịch thất bại. Kiểm tra console để biết chi tiết.");
    }
  };

  // 5. Logic Tìm kiếm
  const filteredData = allTransactions.filter(item =>
    item.reference_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.performed_by?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(item.product_id).includes(searchTerm)
  );

  const totalIn = allTransactions.filter(t => t.transaction_type === "IN").length;
  const totalOut = allTransactions.filter(t => t.transaction_type === "OUT").length;

  if (kpiLoading || transactionLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <FiLoader className="animate-spin text-blue-600 text-4xl" />
      </div>
    );
  }

  const getTypeStyles = (type) => {
    const styles = {
      IN: "bg-emerald-100 text-emerald-700 border-emerald-200",
      OUT: "bg-blue-100 text-blue-700 border-blue-200",
      ADJUSTMENT: "bg-amber-100 text-amber-700 border-amber-200",
      RETURN: "bg-rose-100 text-rose-700 border-rose-200"
    };
    return styles[type] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden relative">
      <Sidebar />

      <div className="flex flex-col flex-1">
        <Topbar />

        <main className="flex-1 overflow-auto p-6 space-y-6">
          {/* HEADER */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Quản lý giao dịch</h1>
              <p className="text-gray-500 text-sm">Xem chi tiết các giao dịch nhập (IN) và xuất (OUT)</p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
            >
              <FiPlus size={20} />
              Tạo giao dịch
            </button>
          </div>

          {/* KPI CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard title="Tổng giao dịch" value={allTransactions.length} icon={<FiShoppingCart />} color="indigo" />
            <KpiCard title="Nhập kho (IN)" value={totalIn} icon={<FiArrowDownLeft />} color="green" />
            <KpiCard title="Xuất kho (OUT)" value={totalOut} icon={<FiArrowUpRight />} color="blue" />
            <KpiCard title="Doanh thu (LIFETIME)" value={formatCurrency(kpiData?.revenue || 0)} icon={<FiDollarSign />} color="orange" />
          </div>

          {/* SEARCH BAR */}
          <div className="bg-white border rounded-xl p-4 flex items-center gap-4 shadow-sm focus-within:ring-2 ring-blue-500/20 transition-all">
            <FiSearch className="text-gray-400 text-lg" />
            <input
              type="text"
              placeholder="Tìm theo mã giao dịch, ID sản phẩm, khách hàng..."
              className="w-full outline-none text-gray-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* TABLE */}
          <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b text-gray-500 text-[11px] uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-4">Thông tin giao dịch</th>
                  <th className="p-4">Người thực hiện</th>
                  <th className="p-4">Thời gian</th>
                  <th className="p-4 text-center">Số lượng</th>
                  <th className="p-4">Tổng cộng</th>
                  <th className="p-4">Loại</th>
                  <th className="p-4 text-center">Thao tác</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {filteredData.length ? (
                  filteredData.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-4">
                        <div className="flex flex-col gap-0.5">
                          <span className="font-mono text-sm font-bold text-gray-800">{item.reference_number}</span>
                          <div className="flex items-center gap-1 text-[11px] text-gray-400">
                            <FiTag size={10} />
                            <span>Product ID: </span>
                            <span className="font-semibold text-blue-500">{item.product_id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-gray-700 text-sm">{item.performed_by}</span>
                      </td>
                      <td className="p-4 text-xs text-gray-500">
                        {new Date(item.created_at).toLocaleString('vi-VN')}
                      </td>
                      <td className="p-4 text-center font-bold text-sm">{item.quantity}</td>
                      <td className="p-4 font-bold text-gray-900 text-sm">{formatCurrency(item.total_amount)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black border ${getTypeStyles(item.transaction_type)}`}>
                          {item.transaction_type}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => setSelectedTxn(item)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Xem chi tiết"
                          >
                            <FiEye size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Xóa giao dịch"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-10 text-center text-gray-400 text-sm">Không tìm thấy giao dịch nào.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </main>
      </div>

      {/* MODAL CHI TIẾT GIAO DỊCH */}
      {selectedTxn && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all scale-100">
            <div className="p-5 border-b flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <FiEye className="text-blue-500" /> Chi tiết giao dịch
              </h2>
              <button onClick={() => setSelectedTxn(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <FiX size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <span className="text-gray-500 text-xs uppercase font-bold tracking-tighter">Mã tham chiếu</span>
                <span className="font-mono font-black text-gray-900">{selectedTxn.reference_number}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                  <p className="text-[10px] text-blue-400 uppercase font-bold mb-1">Mã sản phẩm</p>
                  <p className="font-bold text-blue-700 flex items-center gap-1.5">
                    <FiTag size={12} /> {selectedTxn.product_id}
                  </p>
                </div>
                <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                  <p className="text-[10px] text-emerald-400 uppercase font-bold mb-1">Số lượng</p>
                  <p className="font-bold text-emerald-700 mt-1">{selectedTxn.quantity} sản phẩm</p>
                </div>
              </div>

              <div className="space-y-3 py-2">
                <div className="flex items-center gap-3 text-sm">
                  <FiUser className="text-gray-300" />
                  <span className="text-gray-500 italic">Người thực hiện:</span>
                  <span className="font-semibold ml-auto text-gray-800">{selectedTxn.performed_by}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FiCalendar className="text-gray-300" />
                  <span className="text-gray-500 italic">Ngày thực hiện:</span>
                  <span className="font-medium ml-auto text-gray-700">
                    {new Date(selectedTxn.created_at).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <FiDollarSign className="text-gray-300" />
                  <span className="text-gray-500 italic">Đơn giá:</span>
                  <span className="font-bold ml-auto text-gray-800">{formatCurrency(selectedTxn.unit_price)}</span>
                </div>
              </div>

              <div className="bg-gray-50 p-3 rounded-lg border border-dashed border-gray-200">
                <p className="text-[10px] text-gray-400 uppercase font-bold mb-1">Ghi chú giao dịch</p>
                <p className="text-sm text-gray-600 leading-relaxed italic">
                  {selectedTxn.notes || "Không có ghi chú đính kèm."}
                </p>
              </div>

              <div className="pt-4 mt-2 border-t flex justify-between items-center">
                <span className="text-sm font-black text-gray-400 uppercase">Tổng cộng</span>
                <span className="text-2xl font-black text-blue-600">{formatCurrency(selectedTxn.total_amount)}</span>
              </div>
            </div>

            <div className="p-4 bg-gray-50 text-center">
              <button
                onClick={() => setSelectedTxn(null)}
                className="w-full py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-100 transition-all text-sm shadow-sm"
              >
                Đóng cửa sổ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TẠO GIAO DỊCH MỚI */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b flex justify-between items-center bg-gray-50">
              <h2 className="font-bold text-gray-800 flex items-center gap-2">
                <FiPlus className="text-blue-500" /> Tạo giao dịch mới
              </h2>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <FiX size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 grid grid-cols-2 gap-4">
              <div className="col-span-1">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">ID Sản phẩm *</label>
                <input
                  type="number" required
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 ring-blue-500/20 outline-none"
                  value={formData.product_id} onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                />
              </div>
              <div className="col-span-1">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Loại giao dịch *</label>
                <select
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 ring-blue-500/20 outline-none"
                  value={formData.transaction_type} onChange={(e) => setFormData({ ...formData, transaction_type: e.target.value })}
                >
                  <option value="IN">Nhập kho (IN)</option>
                  <option value="OUT">Xuất kho (OUT)</option>
                  <option value="ADJUSTMENT">Điều chỉnh (ADJUSTMENT)</option>
                  <option value="RETURN">Trả hàng (RETURN)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Số lượng *</label>
                <input
                  type="number" required
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 ring-blue-500/20 outline-none"
                  value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Đơn giá (VNĐ)</label>
                <input
                  type="number"
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 ring-blue-500/20 outline-none"
                  value={formData.unit_price} onChange={(e) => setFormData({ ...formData, unit_price: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Mã tham chiếu (Để trống để tự tạo)</label>
                <input
                  type="text"
                  placeholder="ADM-TXN-..."
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 ring-blue-500/20 outline-none"
                  value={formData.reference_number} onChange={(e) => setFormData({ ...formData, reference_number: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Người thực hiện</label>
                <input
                  type="text"
                  placeholder="Mặc định: Admin Dashboard"
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 ring-blue-500/20 outline-none"
                  value={formData.performed_by} onChange={(e) => setFormData({ ...formData, performed_by: e.target.value })}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Ghi chú</label>
                <textarea
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 ring-blue-500/20 outline-none h-20"
                  value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </div>
              <div className="col-span-2 pt-4 flex gap-3">
                <button
                  type="button" onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 py-2 border rounded-xl font-bold text-gray-500 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100"
                >
                  Xác nhận tạo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

const KpiCard = ({ title, value, icon, color }) => {
  const iconColorMap = {
    indigo: "text-indigo-600",
    green: "text-emerald-600",
    blue: "text-blue-600",
    orange: "text-orange-500",
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-semibold text-gray-800">
          {value}
        </h3>
      </div>

      <div className={`w-8 h-8 ${iconColorMap[color]}`}>
        {React.cloneElement(icon, { size: 32 })}
      </div>
    </div>
  );
};
