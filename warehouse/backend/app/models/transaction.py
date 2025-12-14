from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, Text, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from app.database import Base


class TransactionType(str, enum.Enum):
    """
    Loại giao dịch
    """
    IN = "IN"  # Nhập kho
    OUT = "OUT"  # Xuất kho
    ADJUSTMENT = "ADJUSTMENT"  # Điều chỉnh
    RETURN = "RETURN"  # Trả hàng


class Transaction(Base):
    """
    Model cho các giao dịch kho (nhập/xuất/điều chỉnh)
    """
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)
    transaction_type = Column(Enum(TransactionType), nullable=False)
    quantity = Column(Integer, nullable=False)
    unit_price = Column(Float, nullable=True)
    total_amount = Column(Float, nullable=True)
    reference_number = Column(String(100), nullable=True, index=True)  # Số tham chiếu (PO, SO...)
    notes = Column(Text, nullable=True)
    performed_by = Column(String(100), nullable=True)  # Người thực hiện
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    product = relationship("Product", back_populates="transactions")

    def __repr__(self):
        return f"<Transaction {self.transaction_type}: {self.quantity} units>"

