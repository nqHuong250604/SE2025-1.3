import React, { useEffect, useMemo, useState } from "react";
import HeaderUser from "../components/HeaderUser";

import {
  listTransactions,
  getTransactionDetail,
  listProducts,
  createTransaction,
  listRawInventory,
} from "../services/userService";

import TransactionHeader from "./transactions/TransactionHeader";
import TransactionList from "./transactions/TransactionList";
import TransactionCreate from "./transactions/TransactionCreate";
import TransactionDetail from "./transactions/TransactionDetail";
import formatCurrency from "./transactions/formatCurrency";
import { useAuth } from "../../../services/AuthContext";
const safeLower = (v) => String(v || "").toLowerCase();

export default function TransactionPage() {
  const { user } = useAuth();
  const performedBy = user?.full_name || "Admin";

  const [view, setView] = useState("list");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [detailData, setDetailData] = useState(null);

  // Form states
  const [type, setType] = useState("IN");
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [items, setItems] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [q, setQ] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const res = await listTransactions();
      const data = res?.data?.items ?? res?.data ?? [];
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

  useEffect(() => {
    const timeout = setTimeout(() => setQ(searchTerm), 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  const loadDetail = async (id) => {
    try {
      setDetailData(null);
      const res = await getTransactionDetail(id);
      let detail = res?.data ?? null;
      if (!detail) return;

      const productsRes = await listProducts();
      const allProducts = productsRes?.data?.items ?? productsRes?.data ?? [];

      // Nếu chỉ 1 sản phẩm
      if (detail.product_id) {
        const prod = allProducts.find((p) => p.id === detail.product_id);
        detail.product_name =
          prod?.name || prod?.product_name || `SP #${detail.product_id}`;
      }

      // Nếu nhiều sản phẩm
      if (detail.products?.length > 0) {
        detail.products = detail.products.map((p) => {
          const prodInfo = allProducts.find((ap) => ap.id === p.product_id);
          return {
            ...p,
            product_name:
              prodInfo?.name || prodInfo?.product_name || `SP #${p.product_id}`,
          };
        });
      }

      setDetailData(detail);
      setView("detail");
    } catch (err) {
      console.error(err);
      alert("Không thể tải chi tiết giao dịch");
    }
  };

  const searchProducts = async (qStr) => {
    setSearch(qStr);
    if (!qStr.trim()) return setSearchResult([]);
    try {
      // 1. Gọi song song cả danh sách sản phẩm và danh sách kho
      const [resProducts, resInventory] = await Promise.all([
        listProducts(),
        listRawInventory(),
      ]);

      const allProds = resProducts?.data?.items ?? resProducts?.data ?? [];
      const allInv = resInventory?.data?.items ?? resInventory?.data ?? [];
      // 2. Lọc sản phẩm theo tên và map stock_quantity từ inventory
      const filtered = allProds
        .filter((p) => safeLower(p.name).includes(qStr.toLowerCase()))
        .map((p) => {
          // Tìm thông tin kho khớp với product_id
          const invData = allInv.find((inv) => inv.product_id === p.id);
          return {
            ...p,
            stock_quantity: invData ? invData.available_quantity : 0,
          };
        });

      setSearchResult(filtered.slice(0, 6));
    } catch (err) {
      console.error("Lỗi khi lấy dữ liệu sản phẩm và kho:", err);
    }
  };

  const addProduct = (p) => {
    // Kiểm tra nếu là xuất kho mà tồn kho bằng 0
    if (type === "OUT" && (p.stock_quantity <= 0 || !p.stock_quantity)) {
      alert(
        `Sản phẩm "${p.name}" đã hết hàng, không thể tạo giao dịch xuất kho!`
      );
      return;
    }

    if (items.some((i) => i.id === p.id)) {
      alert("Sản phẩm đã tồn tại trong danh sách");
      setSearch("");
      setSearchResult([]);
      return;
    }

    const unit_price = Number(p.price ?? p.unit_price ?? 0) || 0;
    setItems((prev) => [
      ...prev,
      {
        ...p,
        quantity: 1,
        unit_price,
        product_name: p.name,
        sku: p.sku || p.id,
        max_available: p.stock_quantity, // Lưu lại số lượng tối đa có thể xuất
      },
    ]);
    setSearch("");
    setSearchResult([]);
  };

  const removeItem = (idx) => setItems((s) => s.filter((_, i) => i !== idx));

  const submitTransaction = async () => {
    if (items.length === 0) {
      alert("Vui lòng thêm ít nhất 1 sản phẩm");
      return;
    }

    const item = items[0];

    // KIỂM TRA CHẶN XUẤT KHO KHI HẾT HÀNG/KHÔNG ĐỦ HÀNG
    if (type === "OUT") {
      const available = Number(item.stock_quantity || 0);
      const requestQty = Number(item.quantity || 0);

      if (available <= 0) {
        alert(
          `Sản phẩm "${item.product_name}" đã hết hàng trong kho. Không thể xuất!`
        );
        return;
      }

      if (requestQty > available) {
        alert(
          `Số lượng tồn kho không đủ (Hiện có: ${available}). Vui lòng điều chỉnh lại số lượng xuất!`
        );
        return;
      }
    }

    const payload = {
      transaction_type: type,
      product_id: item.id,
      quantity: Number(item.quantity) || 1,
      unit_price: Math.max(0, Number(item.unit_price) || 0),
      reference_number: `WEB-TXN-${Date.now()}`,
      notes: `${item.product_name || item.name} (Qty: ${item.quantity})`,
      performed_by: performedBy,
    };

    try {
      setLoading(true);
      await createTransaction(payload);
      alert("Tạo giao dịch thành công");
      setItems([]);
      setSearch("");
      setType("IN");
      setView("list");
      loadTransactions();
    } catch (err) {
      console.error(err);
      const serverMessage =
        err.response?.data?.message || err.response?.data?.detail;
      if (serverMessage) {
        alert(`Lỗi từ hệ thống: ${serverMessage}`);
      } else {
        alert(
          "Tạo giao dịch thất bại. Vui lòng kiểm tra lại kết nối hoặc dữ liệu."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = useMemo(() => {
    const currentQ = q.toLowerCase();
    return transactions.filter((t) => {
      if (filterType && t.transaction_type !== filterType) return false;
      const searchTerms =
        `${t.reference_number} ${t.performed_by} ${t.product_name} ${t.id}`.toLowerCase();
      if (currentQ && !searchTerms.includes(currentQ)) return false;
      return true;
    });
  }, [transactions, filterType, q]);

  const totalAmount = useMemo(
    () =>
      items.reduce(
        (s, it) => s + Number(it.quantity || 0) * Number(it.unit_price || 0),
        0
      ),
    [items]
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <HeaderUser />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        <TransactionHeader
          loading={loading}
          setView={setView}
          setDetailData={setDetailData}
        />

        <div className="mt-8">
          {view === "list" && (
            <TransactionList
              filterType={filterType}
              setFilterType={setFilterType}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              setQ={setQ}
              loading={loading}
              filteredTransactions={filteredTransactions}
              loadTransactions={loadTransactions}
              loadDetail={loadDetail}
              formatCurrency={formatCurrency}
            />
          )}
          {view === "create" && (
            <TransactionCreate
              type={type}
              setType={setType}
              search={search}
              searchProducts={searchProducts}
              searchResult={searchResult}
              addProduct={addProduct}
              items={items}
              removeItem={removeItem}
              totalAmount={totalAmount}
              submitTransaction={submitTransaction}
              loading={loading}
              setItems={setItems}
              setSearch={setSearch}
              setView={setView}
            />
          )}
          {view === "detail" && (
            <TransactionDetail
              detailData={detailData}
              setView={setView}
              formatCurrency={formatCurrency}
            />
          )}
        </div>
      </main>
    </div>
  );
}
