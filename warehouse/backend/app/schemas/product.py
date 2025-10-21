from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime


class ProductBase(BaseModel):
    """
    Schema cơ bản cho Product
    """
    sku: str = Field(..., description="Mã SKU duy nhất", max_length=100)
    name: str = Field(..., description="Tên sản phẩm", max_length=255)
    description: Optional[str] = Field(None, description="Mô tả sản phẩm")
    category: Optional[str] = Field(None, description="Danh mục", max_length=100)
    unit: str = Field(default="Cái", description="Đơn vị tính (Cái, kg, lít...)", max_length=50)
    price: float = Field(default=0.0, ge=0, description="Giá bán")
    cost: float = Field(default=0.0, ge=0, description="Giá nhập")
    supplier: Optional[str] = Field(None, description="Nhà cung cấp", max_length=200)
    min_stock: Optional[int] = Field(None, ge=0, description="Tồn kho tối thiểu")
    import_date: Optional[datetime] = Field(None, description="Ngày nhập hàng")
    status: Optional[str] = Field(None, description="Trạng thái", max_length=50)


class ProductCreate(ProductBase):
    """
    Schema để tạo sản phẩm mới
    """
    pass


class ProductUpdate(BaseModel):
    """
    Schema để cập nhật sản phẩm
    """
    sku: Optional[str] = Field(None, max_length=100)
    name: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    category: Optional[str] = Field(None, max_length=100)
    unit: Optional[str] = Field(None, max_length=50)
    price: Optional[float] = Field(None, ge=0)
    cost: Optional[float] = Field(None, ge=0)
    supplier: Optional[str] = Field(None, max_length=200)
    min_stock: Optional[int] = Field(None, ge=0)
    import_date: Optional[datetime] = None
    status: Optional[str] = Field(None, max_length=50)
    is_active: Optional[bool] = None


class ProductResponse(ProductBase):
    """
    Schema cho response của Product
    """
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class ProductWithInventory(ProductResponse):
    """
    Schema cho Product kèm thông tin tồn kho
    """
    stock_quantity: Optional[int] = None
    available_quantity: Optional[int] = None
    
    model_config = ConfigDict(from_attributes=True)


class ProductList(BaseModel):
    """
    Schema cho danh sách sản phẩm
    """
    total: int
    items: list[ProductResponse]

