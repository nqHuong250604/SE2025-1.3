// src/services/adminServices.js

const API_BASE_URL = "http://localhost:3000/api/v1";

/**
 * Helper fetch dùng chung
 */
const request = async (
  endpoint,
  { method = "GET", body, headers = {} } = {}
) => {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      Accept: "application/json",
      ...(body && { "Content-Type": "application/json" }),
      ...headers,
    },
    ...(body && { body: JSON.stringify(body) }),
  });

  if (!res.ok) {
    let message = `HTTP Error ${res.status}`;
    try {
      const err = await res.json();
      message = err.message || message;
    } catch {
      throw new Error(message);
    }
  }

  if (res.status === 204) return { success: true };

  const contentType = res.headers.get("content-type");
  if (!contentType || !contentType.includes("application/json")) {
    return { success: true };
  }

  return res.json();
};

/* ======================= DASHBOARD ======================= */

export const getDashboardKPIs = async () =>
  request("/stats/dashboard").catch(() => ({
    totalShipments: 0,
    activeDeliveries: 0,
    totalCustomers: 0,
    revenue: 0,
  }));

export const getRecentTransactions = async (params = { skip: 0, limit: 5 }) => {
  const query = new URLSearchParams(params).toString();
  const data = await request(`/transactions?${query}`).catch(() => ({
    items: [],
  }));
  return data.items || [];
};

export const getAllTransactions = async (params = { skip: 0, limit: 1000 }) => {
  const query = new URLSearchParams(params).toString();
  const data = await request(`/transactions?${query}`).catch(() => ({
    items: [],
  }));
  return data.items || [];
};

/* ======================= CHART DATA ======================= */

export const getProcessedChartData = async () => {
  const [productsRes, transactionsRes] = await Promise.all([
    request("/products?limit=1000"),
    request("/transactions?limit=1000&sort=created_at&order=asc"),
  ]);

  const productCategory = Object.fromEntries(
    (productsRes.items || []).map((p) => [p.id, p.category || "Khác"])
  );

  const monthly = {};
  const category = {};

  (transactionsRes.items || []).forEach((txn) => {
    if (txn.transaction_type !== "OUT") return;

    const date = new Date(txn.created_at);
    const month = date.toLocaleString("en-US", { month: "short" });
    const sortKey = date.getFullYear() * 100 + date.getMonth() + 1;

    monthly[month] ??= {
      month,
      revenue: 0,
      orders: 0,
      deliveries: 0,
      sortOrder: sortKey,
    };

    monthly[month].revenue += txn.total_amount || 0;
    monthly[month].orders++;
    monthly[month].deliveries++;

    const cat = productCategory[txn.product_id] || "Không xác định";
    category[cat] ??= { name: cat, value: 0 };
    category[cat].value++;
  });

  const COLORS = [
    "#8b82ff",
    "#8dd6a0",
    "#ffc86b",
    "#ff7c00",
    "#ef4444",
    "#3b82f6",
  ];

  return {
    revenueData: Object.values(monthly).sort(
      (a, b) => a.sortOrder - b.sortOrder
    ),
    ordersData: Object.values(monthly),
    categoryData: Object.values(category).map((c, i) => ({
      ...c,
      color: COLORS[i % COLORS.length],
    })),
  };
};

/* ======================= TRANSACTIONS ======================= */

export const createTransaction = (data) =>
  request("/transactions/", { method: "POST", body: data });

export const deleteTransaction = (id) =>
  request(`/transactions/${id}`, { method: "DELETE" });

/* ======================= INVENTORY ======================= */

export const getInventoryList = async (params = { skip: 0, limit: 100 }) => {
  const query = new URLSearchParams(params).toString();
  return request(`/inventory/?${query}`).catch(() => []);
};

export const reserveStock = (productId, quantity) =>
  request(`/inventory/reserve/${productId}?quantity=${quantity}`, {
    method: "POST",
  });

export const releaseStock = (productId, quantity) =>
  request(`/inventory/release/${productId}?quantity=${quantity}`, {
    method: "POST",
  });

export const updateInventory = (inventoryId, data) =>
  request(`/inventory/${inventoryId}`, {
    method: "PUT",
    body: data,
  });

/* ======================= PRODUCTS ======================= */

export const getProductList = async (params = { skip: 0, limit: 100 }) => {
  const query = new URLSearchParams(params).toString();
  return request(`/products/?${query}`).catch(() => ({
    items: [],
    total: 0,
  }));
};
