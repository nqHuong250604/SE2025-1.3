import subprocess
import sys
import os

def run_js_tests():
    print("🚀 Đang khởi chạy bộ kiểm thử React (Vitest)...")
    try:
        # Chạy lệnh npm test của Node.js
        # shell=True cần thiết trên Windows
        result = subprocess.run(["npm", "test"], shell=True)
        
        if result.returncode == 0:
            print("\n✅ Tất cả các bản test đã vượt qua!")
        else:
            print("\n❌ Có lỗi xảy ra trong các bản test.")
            sys.exit(result.returncode)
            
    except FileNotFoundError:
        print("❌ Lỗi: Không tìm thấy 'npm'. Hãy chắc chắn bạn đã cài đặt Node.js.")
        sys.exit(1)

if __name__ == "__main__":
    run_js_tests()