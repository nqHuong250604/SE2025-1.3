import React, { useState } from "react";
import { Plus, Search, Package, ArrowLeft, Trash2 } from "lucide-react";
import ModernInput from "./ModernInput";
import ModernSelect from "./ModernSelect";
import Badge from "./Badge";
import formatCurrency from "./formatCurrency";
import { useAuth } from '../../../../services/AuthContext';
const TransactionCreate = ({
  type,
  setType,
  searchProducts,   // thêm hàm searchProducts từ parent
  searchResult,
  addProduct,
  items,
  setItems,
  removeItem,
  totalAmount,
  submitTransaction,
  loading,
  setView,
}) => {
  const [searchLocal, setSearchLocal] = useState("");

  // BỔ SUNG: Lấy thông tin người dùng từ Context
  const { user } = useAuth();
  const performedBy = user?.full_name || "Đang tải / Admin";

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchLocal(val);
    if (val.trim()) {
      searchProducts(val); // gọi API lọc sản phẩm
    }
  };

  // Update quantity của từng sản phẩm
  const updateQuantity = (idx, newQty) => {
    if (newQty < 1) newQty = 1; // tối thiểu 1
    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, quantity: newQty } : it))
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-5xl mx-auto border border-slate-100">
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* ================= LEFT ================= */}
        <div className="flex-[2]">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Plus className="w-7 h-7 text-indigo-600" /> Tạo Giao dịch Mới
            </h2>
            <Badge type={type} />
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Loại giao dịch */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Loại giao dịch
              </label>
              <ModernSelect
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                <option value="IN">Nhập kho (IN)</option>
                <option value="OUT">Xuất kho (OUT)</option>
                <option value="ADJUSTMENT">Điều chỉnh</option>
                <option value="RETURN">Trả hàng</option>
              </ModernSelect>
            </div>

            {/* Người thực hiện */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Người thực hiện
              </label>
              <ModernInput
                readOnly
                value={performedBy}
              />
            </div>

            {/* Tìm & Thêm sản phẩm */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Tìm & Thêm sản phẩm
              </label>

              <div className="relative w-full max-w-sm">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-slate-400" />
                </div>

                <ModernInput
                  value={searchLocal}
                  onChange={handleSearchChange}
                  placeholder="Nhập tên hoặc mã sản phẩm..."
                  className="pl-12 pr-3 h-10 text-sm"
                />

                {searchResult.length > 0 && (
                  <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
                    {searchResult.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          addProduct(p);
                          setSearchLocal("");
                        }}
                        className="p-3 hover:bg-indigo-50 cursor-pointer flex items-center justify-between transition duration-150 border-b last:border-b-0"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <Package className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                          <div className="truncate">
                            <div className="font-medium text-slate-800 truncate">
                              {p.name}
                            </div>
                            <div className="text-xs text-slate-400 truncate">
                              SKU: {p.sku || p.id} | Giá:{" "}
                              {formatCurrency(p.price ?? p.unit_price)}
                            </div>
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1">
                          Thêm <Plus className="w-4 h-4 inline" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT ================= */}
        <div className="flex-[3] bg-white p-6 rounded-2xl flex-shrink-0 border border-slate-200 shadow-xl flex flex-col gap-6 sticky top-6">
          {/* Thông tin giao dịch */}
          <div className="border border-indigo-200 rounded-xl p-4 bg-indigo-50">
            <div className="text-base font-bold text-indigo-700 flex items-center gap-2 mb-3">
              Thông tin Giao dịch
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-slate-600">
                Tổng Số lượng Sản phẩm
              </div>
              <div className="text-base font-semibold text-slate-800">
                {items.reduce((s, it) => s + Number(it.quantity || 0), 0)}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-indigo-600/90 text-white shadow-md shadow-indigo-300">
              <div className="text-sm opacity-80">Tổng Giá trị Ước tính</div>
              <div className="text-2xl font-extrabold mt-1">
                {formatCurrency(totalAmount)}
              </div>
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-inner flex flex-col gap-3 max-h-[25rem] overflow-y-auto">
            <div className="grid grid-cols-6 text-xs font-semibold text-slate-500 border-b pb-2 sticky top-0 bg-white z-10">
              <div className="col-span-2">Sản phẩm</div>
              <div className="text-center">SL</div>
              <div className="text-right">Đơn giá</div>
              <div className="text-right">Tổng</div>
              <div className="w-6"></div>
            </div>

            {items.length === 0 ? (
              <div className="text-center text-slate-500 text-sm py-4">
                Không có sản phẩm nào.
              </div>
            ) : (
              items.map((it, idx) => (
                <div
                  key={it.id + "-" + idx}
                  className="grid grid-cols-6 items-center gap-2 py-2 border-b last:border-b-0 group"
                >
                  <div className="col-span-2 pr-1">
                    <div className="font-medium text-slate-900 line-clamp-2 leading-tight text-sm">
                      {it.product_name || it.name}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      SKU: {it.sku ?? it.id}
                    </div>
                  </div>

                  <div className="text-center">
                    <input
                      type="number"
                      value={it.quantity}
                      min={1}
                      onChange={(e) =>
                        updateQuantity(idx, Number(e.target.value))
                      }
                      className="w-16 text-center border border-slate-300 rounded"
                    />
                  </div>

                  <div className="text-right text-xs text-slate-600 pr-1">
                    {formatCurrency(it.unit_price)}
                  </div>

                  <div className="font-bold text-indigo-700 text-sm text-right pr-1">
                    {formatCurrency(it.quantity * it.unit_price)}
                  </div>

                  <div className="flex justify-end w-full">
                    <button
                      onClick={() => removeItem(idx)}
                      className="p-1 rounded-full text-rose-500 opacity-80 hover:opacity-100 hover:bg-rose-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={submitTransaction}
              disabled={items.length === 0 || loading}
              className={`w-full py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-lg ${
                items.length > 0 && !loading
                  ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-300/60"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 animate-spin border-2 border-white border-t-transparent rounded-full"></div>
              ) : (
                "Xác nhận & Tạo"
              )}
            </button>

            <button
              onClick={() => {
                setItems([]);
                setSearchLocal("");
              }}
              disabled={loading || items.length === 0}
              className="w-full py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-50"
            >
              Hủy & Xóa Sản phẩm
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center">
        <div className="text-xs text-slate-500">
          Mã tham chiếu sẽ được tự động tạo.
        </div>
        <button
          onClick={() => setView("list")}
          className="text-indigo-700 hover:text-indigo-900 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
        </button>
      </div>
    </div>
  );
};

export default TransactionCreate;
