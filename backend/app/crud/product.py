from sqlalchemy.orm import Session
from typing import Optional, List
from app.models.product import Product
from app.schemas.product import ProductCreate, ProductUpdate


class ProductCRUD:
    """
    CRUD operations cho Product
    """
    
    def get(self, db: Session, product_id: int) -> Optional[Product]:
        """
        Lấy sản phẩm theo ID
        """
        return db.query(Product).filter(Product.id == product_id).first()
    
    def get_by_sku(self, db: Session, sku: str) -> Optional[Product]:
        """
        Lấy sản phẩm theo SKU
        """
        return db.query(Product).filter(Product.sku == sku).first()
    
    def get_multi(
        self, 
        db: Session, 
        skip: int = 0, 
        limit: int = 100,
        is_active: Optional[bool] = None,
        category: Optional[str] = None,
        search: Optional[str] = None
    ) -> tuple[List[Product], int]:
        """
        Lấy danh sách sản phẩm với pagination và filters
        """
        query = db.query(Product)
        
        # Apply filters
        if is_active is not None:
            query = query.filter(Product.is_active == is_active)
        
        if category:
            query = query.filter(Product.category == category)
        
        if search:
            query = query.filter(
                (Product.name.contains(search)) | 
                (Product.sku.contains(search)) |
                (Product.description.contains(search))
            )
        
        total = query.count()
        items = query.offset(skip).limit(limit).all()
        
        return items, total
    
    def create(self, db: Session, obj_in: ProductCreate) -> Product:
        """
        Tạo sản phẩm mới
        """
        db_obj = Product(**obj_in.model_dump())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def update(
        self, 
        db: Session, 
        db_obj: Product, 
        obj_in: ProductUpdate
    ) -> Product:
        """
        Cập nhật sản phẩm
        """
        obj_data = obj_in.model_dump(exclude_unset=True)
        for field, value in obj_data.items():
            setattr(db_obj, field, value)
        
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def delete(self, db: Session, product_id: int) -> Optional[Product]:
        """
        Xóa sản phẩm (soft delete - set is_active = False)
        """
        obj = db.query(Product).filter(Product.id == product_id).first()
        if obj:
            obj.is_active = False
            db.commit()
            db.refresh(obj)
        return obj


# Singleton instance
product_crud = ProductCRUD()

