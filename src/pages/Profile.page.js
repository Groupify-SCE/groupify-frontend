import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import userService from '../services/user.service';
import { StatusCodes } from 'http-status-codes';
import '../styles/ProfilePage.style.css';

function ProfilePage() {
  const [username, setUsername] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const response = await userService.userInfo();
    const data = await response.json();
    if (response.status === StatusCodes.OK) {
      setUsername(data.response.username);
      setFormData({
        ...formData,
        username: data.response.username,
        email: data.response.email,
        firstName: data.response.firstName,
        lastName: data.response.lastName,
      });
    } else {
      toast.error(data.response);
    }
  }

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
    console.log('Form submitted:', formData);
    setError('');
  };

  return (
    <div className="profile-container">
      <h1 className="profile-header">Welcome Back, {username}!</h1>

      {error && <p className="profile-error">{error}</p>}

      <form className="profile-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              name="username"
              placeholder="Your username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              placeholder="Your first name"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              placeholder="Your last name"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="••••••••"
              pattern="^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$"
              title="Password must be at least 8 characters long and include at least one letter, one digit, and one special character."
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="passwordConfirmation">Confirm New Password</label>
            <input
              id="passwordConfirmation"
              type="password"
              name="passwordConfirmation"
              placeholder="••••••••"
              value={formData.passwordConfirmation}
              onChange={handleChange}
            />
          </div>
        </div>

        <button type="submit" className="update-button">
          Update Info
        </button>
      </form>
    </div>
  );
}

export default ProfilePage;
