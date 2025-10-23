
## 📋 Tổng Quan Dự Án

- **Tên dự án:** Hệ Thống Quản Lý Kho Hàng (Warehouse Management System)
- **Tech Stack:**
  - **Backend:** Python + FastAPI + SQLAlchemy + PostgreSQL/MySQL
  - **Frontend:** ReactJS hoặc VueJS
  - **Database:** PostgreSQL (khuyến nghị) hoặc MySQL
  - **Version Control:** GitHub
---

## 🧩 ĐỀ BÀI DỰ ÁN

Trong bối cảnh nền kinh tế hiện đại và sự phát triển nhanh chóng của thương mại điện tử, hoạt động logistics đóng vai trò cực kỳ quan trọng trong việc vận hành chuỗi cung ứng và đảm bảo hiệu quả phân phối sản phẩm. Một trong những thách thức lớn nhất của các doanh nghiệp hiện nay là việc quản lý kho hàng – nơi lưu trữ, điều phối và kiểm soát luồng hàng hóa giữa nhà sản xuất, đại lý và người tiêu dùng.  

Phần lớn các doanh nghiệp nhỏ và vừa hiện vẫn đang thực hiện việc quản lý kho bằng các phương pháp thủ công như bảng tính Excel hoặc ghi chép giấy tờ, dẫn đến nhiều rủi ro như thất thoát hàng hóa, sai lệch số liệu, chậm trễ trong việc nắm bắt thông tin tồn kho và khó khăn khi cần báo cáo nhanh. Chính vì vậy, nhóm chúng em lựa chọn đề tài **“Hệ thống Quản lý Kho Hàng (Warehouse Management System)”**, với mục tiêu xây dựng một nền tảng ứng dụng web hiện đại, giúp tự động hóa các hoạt động nhập – xuất – kiểm kho, quản lý sản phẩm và thống kê tình hình tồn hàng một cách chính xác và minh bạch.  

Hệ thống được phát triển trên nền tảng **FastAPI (Python)** cho phần backend, đảm bảo tốc độ xử lý nhanh, khả năng mở rộng cao, và dễ dàng tích hợp với các hệ thống khác. Song song đó, phần **frontend** được xây dựng bằng **ReactJS**, giúp tạo ra giao diện người dùng thân thiện, trực quan và phản hồi tức thì với thao tác của nhân viên kho hoặc nhà quản lý. Tất cả dữ liệu được lưu trữ trong **PostgreSQL** hoặc **MySQL**, giúp đảm bảo tính toàn vẹn và an toàn của thông tin.

---

## 🎯 MỤC TIÊU DỰ ÁN

Mục tiêu chính của dự án là **xây dựng một hệ thống quản lý kho hàng thông minh**, có khả năng ghi nhận, lưu trữ và theo dõi toàn bộ quá trình **nhập – xuất – tồn kho** theo thời gian thực. Hệ thống hướng đến việc hỗ trợ doanh nghiệp **giảm thiểu sai sót thủ công**, **nâng cao hiệu suất làm việc**, **tăng tính chính xác của dữ liệu tồn kho**, và **tối ưu hóa quy trình vận hành kho hàng**.

Song song đó, dự án còn giúp sinh viên **nắm vững toàn bộ quy trình phát triển phần mềm hiện đại**, từ thiết kế mô hình dữ liệu, xây dựng RESTful API, thiết kế giao diện người dùng, kiểm thử hệ thống, cho đến triển khai và quản lý mã nguồn trên GitHub. Đây là một dự án mang tính thực hành cao, kết hợp cả kỹ năng kỹ thuật và kỹ năng làm việc nhóm chuyên nghiệp.

Cụ thể, dự án hướng tới việc hoàn thành các mục tiêu sau:

- **Về kỹ thuật:**  
  Xây dựng **hệ thống API hoàn chỉnh với FastAPI**, hỗ trợ đầy đủ các chức năng CRUD (Create – Read – Update – Delete) cho các đối tượng quản lý như **sản phẩm, giao dịch nhập – xuất, người dùng và tồn kho**.  
  Đặc biệt, dự án **tích hợp Swagger UI và chuẩn OpenAPI** nhằm:
  - Tự động **mô tả toàn bộ hệ thống API** theo chuẩn quốc tế OpenAPI Specification (OAS), giúp người phát triển dễ dàng hiểu rõ cấu trúc, phương thức, tham số và phản hồi của từng endpoint.
  - Cho phép **kiểm thử trực tiếp các API** ngay trên giao diện Swagger mà không cần công cụ ngoài (như Postman), giúp quá trình phát triển và debug nhanh chóng, thuận tiện hơn.
  - Đảm bảo **tính minh bạch, khả năng mở rộng và khả năng tích hợp liên hệ thống**, vì OpenAPI là chuẩn mô tả được các dịch vụ khác (như hệ thống ERP hoặc thương mại điện tử) dễ dàng kết nối đến thông qua tài liệu mô tả chung.
  - Góp phần **tự động sinh tài liệu kỹ thuật** (API Documentation), giúp giảm tải việc viết mô tả thủ công và nâng cao khả năng bảo trì hệ thống trong dài hạn.

- **Về giao diện:**  
  Phát triển **ứng dụng ReactJS** có khả năng tương tác mượt mà với backend thông qua thư viện **Axios**, hiển thị dữ liệu động theo thời gian thực và hỗ trợ người dùng thao tác dễ dàng trên các bảng dữ liệu sản phẩm, giao dịch, và báo cáo thống kê tồn kho. Giao diện được thiết kế hiện đại, rõ ràng, đảm bảo **trải nghiệm người dùng trực quan và hiệu quả**.

- **Về vận hành:**  
  Đảm bảo hệ thống hoạt động **ổn định, phản hồi nhanh và có cơ chế xử lý lỗi rõ ràng**, chẳng hạn xác nhận người dùng trước khi thực hiện các thao tác quan trọng như xóa hoặc nhập hàng.  
  Ngoài ra, hệ thống được thiết kế theo hướng **mở rộng linh hoạt**, cho phép bổ sung các module nâng cao như:
  - Phân tích và **thống kê doanh thu theo thời gian**,  
  - **Dự đoán nhu cầu hàng tồn**,  
  - hoặc **tích hợp IoT** để theo dõi lượng hàng trong kho thực tế.

- **Về cộng tác và phát triển nhóm:**  
  Áp dụng **quy trình phát triển phần mềm chuyên nghiệp** thông qua nền tảng **GitHub**, bao gồm:
  - Quản lý nhánh (branching model),  
  - Tạo và review **pull request**,  
  - Tích hợp **CI/CD pipelines** để kiểm thử và triển khai tự động với **GitHub Actions**,  
  - Đồng thời, sử dụng tài liệu API tự sinh từ **Swagger/OpenAPI** như một cầu nối giao tiếp giữa backend developer, frontend developer, và tester, giúp đội nhóm làm việc hiệu quả, thống nhất và tránh hiểu nhầm trong quá trình phát triển.

Việc kết hợp **FastAPI + Swagger/OpenAPI + ReactJS** không chỉ giúp dự án đạt được tính **tự động hóa, trực quan và chuyên nghiệp**, mà còn phản ánh đúng xu hướng phát triển phần mềm hiện đại – nơi **API được mô tả rõ ràng, có thể kiểm thử trực tiếp và dễ dàng tích hợp với các hệ thống khác**.

---

## 🧱 PHẠM VI VÀ YÊU CẦU CỦA HỆ THỐNG

Hệ thống được thiết kế nhằm đáp ứng các nhu cầu thực tế trong việc quản lý kho hàng của một doanh nghiệp nhỏ đến trung bình, bao gồm quản lý danh mục sản phẩm, giao dịch nhập – xuất hàng, theo dõi tồn kho và lập báo cáo tổng hợp.  
Ứng dụng được triển khai dưới dạng **nền tảng web**, người dùng có thể truy cập thông qua trình duyệt, không cần cài đặt phức tạp.

Hệ thống tập trung vào bốn nhóm chức năng chính:

1. **Quản lý sản phẩm:**  
   Hệ thống cho phép người dùng thêm mới, chỉnh sửa, tìm kiếm hoặc xóa sản phẩm. Mỗi sản phẩm bao gồm các thông tin như mã SKU, tên sản phẩm, mô tả, giá nhập, giá bán và số lượng tồn hiện tại. Tính năng tìm kiếm giúp người quản lý dễ dàng lọc và truy cập sản phẩm cần thiết theo tên hoặc mã.

2. **Quản lý giao dịch nhập – xuất kho:**  
   Người dùng có thể ghi nhận các giao dịch nhập hoặc xuất hàng từ kho. Khi thực hiện thao tác này, hệ thống sẽ tự động cập nhật số lượng tồn tương ứng của từng sản phẩm, đảm bảo dữ liệu kho luôn phản ánh đúng thực tế. Mỗi giao dịch được lưu lại với thời gian thực hiện, người thao tác và loại giao dịch (nhập hoặc xuất).

3. **Theo dõi tồn kho và thống kê:**  
   Ứng dụng hiển thị danh sách toàn bộ sản phẩm kèm số lượng tồn hiện tại. Các mặt hàng sắp hết hàng sẽ được cảnh báo để nhà quản lý chủ động nhập thêm. Ngoài ra, hệ thống cung cấp biểu đồ thống kê nhập – xuất theo thời gian, giúp hỗ trợ ra quyết định nhanh chóng và chính xác hơn.

4. **Báo cáo và xuất dữ liệu:**  
   Người dùng có thể tạo báo cáo tổng hợp theo ngày, tuần hoặc tháng, với các chỉ tiêu như tổng số lượng nhập, tổng số lượng xuất và giá trị tồn kho. Các báo cáo này có thể được trích xuất ra file CSV hoặc Excel để phục vụ công tác lưu trữ hoặc trình bày nội bộ.

---

## ⚙️ YÊU CẦU PHI CHỨC NĂNG

Bên cạnh các chức năng chính, dự án cũng phải đáp ứng một số yêu cầu phi chức năng nhằm đảm bảo hệ thống hoạt động hiệu quả và có khả năng mở rộng trong tương lai:

- **Hiệu năng:** thời gian phản hồi API phải nhanh (dưới 200ms với thao tác CRUD cơ bản), giao diện frontend phải mượt và đồng bộ với backend.
- **Bảo mật:** đảm bảo các endpoint API chỉ nhận dữ liệu hợp lệ, có xác thực và kiểm tra đầu vào; tránh SQL injection và lỗi định dạng JSON.
- **Tính mở rộng:** cấu trúc mã nguồn backend và frontend được tách biệt rõ ràng, dễ dàng mở rộng thêm các module như quản lý nhà cung cấp, quản lý nhân viên hoặc tích hợp phân quyền người dùng.
- **Khả năng triển khai:** có thể triển khai hệ thống trên máy chủ nội bộ hoặc cloud (Heroku, Render, hoặc AWS) với quy trình CI/CD tự động.
- **Khả năng bảo trì:** mã nguồn được tổ chức khoa học, có ghi chú, đặt tên biến rõ ràng, và tuân thủ quy chuẩn PEP8 (Python) cũng như ESLint (React).

---

## 💡 Ý NGHĨA ỨNG DỤNG

Dự án không chỉ là một bài thực hành kỹ thuật, mà còn có giá trị thực tiễn cao trong việc **ứng dụng công nghệ vào quản trị kho logistics**. Việc xây dựng hệ thống này giúp sinh viên hiểu rõ hơn về **luồng dữ liệu trong vận hành chuỗi cung ứng**, **các thao tác nghiệp vụ kho hàng** và **cách tối ưu hóa hoạt động lưu trữ – vận chuyển bằng phần mềm**.  

Trong tương lai, hệ thống có thể được phát triển mở rộng với các tính năng nâng cao như **phân quyền người dùng**, **tích hợp mã QR cho sản phẩm**, **định vị hàng hóa theo khu vực lưu trữ (zone tracking)**, hoặc **tích hợp AI để dự đoán xu hướng tiêu thụ và điều chỉnh tồn kho tự động**. Điều này mở ra hướng tiếp cận hiện đại trong việc chuyển đổi số ngành logistics – một lĩnh vực đang tăng trưởng mạnh mẽ tại Việt Nam.

---

## 🚀 KẾT LUẬN

Với việc kết hợp giữa **FastAPI, ReactJS và PostgreSQL**, dự án “Hệ thống Quản lý Kho Hàng” thể hiện quy trình phát triển một ứng dụng web hoàn chỉnh từ backend đến frontend, vừa đảm bảo tính thực tế, vừa mang ý nghĩa học thuật cao. Dự án giúp người học củng cố kiến thức về phát triển API, thiết kế hệ thống, lập trình hướng đối tượng, xử lý dữ liệu, và làm việc nhóm trong môi trường phần mềm chuyên nghiệp.  
Đây là bước khởi đầu quan trọng cho việc ứng dụng công nghệ vào quản lý logistics hiện đại, góp phần thúc đẩy quá trình số hóa và tự động hóa trong doanh nghiệp.

---

## 👥 Phân Công Chi Tiết Với FastAPI & GitHub

### 1. Vũ Bá Anh: FastAPI Backend & Swagger
    **Cấu Trúc API:**
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



### 2. Nguyễn Quang Hướng: Frontend (React)

#### Các Bước Với GitHub:

1.  **Tạo Frontend Repository Riêng hoặc Monorepo:**
    ```bash
    # Cách 1: Repository riêng
    git clone <frontend-repo-url>
    npx create-react-app warehouse-frontend
    cd warehouse-frontend
    
    # Cách 2: Monorepo (recommended)
    # Trong repository chính
    mkdir frontend
    cd frontend
    npx create-react-app . 
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

### 3. Hồ Thái Đức: Kết Nối API & Frontend

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

### 4. Nguyễn Minh Dương: Testing & Frontend Polish

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

4. Frontend Testing & Polish

🧩 Kiểm thử & Hoàn thiện giao diện người dùng (Frontend)

**Kiểm thử giao diện:**  
Sử dụng **React Testing Library** (với React) hoặc **Vue Test Utils** (với Vue) để kiểm thử các *component*, hành vi tương tác và hiển thị dữ liệu.  
Mục tiêu là đảm bảo giao diện hoạt động ổn định, các thành phần hiển thị chính xác và phản hồi đúng với thao tác của người dùng.

**Cải thiện giao diện:**  
- Áp dụng **Tailwind CSS** hoặc **Material-UI** để thống nhất phong cách và nâng cao trải nghiệm người dùng.  
- Đảm bảo **thiết kế đáp ứng (responsive design)** trên mọi kích thước màn hình (máy tính, máy tính bảng, thiết bị di động).  
- Thêm **trạng thái tải (loading states)** và **xử lý lỗi (error handling)** rõ ràng, thân thiện với người dùng để cải thiện trải nghiệm tổng thể.


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

