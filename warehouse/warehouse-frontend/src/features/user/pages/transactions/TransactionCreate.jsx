import React, { useState } from "react";
import { Plus, Search, Package, ArrowLeft, Trash2 } from "lucide-react";
import ModernInput from "./ModernInput";
import ModernSelect from "./ModernSelect";
import Badge from "./Badge";
import formatCurrency from "./formatCurrency";
import { useAuth } from "../../../../services/AuthContext";

const TransactionCreate = ({
  type,
  setType,
  searchProducts,
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

  // 1. Lấy thông tin user và trạng thái loading từ AuthContext
  const { user } = useAuth();

  // 2. Tự động xác định tên người thực hiện
  // Nếu user chưa load xong sẽ hiện "Đang xác thực...", khi load xong sẽ tự nhảy tên
  const performedBy = user?.full_name || "Đang xác thực tài khoản...";

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchLocal(val);
    if (val.trim()) {
      searchProducts(val);
    }
  };

  const updateQuantity = (idx, newQty) => {
    let qty = Math.max(1, Number(newQty) || 1);
    const item = items[idx];

    // Nếu là xuất kho, tự động gán về số lượng tối đa nếu nhập quá
    if (type === "OUT" && qty > (item.stock_quantity || 0)) {
      qty = item.stock_quantity;
      // Có thể thêm một cái toast hoặc thông báo nhỏ ở đây
    }

    setItems((prev) =>
      prev.map((it, i) => (i === idx ? { ...it, quantity: qty } : it))
    );
  };

  // Hàm xử lý nhấn nút Xác nhận
  const handleFinalSubmit = () => {
    if (items.length === 0) {
      alert("Vui lòng thêm ít nhất 1 sản phẩm");
      return;
    }
    // Gửi kèm tên người thực hiện mới nhất từ Context vào hàm submit
    submitTransaction();
  };
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-5xl mx-auto border border-slate-100 animate-in fade-in duration-500">
      <div className="flex flex-col lg:flex-row items-start gap-8">
        {/* ================= LEFT: Cấu hình chung ================= */}
        <div className="flex-[2] w-full">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <Plus className="w-7 h-7 text-indigo-600" /> Tạo giao dịch
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

            {/* Người thực hiện (Tự động cập nhật) */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Người thực hiện
              </label>
              <ModernInput
                readOnly
                value={performedBy}
                className={
                  !user?.full_name
                    ? "animate-pulse text-slate-400 italic"
                    : "font-medium text-indigo-600"
                }
              />
            </div>

            {/* Tìm & Thêm sản phẩm */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Tìm & thêm sản phẩm vào danh sách
              </label>

              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-slate-400" />
                </div>

                <ModernInput
                  value={searchLocal}
                  onChange={handleSearchChange}
                  placeholder="Nhập tên hoặc mã sản phẩm..."
                  className="pl-12 pr-3 h-12"
                />

                {searchResult.length > 0 && (
                  <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 max-h-64 overflow-y-auto overflow-x-hidden">
                    {searchResult.map((p) => {
                      const isOutOfStock =
                        (p.stock_quantity <= 0 || !p.stock_quantity) &&
                        type === "OUT";

                      return (
                        <div
                          key={p.id}
                          onClick={() => {
                            if (isOutOfStock) return; // Không cho click nếu hết hàng
                            addProduct(p);
                            setSearchLocal("");
                          }}
                          className={`p-3 flex items-center justify-between transition duration-150 border-b last:border-b-0 ${
                            isOutOfStock
                              ? "bg-slate-50 opacity-60 cursor-not-allowed"
                              : "hover:bg-indigo-50 cursor-pointer"
                          }`}
                        >
                          <div className="flex items-center gap-3 truncate mr-4">
                            <Package
                              className={`w-5 h-5 flex-shrink-0 ${
                                isOutOfStock
                                  ? "text-slate-400"
                                  : "text-indigo-500"
                              }`}
                            />
                            <div className="truncate">
                              <div
                                className={`font-bold truncate ${
                                  isOutOfStock
                                    ? "text-slate-400"
                                    : "text-slate-800"
                                }`}
                              >
                                {p.name}{" "}
                                {isOutOfStock && (
                                  <span className="text-[10px] text-rose-500 font-black">
                                    (HẾT HÀNG)
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-slate-500">
                                SKU: {p.sku || p.id} | Kho:{" "}
                                <span
                                  className={`${
                                    p.stock_quantity > 0
                                      ? "text-emerald-600"
                                      : "text-rose-600"
                                  } font-bold`}
                                >
                                  {p.stock_quantity ?? 0}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Ẩn giá hoặc hiển thị giá mờ đi nếu hết hàng */}
                          <div
                            className={`text-sm font-bold whitespace-nowrap px-3 py-1 rounded-full border ${
                              isOutOfStock
                                ? "text-slate-400 bg-slate-100 border-slate-200"
                                : "text-indigo-600 bg-indigo-50 border-indigo-100"
                            }`}
                          >
                            {formatCurrency(p.price ?? p.unit_price)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================= RIGHT: Giỏ hàng / Xác nhận ================= */}
        <div className="flex-[3] w-full bg-slate-50/50 p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-6 sticky top-6">
          <div className="border border-indigo-200 rounded-xl p-4 bg-indigo-50">
            <div className="text-base font-bold text-indigo-700 flex items-center gap-2 mb-3">
              Tóm tắt giao dịch
            </div>

            <div className="flex items-center justify-between mb-3">
              <div className="text-sm text-slate-600">Tổng mặt hàng</div>
              <div className="text-base font-bold text-slate-800">
                {items.reduce((s, it) => s + Number(it.quantity || 0), 0)} sản
                phẩm
              </div>
            </div>

            <div className="p-4 rounded-xl bg-indigo-600 text-white shadow-lg">
              <div className="text-xs opacity-80 uppercase tracking-wider font-bold">
                Tổng Giá trị (Ước tính)
              </div>
              <div className="text-2xl font-black mt-1">
                {formatCurrency(totalAmount)}
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-inner flex flex-col gap-3 max-h-[22rem] overflow-y-auto">
            <div className="grid grid-cols-6 text-[10px] font-black text-slate-400 uppercase border-b pb-2 sticky top-0 bg-white z-10">
              <div className="col-span-2">Sản phẩm</div>
              <div className="text-center">Số lượng</div>
              <div className="text-right">Đơn giá</div>
              <div className="text-right">Thành tiền</div>
              <div className="w-6"></div>
            </div>

            {items.length === 0 ? (
              <div className="text-center text-slate-400 text-sm py-8 italic">
                Chưa có sản phẩm nào được chọn.
              </div>
            ) : (
              items.map((it, idx) => (
                <div
                  key={`${it.id}-${idx}`}
                  className="grid grid-cols-6 items-center gap-2 py-3 border-b last:border-b-0 animate-in slide-in-from-right-2 duration-300"
                >
                  <div className="col-span-2">
                    <div className="font-bold text-slate-800 text-sm truncate">
                      {it.product_name || it.name}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      ID: {it.id}
                    </div>
                  </div>

                  <div className="flex justify-center">
                    <input
                      type="number"
                      value={it.quantity}
                      min={1}
                      onChange={(e) => updateQuantity(idx, e.target.value)}
                      className="w-14 text-center font-bold border border-slate-200 rounded-lg p-1 text-sm focus:ring-2 ring-indigo-500 outline-none"
                    />
                  </div>

                  <div className="text-right text-xs text-slate-500">
                    {formatCurrency(it.unit_price)}
                  </div>

                  <div className="font-bold text-indigo-700 text-sm text-right">
                    {formatCurrency(it.quantity * it.unit_price)}
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={() => removeItem(idx)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={handleFinalSubmit}
              disabled={items.length === 0 || loading}
              className={`w-full py-4 rounded-xl text-white font-black text-lg transition-all active:scale-[0.98] shadow-xl shadow-indigo-200 ${
                items.length > 0 && !loading
                  ? "bg-indigo-600 hover:bg-indigo-700"
                  : "bg-slate-300 cursor-not-allowed"
              }`}
            >
              {loading ? (
                <div className="flex items-center gap-2 justify-center">
                  <div className="w-5 h-5 animate-spin border-3 border-white border-t-transparent rounded-full"></div>
                  Đang xử lý...
                </div>
              ) : (
                "Xác nhận giao dịch"
              )}
            </button>

            <button
              onClick={() => {
                setItems([]);
                setSearchLocal("");
              }}
              disabled={loading || items.length === 0}
              className="w-full py-3 rounded-xl border-2 border-slate-200 text-slate-500 font-bold hover:bg-slate-50 disabled:hidden transition-all"
            >
              Hủy toàn bộ
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-6 border-t border-slate-100 flex justify-between items-center text-sm">
        <div className="text-slate-400 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          Mã giao dịch sẽ được tạo tự động sau khi xác nhận.
        </div>
        <button
          onClick={() => setView("list")}
          className="text-slate-600 hover:text-indigo-600 font-bold flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
        </button>
      </div>
    </div>
  );
};

export default TransactionCreate;
