from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.api.dependencies import get_db
from app.crud.transaction import transaction_crud
from app.crud.product import product_crud
from app.schemas.transaction import TransactionCreate, TransactionResponse, TransactionList
from app.models.transaction import TransactionType

router = APIRouter()


@router.get("/", response_model=TransactionList, summary="Lấy danh sách giao dịch")
def get_transactions(
    skip: int = Query(0, ge=0, description="Số bản ghi bỏ qua"),
    limit: int = Query(100, ge=1, le=1000, description="Số bản ghi tối đa"),
    product_id: Optional[int] = Query(None, description="Lọc theo ID sản phẩm"),
    transaction_type: Optional[TransactionType] = Query(None, description="Lọc theo loại giao dịch"),
    start_date: Optional[datetime] = Query(None, description="Lọc từ ngày"),
    end_date: Optional[datetime] = Query(None, description="Lọc đến ngày"),
    db: Session = Depends(get_db)
):
    """
    Lấy danh sách tất cả giao dịch với pagination và filters
    
    - **skip**: Số bản ghi bỏ qua
    - **limit**: Số bản ghi tối đa trả về
    - **product_id**: Lọc theo sản phẩm
    - **transaction_type**: Lọc theo loại giao dịch (IN, OUT, ADJUSTMENT, RETURN)
    - **start_date**: Lọc từ ngày
    - **end_date**: Lọc đến ngày
    """
    items, total = transaction_crud.get_multi(
        db,
        skip=skip,
        limit=limit,
        product_id=product_id,
        transaction_type=transaction_type,
        start_date=start_date,
        end_date=end_date
    )
    return TransactionList(total=total, items=items)


@router.post(
    "/",
    response_model=TransactionResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Tạo giao dịch mới"
)
def create_transaction(
    transaction_in: TransactionCreate,
    db: Session = Depends(get_db)
):
    """
    Tạo một giao dịch mới (nhập/xuất/điều chỉnh/trả hàng)
    
    Giao dịch sẽ tự động cập nhật số lượng tồn kho:
    - **IN**: Nhập kho - tăng số lượng
    - **OUT**: Xuất kho - giảm số lượng
    - **ADJUSTMENT**: Điều chỉnh - đặt lại số lượng
    - **RETURN**: Trả hàng - tăng số lượng
    
    Fields:
    - **product_id**: ID sản phẩm (bắt buộc)
    - **transaction_type**: Loại giao dịch (bắt buộc)
    - **quantity**: Số lượng (bắt buộc)
    - **unit_price**: Đơn giá
    - **reference_number**: Số tham chiếu (PO, SO...)
    - **notes**: Ghi chú
    - **performed_by**: Người thực hiện
    """
    # Kiểm tra sản phẩm tồn tại
    product = product_crud.get(db, transaction_in.product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy sản phẩm với ID {transaction_in.product_id}"
        )
    
    # Validate số lượng cho giao dịch OUT
    if transaction_in.transaction_type == TransactionType.OUT:
        from app.crud.inventory import inventory_crud
        inventory = inventory_crud.get_by_product(db, transaction_in.product_id)
        if inventory and inventory.available_quantity < transaction_in.quantity:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Không đủ hàng. Số lượng khả dụng: {inventory.available_quantity}"
            )
    
    transaction = transaction_crud.create(db, transaction_in)
    return transaction


@router.get("/{transaction_id}", response_model=TransactionResponse, summary="Lấy thông tin giao dịch")
def get_transaction(
    transaction_id: int,
    db: Session = Depends(get_db)
):
    """
    Lấy thông tin chi tiết của một giao dịch theo ID
    """
    transaction = transaction_crud.get(db, transaction_id)
    if not transaction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy giao dịch với ID {transaction_id}"
        )
    return transaction


@router.delete(
    "/{transaction_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Xóa giao dịch"
)
def delete_transaction(
    transaction_id: int,
    db: Session = Depends(get_db)
):
    """
    Xóa giao dịch
    
    ⚠️ Cảnh báo: Thao tác này không tự động hoàn tác việc cập nhật tồn kho.
    Cần tạo giao dịch điều chỉnh (ADJUSTMENT) để sửa tồn kho nếu cần.
    """
    result = transaction_crud.delete(db, transaction_id)
    if not result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Không tìm thấy giao dịch với ID {transaction_id}"
        )
    return None

