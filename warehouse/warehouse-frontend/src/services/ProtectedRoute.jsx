// file: components/ProtectedRoute.jsimport React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    // 1. Kiểm tra Token
    const isAuthenticated = !!localStorage.getItem('accessToken');
    
    if (isAuthenticated) {
        // 2. Nếu đã đăng nhập (có token), cho phép render component con
        return children;
    } else {
        // 3. Nếu CHƯA đăng nhập (hoặc token không tồn tại), chuyển hướng về trang /login
        // 'replace: true' giúp thay thế lịch sử trình duyệt, ngăn quay lại trang bị chặn bằng nút Back
        return <Navigate to="/login" replace={true} />;
    }
};

export default ProtectedRoute;