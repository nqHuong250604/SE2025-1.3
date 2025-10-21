
## 📋 Tổng Quan Dự Án

- **Tên dự án:** Hệ Thống Quản Lý Kho Hàng (Warehouse Management System)
- **Tech Stack:**
  - **Backend:** Python + FastAPI + SQLAlchemy + PostgreSQL/MySQL
  - **Frontend:** ReactJS hoặc VueJS
  - **Database:** PostgreSQL (khuyến nghị) hoặc MySQL
  - **Version Control:** GitHub

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
```

---

## 👥 Phân Công Chi Tiết Với FastAPI & GitHub

### 1. Thành Viên A: FastAPI Backend & Swagger

#### Các Bước Thực Hiện:

1.  **Khởi Tạo Dự Án & GitHub:**
    ```bash
    # Tạo repository trên GitHub trước
    mkdir warehouse-backend
    cd warehouse-backend
    git init
    git remote add origin <your-github-repo-url>
    
    # Tạo virtual environment
    python -m venv venv
    source venv/bin/activate  # Linux/Mac
    # venv\Scripts\activate  # Windows
    
    # Tạo requirements.txt
    echo "fastapi==0.104.1
    uvicorn==0.24.0
    sqlalchemy==2.0.23
    psycopg2-binary==2.9.9
    pydantic==2.5.0
    python-multipart==0.0.6
    alembic==1.12.1" > requirements.txt
    
    pip install -r requirements.txt
    ```

2.  **Thiết Kế API Structure:**
    ```
    warehouse-backend/
    ├── app/
    │   ├── __init__.py
    │   ├── main.py              # FastAPI app instance
    │   ├── database.py          # Database connection
    │   ├── models/              # SQLAlchemy models
    │   │   ├── __init__.py
    │   │   ├── product.py
    │   │   ├── transaction.py
    │   │   └── inventory.py
    │   ├── schemas/             # Pydantic schemas
    │   │   ├── __init__.py
    │   │   ├── product.py
    │   │   └── transaction.py
    │   ├── crud/                # CRUD operations
    │   │   ├── __init__.py
    │   │   ├── product.py
    │   │   └── transaction.py
    │   └── api/                 # API routes
    │       ├── __init__.py
    │       ├── endpoints/
    │       │   ├── __init__.py
    │       │   ├── products.py
    │       │   └── transactions.py
    │       └── dependencies.py
    ├── alembic/                 # Database migrations
    ├── requirements.txt
    └── README.md
    ```

3.  **Triển Khai Code Với FastAPI:**
    - **`app/main.py`:**
    ```python
    from fastapi import FastAPI
    from fastapi.middleware.cors import CORSMiddleware
    from app.api.endpoints import products, transactions
    
    app = FastAPI(
        title="Warehouse Management API",
        description="API for managing warehouse operations",
        version="1.0.0"
    )
    
    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],  # Frontend URL
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    app.include_router(products.router, prefix="/api/products", tags=["products"])
    app.include_router(transactions.router, prefix="/api/transactions", tags=["transactions"])
    
    @app.get("/")
    async def root():
        return {"message": "Warehouse Management API"}
    ```

    - **Pydantic Schemas (trong `app/schemas/product.py`):**
    ```python
    from pydantic import BaseModel
    from datetime import datetime
    from typing import Optional
    
    class ProductBase(BaseModel):
        name: str
        description: Optional[str] = None
        sku: str
    
    class ProductCreate(ProductBase):
        pass
    
    class Product(ProductBase):
        id: int
        created_at: datetime
        updated_at: datetime
        
        class Config:
            from_attributes = True
    ```

    - **API Endpoint (trong `app/api/endpoints/products.py`):**
    ```python
    from fastapi import APIRouter, HTTPException, Depends
    from sqlalchemy.orm import Session
    from app.schemas.product import Product, ProductCreate
    from app.crud import product as product_crud
    from app.database import get_db
    
    router = APIRouter()
    
    @router.get("/", response_model=list[Product])
    def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
        products = product_crud.get_products(db, skip=skip, limit=limit)
        return products
    
    @router.post("/", response_model=Product)
    def create_product(product: ProductCreate, db: Session = Depends(get_db)):
        return product_crud.create_product(db=db, product=product)
    
    @router.get("/{product_id}", response_model=Product)
    def read_product(product_id: int, db: Session = Depends(get_db)):
        db_product = product_crud.get_product(db, product_id=product_id)
        if db_product is None:
            raise HTTPException(status_code=404, detail="Product not found")
        return db_product
    ```

4.  **Swagger Tự Động:**
    - FastAPI tự động tạo Swagger UI tại `http://localhost:8000/docs`
    - Không cần cấu hình thêm!

#### Git Workflow:
```bash
git checkout -b feature/backend-setup
git add .
git commit -m "feat: initialize FastAPI backend with product endpoints"
git push origin feature/backend-setup
# Tạo Pull Request trên GitHub
```

---

### 2. Thành Viên B: Frontend (React/Vue)

#### Các Bước Với GitHub:

1.  **Tạo Frontend Repository Riêng hoặc Monorepo:**
    ```bash
    # Cách 1: Repository riêng
    git clone <frontend-repo-url>
    npx create-react-app warehouse-frontend  # hoặc vue create warehouse-frontend
    cd warehouse-frontend
    
    # Cách 2: Monorepo (recommended)
    # Trong repository chính
    mkdir frontend
    cd frontend
    npx create-react-app .  # hoặc vue create .
    ```

2.  **Cấu Trúc Dự Án Frontend:**
    ```
    frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Product/
    │   │   │   ├── ProductList.jsx
    │   │   │   ├── ProductForm.jsx
    │   │   │   └── ProductItem.jsx
    │   │   ├── Transaction/
    │   │   │   ├── TransactionForm.jsx
    │   │   │   └── TransactionHistory.jsx
    │   │   └── Layout/
    │   │       ├── Header.jsx
    │   │       └── Sidebar.jsx
    │   ├── services/
    │   │   └── api.js          # Axios configuration
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Products.jsx
    │   │   └── Transactions.jsx
    │   └── App.jsx
    ```

3.  **API Service (`src/services/api.js`):**
    ```javascript
    import axios from 'axios';
    
    const API_BASE_URL = 'http://localhost:8000/api';
    
    const api = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    export const productAPI = {
      getAll: () => api.get('/products/'),
      getById: (id) => api.get(`/products/${id}`),
      create: (data) => api.post('/products/', data),
      update: (id, data) => api.put(`/products/${id}`, data),
      delete: (id) => api.delete(`/products/${id}`),
    };
    
    export const transactionAPI = {
      getAll: () => api.get('/transactions/'),
      import: (data) => api.post('/transactions/import', data),
      export: (data) => api.post('/transactions/export', data),
    };
    
    export default api;
    ```

#### Git Workflow:
```bash
git checkout -b feature/product-crud
# Develop feature...
git add .
git commit -m "feat: implement product list and create form"
git push origin feature/product-crud
```

---

### 3. Thành Viên C: Kết Nối API & Frontend

#### Trách Nhiệm Chính:

1.  **CORS Configuration (Đã làm ở backend):**
    - Đảm bảo FastAPI đã config CORS cho frontend URL

2.  **API Integration Testing:**
    - Dùng Swagger UI tại `http://localhost:8000/docs` để test API
    - Verify response format matches frontend expectations

3.  **Error Handling Trong Frontend:**
    ```javascript
    // Trong component
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const handleCreateProduct = async (productData) => {
      setLoading(true);
      setError('');
      try {
        const response = await productAPI.create(productData);
        // Handle success
      } catch (err) {
        setError(err.response?.data?.detail || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    ```

4.  **Real-time API Documentation:**
    - Luôn cập nhật frontend team về các thay đổi API qua Swagger
    - Sử dụng auto-generated types từ Swagger nếu có thể

#### Git Workflow:
```bash
git checkout -b feature/api-integration
# Work on API connection...
git commit -m "feat: complete API integration for products and transactions"
git push origin feature/api-integration
```

---

### 4. Thành Viên D: Testing & Frontend Polish

#### Testing Cho FastAPI Backend:

1.  **Install Testing Dependencies:**
    ```bash
    pip install pytest pytest-asyncio httpx
    ```

2.  **Tạo Test Structure:**
    ```
    tests/
    ├── __init__.py
    ├── conftest.py
    ├── test_products.py
    └── test_transactions.py
    ```

3.  **Viết Tests (`tests/test_products.py`):**
    ```python
    import pytest
    from fastapi.testclient import TestClient
    from app.main import app
    
    client = TestClient(app)
    
    def test_create_product():
        response = client.post(
            "/api/products/",
            json={"name": "Test Product", "sku": "TEST123", "description": "Test desc"}
        )
        assert response.status_code == 200
        data = response.json()
        assert data["name"] == "Test Product"
        assert "id" in data
    
    def test_get_products():
        response = client.get("/api/products/")
        assert response.status_code == 200
        assert isinstance(response.json(), list)
    ```

4.  **Frontend Testing & Polish:**
    - React Testing Library hoặc Vue Test Utils
    - Styling với Tailwind CSS hoặc Material-UI
    - Responsive design
    - Loading states và error handling

#### Git Workflow:
```bash
git checkout -b feature/testing-polish
# Add tests and improvements...
git commit -m "feat: add backend tests and frontend styling"
git push origin feature/testing-polish
```

---

## 🔄 GitHub Collaboration Workflow

1.  **Repository Structure:**
    ```
    warehouse-project/
    ├── backend/
    │   ├── app/
    │   ├── tests/
    │   └── requirements.txt
    ├── frontend/
    │   ├── src/
    │   └── package.json
    └── README.md
    ```

2.  **Branch Strategy:**
    - `main` - production-ready code
    - `develop` - integration branch
    - `feature/*` - new features
    - `hotfix/*` - urgent fixes

3.  **Development Process:**
    ```bash
    # 1. Clone repository
    git clone <your-repo-url>
    cd warehouse-project
    
    # 2. Create feature branch
    git checkout -b feature/your-feature
    
    # 3. Develop and commit
    git add .
    git commit -m "feat: your feature description"
    
    # 4. Push and create PR
    git push origin feature/your-feature
    # Tạo Pull Request trên GitHub
    ```

4.  **GitHub Actions CI (Tùy chọn - tạo file `.github/workflows/test.yml`):**
    ```yaml
    name: Test Backend
    on: [push, pull_request]
    jobs:
      test:
        runs-on: ubuntu-latest
        steps:
          - uses: actions/checkout@v2
          - name: Set up Python
            uses: actions/setup-python@v2
            with:
              python-version: '3.11'
          - name: Install dependencies
            run: |
              cd backend
              pip install -r requirements.txt
          - name: Run tests
            run: |
              cd backend
              pytest
    ```

## 🚀 Quick Start Commands

**Backend:**
```bash
cd backend
uvicorn app.main:app --reload --port 8000
# Access: http://localhost:8000/docs (Swagger UI)
```

**Frontend:**
```bash
cd frontend
npm start
# Access: http://localhost:3000
```

