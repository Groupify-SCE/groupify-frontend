import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/AuthPage.style.css';
import authService from '../services/auth.service';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

function LoginPage() {
  const [formData, setFormData] = useState({
    identifier: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authService.login(formData);
      if (response.status === StatusCodes.OK) {
        navigate('/profile');
        toast.success('Login Successful');
      } else {
        toast.error('Invalid Login Credentials');
        const responseData = await response.json();
        setError(responseData.response);
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-section">
      {loading && <LoadingSpinner text="Logging in..." />}
      <div className={`auth-container ${loading ? 'auth-loading' : ''}`}>
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
              className="auth-input"
              disabled={loading}
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
              className="auth-input"
              disabled={loading}
            />
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-link-to-login">
          Forgot your password?{' '}
          <Link to="/forgot-password" className="auth-link">
            Reset Password
          </Link>
        </p>
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
