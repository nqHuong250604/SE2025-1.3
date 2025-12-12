import React from "react";
import { ListChecks, Filter, RefreshCw, Loader2, User } from "lucide-react";
import ModernSelect from "./ModernSelect";
import Badge from "./Badge";

const TransactionList = ({
  filterType,
  setFilterType,
//   searchTerm,
  setSearchTerm,
  setQ,
  loading,
  filteredTransactions,
  loadTransactions,
  loadDetail,
  formatCurrency,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      {/* ===== HEADER ===== */}
      <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap lg:flex-nowrap">
        <div className="flex items-center gap-2 flex-shrink-0">
          <ListChecks className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-bold text-slate-800 whitespace-nowrap">
            Danh sách Giao dịch
          </h3>
        </div>

        {/* Filter + Refresh */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <ModernSelect
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="py-2.5 min-w-[150px]"
          >
            <option value="">Tất cả loại</option>
            <option value="IN">Nhập kho (IN)</option>
            <option value="OUT">Xuất kho (OUT)</option>
            <option value="ADJUSTMENT">Điều chỉnh</option>
            <option value="RETURN">Trả hàng</option>
          </ModernSelect>

          <button
            onClick={() => {
              setSearchTerm("");
              setQ("");
              loadTransactions();
            }}
            disabled={loading}
            className={`px-4 py-2.5 rounded-xl bg-white border text-slate-700 flex items-center gap-2 hover:bg-slate-50 transition duration-150 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed justify-center min-w-[120px] ${
              loading ? "animate-pulse" : ""
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                Đang tải...
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4 text-indigo-600" />
                Làm mới
              </>
            )}
          </button>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1000px] table-auto">
          <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider font-semibold border-b">
            <tr>
              <th className="px-6 py-3 text-left">Mã / Tham chiếu</th>
              <th className="px-6 py-3 text-left">Loại</th>
              <th className="px-6 py-3 text-left">Sản phẩm</th>
              <th className="px-6 py-3 text-left">Người thực hiện</th>
              <th className="px-6 py-3 text-right">Tổng giá trị</th>
              <th className="px-6 py-3 text-center"></th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-10 text-center text-slate-500 text-lg flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />{" "}
                      Đang tải dữ liệu...
                    </>
                  ) : (
                    <>
                      <Filter className="w-6 h-6 text-slate-400" /> Không tìm thấy giao dịch nào phù hợp.
                    </>
                  )}
                </td>
              </tr>
            ) : (
              filteredTransactions.map((t) => (
                <tr
                  key={t.id}
                  className="border-b last:border-b-0 hover:bg-indigo-50/50 transition duration-150 cursor-pointer"
                  onClick={() => loadDetail(t.id)}
                >
                  <td className="px-6 py-4 align-top">
                    <div className="font-mono text-sm text-slate-800 font-medium">
                      {t.reference_number || "-"}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Mã giao dịch: #{t.id}
                    </div>
                  </td>

                  <td className="px-6 py-4 align-top">
                    <Badge type={t.transaction_type} />
                  </td>

                  <td className="px-6 py-4 align-top text-sm text-slate-700">
                    <div className="font-medium">
                      {t.product_name || `ID: ${t.product_id}`}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      SL: {t.quantity}
                    </div>
                  </td>

                  <td className="px-6 py-4 align-top text-sm text-slate-600 flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    {t.performed_by || "Hệ thống"}
                  </td>

                  <td className="px-6 py-4 align-top text-sm text-slate-800 font-bold text-right">
                    {formatCurrency(t.total_amount ?? t.unit_price * t.quantity)}
                  </td>

                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        loadDetail(t.id);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-sm font-medium hover:bg-indigo-100 transition duration-150"
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
