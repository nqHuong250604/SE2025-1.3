from pydantic import BaseModel, Field, ConfigDict
from typing import Optional
from datetime import datetime
from app.models.transaction import TransactionType


class TransactionBase(BaseModel):
    """
    Schema cơ bản cho Transaction
    """
    product_id: int = Field(..., description="ID sản phẩm")
    transaction_type: TransactionType = Field(..., description="Loại giao dịch (IN/OUT/ADJUSTMENT/RETURN)")
    quantity: int = Field(..., description="Số lượng")
    unit_price: Optional[float] = Field(None, ge=0, description="Đơn giá")
    reference_number: Optional[str] = Field(None, max_length=100, description="Số tham chiếu")
    notes: Optional[str] = Field(None, description="Ghi chú")
    performed_by: Optional[str] = Field(None, max_length=100, description="Người thực hiện")


class TransactionCreate(TransactionBase):
    """
    Schema để tạo giao dịch mới
    """
    pass


class TransactionResponse(TransactionBase):
    """
    Schema cho response của Transaction
    """
    id: int
    total_amount: Optional[float]
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)


class TransactionList(BaseModel):
    """
    Schema cho danh sách giao dịch
    """
    total: int
    items: list[TransactionResponse]

