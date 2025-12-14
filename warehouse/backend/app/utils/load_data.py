"""
Utility functions để load dữ liệu từ CSV vào database
"""
import csv
import os
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.product import Product
from app.models.inventory import Inventory
from app.database import SessionLocal, Base, engine


def parse_date(date_str: str) -> datetime:
    """
    Parse date string từ CSV (format: DD/MM/YYYY)
    """
    try:
        return datetime.strptime(date_str, "%d/%m/%Y")
    except:
        return datetime.utcnow()


def parse_number(num_str: str) -> float:
    """
    Parse số từ string, loại bỏ dấu phẩy và khoảng trắng
    """
    try:
        return float(num_str.replace(",", "").replace(" ", ""))
    except:
        return 0.0


def load_products_from_csv(csv_path: str = "database/Products.csv", db: Session = None) -> dict:
    """
    Load sản phẩm từ file CSV vào database
    
    Args:
        csv_path: Đường dẫn đến file CSV
        db: Database session (nếu None sẽ tạo mới)
    
    Returns:
        dict: Thống kê số lượng sản phẩm đã load
    """
    close_db = False
    if db is None:
        db = SessionLocal()
        close_db = True
    
    try:
        if not os.path.exists(csv_path):
            return {
                "success": False,
                "message": f"File {csv_path} không tồn tại",
                "products_loaded": 0,
                "inventory_created": 0
            }
        
        products_loaded = 0
        inventory_created = 0
        
        with open(csv_path, 'r', encoding='utf-8') as file:
            # Đọc CSV với delimiter là dấu phẩy
            csv_reader = csv.DictReader(file)
            
            for row in csv_reader:
                try:
                    # Kiểm tra xem sản phẩm đã tồn tại chưa
                    sku = row.get('Mã hàng', '').strip()
                    if not sku:
                        continue
                    
                    existing_product = db.query(Product).filter(Product.sku == sku).first()
                    
                    # Parse dữ liệu từ CSV
                    product_data = {
                        'sku': sku,
                        'name': row.get('Tên hàng', '').strip(),
                        'category': row.get('Loại hàng', '').strip(),
                        'unit': row.get('Đơn vị tính', 'Cái').strip(),
                        'cost': parse_number(row.get('Giá nhập', '0')),
                        'price': parse_number(row.get('Giá bán', '0')),
                        'supplier': row.get('Nhà cung cấp', '').strip(),
                        'min_stock': int(parse_number(row.get('Tồn tối thiểu', '0'))),
                        'import_date': parse_date(row.get('Ngày nhập', '')),
                        'status': row.get('Trạng thái', 'Còn hàng').strip(),
                        'is_active': True
                    }
                    
                    stock_quantity = int(parse_number(row.get('Tồn kho', '0')))
                    
                    if existing_product:
                        # Cập nhật sản phẩm hiện có
                        for key, value in product_data.items():
                            setattr(existing_product, key, value)
                        product = existing_product
                    else:
                        # Tạo sản phẩm mới
                        product = Product(**product_data)
                        db.add(product)
                        db.flush()  # Để lấy product.id
                        products_loaded += 1
                    
                    # Tạo hoặc cập nhật inventory
                    inventory = db.query(Inventory).filter(Inventory.product_id == product.id).first()
                    
                    if inventory:
                        inventory.quantity = stock_quantity
                        inventory.available_quantity = stock_quantity
                    else:
                        inventory = Inventory(
                            product_id=product.id,
                            quantity=stock_quantity,
                            reserved_quantity=0,
                            available_quantity=stock_quantity
                        )
                        db.add(inventory)
                        inventory_created += 1
                    
                except Exception as e:
                    print(f"Lỗi khi xử lý dòng: {row.get('Mã hàng', 'Unknown')} - {str(e)}")
                    continue
            
            db.commit()
            
            return {
                "success": True,
                "message": "Load dữ liệu thành công",
                "products_loaded": products_loaded,
                "inventory_created": inventory_created
            }
    
    except Exception as e:
        db.rollback()
        return {
            "success": False,
            "message": f"Lỗi: {str(e)}",
            "products_loaded": 0,
            "inventory_created": 0
        }
    
    finally:
        if close_db:
            db.close()


def reset_database(db: Session = None) -> dict:
    """
    Reset database - Xóa tất cả dữ liệu và tạo lại tables
    
    Args:
        db: Database session
    
    Returns:
        dict: Kết quả reset
    """
    close_db = False
    if db is None:
        db = SessionLocal()
        close_db = True
    
    try:
        # Drop all tables
        Base.metadata.drop_all(bind=engine)
        
        # Create all tables
        Base.metadata.create_all(bind=engine)
        
        if close_db:
            db.close()
        
        return {
            "success": True,
            "message": "Database đã được reset thành công"
        }
    
    except Exception as e:
        return {
            "success": False,
            "message": f"Lỗi khi reset database: {str(e)}"
        }


def init_sample_data(force: bool = False) -> dict:
    """
    Khởi tạo dữ liệu mẫu từ CSV nếu database trống
    
    Args:
        force: Nếu True, sẽ load dữ liệu dù database đã có dữ liệu
    
    Returns:
        dict: Kết quả khởi tạo
    """
    db = SessionLocal()
    
    try:
        # Kiểm tra xem đã có dữ liệu chưa
        product_count = db.query(Product).count()
        
        if product_count > 0 and not force:
            return {
                "success": True,
                "message": f"Database đã có {product_count} sản phẩm, bỏ qua việc load dữ liệu mẫu",
                "products_loaded": 0,
                "inventory_created": 0
            }
        
        # Load dữ liệu từ CSV
        result = load_products_from_csv(db=db)
        
        return result
    
    finally:
        db.close()

