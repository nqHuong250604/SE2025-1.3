from pydantic import BaseModel, EmailStr, Field, ConfigDict
from typing import Optional

# Token Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

# User Schemas
class UserBase(BaseModel):
    email: EmailStr = Field(..., description="Email người dùng")
    full_name: Optional[str] = Field(None, description="Họ và tên")

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, description="Mật khẩu (tối thiểu 6 ký tự)")

class UserResponse(UserBase):
    id: int
    is_active: bool
    
    model_config = ConfigDict(from_attributes=True)
