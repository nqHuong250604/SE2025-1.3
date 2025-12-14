import React, { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUserAPI, logout } from '../features/auth/authServices';

const AuthContext = createContext(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Tải thông tin người dùng khi App khởi động
    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            getCurrentUserAPI()
                .then(data => {
                    setUser(data);
                })
                .catch(() => {
                    // Nếu token không hợp lệ, đăng xuất
                    logout();
                    setUser(null);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    }, []);
    
    // Hàm cập nhật state khi đăng nhập thành công (Dùng trong component Login)
    const loginUser = (userData) => {
        setUser(userData);
    };

    const logoutUser = () => {
        logout();
        setUser(null);
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        loginUser,
        logoutUser
    };

    // Có thể trả về null hoặc loading spinner nếu đang tải
    // if (loading) return <div>Loading Application...</div>; 

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};