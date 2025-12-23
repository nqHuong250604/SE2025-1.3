const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
  ? "http://localhost:3000/api/v1"           // Dùng khi chạy trên Laptop của bạn
  : "https://test-backend-sxs8.onrender.com/api/v1"; // Dùng khi đã đưa lên Render

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

  const productInfo = Object.fromEntries(
    (productsRes.items || []).map((p) => [
      p.id, 
      { category: p.category || "Khác", price: p.price || 0 }
    ])
  );

  const monthly = {};
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  const now = new Date();
  const currentMonthIdx = now.getMonth();
  const currentYear = now.getFullYear();

  // ---  TẠO KHUNG 6 THÁNG (5 THÁNG TRƯỚC + THÁNG NÀY) ---
  for (let i = 5; i >= 0; i--) {
    const d = new Date(currentYear, currentMonthIdx - i, 1);
    const mName = monthNames[d.getMonth()];
    const sKey = d.getFullYear() * 100 + d.getMonth() + 1;

    // Chỉ giả lập số liệu cho các tháng cũ (i > 0)
    // Tháng hiện tại (i === 0) luôn khởi tạo là 0
    const isPastMonth = i > 0;

    monthly[mName] = {
      month: mName,
      revenue: isPastMonth ? Math.floor(Math.random() * (40 - 20 + 1) + 20) * 1000000 : 0,
      totalQty: isPastMonth ? Math.floor(Math.random() * (200 - 100 + 1) + 100) : 0,
      orders: isPastMonth ? Math.floor(Math.random() * (30 - 10 + 1) + 10) : 0,
      sortOrder: sKey,
      isReal: !isPastMonth // Đánh dấu tháng hiện tại là dữ liệu thật
    };
  }

  // --- ĐÈ DỮ LIỆU THẬT TỪ API VÀO ---
  (transactionsRes.items || []).forEach((txn) => {
    if (txn.transaction_type !== "OUT") return;

    const date = new Date(txn.created_at);
    const mName = monthNames[date.getMonth()];
    
    // Chỉ xử lý nếu tháng này nằm trong khung 6 tháng chúng ta đang hiển thị
    if (monthly[mName]) {
      const pDetail = productInfo[txn.product_id] || { price: 0 };
      const qty = txn.quantity || 0;
      const rev = qty * pDetail.price;

      // Nếu là tháng hiện tại, lần đầu có dữ liệu thật sẽ xóa sạch giả lập (nếu có)
      // Nhưng ở trên ta đã khởi tạo i=0 là 0 rồi, nên cứ thế cộng dồn vào thôi
      monthly[mName].revenue += rev;
      monthly[mName].totalQty += qty;
      monthly[mName].orders++;
      monthly[mName].isReal = true; 
    }
  });

  const COLORS = ["#8b82ff", "#8dd6a0", "#ffc86b", "#ff7c00", "#ef4444", "#3b82f6"];

  return {
    revenueData: Object.values(monthly).sort((a, b) => a.sortOrder - b.sortOrder),
    categoryData: Object.values(
      (transactionsRes.items || []).reduce((acc, txn) => {
        if (txn.transaction_type !== "OUT") return acc;
        const cat = productInfo[txn.product_id]?.category || "Khác";
        acc[cat] ??= { name: cat, value: 0 };
        acc[cat].value += txn.quantity || 0;
        return acc;
      }, {})
    ).map((c, i) => ({ ...c, color: COLORS[i % COLORS.length] })),
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


/* ======================= NOTIFICATIONS (SMART MIN-STOCK LOGIC) ======================= */

export const getSystemNotifications = async () => {
  try {
    const [productsRes, inventoryRes, transactionsRes] = await Promise.all([
      request("/products?limit=100"),
      request("/inventory/?limit=100"),
      request("/transactions?limit=20&sort=created_at&order=desc")
    ]);

    const deletedIds = JSON.parse(localStorage.getItem('deleted_notifications') || '[]');
    const products = productsRes.items || [];
    const inventory = inventoryRes || [];
    const transactions = transactionsRes.items || transactionsRes || [];
    
    const productInfoMap = Object.fromEntries(
      products.map(p => [p.id, { name: p.name, minStock: p.min_stock }])
    );

    let notifications = [];

    // --- PHẦN 1: THÔNG BÁO TỒN KHO THẤP ---
    inventory.forEach(item => {
      const pInfo = productInfoMap[item.product_id];
      const minThreshold = pInfo?.minStock ?? 10; 

      if (item.quantity <= minThreshold) {
        // QUAN TRỌNG: ID bao gồm cả số lượng để khi số lượng thay đổi, thông báo sẽ hiện lại
        const id = `low-stock-${item.product_id}-qty-${item.quantity}`;
        
        if (!deletedIds.includes(id)) {
           notifications.push({
             id,
             title: item.quantity <= 3 ? "Khẩn cấp: Hết hàng" : "Tồn kho thấp",
             message: `Sản phẩm "${pInfo?.name || item.product_id}" còn ${item.quantity} (Ngưỡng an toàn: ${minThreshold})`,
             type: "low_stock",
             priority: item.quantity <= 3 ? "high" : "medium",
             unread: true,
             created_at: new Date().toISOString()
           });
        }
      }
    });

    // --- PHẦN 2: THÔNG BÁO XUẤT NHẬP HÀNG ---
    transactions.forEach(txn => {
      const id = `txn-${txn.id}`;
      if (!deletedIds.includes(id)) {
        const isOut = txn.transaction_type === "OUT";
        const pName = productInfoMap[txn.product_id]?.name || txn.product_id;

        notifications.push({
          id,
          title: isOut ? "Đơn hàng xuất kho" : "Nhập kho hoàn tất",
          message: `${isOut ? "Đã xuất" : "Đã nhập"} ${txn.quantity} sản phẩm "${pName}"`,
          type: "transaction",
          priority: "low",
          unread: false,
          created_at: txn.created_at
        });
      }
    });

    return notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  } catch (error) { 
    console.error("Lỗi lấy thông báo:", error);
    return []; 
  }
};


/* ======================= USERS API ======================= */

// Lấy danh sách tất cả người dùng
export const getUsers = () => request("/users/?limit=100");

// Tạo người dùng mới (Dùng cho Admin tạo hộ)
export const createUser = (data) => request("/users/", { method: "POST", body: data });

// Cập nhật thông tin (Role, Name, etc.)
export const updateUser = (id, data) => request(`/users/${id}`, { method: "PUT", body: data });

// Xóa người dùng
export const deleteUser = (id) => request(`/users/${id}`, { method: "DELETE" });
