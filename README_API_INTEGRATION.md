
# API Integration – Hồ Thái Đức

## 1. CORS
Ensure FastAPI:
```
allow_origins=["http://localhost:3000"]
```

## 2. Swagger Tests
Check:
- /products/
- /products/{id}
- /transactions/import
- /transactions/export

## 3. React Integration
- src/services/api.js
- ProductForm.jsx
- ProductList.jsx
- TransactionForm.jsx

## 4. Error Handling
Use:
```
err.response?.data?.detail
```

## 5. Git Workflow
```
git checkout -b feature/api-integration
git commit -m "feat: api integration"
git push origin feature/api-integration
```
