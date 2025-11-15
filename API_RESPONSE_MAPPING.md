# API Response Mapping (Frontend ↔ Backend)

## 1. Products API

### GET /api/products/
Frontend expects:
[
  {
    id: number,
    name: string,
    sku: string,
    description: string,
    quantity: number
  }
]

Backend returns:
- id
- name
- sku
- description
- quantity

=> MATCHED

---

### POST /api/products/
Request:
{
  "name": string,
  "sku": string,
  "description": string
}

Response:
{
  "id": number,
  "name": string,
  "sku": string,
  "description": string,
  "quantity": 0
}

=> Frontend must use data.id to navigate or refresh list.

---

## 2. Transactions API

### POST /api/transactions/import
Request:
{
  "product_id": number,
  "quantity": number
}

Response:
{
  "id": number,
  "product_id": number,
  "quantity": number,
  "type": "import"
}

---

### POST /api/transactions/export
Same structure as import, type = "export".

---

## Notes for Frontend Developers
✔ Always handle error using err.response.data.detail  
✔ quantity may be default 0 for new products  
✔ API may return 422 if missing fields
