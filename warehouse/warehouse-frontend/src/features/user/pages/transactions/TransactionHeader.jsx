import React from "react";
import { ListChecks, Plus } from "lucide-react";
import ActionPill from "./ActionPill";

const TransactionHeader = ({ loading, setView, setDetailData }) => {
  return (
    <div className="flex flex-col gap-6 py-6">
      {/* ===== PHẦN TIÊU ĐỀ ===== */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex flex-col gap-2 shadow-sm">
        <div className="flex items-center gap-3">
          <ListChecks className="w-8 h-8 text-indigo-600" />
          <h1 className="text-3xl font-extrabold text-slate-900">
            Quản lý Giao dịch Kho
          </h1>
        </div>
        <p className="text-base text-slate-500">
          Danh sách và tạo giao dịch nhập / xuất kho
        </p>
      </div>

      {/* ===== GẠCH NGANG ===== */}
      <hr className="border-slate-200" />

      {/* ===== PHẦN ACTIONS ===== */}
      <div className="flex flex-wrap gap-3 items-center">
        <ActionPill
          onClick={() => {
            setView("create");
            setDetailData(null);
          }}
          disabled={loading}
        >
          <Plus className="w-4 h-4" /> Tạo Giao dịch
        </ActionPill>
      </div>
    </div>
  );
};

export default TransactionHeader;
