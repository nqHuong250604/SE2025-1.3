import React, { useState } from "react";
import logo from "../../../assets/icons/logo.svg";
import Saly from "../../../assets/icons/Saly-1.svg";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import { registerAPI } from "../authServices"; 

const Register = () => {
  const navigate = useNavigate();

  // 1. Khởi tạo state CHỈ VỚI email, username (full_name), và password
  const [formData, setFormData] = useState({
    email: "",
    username: "", 
    password: ""
  });

  const [error, setError] = useState(""); 

  const handleClickLogin = () => {
    navigate("/login");
  };

  // 2. Hàm xử lý khi người dùng nhập liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // 3. Hàm xử lý khi nhấn nút Sign up
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    setError(""); 

    try {
      await registerAPI(formData.email, formData.username, formData.password);
      
      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/login"); 
    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      setError(err.message || "Đã xảy ra lỗi không xác định."); 
    }
  };

  return (
    <div className="register-container">
      {/* Bên trái giữ nguyên */}
      <div className="register-left">
        <img src={logo} alt="logo" className="register-logo" onClick={handleClickLogin} />
        <div className="register-text">
          <h1>Sign Up to</h1>
          <h2>Logistic is simply</h2>
          <p>
            Log in to manage, track, and optimize every step of your logistics
            process with ease. Our intelligent system empowers you to control
            shipments, monitor warehouse status, and streamline deliveries—all
            in one place.
          </p>
        </div>
        <img src={Saly} alt="Illustration" />
      </div>

      {/* Bên phải */}
      <div className="register-right"></div>

      {/* Form */}
      <div className="register-form">
        <div className="register-form-header">
          <h4>
            <span className="black">Welcome to</span>
            <span className="blue">LOGISTIC</span>
          </h4>
          <div className="register-no-account">
            <p onClick={handleClickLogin}>Have an Account?</p>
            <a href="/login">Sign in</a>
          </div>
        </div>

        <h1>Sign up</h1>

        {/* Hiển thị lỗi nếu có */}
        {error && <p style={{ color: "red", marginBottom: "10px", textAlign: "center" }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <label>Enter your email address</label>
          <input 
            type="email" 
            name="email" 
            placeholder="Email address" 
            required 
            value={formData.email}
            onChange={handleChange}
          />

          {/* User Name (Full Name) */}
          <div className="register-row-inputs">
            <div className="register-row1" style={{ width: '100%' }}> 
              <label>User name</label>
              <input 
                type="text" 
                name="username" 
                placeholder="User name" 
                required
                value={formData.username}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <label>Enter your Password</label>
          <input 
            type="password" 
            name="password"
            placeholder="Password" 
            required 
            value={formData.password}
            onChange={handleChange}
          />

          <button type="submit">
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
