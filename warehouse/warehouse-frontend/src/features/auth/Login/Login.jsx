import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// ... (Import các assets)
import logo from "../../../assets/icons/logo.svg";
import Saly from "../../../assets/icons/Saly-1.svg";
import Google from "../../../assets/icons/google.svg";
import Facebook from "../../../assets/icons/Facebook.svg";
import Apple from "../../../assets/icons/apple.svg";
import "./Login.css";

// 💡 IMPORT CẢ HAI HÀM API CẦN THIẾT
import { loginAPI, getCurrentUserAPI, logout } from "../authServices"; 
// Đảm bảo file service của bạn có cả 3 hàm này

// --- CẤU HÌNH FULL NAME ADMIN ĐỂ PHÂN QUYỀN TẠM THỜI ---
const ADMIN_FULL_NAME_CHECK = "admin"; // Đã đăng ký là "ADMIN", nên kiểm tra với "admin" (không phân biệt hoa thường)
// --------------------------------------------------------

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleClick = () => {
    navigate("/");
  };

  const handleLogin = async (e) => {
    e.preventDefault(); 
    setErrorMessage(""); 
    setLoading(true); 

    try {
      // 1. GỌI API ĐĂNG NHẬP (Xác thực và lấy Token)
      const loginResponse = await loginAPI(username, password);

      // 2. Lưu token (đã được xử lý trong loginAPI, nhưng kiểm tra lại)
      if (loginResponse.access_token) {
        localStorage.setItem("accessToken", loginResponse.access_token);
      }
      
      // 3. GỌI API LẤY THÔNG TIN NGƯỜI DÙNG (Cần có Token để gọi)
      const userData = await getCurrentUserAPI();
      
      let redirectPath = "/user"; // Mặc định chuyển hướng tới /user
      
      // 4. PHÂN QUYỀN DỰA TRÊN FULL NAME CỦA USERDATA TRẢ VỀ
      const userFullName = userData.full_name || userData.fullName || ""; 

      // Kiểm tra full name có khớp với tên ADMIN đã đăng ký không
      if (userFullName.toLowerCase() === ADMIN_FULL_NAME_CHECK) {
          redirectPath = "/admin";
      }

      console.log(`Login Success. Full Name: ${userFullName}. Redirecting to ${redirectPath}`);
      
      // 5. Chuyển hướng
      navigate(redirectPath); 

    } catch (error) {
      console.error("Login/Auth Error:", error);
      // Xóa token nếu quá trình xác thực hoặc lấy thông tin thất bại
      logout(); 
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      {/* ... (Phần UI không đổi) ... */}
      <div className="login-left">
        <img src={logo} alt="logo" className="logo-web" onClick={handleClick} />
        <div className="login-text">
          <h1>Sign in to</h1>
          <h2>Logistic is simply</h2>
          <p>
            Log in to manage, track, and optimize every step of your logistics
            process with ease. Our intelligent system empowers you to control
            shipments, monitor warehouse status, and streamline deliveries—all
            in one place.
          </p>
        </div>
        <img src={Saly} alt="Login Illustration" />
      </div>

      <div className="login-right"></div>

      <div className="login-form">
        <div className="form-header">
          <h4 className="form-header-text">
            <span className="black">Welcome to</span>
            <span className="blue">LOGISTIC</span>
          </h4>
          <div className="no-account">
            <p>No Account?</p>
            <a href="/register">Sign up</a>
          </div>
        </div>

        <h1>Sign in</h1>

        <div className="social-login">
          <div className="google-btn">
            <img src={Google} alt="Google" />
            <p>Sign in with Google</p>
          </div>
          <div className="social-icons">
            <div className="icon-box">
              <img src={Facebook} alt="Facebook" />
            </div>
            <div className="icon-box">
              <img src={Apple} alt="Apple" />
            </div>
          </div>
        </div>

        {/* Form Login */}
        <form onSubmit={handleLogin}>
            {/* Hiển thị lỗi nếu có */}
            {errorMessage && <p style={{ color: "red", fontSize: "14px", marginBottom: "10px" }}>{errorMessage}</p>}

          <label>Enter your user name or email address</label>
          <input
            type="text" 
            placeholder="Username or Email"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <label>Enter your password</label>
          <input 
            type="password" 
            placeholder="Enter your password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <a href="/forgot_password" className="forgot-password">
            Forgot password
          </a>
          
          {/* Nút submit */}
          <button type="submit" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;