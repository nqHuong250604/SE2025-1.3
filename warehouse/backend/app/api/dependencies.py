from typing import Generator
from app.database import SessionLocal


def get_db() -> Generator:
    """
    Dependency để lấy database session cho mỗi request
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

