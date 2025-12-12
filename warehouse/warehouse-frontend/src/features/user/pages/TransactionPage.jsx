import React, { useEffect, useMemo, useState } from "react";
// ... (Các imports khác giữ nguyên)
import {
  ListChecks,
  Plus,
  ArrowLeft,
  Trash2,
  Search,
  CheckCircle,
  XCircle,
  Truck,
  Settings,
  CornerDownLeft,
  DollarSign,
  Package,
  Calendar,
  User,
  Tag,
  Filter,
  RefreshCw,
  Loader2, // Icon mới cho Loading
} from "lucide-react";
import HeaderUser from "../components/HeaderUser";

// Services (giữ nguyên)
import {
  listTransactions,
  getTransactionDetail,
  listProducts,
  createTransaction,
} from "../services/userService";

// -----------------------------
// Helpers & Components Mới (Giữ nguyên)
// -----------------------------

const formatCurrency = (amount) => {
  const num = Number(amount ?? 0);
  if (Number.isNaN(num)) return "0 VNĐ";
  return num.toLocaleString("vi-VN") + " VNĐ";
};

const safeLower = (v) => String(v || "").toLowerCase();

const Badge = ({ type }) => {
  const base =
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold transition duration-150";
  let content;
  let style;

  if (type === "IN") {
    style = `${base} bg-emerald-100 text-emerald-800 ring-1 ring-emerald-300`;
    content = (
      <>
        <CheckCircle className="w-3 h-3 mr-1" />
        NHẬP
      </>
    );
  } else if (type === "OUT") {
    style = `${base} bg-rose-100 text-rose-800 ring-1 ring-rose-300`;
    content = (
      <>
        <XCircle className="w-3 h-3 mr-1" />
        XUẤT
      </>
    );
  } else if (type === "ADJUSTMENT") {
    style = `${base} bg-amber-100 text-amber-800 ring-1 ring-amber-300`;
    content = (
      <>
        <Settings className="w-3 h-3 mr-1" />
        ĐIỀU CHỈNH
      </>
    );
  } else if (type === "RETURN") {
    style = `${base} bg-blue-100 text-blue-800 ring-1 ring-blue-300`;
    content = (
      <>
        <CornerDownLeft className="w-3 h-3 mr-1" />
        TRẢ HÀNG
      </>
    );
  } else {
    style = `${base} bg-slate-100 text-slate-700 ring-1 ring-slate-300`;
    content = type;
  }
  return <span className={style}>{content}</span>;
};

// Small Detail row (Giữ nguyên)
const DetailItem = ({ label, value, highlight, monospace, icon: Icon }) => (
  <div className="flex flex-col p-3 border rounded-xl bg-slate-50 transition duration-150 hover:bg-white">
    <span className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1">
      {Icon && <Icon className="w-4 h-4 text-indigo-400" />}
      {label}
    </span>
    <span
      className={`mt-1 ${monospace ? "font-mono" : ""} ${
        highlight
          ? "text-indigo-600 font-extrabold text-xl"
          : "text-slate-800 font-medium"
      }`}
    >
      {value}
    </span>
  </div>
);

// New: Action Pill Button (Giữ nguyên)
const ActionPill = ({ children, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`px-4 py-2 rounded-full flex items-center gap-2 text-sm font-semibold shadow-md transition duration-150 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 ${
      disabled
        ? "bg-indigo-300 cursor-not-allowed"
        : "bg-indigo-600 text-white hover:bg-indigo-700"
    }`}
  >
    {children}
  </button>
);

// New: Input field for better look (Giữ nguyên)
const ModernInput = ({
  className = "",
  readOnly = false,
  onChange,
  value,
  ...props
}) => {
  // Nếu input có value nhưng không có onChange và không readOnly → tự thêm readOnly để tránh cảnh báo
  const isReadOnly = readOnly || (value !== undefined && !onChange);

  return (
    <input
      {...props}
      value={value}
      onChange={onChange}
      readOnly={isReadOnly}
      className={`w-full border border-slate-200 rounded-xl bg-white text-slate-700 transition duration-150 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 p-3 ${
        isReadOnly ? "bg-slate-100 cursor-not-allowed" : ""
      } ${className}`}
    />
  );
};

// New: Select field for better look (Giữ nguyên)
const ModernSelect = (props) => (
  <select
    {...props}
    className="w-full p-3 border border-slate-200 rounded-xl bg-white text-slate-700 appearance-none pr-10 transition duration-150 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
    style={{
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>')`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "right 0.75rem center",
      backgroundSize: "1.5em 1.5em",
    }}
  />
);

// -----------------------------
// Main Component
// -----------------------------
export default function TransactionPage() {
  const [view, setView] = useState("list");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailData, setDetailData] = useState(null);

  // Create form states (Giữ nguyên)
  const [type, setType] = useState("IN");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [items, setItems] = useState([]);

  // Filters & UI
  const [filterType, setFilterType] = useState("");

  // SỬA: Tách state. q là state dùng để lọc (chỉ thay đổi khi gõ xong)
  const [q, setQ] = useState("");
  // SỬA: searchTerm là state dùng cho ô input, thay đổi liên tục
  const [searchTerm, setSearchTerm] = useState("");

  // Load transactions (Giữ nguyên)
  const loadTransactions = async () => {
    setLoading(true);
    try {
      const res = await listTransactions();
      const data = res?.data?.items ?? res?.data ?? [];
      // Sắp xếp ID giảm dần cho hiển thị mới nhất
      setTransactions(
        Array.isArray(data) ? data.slice().sort((a, b) => a.id - b.id) : []
      );
    } catch (err) {
      console.error(err);
      alert("Lỗi tải giao dịch. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  // THÊM: Logic Debounce để cập nhật state q
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setQ(searchTerm);
    }, 300); // 300ms delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]); // Chạy khi searchTerm thay đổi

  // Load detail (Giữ nguyên)
  const loadDetail = async (id) => {
    try {
      setDetailData(null); // Clear previous detail
      const res = await getTransactionDetail(id);
      console.log(res);
      setDetailData(res?.data ?? null);
      setView("detail");
    } catch (err) {
      console.error(err);
      alert("Không thể tải chi tiết giao dịch");
    }
  };

  // Search products (autocomplete) (Giữ nguyên)
  const searchProducts = async (qStr) => {
    setSearch(qStr);
    if (!qStr.trim()) return setSearchResult([]);
    try {
      const res = await listProducts();
      const all = res?.data?.items ?? res?.data ?? [];
      const filtered = (all || []).filter((p) =>
        safeLower(p.name).includes(qStr.toLowerCase())
      );
      setSearchResult(filtered.slice(0, 6));
    } catch (err) {
      console.error(err);
    }
  };

  // Add product to items (Giữ nguyên)
  const addProduct = (p) => {
    if (items.some((i) => i.id === p.id)) {
      alert("Sản phẩm đã tồn tại trong danh sách");
      setSearch("");
      setSearchResult([]);
      return;
    }
    const unit_price = Number(p.price ?? p.unit_price ?? 0) || 0;
    // Thêm trường `product_name` và `sku` cho hiển thị chi tiết tốt hơn
    setItems((prev) => [
      ...prev,
      {
        ...p,
        quantity: 1,
        unit_price,
        product_name: p.name,
        sku: p.sku || p.id,
      },
    ]);
    setSearch("");
    setSearchResult([]);
  };

  // Remove item (Giữ nguyên)
  const removeItem = (idx) => setItems((s) => s.filter((_, i) => i !== idx));

  // Update item field (Giữ nguyên)
  // const updateItem = (idx, changes) =>
  //   setItems(items.map((it, i) => (i === idx ? { ...it, ...changes } : it)));

  // Submit transaction (uses only first item if API requires single product) (Giữ nguyên)
  const submitTransaction = async () => {
    if (items.length === 0) {
      alert("Vui lòng thêm ít nhất 1 sản phẩm");
      return;
    }

    // Dựa trên comment của bạn: API hiện tại chỉ nhận 1 sản phẩm
    const item = items[0];
    const payload = {
      transaction_type: type,
      product_id: item.id,
      quantity: Number(item.quantity) || 1,
      unit_price: Math.max(0, Number(item.unit_price) || 0),
      reference_number: `WEB-TXN-${Date.now()}`,
      notes: `Giao dịch ${type} - ${item.product_name || item.name} (SL: ${
        item.quantity
      })`,
      performed_by: localStorage.getItem("username") || "Admin",
    };

    try {
      setLoading(true);
      await createTransaction(payload);
      alert("Tạo giao dịch thành công");
      // Reset form
      setItems([]);
      setSearch("");
      setType("IN");
      setView("list");
      loadTransactions();
    } catch (err) {
      console.error(err);
      alert("Tạo giao dịch thất bại. Kiểm tra console để biết chi tiết.");
    } finally {
      setLoading(false);
    }
  };

  // Derived filtered transactions (Giữ nguyên)
  const filteredTransactions = useMemo(() => {
    // SỬA: Dùng state q để lọc
    const currentQ = q.toLowerCase();
    return transactions.filter((t) => {
      if (filterType && t.transaction_type !== filterType) return false;
      const searchTerms =
        `${t.reference_number} ${t.performed_by} ${t.product_name} ${t.id}`.toLowerCase();
      if (currentQ && !searchTerms.includes(currentQ)) return false;
      return true;
    });
  }, [transactions, filterType, q]); // Dùng q làm dependency
  // Total calc for create form (Giữ nguyên)
  const totalAmount = useMemo(() => {
    return items.reduce(
      (s, it) => s + Number(it.quantity || 0) * Number(it.unit_price || 0),
      0
    );
  }, [items]);

  // -----------------------------
  // Renderers
  // -----------------------------
  const RenderHeader = () => (
    <div className="flex flex-col gap-6 py-6">
      {/* ===== PHẦN TIÊU ĐỀ ===== */}
      <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex flex-col gap-2 shadow-sm">
        <div className="flex items-center gap-3">
          {/* Icon trước tiêu đề */}
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
          disabled={loading} // Vô hiệu hóa khi đang tải
        >
          <Plus className="w-4 h-4" /> Tạo Giao dịch
        </ActionPill>
      </div>
    </div>
  );

  const RenderList = () => (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100">
      {/* HEADER 1 DÒNG: Tiêu đề + Filter + Refresh/Loading */}
      <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between gap-4 flex-wrap lg:flex-nowrap">
        {/* Tiêu đề + icon */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <ListChecks className="w-6 h-6 text-indigo-600" />
          <h3 className="text-xl font-bold text-slate-800 whitespace-nowrap">
            Danh sách Giao dịch
          </h3>
        </div>

        {/* Filter + nút refresh */}
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

      {/* BẢNG GIAO DỊCH */}
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
                      <Filter className="w-6 h-6 text-slate-400" /> Không tìm
                      thấy giao dịch nào phù hợp.
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
                      ID: {t.product_id}
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
                    {formatCurrency(
                      t.total_amount ?? t.unit_price * t.quantity
                    )}
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

  // RenderCreate (Giữ nguyên)
  const RenderCreate = () => (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-5xl mx-auto border border-slate-100">
      <div className="flex flex-col lg:flex-row items-start justify-between gap-8">
        {/* Left section */}
        <div className="flex-1 w-full">
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
                value={localStorage.getItem("username") || "Admin"}
              />
            </div>

            {/* Tìm & Thêm sản phẩm */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">
                Tìm & Thêm sản phẩm (Chỉ hỗ trợ 1 SP/GD)
              </label>
              <div className="relative w-full max-w-sm">
                {/* Icon Search */}
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-5 h-5 text-slate-400" />
                </div>

                {/* Input tìm kiếm */}
                <ModernInput
                  value={search}
                  onChange={(e) => searchProducts(e.target.value)}
                  placeholder="Nhập tên hoặc mã sản phẩm..."
                  className="pl-12 pr-3 h-10 text-sm"
                />

                {/* Dropdown kết quả */}
                {searchResult.length > 0 && (
                  <div className="absolute left-0 right-0 mt-2 bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-64 overflow-y-auto">
                    {searchResult.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => addProduct(p)}
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

        {/* Right section (Phiên bản mới) */}
        <div className="w-full lg:w-96 bg-white p-6 rounded-2xl flex-shrink-0 border border-slate-200 shadow-xl flex flex-col gap-6 sticky top-6">
          {/* ===== Thông tin tổng quan Giao dịch ===== */}
          <div className="border border-indigo-200 rounded-xl p-4 bg-indigo-50">
            <div className="text-base font-bold text-indigo-700 flex items-center gap-2 mb-3">
              {/* Thay đổi icon nếu cần, ví dụ: ShoppingBag */}
              <svg
                className="w-5 h-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M12 1.5a.75.75 0 0 1 .75.75V3h-.75a6.75 6.75 0 0 0-6.75 6.75v.547c.754-.367 1.543-.597 2.375-.684V9c0-1.879 1.168-3.51 2.812-4.148A4.125 4.125 0 0 1 12 5.25V6a.75.75 0 0 1-1.5 0V5.25A2.625 2.625 0 0 0 8.875 6.505c.801-.082 1.583-.102 2.375.057a6.764 6.764 0 0 0 2.923-1.025V9h-3.375a.75.75 0 0 0 0 1.5h3.375v.547a4.412 4.412 0 0 1-2.375.684v.546A6.75 6.75 0 0 0 5.25 15v.75c0 1.34.82 2.5 2.053 3.018a9.71 9.71 0 0 0 7.394 0c1.233-.518 2.053-1.678 2.053-3.018V15.75A6.75 6.75 0 0 0 12 9.047V8.5a.75.75 0 0 1 1.5 0v.547A5.25 5.25 0 0 1 18.75 15v.75c0 1.954-1.127 3.65-2.82 4.39A11.233 11.233 0 0 1 12 21.75a11.233 11.233 0 0 1-3.93-7.51c-1.693-.74-2.82-2.436-2.82-4.39V9.75c0-1.332-.78-2.5-2.053-3.018A8.212 8.212 0 0 0 12 2.25V1.5h-.75Z"
                  clipRule="evenodd"
                />
              </svg>
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
              <div className="text-sm font-light opacity-80">
                Tổng Giá trị Ước tính
              </div>
              <div className="text-2xl font-extrabold mt-1">
                {formatCurrency(totalAmount)}
              </div>
            </div>
          </div>

          {/* ===== Danh sách sản phẩm (Bill) - Hiển thị chi tiết hơn ===== */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-inner flex flex-col gap-3 max-h-[25rem] overflow-y-auto">
            <div className="grid grid-cols-5 text-xs font-semibold text-slate-500 border-b pb-2 sticky top-0 bg-white z-10">
              <div className="col-span-2">Sản phẩm</div>
              <div className="text-right">SL x Giá</div>
              <div className="text-right">Tổng</div>
              <div className="w-6"></div>
            </div>

            {items.length === 0 ? (
              <div className="text-center text-slate-500 text-sm py-4">
                Không có sản phẩm nào trong giao dịch.
              </div>
            ) : (
              items.map((it, idx) => (
                <div
                  key={it.id + "-" + idx}
                  className="grid grid-cols-5 items-center gap-2 py-2 border-b last:border-b-0 group"
                >
                  {/* Cột Tên & SKU */}
                  <div className="col-span-2 pr-1">
                    <div className="font-medium text-slate-900 line-clamp-2 leading-tight text-sm">
                      {it.product_name || it.name}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      SKU: {it.sku ?? it.id}
                    </div>
                  </div>

                  {/* Cột SL x Giá */}
                  <div className="text-right text-xs text-slate-600 pr-1">
                    {it.quantity} x {formatCurrency(it.unit_price)}
                  </div>

                  {/* Cột Tổng tiền */}
                  <div className="font-bold text-indigo-700 text-sm text-right pr-1">
                    {formatCurrency(it.quantity * it.unit_price)}
                  </div>

                  {/* Cột Xóa */}
                  <div className="flex justify-end w-full">
                    <button
                      onClick={() => removeItem(idx)}
                      className="p-1 rounded-full text-rose-500 transition duration-150 flex-shrink-0 opacity-80 hover:opacity-100 hover:bg-rose-100"
                      aria-label="Xóa sản phẩm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ===== Nút xác nhận & xóa ===== */}
          <div className="flex flex-col gap-3 pt-2">
            <button
              onClick={submitTransaction}
              disabled={items.length === 0 || loading}
              className={`w-full py-3 rounded-xl text-white font-bold transition duration-150 flex items-center justify-center gap-2 shadow-lg ${
                items.length > 0 && !loading
                  ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-300/60"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed shadow-none"
              }`}
            >
              {loading ? (
                <svg
                  className="w-5 h-5 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2V8h-2V6zm0 14h2V18h-2v2zm-4-4h2V14h-2v2zm8 0h-2V14h2v2z" />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M19.916 4.626a.75.75 0 0 1 .208 1.04l-9.5 13.5a.75.75 0 0 1-1.127.078l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 8.847-12.557a.75.75 0 0 1 1.04-.208Z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {loading
                ? "Đang xử lý..."
                : items.length > 0
                ? `Xác nhận & Tạo (${items.length} SP)`
                : "Thêm sản phẩm để tạo"}
            </button>

            <button
              onClick={() => {
                setItems([]);
                setSearch("");
              }}
              disabled={loading || items.length === 0}
              className="w-full py-3 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-100 transition duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg
                className="inline w-4 h-4 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.5 4.478a.75.75 0 0 1 .721.026l1.353.966c.54.385.872.986.872 1.63V18.75a3 3 0 0 1-3 3H5.25a3 3 0 0 1-3-3V7.104c0-.644.332-1.245.872-1.63l1.353-.966a.75.75 0 0 1 .721-.026H16.5ZM12 6.75a.75.75 0 0 0-1.5 0V18a.75.75 0 0 0 1.5 0V6.75ZM9 12a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1-.75-.75v-3ZM15.75 12a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-.75.75h-.5a.75.75 0 0 1-.75-.75v-3Z"
                  clipRule="evenodd"
                />
              </svg>
              Hủy & Xóa Sản phẩm
            </button>
          </div>
        </div>

        {/* Hàm removeItem (Giữ nguyên)
  const removeItem = (idx) => setItems((s) => s.filter((_, i) => i !== idx));

  Hàm updateItem đã được loại bỏ theo yêu cầu.
*/}
      </div>

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center">
        <div className="text-xs text-slate-500">
          Mã tham chiếu sẽ được tự động tạo.
        </div>
        <button
          onClick={() => setView("list")}
          className="text-indigo-700 hover:text-indigo-900 flex items-center gap-2 font-medium transition duration-150"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại danh sách
        </button>
      </div>
    </div>
  );

  // RenderDetail (Giữ nguyên)
  const RenderDetail = () =>
    detailData && (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-5xl mx-auto border border-slate-100">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 flex items-center gap-3">
              <ListChecks className="w-7 h-7 text-indigo-600" /> Chi tiết Giao
              dịch
            </h2>
            <div className="text-sm text-slate-500 mt-2">
              ID:{" "}
              <span className="font-mono text-slate-700">#{detailData.id}</span>
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
          <div className="md:col-span-2 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DetailItem
                label="Mã Tham chiếu"
                value={detailData.reference_number || "-"}
                monospace
                icon={Tag}
              />
              <DetailItem
                label="Người thực hiện"
                value={detailData.performed_by || "-"}
                icon={User}
              />
              <DetailItem
                label="Ngày tạo"
                value={detailData.created_at}
                icon={Calendar}
              />
              <DetailItem
                label="Ghi chú"
                value={detailData.notes || "Không có"}
                icon={ListChecks}
              />
            </div>

            <div className="mt-4 p-5 border rounded-xl shadow-md bg-slate-50">
              <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-600" /> Sản phẩm
              </h3>
              <div className="p-4 border border-indigo-200 rounded-lg flex items-center justify-between bg-white shadow-sm">
                <div>
                  <div className="font-bold text-slate-800">
                    {detailData.product_name ||
                      `Sản phẩm ID: ${detailData.product_id}`}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Mã SP: {detailData.product_id}
                  </div>
                </div>
                <div className="text-sm font-medium text-slate-700 text-right">
                  <span className="font-bold text-indigo-600">
                    {detailData.quantity}
                  </span>{" "}
                  x {formatCurrency(detailData.unit_price)}
                  <div className="text-xs text-slate-500 mt-0.5">
                    Tổng:{" "}
                    {formatCurrency(
                      detailData.quantity * detailData.unit_price
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-indigo-600 rounded-2xl p-6 text-white flex flex-col justify-between shadow-lg">
            <div>
              <div className="text-sm opacity-80">Tổng giá trị giao dịch</div>
              <div className="mt-2 text-4xl font-extrabold">
                {formatCurrency(
                  detailData.total_amount ??
                    detailData.unit_price * detailData.quantity
                )}
              </div>
              <p className="mt-3 text-sm opacity-90">
                Đây là tổng giá trị được tính theo đơn giá tại thời điểm tạo
                giao dịch.
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

  // -----------------------------
  // Main render
  // -----------------------------
  return (
    <div className="min-h-screen bg-slate-50">
      <HeaderUser />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <RenderHeader />

        <div className="mt-8">
          {view === "list" && <RenderList />}
          {view === "create" && <RenderCreate />}
          {view === "detail" && <RenderDetail />}
        </div>
      </main>
    </div>
  );
}
