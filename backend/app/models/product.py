from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base


class Product(Base):
    """
    Model cho sản phẩm trong kho
    """
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)
    sku = Column(String(100), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)
    unit = Column(String(50), nullable=False, default="Cái")  # đơn vị: Cái, kg, lít...
    price = Column(Float, nullable=False, default=0.0)  # Giá bán
    cost = Column(Float, nullable=False, default=0.0)   # Giá nhập
    supplier = Column(String(200), nullable=True)  # Nhà cung cấp
    min_stock = Column(Integer, nullable=True, default=0)  # Tồn tối thiểu
    import_date = Column(DateTime, nullable=True)  # Ngày nhập
    status = Column(String(50), nullable=True, default="Còn hàng")  # Trạng thái
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    inventory = relationship("Inventory", back_populates="product", uselist=False, cascade="all, delete-orphan")
    transactions = relationship("Transaction", back_populates="product", cascade="all, delete-orphan")

    @property
    def quantity(self):
        """
        Trả về số lượng tồn kho hiện tại (từ bảng Inventory)
        """
        if self.inventory:
            return self.inventory.quantity
        return 0

    def __repr__(self):
        return f"<Product {self.sku}: {self.name}>"

