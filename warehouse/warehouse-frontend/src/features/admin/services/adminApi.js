import axios from "axios";

const API_BASE = "http://localhost:5000/api"; // thay bằng URL backend của bạn

export const getRecentOrders = async () => {
  const res = await axios.get(`${API_BASE}/orders/recent`);
  return res.data;
};

export const getLoadingTrucks = async () => {
  const res = await axios.get(`${API_BASE}/trucks/loading`);
  return res.data;
};

export const getLatestShipping = async () => {
  const res = await axios.get(`${API_BASE}/shipping/latest`);
  return res.data;
};

export const getOrderRequests = async () => {
  const res = await axios.get(`${API_BASE}/orders/requests`);
  return res.data;
};
