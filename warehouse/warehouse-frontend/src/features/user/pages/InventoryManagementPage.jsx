import React, { useState, useEffect } from "react";
import HeaderUser from "../components/HeaderUser";
import { RefreshCcw, Plus, ArrowLeft, Package, Search } from "lucide-react";
import {
  fetchInventoryWithDetails,
  createProduct,
} from "../services/userService";

function InventoryManagementPage() {
  const [inventory, setInventory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [message, setMessage] = useState(null);

  // ======================================
  // 🔍 Search sản phẩm theo ID
  // ======================================
  const [searchId, setSearchId] = useState("");

  // ======================================
  // 🔥 Phân trang
  // ======================================
  const ITEMS_PER_PAGE = 8;
  const [currentPage, setCurrentPage] = useState(1);

  // Khi searchId thay đổi, reset về trang 1
  useEffect(() => {
    setCurrentPage(1);
  }, [searchId]);

  const filteredInventory = searchId
    ? inventory.filter((item) => {
        // an toàn: convert sang string trước khi gọi toLowerCase()
        const pid = item?.product_id ?? item?.id ?? "";
        return String(pid)
          .toLowerCase()
          .includes(searchId.trim().toLowerCase());
      })
    : inventory;

  const totalPages = Math.ceil(filteredInventory.length / ITEMS_PER_PAGE);

  const paginatedInventory = filteredInventory.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // ======================================
  // FORM SẢN PHẨM
  // ======================================
  const [newProduct, setNewProduct] = useState({
    id: "",
    name: "",
    description: "",
    category: "",
    unit: "",
    price: "",
    cost: "",
    supplier: "",
    min_stock: "",
    import_date: "",
    status: "Còn hàng",
    quantity: 1,
    location: "",
  });

  const emptyForm = {
    id: "",
    name: "",
    description: "",
    category: "",
    unit: "",
    price: "",
    cost: "",
    supplier: "",
    min_stock: "",
    import_date: "",
    status: "Còn hàng",
    quantity: 1,
    location: "",
  };

  const loadInventory = async () => {
    setIsLoading(true);
    setMessage(null);
    try {
      const detailedData = await fetchInventoryWithDetails();
      setInventory(detailedData);
    } catch {
      setMessage({ text: "Lỗi tải dữ liệu", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const numericFields = ["price", "cost", "min_stock", "quantity"];

    setNewProduct((prev) => ({
      ...prev,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    if (!newProduct.id || !newProduct.name || newProduct.quantity < 1) {
      setMessage({ text: "Vui lòng điền đầy đủ thông tin.", type: "error" });
      return;
    }

    try {
      await createProduct(newProduct);

      setMessage({
        text: `Đã tạo sản phẩm "${newProduct.name}"`,
        type: "success",
      });

      setShowForm(false);
      setNewProduct(emptyForm);
      loadInventory();
    } catch {
      setMessage({ text: "Lỗi khi thêm sản phẩm", type: "error" });
    }
  };

  // ----------------------------------------------------
  // BẮT ĐẦU PHẦN THIẾT KẾ HIỆN ĐẠI (PHẦN RETURN)
  // ----------------------------------------------------
  return (
    <div className="min-h-screen bg-gray-50">
      {" "}
      {/* Màu nền nhạt, hiện đại hơn */}
      <HeaderUser />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 mt-16">
        <div className="flex flex-col gap-6 py-6">
          {/* ===== PHẦN TIÊU ĐỀ ===== */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex flex-col gap-2 shadow-sm">
            <div className="flex items-center gap-3">
              {/* Icon trước tiêu đề */}
              <Package className="w-8 h-8 text-indigo-600" />
              <h1 className="text-3xl font-extrabold text-gray-900">
                Quản Lý Tồn Kho
              </h1>
            </div>
            <p className="text-base text-gray-600">
              Danh sách sản phẩm tồn kho
            </p>
          </div>

          {/* ===== GẠCH NGANG ===== */}
          <hr className="border-slate-200" />

          {/* ===== MESSAGE ALERT ===== */}
          {message && (
            <div
              className={`flex items-center p-4 rounded-lg mb-2 text-sm font-medium shadow-md ${
                message.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}
              role="alert"
            >
              {message.text}
            </div>
          )}

          {/* ===== PHẦN ACTION BUTTONS ===== */}
          <div className="flex flex-wrap gap-3 items-center">
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="flex items-center px-3 py-2 bg-indigo-600 text-white text-sm font-medium rounded-xl shadow hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.01]"
              >
                <Plus className="w-4 h-4 mr-1" />
                Thêm sản phẩm mới
              </button>
            ) : (
              <button
                onClick={() => setShowForm(false)}
                className="flex items-center px-3 py-2 bg-gray-500 text-white text-sm font-medium rounded-xl shadow hover:bg-gray-600 transition duration-300 transform hover:scale-[1.01]"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Quay lại danh sách
              </button>
            )}
          </div>
        </div>

        {/* BẢNG TỒN KHO */}
        {!showForm && (
          <div className="bg-white rounded-xl shadow-2xl p-6 lg:p-8 border border-gray-100 mt-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-7">
              <h2 className="text-xl font-bold text-gray-900 flex items-center">
                <Package className="h-6 w-6 mr-2 text-indigo-600" />
                Dữ Liệu Tồn Kho
              </h2>

              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                {/* 🔍 SEARCH */}
                <div className="relative w-full sm:w-80">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search className="text-gray-400 h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Tìm sản phẩm theo ID..."
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm"
                  />
                </div>

                <button
                  onClick={() => loadInventory()}
                  className="flex items-center justify-center px-4 py-2 bg-white text-indigo-600 border border-indigo-600 rounded-xl hover:bg-indigo-50 transition duration-150"
                >
                  <RefreshCcw className="h-5 w-5 mr-1" />
                  Tải lại
                </button>
              </div>
            </div>

            {isLoading ? (
              <p className="text-center text-indigo-500 py-12 text-lg">
                Đang tải dữ liệu...
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Mã SP
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên SP
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tồn kho
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sẵn có
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Danh mục
                      </th>
                    </tr>
                  </thead>

                  <tbody className="bg-white divide-y divide-gray-100">
                    {paginatedInventory.length > 0 ? (
                      paginatedInventory.map((item) => (
                        <tr
                          key={item.product_id}
                          className="hover:bg-indigo-50 transition duration-100"
                        >
                          <td className="px-4 py-4 text-sm font-medium text-gray-900">
                            {item.product_id}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {item.product_name}
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-800 font-semibold">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <span
                              className={`inline-flex px-3 py-1 text-xs font-bold leading-5 rounded-full ${
                                item.available_quantity > 0
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {item.available_quantity}
                            </span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {item.product_info?.category}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center py-8 text-gray-500 text-base italic"
                        >
                          Không có dữ liệu tồn kho.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* =================================== */}
            {/* 🔥 PHÂN TRANG */}
            {/* =================================== */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-6 space-x-2 items-center">
                {/* Prev */}
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 border rounded-xl text-sm font-medium transition duration-150 ${
                    currentPage === 1
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-indigo-600 hover:bg-indigo-50 border-indigo-300"
                  }`}
                >
                  Trước
                </button>

                {/* Pages */}
                {(() => {
                  const pages = [];

                  // Logic giữ nguyên như code gốc của bạn
                  if (totalPages <= 7) {
                    for (let i = 1; i <= totalPages; i++) pages.push(i);
                  } else {
                    if (currentPage <= 3) {
                      pages.push(1, 2, 3, "...", totalPages);
                    } else if (currentPage >= totalPages - 2) {
                      pages.push(
                        1,
                        "...",
                        totalPages - 2,
                        totalPages - 1,
                        totalPages
                      );
                    } else {
                      pages.push(
                        1,
                        "...",
                        currentPage - 1,
                        currentPage,
                        currentPage + 1,
                        "...",
                        totalPages
                      );
                    }
                  }

                  return pages.map((page, index) =>
                    page === "..." ? (
                      <span
                        key={index}
                        className="px-3 py-1 text-gray-500 select-none"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={index}
                        onClick={() => setCurrentPage(page)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium border transition duration-150 ${
                          currentPage === page
                            ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                            : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                        }`}
                      >
                        {page}
                      </button>
                    )
                  );
                })()}

                {/* Next */}
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 border rounded-xl text-sm font-medium transition duration-150 ${
                    currentPage === totalPages
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-white text-indigo-600 hover:bg-indigo-50 border-indigo-300"
                  }`}
                >
                  Sau
                </button>
              </div>
            )}
          </div>
        )}

        {/* ============================ */}
        {/* FORM THÊM SẢN PHẨM */}
        {/* ============================ */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-2xl p-6 lg:p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-3">
              Thêm Sản Phẩm Mới
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* INPUT */}
                {Object.entries({
                  id: "Mã sản phẩm (SKU) *",
                  name: "Tên sản phẩm *",
                  quantity: "Số lượng nhập *",
                  price: "Giá bán",
                  cost: "Giá nhập",
                  category: "Danh mục",
                  unit: "Đơn vị",
                  supplier: "Nhà cung cấp",
                  min_stock: "Tồn kho tối thiểu",
                  location: "Vị trí kho *",
                  import_date: "Ngày nhập kho",
                }).map(([key, label]) => (
                  <div key={key}>
                    <label
                      htmlFor={key}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {label}
                    </label>

                    <input
                      id={key}
                      type={
                        key === "price" ||
                        key === "cost" ||
                        key === "min_stock" ||
                        key === "quantity"
                          ? "number"
                          : key === "import_date"
                          ? "datetime-local"
                          : "text"
                      }
                      name={key}
                      value={newProduct[key]}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                      required={
                        key === "id" ||
                        key === "name" ||
                        key === "quantity" ||
                        key === "location"
                      }
                      min={key === "quantity" ? 1 : undefined}
                    />
                  </div>
                ))}

                {/* Textarea for Description - Takes up one full row in 3-column layout */}
                <div className="lg:col-span-3">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Mô tả
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={newProduct.description}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                  />
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 font-bold text-lg transition duration-300 transform hover:scale-[1.005]"
                >
                  Tạo sản phẩm & nhập kho
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

export default InventoryManagementPage;
