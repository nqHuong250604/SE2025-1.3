from sqlalchemy.orm import Session
from typing import Optional, List
from datetime import datetime
from app.models.transaction import Transaction, TransactionType
from app.models.inventory import Inventory
from app.schemas.transaction import TransactionCreate


class TransactionCRUD:
    """
    CRUD operations cho Transaction
    """
    
    def get(self, db: Session, transaction_id: int) -> Optional[Transaction]:
        """
        Lấy giao dịch theo ID
        """
        return db.query(Transaction).filter(Transaction.id == transaction_id).first()
    
    def get_multi(
        self, 
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        product_id: Optional[int] = None,
        transaction_type: Optional[TransactionType] = None,
        start_date: Optional[datetime] = None,
        end_date: Optional[datetime] = None
    ) -> tuple[List[Transaction], int]:
        """
        Lấy danh sách giao dịch với pagination và filters
        """
        query = db.query(Transaction)
        
        # Apply filters
        if product_id:
            query = query.filter(Transaction.product_id == product_id)
        
        if transaction_type:
            query = query.filter(Transaction.transaction_type == transaction_type)
        
        if start_date:
            query = query.filter(Transaction.created_at >= start_date)
        
        if end_date:
            query = query.filter(Transaction.created_at <= end_date)
        
        query = query.order_by(Transaction.created_at.desc())
        
        total = query.count()
        items = query.offset(skip).limit(limit).all()
        
        return items, total
    
    def create(self, db: Session, obj_in: TransactionCreate) -> Transaction:
        """
        Tạo giao dịch mới và cập nhật inventory
        """
        # Tính total_amount
        total_amount = None
        if obj_in.unit_price is not None:
            total_amount = obj_in.unit_price * obj_in.quantity
        
        # Tạo transaction
        db_obj = Transaction(
            **obj_in.model_dump(),
            total_amount=total_amount
        )
        db.add(db_obj)
        
        # Cập nhật inventory
        inventory = db.query(Inventory).filter(
            Inventory.product_id == obj_in.product_id
        ).first()
        
        if not inventory:
            # Tạo inventory mới nếu chưa có
            inventory = Inventory(product_id=obj_in.product_id, quantity=0)
            db.add(inventory)
        
        # Cập nhật số lượng tồn kho
        if obj_in.transaction_type == TransactionType.IN:
            inventory.quantity += obj_in.quantity
        elif obj_in.transaction_type == TransactionType.OUT:
            inventory.quantity -= obj_in.quantity
        elif obj_in.transaction_type == TransactionType.ADJUSTMENT:
            inventory.quantity = obj_in.quantity
        elif obj_in.transaction_type == TransactionType.RETURN:
            inventory.quantity += obj_in.quantity
        
        # Cập nhật available_quantity
        inventory.available_quantity = inventory.quantity - inventory.reserved_quantity
        
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def delete(self, db: Session, transaction_id: int) -> bool:
        """
        Xóa giao dịch (hard delete - cẩn thận khi sử dụng)
        """
        obj = db.query(Transaction).filter(Transaction.id == transaction_id).first()
        if obj:
            db.delete(obj)
            db.commit()
            return True
        return False


# Singleton instance
transaction_crud = TransactionCRUD()

