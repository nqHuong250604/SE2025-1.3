import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/icons/logo.svg";
import Saly from "../../../assets/icons/Saly-1.svg";
import Google from "../../../assets/icons/google.svg";
import Facebook from "../../../assets/icons/Facebook.svg";
import Apple from "../../../assets/icons/apple.svg";
import "./Login.css";
import { loginAPI, getCurrentUserAPI, logout } from "../authServices";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    try {
      // 1. Đăng nhập để lấy và lưu Token
      await loginAPI(username, password);

      // 2. Lấy thông tin chi tiết user từ token vừa lưu
      const userData = await getCurrentUserAPI();
      
      // 3. Phân quyền dựa trên Role từ Database
      let redirectPath = "/user";
      if (userData.role === "admin") {
        redirectPath = "/admin";
      } else if (userData.role === "staff") {
        redirectPath = "/user"; 
      }

      navigate(redirectPath);
    } catch (error) {
      console.error("Login Error:", error);
      logout(); // Xóa token nếu lỗi
      setErrorMessage(error.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-left">
        <img 
          src={logo} 
          alt="logo" 
          className="logo-web" 
          onClick={() => navigate("/")} 
          style={{ cursor: 'pointer' }}
        />
        <div className="login-text">
          <h1>Sign in to</h1>
          <h2>Logistic is simply</h2>
          <p>
            Log in to manage, track, and optimize every step of your logistics
            process with ease. Our intelligent system empowers you to control
            shipments, monitor warehouse status, and streamline deliveries.
          </p>
        </div>
        <img src={Saly} alt="Login Illustration" />
      </div>

      <div className="login-right"></div>

      <div className="login-form">
        <div className="form-header">
          <h4 className="form-header-text">
            <span className="black">Welcome to</span>
            <span className="blue"> LOGISTIC</span>
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
            <div className="icon-box"><img src={Facebook} alt="Facebook" /></div>
            <div className="icon-box"><img src={Apple} alt="Apple" /></div>
          </div>
        </div>

        <form onSubmit={handleLogin}>
          {errorMessage && (
            <p style={{ color: "#ef4444", fontSize: "14px", marginBottom: "15px", fontWeight: "500" }}>
              {errorMessage}
            </p>
          )}

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

          <a href="/forgot_password" className="forgot-password">Forgot password</a>
          
          <button type="submit" disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;