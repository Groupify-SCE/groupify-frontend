import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/SignupPage.style.css';
import authService from '../services/auth.service';
import { StatusCodes } from 'http-status-codes';
function SignupPage() {
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }
    const response = await authService.register(formData);
    if (response.status === StatusCodes.CREATED) {
      alert('User registered successfully');
      navigate('/login');
    } else {
      const responseData = await response.json();
      setError(responseData.response);
    }
  };

  return (
    <section className="auth-section">
      <div className="auth-container">
        <h1 className="auth-title">Create Your Account</h1>
        <p className="auth-subtitle">
          Join us and create your own Groupify projects on our unique platform.
        </p>
        {error && <p className="auth-error">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label htmlFor="username" className="auth-label">
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Your username"
              required
              name="username"
              value={formData.username}
              onChange={handleChange}
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
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
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
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
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
              name="email"
              value={formData.email}
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
              pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$"
              title="Password must be at least 8 characters long and include at least one letter, one digit, and one special character."
              name="password"
              value={formData.password}
              onChange={handleChange}
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
              name="passwordConfirmation"
              value={formData.passwordConfirmation}
              onChange={handleChange}
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
