# 🏭 Warehouse Management API

Hệ thống API quản lý kho hàng được xây dựng với FastAPI và tuân theo chuẩn OpenAPI/Swagger.

## 🎯 Tính năng

### 📦 Quản lý Sản phẩm
- ✅ CRUD đầy đủ cho sản phẩm
- ✅ Tìm kiếm và lọc sản phẩm theo nhiều tiêu chí
- ✅ Quản lý SKU, giá, danh mục, đơn vị tính
- ✅ Soft delete (không xóa vĩnh viễn)

### 📊 Quản lý Tồn kho
- ✅ Theo dõi số lượng tồn kho theo thời gian thực
- ✅ Quản lý hàng đặt trước (reserved stock)
- ✅ Tính toán số lượng khả dụng tự động
- ✅ Cảnh báo hàng sắp hết
- ✅ Quản lý vị trí lưu kho

### 📝 Quản lý Giao dịch
- ✅ Nhập kho (IN)
- ✅ Xuất kho (OUT)
- ✅ Điều chỉnh tồn kho (ADJUSTMENT)
- ✅ Trả hàng (RETURN)
- ✅ Tự động cập nhật tồn kho
- ✅ Lịch sử giao dịch đầy đủ
- ✅ Theo dõi người thực hiện và ghi chú

## 🏗️ Kiến trúc

```
warehouse-backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI app instance + Swagger config
│   ├── database.py          # Database connection
│   ├── models/              # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── product.py       # Model sản phẩm
│   │   ├── transaction.py   # Model giao dịch
│   │   └── inventory.py     # Model tồn kho
│   ├── schemas/             # Pydantic schemas (validation)
│   │   ├── __init__.py
│   │   ├── product.py
│   │   ├── transaction.py
│   │   └── inventory.py
│   ├── crud/                # CRUD operations
│   │   ├── __init__.py
│   │   ├── product.py
│   │   ├── transaction.py
│   │   └── inventory.py
│   └── api/                 # API routes
│       ├── __init__.py
│       ├── endpoints/
│       │   ├── __init__.py
│       │   ├── products.py      # Endpoints sản phẩm
│       │   ├── transactions.py  # Endpoints giao dịch
│       │   └── inventory.py     # Endpoints tồn kho
│       └── dependencies.py
├── requirements.txt
└── README.md
```

## 🚀 Cài đặt

### Yêu cầu
- Python 3.8+
- pip

### Các bước cài đặt

1. **Clone repository**
```bash
cd warehouse-backend
```

2. **Tạo virtual environment**
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

3. **Cài đặ dependencies**
```bash
pip install -r requirements.txt
```

4. **Chạy server**
```bash
# Cách 1: Sử dụng script run.py
python run.py

# Cách 2: Sử dụng uvicorn trực tiếp
uvicorn app.main:app --reload --port 3000
```

Server sẽ chạy tại: `http://localhost:3000`

**🎉 QUAN TRỌNG**: Khi khởi động lần đầu, hệ thống sẽ tự động:
- Tạo database SQLite (`warehouse.db`)
- Import **100 sản phẩm mẫu** từ file `database/Products.csv`
- Tạo tồn kho cho tất cả sản phẩm
- Bạn có thể test API ngay lập tức trên Swagger UI!

## 📚 API Documentation

Sau khi chạy server, bạn có thể truy cập documentation tại:

- **Swagger UI**: http://localhost:3000/docs
- **ReDoc**: http://localhost:3000/redoc
- **OpenAPI JSON**: http://localhost:3000/openapi.json

## 🔌 API Endpoints

### Products (Sản phẩm)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/v1/products` | Lấy danh sách sản phẩm (có pagination, filter, search) |
| POST | `/api/v1/products` | Tạo sản phẩm mới |
| GET | `/api/v1/products/{id}` | Lấy chi tiết sản phẩm |
| PUT | `/api/v1/products/{id}` | Cập nhật sản phẩm |
| DELETE | `/api/v1/products/{id}` | Xóa sản phẩm (soft delete) |
| GET | `/api/v1/products/{id}/inventory` | Lấy tồn kho của sản phẩm |

### Transactions (Giao dịch)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/v1/transactions` | Lấy danh sách giao dịch (có pagination, filter) |
| POST | `/api/v1/transactions` | Tạo giao dịch mới (tự động cập nhật tồn kho) |
| GET | `/api/v1/transactions/{id}` | Lấy chi tiết giao dịch |
| DELETE | `/api/v1/transactions/{id}` | Xóa giao dịch |

### Inventory (Tồn kho)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/api/v1/inventory` | Lấy danh sách tồn kho (có filter hàng sắp hết) |
| GET | `/api/v1/inventory/{id}` | Lấy chi tiết tồn kho |
| PUT | `/api/v1/inventory/{id}` | Cập nhật tồn kho |
| POST | `/api/v1/inventory/reserve/{product_id}` | Đặt trước hàng |
| POST | `/api/v1/inventory/release/{product_id}` | Hủy đặt trước hàng |

### System (Quản lý hệ thống)
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/` | Root endpoint |
| GET | `/health` | Health check |
| POST | `/api/v1/system/import-products` | Import sản phẩm từ CSV |
| POST | `/api/v1/system/reset-database` | Reset database và import lại dữ liệu |
| GET | `/api/v1/system/database-stats` | Xem thống kê database |
| DELETE | `/api/v1/system/clear-all-data` | Xóa toàn bộ dữ liệu |

## 💡 Ví dụ sử dụng

### 🎯 Quick Start - Test ngay trên Swagger UI

1. **Khởi động server**: `python run.py`
2. **Mở Swagger UI**: http://localhost:3000/docs
3. **Xem dữ liệu mẫu**:
   - Click vào `GET /api/v1/products` → Try it out → Execute
   - Bạn sẽ thấy 100 sản phẩm đã được load sẵn!

4. **Thử các tính năng**:
   - Tạo giao dịch nhập/xuất kho
   - Xem tồn kho real-time
   - Đặt trước hàng (reserve stock)
   - Xem thống kê database

5. **Reset dữ liệu** (nếu muốn bắt đầu lại):
   - Click vào `POST /api/v1/system/reset-database` → Try it out → Execute

---

### 1. Xem dữ liệu mẫu đã được load

**Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/products?limit=5"
```

Bạn sẽ thấy các sản phẩm từ file CSV như iPhone 15, Laptop Dell, Samsung Tab...

### 2. Tạo sản phẩm mới

**Request:**
```bash
curl -X POST "http://localhost:3000/api/v1/products" \
  -H "Content-Type: application/json" \
  -d '{
    "sku": "PROD001",
    "name": "Laptop Dell XPS 13",
    "description": "Laptop cao cấp",
    "category": "Electronics",
    "unit": "pcs",
    "price": 25000000,
    "cost": 20000000
  }'
```

**Response:**
```json
{
  "id": 1,
  "sku": "PROD001",
  "name": "Laptop Dell XPS 13",
  "description": "Laptop cao cấp",
  "category": "Electronics",
  "unit": "pcs",
  "price": 25000000.0,
  "cost": 20000000.0,
  "is_active": true,
  "created_at": "2025-10-21T10:00:00",
  "updated_at": "2025-10-21T10:00:00"
}
```

### 2. Nhập hàng vào kho

**Request:**
```bash
curl -X POST "http://localhost:3000/api/v1/transactions" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "transaction_type": "IN",
    "quantity": 100,
    "unit_price": 20000000,
    "reference_number": "PO-2025-001",
    "notes": "Nhập hàng đợt 1",
    "performed_by": "Nguyễn Văn A"
  }'
```

**Response:**
```json
{
  "id": 1,
  "product_id": 1,
  "transaction_type": "IN",
  "quantity": 100,
  "unit_price": 20000000.0,
  "total_amount": 2000000000.0,
  "reference_number": "PO-2025-001",
  "notes": "Nhập hàng đợt 1",
  "performed_by": "Nguyễn Văn A",
  "created_at": "2025-10-21T10:05:00"
}
```

### 3. Kiểm tra tồn kho

**Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/products/1/inventory"
```

**Response:**
```json
{
  "id": 1,
  "product_id": 1,
  "quantity": 100,
  "reserved_quantity": 0,
  "available_quantity": 100,
  "location": null,
  "last_updated": "2025-10-21T10:05:00"
}
```

### 4. Xuất hàng

**Request:**
```bash
curl -X POST "http://localhost:3000/api/v1/transactions" \
  -H "Content-Type: application/json" \
  -d '{
    "product_id": 1,
    "transaction_type": "OUT",
    "quantity": 10,
    "unit_price": 25000000,
    "reference_number": "SO-2025-001",
    "notes": "Bán cho khách hàng A",
    "performed_by": "Trần Thị B"
  }'
```

### 5. Đặt trước hàng

**Request:**
```bash
curl -X POST "http://localhost:3000/api/v1/inventory/reserve/1?quantity=20"
```

**Response:**
```json
{
  "id": 1,
  "product_id": 1,
  "quantity": 90,
  "reserved_quantity": 20,
  "available_quantity": 70,
  "location": null,
  "last_updated": "2025-10-21T10:15:00"
}
```

### 6. Import dữ liệu từ CSV

**Request:**
```bash
curl -X POST "http://localhost:3000/api/v1/system/import-products"
```

**Response:**
```json
{
  "success": true,
  "message": "Load dữ liệu thành công",
  "products_loaded": 100,
  "inventory_created": 100
}
```

### 7. Xem thống kê database

**Request:**
```bash
curl -X GET "http://localhost:3000/api/v1/system/database-stats"
```

**Response:**
```json
{
  "total_products": 100,
  "total_inventory_records": 100,
  "total_transactions": 5,
  "total_stock_value": 2850000000.0,
  "low_stock_products": 3
}
```

## 🗄️ Database Schema

### Products Table
- `id`: Primary Key
- `sku`: Mã SKU (unique)
- `name`: Tên sản phẩm
- `description`: Mô tả
- `category`: Danh mục
- `unit`: Đơn vị tính
- `price`: Giá bán
- `cost`: Giá vốn
- `is_active`: Trạng thái
- `created_at`: Ngày tạo
- `updated_at`: Ngày cập nhật

### Inventory Table
- `id`: Primary Key
- `product_id`: Foreign Key -> Products
- `quantity`: Số lượng tồn kho
- `reserved_quantity`: Số lượng đã đặt trước
- `available_quantity`: Số lượng khả dụng
- `location`: Vị trí trong kho
- `last_updated`: Lần cập nhật cuối

### Transactions Table
- `id`: Primary Key
- `product_id`: Foreign Key -> Products
- `transaction_type`: Loại giao dịch (IN/OUT/ADJUSTMENT/RETURN)
- `quantity`: Số lượng
- `unit_price`: Đơn giá
- `total_amount`: Thành tiền
- `reference_number`: Số tham chiếu
- `notes`: Ghi chú
- `performed_by`: Người thực hiện
- `created_at`: Ngày tạo

## 🔧 Công nghệ sử dụng

- **FastAPI**: Web framework hiện đại, nhanh cho Python
- **SQLAlchemy**: ORM mạnh mẽ
- **Pydantic**: Data validation
- **Uvicorn**: ASGI server
- **SQLite/PostgreSQL**: Database
- **OpenAPI/Swagger**: API Documentation

## 🎯 Dữ liệu mẫu

Hệ thống đi kèm với file `database/Products.csv` chứa **100 sản phẩm mẫu** thuộc các danh mục:

- 📱 **Điện tử** (20 sản phẩm): iPhone, Laptop, TV, Tủ lạnh, Máy giặt...
- 🪑 **Nội thất** (15 sản phẩm): Bàn, ghế, tủ, giường, sofa...
- 📄 **Văn phòng phẩm** (15 sản phẩm): Máy in, giấy A4, bút, sổ...
- 🍳 **Đồ gia dụng** (15 sản phẩm): Nồi cơm, ấm đun, chảo, bếp...
- 👕 **Thời trang** (10 sản phẩm): Áo, quần, giày, túi...
- 🍜 **Thực phẩm** (10 sản phẩm): Sữa, mì, dầu ăn, cafe...
- 🧴 **Chăm sóc cá nhân** (7 sản phẩm): Dầu gội, sữa tắm, kem đánh răng...
- 💊 **Y tế** (6 sản phẩm): Khẩu trang, thuốc, nhiệt kế, máy đo huyết áp...
- ⚽ **Thể thao** (2 sản phẩm): Xe đạp, vợt cầu lông...

Mỗi sản phẩm có đầy đủ thông tin:
- Mã SKU (ví dụ: SP001, SP002...)
- Tên, loại hàng, đơn vị tính
- Giá nhập, giá bán
- Tồn kho hiện tại, tồn tối thiểu
- Nhà cung cấp, ngày nhập
- Trạng thái

### 🔄 Quản lý dữ liệu

**Import dữ liệu mới:**
- Sửa file `database/Products.csv` với dữ liệu của bạn
- Gọi endpoint `POST /api/v1/system/import-products` trên Swagger
- Hệ thống sẽ tự động import và tạo tồn kho

**Reset về mẫu ban đầu:**
- Gọi endpoint `POST /api/v1/system/reset-database`
- Toàn bộ dữ liệu sẽ được xóa và import lại từ CSV

**Xem thống kê:**
- Gọi endpoint `GET /api/v1/system/database-stats`
- Xem tổng quan: số sản phẩm, giá trị tồn kho, hàng sắp hết...

## 📝 Ghi chú

### Transaction Types
- **IN**: Nhập kho - tăng số lượng tồn kho
- **OUT**: Xuất kho - giảm số lượng tồn kho
- **ADJUSTMENT**: Điều chỉnh - đặt lại số lượng tồn kho
- **RETURN**: Trả hàng - tăng số lượng tồn kho

### Available Quantity Calculation
```
available_quantity = quantity - reserved_quantity
```

### Validation Rules
- SKU phải unique
- Không thể xuất kho nhiều hơn số lượng khả dụng
- Không thể đặt trước nhiều hơn số lượng khả dụng
- Giá và số lượng phải >= 0

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng tạo issue hoặc pull request.

## 📄 License

MIT License

## 👥 Tác giả

Warehouse Management Team

## 📞 Liên hệ

- Email: support@warehouse.com
- Website: https://warehouse.com

