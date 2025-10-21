from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.api.dependencies import get_db
from app.crud.product import product_crud
from app.crud.inventory import inventory_crud
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse, ProductList
from app.schemas.inventory import InventoryResponse

router = APIRouter()


@router.get("/", response_model=ProductList, summary="Lấy danh sách sản phẩm")
def get_products(
    skip: int = Query(0, ge=0, description="Số bản ghi bỏ qua"),
    limit: int = Query(100, ge=1, le=1000, description="Số bản ghi tối đa"),
    is_active: Optional[bool] = Query(None, description="Lọc theo trạng thái active"),
    category: Optional[str] = Query(None, description="Lọc theo danh mục"),
    search: Optional[str] = Query(None, description="Tìm kiếm theo tên, SKU hoặc mô tả"),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách tất cả sản phẩm với pagination và filters
    
    - **skip**: Số bản ghi bỏ qua (mặc định: 0)
    - **limit**: Số bản ghi tối đa trả về (mặc định: 100, tối đa: 1000)
    - **is_active**: Lọc sản phẩm đang hoạt động
    - **category**: Lọc theo danh mục
    - **search**: Tìm kiếm theo tên, SKU hoặc mô tả
    """
    items, total = product_crud.get_multi(
        db, 
        skip=skip, 
        limit=limit,
        is_active=is_active,
        category=category,
        search=search
    )
    return ProductList(total=total, items=items)


@router.post(
    "/", 
    response_model=ProductResponse, 
    status_code=status.HTTP_201_CREATED,
    summary="Tạo sản phẩm mới"
)
def create_product(
    product_in: ProductCreate,
    db: Session = Depends(get_db)
):
    """
    Tạo một sản phẩm mới
    
    - **sku**: Mã SKU duy nhất (bắt buộc)
    - **name**: Tên sản phẩm (bắt buộc)
    - **description**: Mô tả sản phẩm
    - **category**: Danh mục
    - **unit**: Đơn vị tính (mặc định: pcs)
    - **price**: Giá bán
    - **cost**: Giá vốn
    """
    # Kiểm tra SKU đã tồn tại chưa
    existing = product_crud.get_by_sku(db, product_in.sku)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"SKU '{product_in.sku}' đã tồn tại"
        )
    
    product = product_crud.create(db, product_in)
    return product


@router.get("/{product_id}", response_model=ProductResponse, summary="Lấy thông tin sản phẩm")
def get_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    """
    Lấy thông tin chi tiết của một sản phẩm theo ID
    """
    product = product_crud.get(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy sản phẩm với ID {product_id}"
        )
    return product


@router.put("/{product_id}", response_model=ProductResponse, summary="Cập nhật sản phẩm")
def update_product(
    product_id: int,
    product_in: ProductUpdate,
    db: Session = Depends(get_db)
):
    """
    Cập nhật thông tin sản phẩm
    """
    product = product_crud.get(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy sản phẩm với ID {product_id}"
        )
    
    # Kiểm tra SKU mới nếu có thay đổi
    if product_in.sku and product_in.sku != product.sku:
        existing = product_crud.get_by_sku(db, product_in.sku)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"SKU '{product_in.sku}' đã tồn tại"
            )
    
    product = product_crud.update(db, product, product_in)
    return product


@router.delete(
    "/{product_id}", 
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Xóa sản phẩm"
)
def delete_product(
    product_id: int,
    db: Session = Depends(get_db)
):
    """
    Xóa sản phẩm (soft delete - đặt is_active = False)
    """
    product = product_crud.delete(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy sản phẩm với ID {product_id}"
        )
    return None


@router.get("/{product_id}/inventory", response_model=InventoryResponse, summary="Lấy tồn kho")
def get_product_inventory(
    product_id: int,
    db: Session = Depends(get_db)
):
    """
    Lấy thông tin tồn kho của sản phẩm
    """
    # Kiểm tra sản phẩm tồn tại
    product = product_crud.get(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy sản phẩm với ID {product_id}"
        )
    
    inventory = inventory_crud.get_by_product(db, product_id)
    if not inventory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy thông tin tồn kho cho sản phẩm {product_id}"
        )
    
    return inventory

