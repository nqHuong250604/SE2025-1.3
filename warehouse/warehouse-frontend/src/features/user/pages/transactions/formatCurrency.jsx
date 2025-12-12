// utils/formatCurrency.js
const formatCurrency = (amount) => {
  const num = Number(amount ?? 0);
  if (Number.isNaN(num)) return "0 VNĐ";
  return num.toLocaleString("vi-VN") + " VNĐ";
};

export default formatCurrency;
