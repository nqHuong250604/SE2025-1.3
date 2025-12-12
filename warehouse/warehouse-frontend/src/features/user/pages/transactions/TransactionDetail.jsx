import React from "react";
import { ListChecks, ArrowLeft, Calendar, User, Tag, Package } from "lucide-react";
import DetailItem from "./DetailItem";
import formatCurrency from "./formatCurrency"; 
import Badge from "./Badge";

const TransactionDetail = ({ detailData, setView }) => {
  if (!detailData) return null;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-5xl mx-auto border border-slate-100">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
            <ListChecks className="w-7 h-7 text-indigo-600" /> Chi tiết Giao dịch
          </h2>
          <div className="text-sm text-slate-500 mt-2">
            ID: <span className="font-mono text-slate-700">#{detailData.id}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge type={detailData.transaction_type} />
          <div className="text-sm text-slate-600 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-slate-400" />
            {detailData.created_at}
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left */}
        <div className="md:col-span-2 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <DetailItem label="Mã Tham chiếu" value={detailData.reference_number || "-"} monospace icon={Tag} />
            <DetailItem label="Người thực hiện" value={detailData.performed_by || "-"} icon={User} />
            <DetailItem label="Ngày tạo" value={detailData.created_at} icon={Calendar} />
            <DetailItem label="Ghi chú" value={detailData.notes || "Không có"} icon={ListChecks} />
          </div>

          {/* Sản phẩm */}
          <div className="mt-4 p-5 border rounded-xl shadow-md bg-slate-50">
            <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-indigo-600" /> Sản phẩm
            </h3>

            {(detailData.products?.length > 0 ? detailData.products : [detailData]).map((prod, idx) => (
              <div key={idx} className="p-4 border border-indigo-200 rounded-lg flex items-center justify-between bg-white shadow-sm mb-3">
                <div>
                  <div className="font-bold text-slate-800">
                    {prod.product_name || `Sản phẩm ID: ${prod.product_id}`}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">Mã SP: {prod.product_id}</div>
                </div>
                <div className="text-sm font-medium text-slate-700 text-right">
                  <span className="font-bold text-indigo-600">{prod.quantity}</span> x {formatCurrency(prod.unit_price)}
                  <div className="text-xs text-slate-500 mt-0.5">
                    Tổng: {formatCurrency(prod.quantity * prod.unit_price)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right */}
        <div className="bg-indigo-600 rounded-2xl p-6 text-white flex flex-col justify-between shadow-lg">
          <div>
            <div className="text-sm opacity-80">Tổng giá trị giao dịch</div>
            <div className="mt-2 text-4xl font-extrabold">
              {formatCurrency(
                detailData.total_amount ??
                (detailData.products?.reduce((sum, p) => sum + p.quantity * p.unit_price, 0) || detailData.unit_price * detailData.quantity)
              )}
            </div>
            <p className="mt-3 text-sm opacity-90">
              Đây là tổng giá trị được tính theo đơn giá tại thời điểm tạo giao dịch.
            </p>
          </div>

          <div className="mt-8">
            <div className="text-xs opacity-70 mb-3">Thao tác nhanh</div>
            <div className="grid grid-cols-1 gap-3">
              <button className="w-full py-2 rounded-xl bg-white text-indigo-600 font-semibold hover:bg-indigo-50 transition duration-150">
                In Hóa đơn
              </button>
              <button className="w-full py-2 rounded-xl bg-white text-indigo-600 font-semibold hover:bg-indigo-50 transition duration-150">
                Xuất Báo cáo
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-slate-100">
        <button
          onClick={() => setView("list")}
          className="text-indigo-700 hover:text-indigo-900 flex items-center gap-2 font-medium transition duration-150"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
        </button>
      </div>
    </div>
  );
};

export default TransactionDetail;
