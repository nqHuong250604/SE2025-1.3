from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.crud import user as crud_user
from app.api.endpoints.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[UserResponse])
def read_users(
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lấy danh sách người dùng (chỉ Admin mới có quyền - Todo: check role)
    """
    # Todo: Add role check here if needed
    users = crud_user.get_users(db, skip=skip, limit=limit)
    return users

@router.post("/", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(
    user: UserCreate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Tạo người dùng mới (chỉ Admin mới được tạo user khác)
    """
    db_user = crud_user.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud_user.create_user(db=db, user=user)

@router.get("/{user_id}", response_model=UserResponse)
def read_user(
    user_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Xem thông tin chi tiết người dùng
    """
    db_user = crud_user.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user

@router.put("/{user_id}", response_model=UserResponse)
def update_user(
    user_id: int, 
    user_update: UserUpdate, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Cập nhật thông tin người dùng
    """
    db_user = crud_user.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check email duplicates if email is being updated
    if user_update.email and user_update.email != db_user.email:
        if crud_user.get_user_by_email(db, email=user_update.email):
            raise HTTPException(status_code=400, detail="Email already registered")
            
    return crud_user.update_user(db=db, db_user=db_user, user_update=user_update)

@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Xóa người dùng
    """
    db_user = crud_user.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="User not found")
    crud_user.delete_user(db=db, db_user=db_user)
    return None
