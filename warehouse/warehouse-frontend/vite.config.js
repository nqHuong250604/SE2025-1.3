import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // *** THÊM CẤU HÌNH PROXY Ở ĐÂY ***
  server: {
    // Port frontend của bạn (thường là 5173)
    port: 5173, 
    proxy: {
      // Bất kỳ yêu cầu nào từ frontend bắt đầu bằng '/api/v1' 
      // sẽ được tự động chuyển hướng (proxy) đến server backend.
      '/api/v1': {
        target: 'http://localhost:3000', // ĐỊA CHỈ VÀ PORT CỦA FASTAPI BACKEND
        changeOrigin: true, // Quan trọng: thay đổi Host header để backend tin rằng yêu cầu đến từ chính nó
        secure: false, // Sử dụng nếu backend của bạn là http
      },
    },
  },
  // **********************************
})