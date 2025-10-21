"""
System endpoints - Quản lý hệ thống, import dữ liệu
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

from app.api.dependencies import get_db
from app.utils.load_data import load_products_from_csv, reset_database, init_sample_data
from app.models.product import Product
from app.models.inventory import Inventory
from app.models.transaction import Transaction

router = APIRouter()


class ImportResult(BaseModel):
    """
    Schema cho kết quả import
    """
    success: bool
    message: str
    products_loaded: int = 0
    inventory_created: int = 0


class DatabaseStats(BaseModel):
    """
    Schema cho thống kê database
    """
    total_products: int
    total_inventory_records: int
    total_transactions: int
    total_stock_value: float
    low_stock_products: int


@router.post(
    "/import-products",
    response_model=ImportResult,
    summary="Import sản phẩm từ CSV",
    description="""
    Import dữ liệu sản phẩm từ file `database/Products.csv` vào database.
    
    - Tự động tạo inventory cho mỗi sản phẩm
    - Nếu sản phẩm đã tồn tại (trùng SKU), sẽ cập nhật thông tin
    - File CSV phải có format: STT, Mã hàng, Tên hàng, Loại hàng, Đơn vị tính, Giá nhập, Giá bán, Tồn kho, Tồn tối thiểu, Nhà cung cấp, Ngày nhập, Trạng thái
    """
)
def import_products_from_csv(
    db: Session = Depends(get_db)
):
    """
    Import sản phẩm từ file CSV vào database
    """
    result = load_products_from_csv(db=db)
    
    if not result["success"]:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=result["message"]
        )
    
    return ImportResult(**result)


@router.post(
    "/reset-database",
    response_model=ImportResult,
    summary="Reset toàn bộ database",
    description="""
    ⚠️ **CẢNH BÁO**: Thao tác này sẽ xóa toàn bộ dữ liệu trong database!
    
    - Xóa tất cả sản phẩm, tồn kho, giao dịch
    - Tạo lại các bảng trống
    - Sau đó tự động import dữ liệu mẫu từ CSV
    
    Sử dụng để reset về trạng thái ban đầu khi testing.
    """
)
def reset_database_endpoint(
    db: Session = Depends(get_db)
):
    """
    Reset toàn bộ database và import lại dữ liệu mẫu
    """
    # Reset database
    reset_result = reset_database()
    
    if not reset_result["success"]:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=reset_result["message"]
        )
    
    # Import dữ liệu mẫu
    import_result = load_products_from_csv(db=db)
    
    if not import_result["success"]:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=import_result["message"]
        )
    
    return ImportResult(
        success=True,
        message="Database đã được reset và import dữ liệu mẫu thành công",
        products_loaded=import_result["products_loaded"],
        inventory_created=import_result["inventory_created"]
    )


@router.get(
    "/database-stats",
    response_model=DatabaseStats,
    summary="Thống kê database",
    description="Lấy thống kê tổng quan về database: số lượng sản phẩm, tồn kho, giao dịch..."
)
def get_database_stats(
    db: Session = Depends(get_db)
):
    """
    Lấy thống kê tổng quan về database
    """
    # Đếm số lượng
    total_products = db.query(Product).filter(Product.is_active == True).count()
    total_inventory = db.query(Inventory).count()
    total_transactions = db.query(Transaction).count()
    
    # Tính tổng giá trị tồn kho
    inventories = db.query(Inventory).join(Product).all()
    total_stock_value = sum(
        inv.quantity * inv.product.cost 
        for inv in inventories 
        if inv.product
    )
    
    # Đếm sản phẩm sắp hết hàng
    low_stock_count = 0
    for inv in inventories:
        if inv.product and inv.product.min_stock:
            if inv.available_quantity <= inv.product.min_stock:
                low_stock_count += 1
    
    return DatabaseStats(
        total_products=total_products,
        total_inventory_records=total_inventory,
        total_transactions=total_transactions,
        total_stock_value=total_stock_value,
        low_stock_products=low_stock_count
    )


@router.delete(
    "/clear-all-data",
    summary="Xóa toàn bộ dữ liệu",
    description="""
    ⚠️ **CẢNH BÁO**: Xóa toàn bộ dữ liệu nhưng giữ nguyên cấu trúc bảng.
    
    Khác với reset-database, endpoint này chỉ xóa data mà không tạo lại tables.
    """
)
def clear_all_data(
    db: Session = Depends(get_db)
):
    """
    Xóa toàn bộ dữ liệu nhưng giữ nguyên cấu trúc
    """
    try:
        # Xóa theo thứ tự để tránh foreign key constraint
        db.query(Transaction).delete()
        db.query(Inventory).delete()
        db.query(Product).delete()
        db.commit()
        
        return {
            "success": True,
            "message": "Đã xóa toàn bộ dữ liệu"
        }
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Lỗi khi xóa dữ liệu: {str(e)}"
        )

