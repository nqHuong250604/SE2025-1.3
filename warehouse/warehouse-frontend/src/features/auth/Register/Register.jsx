import React from "react";
import logo from "../../../assets/icons/logo.svg";
import Saly from "../../../assets/icons/Saly-1.svg";
import { useNavigate } from "react-router-dom";
import "./Register.css";

const Register = () => {
  const navigate = useNavigate();

  const handleClickLogin = () => {
    navigate("/login");
  };

  return (
    <div className="register-container">
      {/* Bên trái */}
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

        <form>
          <label>Enter your email address</label>
          <input type="email" placeholder="Email address" required />

          <div className="register-row-inputs">
            <div className="register-row1">
              <label>User name</label>
              <input type="text" placeholder="User name" />
            </div>
            <div className="register-row2">
              <label>Phone Number</label>
              <input type="text" placeholder="Phone Number" />
            </div>
          </div>

          <label>Enter your Password</label>
          <input type="password" placeholder="Password" required />

          <button type="submit" onClick={handleClickLogin}>
            Sign up
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
