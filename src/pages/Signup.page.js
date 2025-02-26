import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/SignupPage.style.css';

function SignupPage() {
  return (
    <section className="auth-section">
      <div className="auth-container">
        <h1 className="auth-title">Create Your Account</h1>
        <p className="auth-subtitle">
          Join us and create your own Groupify projects on our unique platform.
        </p>

        <form className="auth-form">
          <div className="auth-form-group">
            <label htmlFor="username" className="auth-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Your username"
              required
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="first-name" className="auth-label">
              First Name
            </label>
            <input
              id="first-name"
              type="text"
              placeholder="Your first name"
              required
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="last-name" className="auth-label">
              Last Name
            </label>
            <input
              id="last-name"
              type="text"
              placeholder="Your last name"
              required
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="email" className="auth-label">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              required
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
              pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$"
              title="Password must be at least 8 characters long and include at least one letter, one digit, and one special character."
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="confirm-password" className="auth-label">
              Confirm Password
            </label>
            <input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary auth-submit-btn">
            Sign Up
          </button>
        </form>

        <p className="auth-link-to-login">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}

export default SignupPage;
