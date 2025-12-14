from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.api.dependencies import get_db
from app.schemas.statistics import DashboardStats
from app.models.transaction import Transaction, TransactionType
from app.models.user import User

router = APIRouter()

@router.get("/dashboard", response_model=DashboardStats, summary="Lấy thống kê dashboard")
def get_dashboard_stats(db: Session = Depends(get_db)):
    """
    Trả về các chỉ số KPI cho Dashboard:
    - **Total Shipments**: Số lượng giao dịch OUT
    - **Active Deliveries**: Tạm thời = 0
    - **Total Customers**: Số lượng User
    - **Revenue**: Tổng tiền (total_amount) của giao dịch OUT
    """
    
    # 1. Total Shipments (Count OUT transactions)
    total_shipments = db.query(func.count(Transaction.id)).filter(
        Transaction.transaction_type == TransactionType.OUT
    ).scalar() or 0
    
    # 2. Active Deliveries (Stub = 0)
    active_deliveries = 0
    
    # 3. Total Customers (Count Users)
    total_customers = db.query(func.count(User.id)).scalar() or 0
    
    # 4. Revenue (Sum total_amount of OUT transactions)
    revenue = db.query(func.sum(Transaction.total_amount)).filter(
        Transaction.transaction_type == TransactionType.OUT
    ).scalar() or 0.0
    
    return DashboardStats(
        total_shipments=total_shipments,
        active_deliveries=active_deliveries,
        total_customers=total_customers,
        revenue=revenue
    )
