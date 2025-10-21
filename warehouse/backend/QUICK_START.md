# 🚀 Quick Start Guide - Warehouse Management API

## Bắt đầu trong 3 bước

### Bước 1: Cài đặt và chạy
```bash
# Cài đặt dependencies
pip install -r requirements.txt

# Chạy server
python run.py
```

### Bước 2: Mở Swagger UI
Truy cập: **http://localhost:3000/docs**

### Bước 3: Test ngay!
Hệ thống đã tự động load **100 sản phẩm mẫu** từ file CSV. Bạn có thể test ngay!

---

## 🎯 Các thao tác cơ bản trên Swagger UI

### 1️⃣ Xem danh sách sản phẩm
1. Tìm endpoint: **GET /api/v1/products**
2. Click **"Try it out"**
3. Click **"Execute"**
4. Kết quả: Danh sách 100 sản phẩm với thông tin đầy đủ

### 2️⃣ Xem chi tiết 1 sản phẩm
1. Endpoint: **GET /api/v1/products/{product_id}**
2. Try it out
3. Nhập `product_id` = `1` (hoặc bất kỳ ID nào từ 1-100)
4. Execute
5. Kết quả: Thông tin chi tiết sản phẩm iPhone 15

### 3️⃣ Xem tồn kho của sản phẩm
1. Endpoint: **GET /api/v1/products/{product_id}/inventory**
2. Nhập `product_id` = `1`
3. Execute
4. Kết quả: Số lượng tồn kho, số lượng khả dụng, đã đặt trước

### 4️⃣ Nhập hàng vào kho
1. Endpoint: **POST /api/v1/transactions**
2. Try it out
3. Điền Request body:
```json
{
  "product_id": 1,
  "transaction_type": "IN",
  "quantity": 50,
  "unit_price": 18000000,
  "reference_number": "PO-2025-001",
  "notes": "Nhập thêm hàng",
  "performed_by": "Admin"
}
```
4. Execute
5. Kết quả: Giao dịch được tạo, tồn kho tự động tăng 50

### 5️⃣ Xuất hàng ra khỏi kho
1. Endpoint: **POST /api/v1/transactions**
2. Request body:
```json
{
  "product_id": 1,
  "transaction_type": "OUT",
  "quantity": 10,
  "unit_price": 22000000,
  "reference_number": "SO-2025-001",
  "notes": "Bán cho khách",
  "performed_by": "Admin"
}
```
3. Execute
4. Kết quả: Tồn kho giảm 10

### 6️⃣ Đặt trước hàng (Reserve Stock)
1. Endpoint: **POST /api/v1/inventory/reserve/{product_id}**
2. Nhập `product_id` = `1`
3. Nhập `quantity` = `5`
4. Execute
5. Kết quả: 
   - `reserved_quantity` tăng 5
   - `available_quantity` giảm 5
   - `quantity` không đổi

### 7️⃣ Xem thống kê tổng quan
1. Endpoint: **GET /api/v1/system/database-stats**
2. Execute
3. Kết quả:
   - Tổng số sản phẩm: 100
   - Tổng giá trị tồn kho
   - Số sản phẩm sắp hết hàng
   - Số giao dịch đã thực hiện

### 8️⃣ Tìm kiếm sản phẩm
1. Endpoint: **GET /api/v1/products**
2. Try it out
3. Điền các filter:
   - `search`: "iPhone" (tìm theo tên)
   - `category`: "Điện tử" (lọc theo danh mục)
   - `limit`: 10
4. Execute
5. Kết quả: Danh sách sản phẩm phù hợp

### 9️⃣ Xem lịch sử giao dịch
1. Endpoint: **GET /api/v1/transactions**
2. Try it out
3. Có thể filter:
   - `product_id`: 1 (xem giao dịch của sản phẩm cụ thể)
   - `transaction_type`: "IN" hoặc "OUT"
4. Execute
5. Kết quả: Danh sách giao dịch theo thời gian

### 🔟 Reset database (bắt đầu lại)
1. Endpoint: **POST /api/v1/system/reset-database**
2. Try it out
3. Execute
4. ⚠️ **Cảnh báo**: Xóa toàn bộ dữ liệu và import lại 100 sản phẩm mẫu từ CSV

---

## 📊 Các loại giao dịch (Transaction Types)

| Type | Ý nghĩa | Ảnh hưởng tồn kho |
|------|---------|-------------------|
| **IN** | Nhập kho | ➕ Tăng |
| **OUT** | Xuất kho | ➖ Giảm |
| **ADJUSTMENT** | Điều chỉnh | ↔️ Đặt lại |
| **RETURN** | Trả hàng | ➕ Tăng |

---

## 🎨 Tips & Tricks

### ✅ Kiểm tra hàng sắp hết
```
GET /api/v1/inventory?low_stock=10
```
Trả về các sản phẩm có `available_quantity` ≤ 10

### ✅ Tìm sản phẩm theo danh mục
```
GET /api/v1/products?category=Điện tử
```

### ✅ Xem top sản phẩm đắt nhất
```
GET /api/v1/products?limit=5
```
(Sắp xếp mặc định theo thời gian tạo, có thể customize trong code)

### ✅ Đặt trước hàng cho đơn hàng
1. Reserve stock khi khách đặt hàng
2. Khi giao hàng thành công → Tạo transaction OUT
3. Nếu khách hủy → Release stock

---

## 🔧 Troubleshooting

### Lỗi: "Không đủ hàng để đặt trước"
→ Kiểm tra `available_quantity` của sản phẩm
→ Release các stock đã reserve nếu không cần

### Lỗi: "SKU đã tồn tại"
→ Mỗi sản phẩm phải có SKU duy nhất
→ Sử dụng endpoint PUT để cập nhật thay vì tạo mới

### Muốn thêm sản phẩm từ file CSV riêng
→ Sửa file `database/Products.csv`
→ Gọi `POST /api/v1/system/import-products`

---

## 🎉 Kết luận

Bây giờ bạn đã có thể:
- ✅ Xem và quản lý 100 sản phẩm mẫu
- ✅ Tạo giao dịch nhập/xuất kho
- ✅ Theo dõi tồn kho real-time
- ✅ Đặt trước và quản lý hàng
- ✅ Xem thống kê và lịch sử

**Happy Testing! 🚀**

Nếu có câu hỏi, xem thêm tại: [README.md](README.md)

