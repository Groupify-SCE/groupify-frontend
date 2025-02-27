import React, { useState } from 'react';
import '../styles/AuthPage.style.css';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
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
