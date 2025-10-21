from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime


class InventoryBase(BaseModel):
    """
    Schema cơ bản cho Inventory
    """
    product_id: int
    quantity: int = Field(default=0, description="Số lượng tồn kho")
    reserved_quantity: int = Field(default=0, description="Số lượng đã đặt trước")
    available_quantity: int = Field(default=0, description="Số lượng có thể bán")
    location: Optional[str] = Field(None, max_length=100, description="Vị trí trong kho")


class InventoryUpdate(BaseModel):
    """
    Schema để cập nhật tồn kho
    """
    quantity: Optional[int] = Field(None, ge=0)
    reserved_quantity: Optional[int] = Field(None, ge=0)
    location: Optional[str] = Field(None, max_length=100)


class InventoryResponse(InventoryBase):
    """
    Schema cho response của Inventory
    """
    id: int
    last_updated: datetime
    
    model_config = ConfigDict(from_attributes=True)


class InventoryWithProduct(InventoryResponse):
    """
    Schema cho Inventory kèm thông tin sản phẩm
    """
    product_sku: str
    product_name: str
    
    model_config = ConfigDict(from_attributes=True)

