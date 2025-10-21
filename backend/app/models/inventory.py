from sqlalchemy import Column, Integer, ForeignKey, DateTime, String
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Inventory(Base):
    """
    Model cho tồn kho hiện tại
    """
    __tablename__ = "inventory"

    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, ForeignKey("products.id"), unique=True, nullable=False)
    quantity = Column(Integer, nullable=False, default=0)
    reserved_quantity = Column(Integer, nullable=False, default=0)  # Số lượng đã đặt trước
    available_quantity = Column(Integer, nullable=False, default=0)  # Số lượng có thể bán
    location = Column(String(100), nullable=True)  # Vị trí trong kho
    last_updated = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    product = relationship("Product", back_populates="inventory")

    def __repr__(self):
        return f"<Inventory product_id={self.product_id}: {self.quantity}>"

