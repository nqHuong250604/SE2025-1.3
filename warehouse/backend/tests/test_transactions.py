# tests/test_transactions.py
import pytest

def create_dummy_product(client):
    """Hàm phụ trợ để tạo nhanh 1 sản phẩm"""
    sku = f"TRANS_{pytest.gen.randint(1000, 9999)}" if hasattr(pytest, 'gen') else f"TRANS_SKU"
    # Dùng random đơn giản nếu không có pytest-randomly
    import random
    sku = f"TRANS_{random.randint(10000,99999)}"
    
    res = client.post("/api/v1/products", json={
        "name": "Transaction Item",
        "sku": sku,
        "category": "Test",
        "price": 50000
    })
    return res.json()

def test_transaction_workflow(client):
    # 1. Tạo sản phẩm trước
    product = create_dummy_product(client)
    product_id = product["id"]

    # 2. Test Nhập Kho (IN)
    # Nhập 100 cái
    res_in = client.post("/api/v1/transactions", json={
        "product_id": product_id,
        "transaction_type": "IN",
        "quantity": 100,
        "unit_price": 40000,
        "notes": "Nhập hàng test"
    })
    assert res_in.status_code == 201
    data_in = res_in.json()
    assert data_in["transaction_type"] == "IN"
    assert data_in["quantity"] == 100

    # 3. Kiểm tra Tồn Kho sau khi nhập
    # Kỳ vọng: 100
    res_inv = client.get(f"/api/v1/products/{product_id}/inventory")
    assert res_inv.status_code == 200
    inv_data = res_inv.json()
    assert inv_data["quantity"] == 100
    assert inv_data["available_quantity"] == 100

    # 4. Test Xuất Kho (OUT)
    # Xuất 30 cái
    res_out = client.post("/api/v1/transactions", json={
        "product_id": product_id,
        "transaction_type": "OUT",
        "quantity": 30,
        "unit_price": 60000,
        "notes": "Bán hàng test"
    })
    assert res_out.status_code == 201

    # 5. Kiểm tra Tồn Kho sau khi xuất
    # Kỳ vọng: 100 - 30 = 70
    res_inv_final = client.get(f"/api/v1/products/{product_id}/inventory")
    final_inv = res_inv_final.json()
    assert final_inv["quantity"] == 70
    assert final_inv["available_quantity"] == 70

def test_transaction_invalid_product(client):
    # Test nhập kho cho sản phẩm không tồn tại (ID = 999999)
    res = client.post("/api/v1/transactions", json={
        "product_id": 999999,
        "transaction_type": "IN",
        "quantity": 10
    })
    assert res.status_code == 404 # Mong đợi lỗi Not Found