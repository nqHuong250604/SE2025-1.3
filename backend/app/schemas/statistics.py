from pydantic import BaseModel, Field

class DashboardStats(BaseModel):
    total_shipments: int = Field(..., description="Tổng số đơn xuất kho")
    active_deliveries: int = Field(..., description="Số đơn đang giao (hiện tại chưa tracking được, trả về 0)")
    total_customers: int = Field(..., description="Tổng số khách hàng (User)")
    revenue: float = Field(..., description="Tổng doanh thu (từ các đơn xuất kho)")
