import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useSearchParams, useNavigate } from 'react-router-dom';
import authService from '../services/auth.service';

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      setError('Passwords do not match');
      return;
    }
    try {
      const response = await authService.resetPassword(
        token,
        password,
        passwordConfirmation
      );
      if (response.status === 200) {
        toast.success('Password reset successful');
        navigate('/login');
      } else {
        toast.error('Error Resetting Password');
        setError(response.response);
      }
    } catch (error) {
      toast.error('Error Resetting Password');
    }
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
