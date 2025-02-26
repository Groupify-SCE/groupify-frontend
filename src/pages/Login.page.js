import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/AuthPage.style.css';

function LoginPage() {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <section className="auth-section">
      <div className="auth-container">
        <h1 className="auth-title">Login To Your Account</h1>
        <p className="auth-subtitle">
          Login to your account using an identifier and a password.
        </p>
        {error && <p className="auth-error">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label htmlFor="identifier" className="auth-label">
              Email or Username
            </label>
            <input
              id="identifier"
              type="text"
              placeholder="Email or Username"
              required
              name="identifier"
              value={formData.identifier}
              onChange={handleChange}
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="password" className="auth-label">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary auth-submit-btn">
            Login
          </button>
        </form>

        <p className="auth-link-to-login">
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
}

export default LoginPage;
