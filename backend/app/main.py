from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
import os
from dotenv import load_dotenv

from app.database import init_db
from app.api.endpoints import products, transactions, inventory, system
from app.utils.load_data import init_sample_data

# Load environment variables
load_dotenv()

# Khởi tạo FastAPI app
app = FastAPI(
    title=os.getenv("API_TITLE", "Warehouse Management API"),
    version=os.getenv("API_VERSION", "1.0.0"),
    description="""
# Hệ Thống API Quản Lý Kho Hàng

API này cung cấp các chức năng quản lý kho hàng với đầy đủ tính năng:

## Tính năng chính

### 📦 Quản lý Sản phẩm (Products)
- Tạo, xem, cập nhật, xóa sản phẩm
- Tìm kiếm và lọc sản phẩm
- Quản lý thông tin chi tiết: SKU, tên, mô tả, giá, danh mục...

### 📊 Quản lý Tồn kho (Inventory)
- Xem tồn kho hiện tại của từng sản phẩm
- Đặt trước hàng (reserve stock)
- Hủy đặt trước (release stock)
- Theo dõi số lượng khả dụng và đã đặt trước
- Cảnh báo hàng sắp hết

### 📝 Quản lý Giao dịch (Transactions)
- Nhập kho (IN): Thêm hàng vào kho
- Xuất kho (OUT): Xuất hàng ra khỏi kho
- Điều chỉnh (ADJUSTMENT): Điều chỉnh số lượng tồn kho
- Trả hàng (RETURN): Xử lý hàng trả lại
- Tự động cập nhật tồn kho khi tạo giao dịch
- Lịch sử đầy đủ các giao dịch

## Công nghệ sử dụng

- **FastAPI**: Web framework hiện đại, nhanh
- **SQLAlchemy**: ORM mạnh mẽ cho Python
- **Pydantic**: Data validation
- **OpenAPI/Swagger**: API documentation tự động

## Cách sử dụng

1. Tạo sản phẩm mới qua endpoint `/api/v1/products`
2. Nhập hàng vào kho qua endpoint `/api/v1/transactions` với type=IN
3. Kiểm tra tồn kho qua endpoint `/api/v1/inventory`
4. Xuất hàng qua endpoint `/api/v1/transactions` với type=OUT

## Liên hệ

- Email: support@warehouse.com
- Website: https://warehouse.com
    """,
    contact={
        "name": "Warehouse Management Team",
        "email": "support@warehouse.com",
    },
    license_info={
        "name": "MIT License",
    },
    docs_url="/docs",  # Swagger UI
    redoc_url="/redoc",  # ReDoc
    openapi_url="/openapi.json"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Trong production, nên chỉ định cụ thể domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Custom OpenAPI schema
def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
    )
    
    # Thêm tags description
    openapi_schema["tags"] = [
        {
            "name": "products",
            "description": "Quản lý sản phẩm - Tạo, xem, cập nhật, xóa sản phẩm"
        },
        {
            "name": "transactions",
            "description": "Quản lý giao dịch - Nhập/xuất/điều chỉnh kho, theo dõi lịch sử"
        },
        {
            "name": "inventory",
            "description": "Quản lý tồn kho - Xem tồn kho, đặt trước hàng, cảnh báo hàng sắp hết"
        },
        {
            "name": "system",
            "description": "Quản lý hệ thống - Import CSV, reset database, thống kê"
        }
    ]
    
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi


# Include routers
app.include_router(
    products.router,
    prefix="/api/v1/products",
    tags=["products"]
)

app.include_router(
    transactions.router,
    prefix="/api/v1/transactions",
    tags=["transactions"]
)

app.include_router(
    inventory.router,
    prefix="/api/v1/inventory",
    tags=["inventory"]
)

app.include_router(
    system.router,
    prefix="/api/v1/system",
    tags=["system"]
)


# Root endpoint
@app.get("/", tags=["system"])
async def root():
    """
    Root endpoint - Thông tin cơ bản về API
    """
    return {
        "message": "Warehouse Management API",
        "version": os.getenv("API_VERSION", "1.0.0"),
        "docs": "/docs",
        "redoc": "/redoc",
        "openapi": "/openapi.json"
    }


# Health check endpoint
@app.get("/health", tags=["system"])
async def health_check():
    """
    Health check endpoint - Kiểm tra trạng thái API
    """
    return {
        "status": "healthy",
        "version": os.getenv("API_VERSION", "1.0.0")
    }


# Startup event
@app.on_event("startup")
async def startup_event():
    """
    Khởi tạo database khi app khởi động
    """
    init_db()
    print("✅ Database initialized successfully")
    
    # Load dữ liệu mẫu từ CSV nếu database trống
    result = init_sample_data(force=False)
    if result["success"]:
        if result["products_loaded"] > 0:
            print(f"📦 Đã load {result['products_loaded']} sản phẩm từ CSV")
            print(f"📊 Đã tạo {result['inventory_created']} bản ghi tồn kho")
        else:
            print(f"ℹ️  {result['message']}")
    
    print(f"📚 API Documentation: http://localhost:{os.getenv('PORT', 3000)}/docs")
    print(f"📖 ReDoc: http://localhost:{os.getenv('PORT', 3000)}/redoc")


# Shutdown event
@app.on_event("shutdown")
async def shutdown_event():
    """
    Cleanup khi app shutdown
    """
    print("👋 Shutting down Warehouse Management API...")


if __name__ == "__main__":
    import uvicorn
    
    port = int(os.getenv("PORT", 3000))
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )

