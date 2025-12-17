# tests/conftest.py
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool
from fastapi.testclient import TestClient

from app.database import Base
from app.main import app
from app.api.dependencies import get_db

# 1. Sử dụng SQLite in-memory (RAM) để test cho nhanh và không ảnh hưởng DB thật
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 2. Fixture tạo database sạch cho mỗi lần chạy test
@pytest.fixture(scope="function")
def db_session():
    # Tạo bảng
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        # Xóa bảng sau khi test xong
        Base.metadata.drop_all(bind=engine)

# 3. Fixture Client đã override dependency để dùng DB test
@pytest.fixture(scope="function")
def client(db_session):
    def override_get_db():
        try:
            yield db_session
        finally:
            db_session.close()
    
    # Ép app dùng DB test thay vì DB thật
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as c:
        yield c