import axios from "axios";

const REST_API_LOGISTICS_BASE_URL = window.location.hostname === "localhost" 
    ? "http://localhost:8000" // Link khi chạy dưới máy (sửa lại port cho đúng với FastAPI của bạn)
    : "https://test-backend-sxs8.onrender.com"; // Link khi đã lên Render

const createAxiosInstance = () => {
    const username = localStorage.getItem("username");
    const password = localStorage.getItem("password");

    return axios.create({
        baseURL: REST_API_LOGISTICS_BASE_URL,
        auth: { username, password },
    });
};

// =========================
// INVENTORY ENDPOINTS
// =========================
export const listRawInventory = () =>
    createAxiosInstance().get("/inventory");

export const getInventoryDetail = (inventoryId) =>
    createAxiosInstance().get(`/inventory/${inventoryId}`);

export const updateInventory = (inventoryId, updateData) =>
    createAxiosInstance().put(`/inventory/${inventoryId}`, updateData);

export const reserveProduct = (productId, reserveAmount) =>
    createAxiosInstance().post(`/inventory/reserve/${productId}`, reserveAmount);

// =========================
// PRODUCTS ENDPOINTS
// =========================
export const listProducts = () =>
    createAxiosInstance().get("/products");

export const getProductDetail = (productId) =>
    createAxiosInstance().get(`/products/${productId}`);

export const createProduct = (product) =>
    createAxiosInstance().post("/products", product);

export const updateProduct = (productId, product) =>
    createAxiosInstance().put(`/products/${productId}`, product);

export const deleteProduct = (productId) =>
    createAxiosInstance().delete(`/products/${productId}`);

// =========================
// TRANSACTIONS ENDPOINTS
// =========================
export const listTransactions = (limit = 20) =>
    createAxiosInstance().get(`/transactions?limit=${limit}`);

export const getTransactionDetail = (transactionId) =>
    createAxiosInstance().get(`/transactions/${transactionId}`);

export const createTransaction = (payload) =>
    createAxiosInstance().post(`/transactions`, payload);

// =========================
// COMPLEX LOGIC
// =========================

/**
 * load inventory + product detail
 */
export const fetchInventoryWithDetails = async () => {
    const invRes = await listRawInventory();
    const inventory = invRes.data.items || invRes.data;

    const detailed = await Promise.all(
        inventory.map(async (item) => {
            const product = await getProductDetail(item.product_id);
            return {
                ...item,
                product_name: product.data?.name || "Unknown",
                product_info: product.data || null,
            };
        })
    );

    return detailed;
};
