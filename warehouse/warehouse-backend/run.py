"""
Script để chạy Warehouse Management API
"""
import uvicorn
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 3000))
    
    print("=" * 60)
    print("🏭 Warehouse Management API")
    print("=" * 60)
    print(f"🚀 Starting server on http://localhost:{port}")
    print(f"📚 Swagger UI: http://localhost:{port}/docs")
    print(f"📖 ReDoc: http://localhost:{port}/redoc")
    print(f"📄 OpenAPI JSON: http://localhost:{port}/openapi.json")
    print("=" * 60)
    
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )

