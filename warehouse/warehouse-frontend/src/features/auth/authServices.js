import axios from 'axios';

// --- Cấu hình chung ---
const API_BASE_URL = window.location.hostname === "localhost" 
    ? "http://localhost:3000" // Link khi bạn mở web ở máy (nhớ check lại port 8000 hay 3000)
    : "https://test-backend-sxs8.onrender.com"; // Link khi bạn mở web đã deploy
const ACCESS_TOKEN_KEY = 'accessToken';
// ----------------------

// 1. TẠO AXIOS INSTANCE ĐỂ TỰ ĐỘNG GẮN TOKEN 
const authApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Accept': 'application/json',
    },
});

// Interceptor Request: Tự động chèn token vào Header
authApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem(ACCESS_TOKEN_KEY);
        if (token) {
            // Thiết lập Header: Authorization: Bearer <token>
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);
// 

// 2. HÀM ĐĂNG NHẬP (Lấy Token & Lưu Token)
/**
 * Hàm đăng nhập người dùng, lưu trữ token và trả về kết quả.
 */
export const loginAPI = async (username, password) => {
    try {
        const params = new URLSearchParams();
        params.append('username', username);
        params.append('password', password);
        params.append('grant_type', 'password'); 

        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };

        const response = await axios.post(
            `${API_BASE_URL}/api/v1/auth/login`, 
            params, 
            config
        );

        // --- LƯU TRỮ TOKEN VÀO LOCAL STORAGE ---
        const { access_token } = response.data;
        if (access_token) {
            localStorage.setItem(ACCESS_TOKEN_KEY, access_token);
        }
        // -------------------------------------

        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.detail || "Đăng nhập thất bại");
        } else {
            throw new Error("Lỗi kết nối đến server");
        }
    }
};

// 3. HÀM ĐĂNG XUẤT
export const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    console.log("Đã đăng xuất.");
};

// 4. HÀM LẤY THÔNG TIN NGƯỜI DÙNG (Sử dụng authApi)
/**
 * Lấy thông tin người dùng hiện tại (yêu cầu token).
 */
export const getCurrentUserAPI = async () => {
    try {
        // authApi sẽ tự động chèn token đã lưu
        const response = await authApi.get('/api/v1/auth/me'); 
        
        return response.data; 
    } catch (error) {
        throw new Error(error.response?.data?.detail || "Không thể lấy thông tin người dùng");
    }
};

// 5. HÀM ĐĂNG KÝ (Không cần token)
export const registerAPI = async (email, full_name, password) => {
    try {
        const config = { headers: { 'Content-Type': 'application/json' } };
        const data = { email, full_name, password };

        const response = await axios.post(
            `${API_BASE_URL}/api/v1/auth/register`,
            data,
            config
        );
        return response.data;
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.detail || "Đăng ký thất bại");
        } else {
            throw new Error("Lỗi kết nối đến server");
        }
    }
};

export const updateProfileAPI = async (profileData) => {
    try {
        // authApi đã có token sẵn trong header
        const response = await authApi.put('/api/v1/users/me', profileData); 
        // Giả sử API dùng phương thức PUT hoặc PATCH để cập nhật hồ sơ người dùng
        
        return response.data; 
    } catch (error) {
        throw new Error(error.response?.data?.detail || "Không thể cập nhật hồ sơ người dùng");
    }
};