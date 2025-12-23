import random

def test_create_product(client):
    random_sku = f"TEST_PROD_{random.randint(1000, 9999)}"
    response = client.post(
        "/api/v1/products",
        json={
            "name": "Iphone 15 Test",
            "sku": random_sku,
            "description": "Test description",
            "category": "Electronics",
            "price": 25000000,
            "unit": "pcs"
        }
    )
    assert response.status_code in [200, 201]
    data = response.json()
    assert data["sku"] == random_sku
    assert "id" in data
    return data["id"] # Trả về ID để dùng cho các test khác nếu cần

def test_get_products(client):
    # Tạo trước 1 sản phẩm để đảm bảo danh sách không rỗng
    client.post(
        "/api/v1/products",
        json={
            "name": "Dummy Product",
            "sku": f"DUMMY_{random.randint(1000,9999)}",
            "price": 100,
            "category": "Test"
        }
    )
    
    response = client.get("/api/v1/products")
    assert response.status_code == 200
    data = response.json()
    

    assert isinstance(data, dict)
    assert "items" in data
    assert "total" in data
    assert isinstance(data["items"], list)
    assert len(data["items"]) > 0
