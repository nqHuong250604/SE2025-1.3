# 🏭 Warehouse Management System (WMS)

## 📋 Tổng Quan Dự Án

- **Tên dự án:** Hệ Thống Quản Lý Kho Hàng (Warehouse Management System)
- **Tech Stack:**
  - **Backend:** Python + FastAPI + SQLAlchemy + PostgreSQL/MySQL
  - **Frontend:** ReactJS hoặc VueJS
  - **Database:** PostgreSQL (khuyến nghị) hoặc MySQL
  - **Version Control:** GitHub

---

## 🗄️ Database Schema Đề Xuất

```sql
-- Bảng sản phẩm
Products (id, name, description, sku, created_at, updated_at)

-- Bảng kho hàng (nếu có nhiều kho)
Warehouses (id, name, location)

-- Bảng tồn kho (quan hệ nhiều-nhiều giữa product và warehouse)
Inventory (id, product_id, warehouse_id, quantity)

-- Bảng giao dịch nhập/xuất
Transactions (id, product_id, warehouse_id, quantity, type['import', 'export'], note, created_at)
