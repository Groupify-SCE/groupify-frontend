import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  return (
    <section className="auth-section forgot-password-section">
      <div className="auth-container">
        <h1 className="auth-title">Reset Password</h1>
        <p className="auth-subtitle">Enter your new password.</p>
        {error && <p className="auth-error">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-form-group">
            <label htmlFor="password" className="auth-label">
              New Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              required
              pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$"
              title="Password must be at least 8 characters long and include at least one letter, one digit, and one special character."
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="auth-form-group">
            <label htmlFor="confirm-password" className="auth-label">
              Confirm New Password
            </label>
            <input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              required
              name="passwordConfirmation"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary auth-submit-btn">
            Change Password
          </button>
        </form>
      </div>
    </section>
  );
};

export default ResetPasswordPage;
