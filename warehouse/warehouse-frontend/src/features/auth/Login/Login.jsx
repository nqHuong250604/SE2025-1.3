import React from "react";
import logo from "../../../assets/icons/logo.svg"
import Saly from "../../../assets/icons/Saly-1.svg";
import Google from "../../../assets/icons/google.svg";
import Facebook from "../../../assets/icons/Facebook.svg";
import Apple from "../../../assets/icons/apple.svg";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  }

  return (
    <div className="login-container">
      {/* Bên trái */}
      <div className="login-left">
        <img src={logo} alt="logo" className="logo-web" onClick={handleClick}/>
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

        <form>
          <label>Enter your user name or email address</label>
          <input
            type="email"
            placeholder="Username or email address"
            required
          />
          <label>Enter your password</label>
          <input type="password" placeholder="Enter your password" required />
          <a href="/forgot_password" className="forgot-password">Forgot password</a>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
