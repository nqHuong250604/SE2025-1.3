from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional

from app.api.dependencies import get_db
from app.crud.inventory import inventory_crud
from app.schemas.inventory import InventoryResponse, InventoryUpdate

router = APIRouter()


@router.get("/", response_model=list[InventoryResponse], summary="Lấy danh sách tồn kho")
def get_inventory_list(
    skip: int = Query(0, ge=0, description="Số bản ghi bỏ qua"),
    limit: int = Query(100, ge=1, le=1000, description="Số bản ghi tối đa"),
    low_stock: Optional[int] = Query(None, description="Lọc hàng sắp hết (số lượng khả dụng <= giá trị này)"),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách tồn kho của tất cả sản phẩm
    
    - **skip**: Số bản ghi bỏ qua
    - **limit**: Số bản ghi tối đa trả về
    - **low_stock**: Lọc các sản phẩm có số lượng khả dụng <= giá trị này
    """
    items, total = inventory_crud.get_multi(db, skip=skip, limit=limit, low_stock=low_stock)
    return items


@router.get("/{inventory_id}", response_model=InventoryResponse, summary="Lấy thông tin tồn kho")
def get_inventory(
    inventory_id: int,
    db: Session = Depends(get_db)
):
    """
    Lấy thông tin chi tiết tồn kho theo ID
    """
    inventory = inventory_crud.get(db, inventory_id)
    if not inventory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy tồn kho với ID {inventory_id}"
        )
    return inventory


@router.put("/{inventory_id}", response_model=InventoryResponse, summary="Cập nhật tồn kho")
def update_inventory(
    inventory_id: int,
    inventory_in: InventoryUpdate,
    db: Session = Depends(get_db)
):
    """
    Cập nhật thông tin tồn kho
    
    - **quantity**: Số lượng tồn kho
    - **reserved_quantity**: Số lượng đã đặt trước
    - **location**: Vị trí trong kho
    
    Lưu ý: available_quantity sẽ được tự động tính = quantity - reserved_quantity
    """
    inventory = inventory_crud.get(db, inventory_id)
    if not inventory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy tồn kho với ID {inventory_id}"
        )
    
    inventory = inventory_crud.update(db, inventory, inventory_in)
    return inventory


@router.post(
    "/reserve/{product_id}",
    response_model=InventoryResponse,
    summary="Đặt trước hàng"
)
def reserve_inventory(
    product_id: int,
    quantity: int = Query(..., gt=0, description="Số lượng cần đặt trước"),
    db: Session = Depends(get_db)
):
    """
    Đặt trước hàng (reserve stock)
    
    - Tăng reserved_quantity
    - Giảm available_quantity
    - Kiểm tra xem có đủ hàng khả dụng không
    """
    try:
        inventory = inventory_crud.reserve_stock(db, product_id, quantity)
        if not inventory:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Không tìm thấy tồn kho cho sản phẩm {product_id}"
            )
        return inventory
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )


@router.post(
    "/release/{product_id}",
    response_model=InventoryResponse,
    summary="Hủy đặt trước hàng"
)
def release_inventory(
    product_id: int,
    quantity: int = Query(..., gt=0, description="Số lượng cần hủy đặt trước"),
    db: Session = Depends(get_db)
):
    """
    Hủy đặt trước hàng (release reserved stock)
    
    - Giảm reserved_quantity
    - Tăng available_quantity
    """
    inventory = inventory_crud.release_stock(db, product_id, quantity)
    if not inventory:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy tồn kho cho sản phẩm {product_id}"
        )
    return inventory

