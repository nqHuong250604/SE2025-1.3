from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.inventory import Inventory
from app.schemas.inventory import InventoryUpdate


class InventoryCRUD:
    """
    CRUD operations cho Inventory
    """
    
    def get(self, db: Session, inventory_id: int) -> Optional[Inventory]:
        """
        Lấy inventory theo ID
        """
        return db.query(Inventory).filter(Inventory.id == inventory_id).first()
    
    def get_by_product(self, db: Session, product_id: int) -> Optional[Inventory]:
        """
        Lấy inventory theo product_id
        """
        return db.query(Inventory).filter(Inventory.product_id == product_id).first()
    
    def get_multi(
        self, 
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        low_stock: Optional[int] = None
    ) -> tuple[List[Inventory], int]:
        """
        Lấy danh sách inventory với pagination và filters
        """
        query = db.query(Inventory)
        
        # Filter low stock items
        if low_stock is not None:
            query = query.filter(Inventory.available_quantity <= low_stock)
        
        total = query.count()
        items = query.offset(skip).limit(limit).all()
        
        return items, total
    
    def update(
        self, 
        db: Session, 
        db_obj: Inventory, 
        obj_in: InventoryUpdate
    ) -> Inventory:
        """
        Cập nhật inventory
        """
        obj_data = obj_in.model_dump(exclude_unset=True)
        for field, value in obj_data.items():
            setattr(db_obj, field, value)
        
        # Tự động tính available_quantity
        if 'quantity' in obj_data or 'reserved_quantity' in obj_data:
            db_obj.available_quantity = db_obj.quantity - db_obj.reserved_quantity
        
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def reserve_stock(
        self, 
        db: Session, 
        product_id: int, 
        quantity: int
    ) -> Optional[Inventory]:
        """
        Đặt trước hàng (reserve stock)
        """
        inventory = self.get_by_product(db, product_id)
        if not inventory:
            return None
        
        if inventory.available_quantity < quantity:
            raise ValueError("Không đủ hàng để đặt trước")
        
        inventory.reserved_quantity += quantity
        inventory.available_quantity = inventory.quantity - inventory.reserved_quantity
        
        db.commit()
        db.refresh(inventory)
        return inventory
    
    def release_stock(
        self, 
        db: Session, 
        product_id: int, 
        quantity: int
    ) -> Optional[Inventory]:
        """
        Hủy đặt trước hàng (release reserved stock)
        """
        inventory = self.get_by_product(db, product_id)
        if not inventory:
            return None
        
        inventory.reserved_quantity = max(0, inventory.reserved_quantity - quantity)
        inventory.available_quantity = inventory.quantity - inventory.reserved_quantity
        
        db.commit()
        db.refresh(inventory)
        return inventory


# Singleton instance
inventory_crud = InventoryCRUD()

