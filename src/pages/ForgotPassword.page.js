import React, { useState } from 'react';
import '../styles/AuthPage.style.css';
import authService from '../services/auth.service';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.forgotPassword(email);
      if (response.status === 200) {
        toast.success('Password Reset Request Sent');
        navigate('/login');
      } else {
        toast.error('Error Requesting Password Reset');
        const data = await response.json();
        if (data.response) {
          setError(data.response);
        } else if (data.error) {
          setError('Enter a valid email address');
        }
      }
    } catch (error) {
      toast.error('Error Requesting Password Reset');
    }
  };

  return (
    <section className="auth-section forgot-password-section">
      <div className="auth-container">
        <h1 className="auth-title">Forgot Password</h1>
        <p className="auth-subtitle">
          Enter your email to reset your password.
        </p>
        {error && <p className="auth-error">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label htmlFor="email" className="auth-label">
              Email
            </label>
            <input
              id="email"
              type="text"
              placeholder="Email"
              required
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary auth-submit-btn">
            Request Reset Password
          </button>
        </form>
      </div>
    </section>
  );
};

export default ForgotPasswordPage;
