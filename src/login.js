// Login.js
import React from 'react';
import './Login.css'; // Create this CSS file

function Login() {
  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome</h2>
        <div className="login-logo">
          <span>A</span>
        </div>
        <form className="login-form">
          <input type="email" placeholder="Email" className="login-input" />
          <div className="password-container">
            <input type="password" placeholder="Password" className="login-input" />
            <span className="toggle-password">👁️</span>
          </div>
          <button type="submit" className="login-button">LOGIN</button>
        </form>
        <p className="signup-link">Don’t have an account? <a href="#">Sign Up</a></p>
      </div>
    </div>
  );
}

export default Login;
