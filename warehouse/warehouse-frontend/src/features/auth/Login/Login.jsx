import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/icons/logo.svg";
import Saly from "../../../assets/icons/Saly-1.svg";
import Google from "../../../assets/icons/google.svg";
import Facebook from "../../../assets/icons/Facebook.svg";
import Apple from "../../../assets/icons/apple.svg";
import "./Login.css";

import { loginAPI } from "../authServices";

const Login = () => {
  const navigate = useNavigate();

  // State quản lý dữ liệu nhập vào
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  
  // State quản lý trạng thái UI
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleClick = () => {
    navigate("/");
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Ngăn reload trang
    setErrorMessage(""); // Reset lỗi cũ
    setLoading(true); // Bật trạng thái loading

    try {
      // Gọi API
      const data = await loginAPI(username, password);

      console.log("Login Success:", data);

      // --- XỬ LÝ KHI THÀNH CÔNG ---
      // 1. Lưu token (Tùy vào response trả về, ví dụ access_token)
      if (data.access_token) {
          localStorage.setItem("accessToken", data.access_token);
      }
      
      // 2. Chuyển hướng
      navigate("/user"); 

    } catch (error) {
      console.error(error);
      setErrorMessage(error.message);
    } finally {
      setLoading(false); // Tắt loading dù thành công hay thất bại
    }
  };

  return (
    <div className="login-container">
      {/* Bên trái */}
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

      {/* Bên phải */}
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
            type="text" // Đổi thành text để nhập username
            placeholder="Username"
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