import React from "react";
import logo from "../../../assets/icons/logo.svg";
import RocketMan from "../../../assets/icons/Saly-1.svg"; 
import "./ForgotPassword.css";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
    const navigate = useNavigate();

    const handleClickSignIn = () => {
        navigate("/login");
    }
  return (
    <div className="forgotpass-container">
      {/* Phần nền trên */}
      <div className="forgotpass-top">
        <div className="logo-top">
          <img
            src={logo}
            alt="Logo"
            className="logo-img"
          />
        </div>
        <img src={RocketMan} alt="Rocket Man" className="rocket-img" />
      </div>

      {/* Form bên phải */}
      <div className="forgotpass-form">
        <h4 className="welcome-text">
          Welcome to <span className="highlight">LOGISTIC</span>
        </h4>
        <div className="account-link">
          <span onClick={handleClickSignIn}>Have an Account?</span> <a href="/login">Sign in</a>
        </div>

        <h2 className="forgot-title">Forgot password</h2>

        <label>Enter your username or email address</label>
        <input type="text" placeholder="Username or email address" />

        <label>Enter your registered email address</label>
        <input type="email" placeholder="Email address" />

        <label>Enter the received OTP</label>
        <div className="otp-row">
          <input type="text" placeholder="OTP" />
          <button className="confirm-btn">Confirm</button>
        </div>

        <label>Enter your new password</label>
        <input type="password" placeholder="Password" />

        <label>Confirm new password</label>
        <input type="password" placeholder="Password" />

        <button className="reset-btn" onClick={handleClickSignIn}>Reset password</button>
      </div>
    </div>
  );
};

export default ForgotPassword;
