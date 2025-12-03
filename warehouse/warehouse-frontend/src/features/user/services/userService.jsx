import axios from "axios";

// Base URL backend
const API = axios.create({
  baseURL: "http://localhost:3000/api/v1",
});

// ------------------------
// Products
// ------------------------

// Lấy danh sách sản phẩm
export const getProducts = async () => {
  const res = await API.get("/products/");
  return res.data;
};

// Lấy thông tin 1 sản phẩm
export const getProductById = async (productId) => {
  const res = await API.get(`/products/${productId}`);
  return res.data;
};

// Lấy tồn kho 1 sản phẩm
export const getInventory = async (productId) => {
  const res = await API.get(`/products/${productId}/inventory`);
  return res.data;
};

// ------------------------
// Transactions
// ------------------------

// Tạo giao dịch mới (xuất, nhập, điều chỉnh)
export const createTransaction = async (payload) => {
  // payload = { type: 'export', product_id, quantity }
  const res = await API.post("/transactions/", payload);
  return res.data;
};
