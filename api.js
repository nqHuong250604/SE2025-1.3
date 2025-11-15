import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 5000
});

// ---- Logging (Real-time API doc updates) ----
api.interceptors.request.use(config => {
  console.log("[API Request]", config.method, config.url, config.data);
  return config;
});

api.interceptors.response.use(
  res => {
    console.log("[API Response]", res.config.url, res.data);
    return res;
  },
  err => {
    const detail = err?.response?.data?.detail;

    if (Array.isArray(detail)) {
      err.message = detail[0]?.msg || "Invalid input";
    } else if (typeof detail === "string") {
      err.message = detail;
    } else {
      err.message = "Something went wrong";
    }

    return Promise.reject(err);
  }
);

// ---- Product APIs ----
export const productAPI = {
  getAll: () => api.get('/products/'),
  getById: (id) => api.get(`/products/${id}`),
  create: (data) => api.post('/products/', data),
  update: (id, data) => api.put(`/products/${id}`, data),
  delete: (id) => api.delete(`/products/${id}`)
};

// ---- Transaction APIs ----
export const transactionAPI = {
  getAll: () => api.get('/transactions/'),
  import: (data) => api.post('/transactions/import', data),
  export: (data) => api.post('/transactions/export', data)
};

export default api;
