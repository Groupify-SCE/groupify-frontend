import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import userService from '../services/user.service';
import { StatusCodes } from 'http-status-codes';
import '../styles/ProfilePage.style.css';

function ProfilePage() {
  const [username, setUsername] = useState('');
  const [initialData, setInitialData] = useState(null);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchData() {
    const response = await userService.userInfo();
    const data = await response.json();
    if (response.status === StatusCodes.OK) {
      setUsername(data.response.username);
      const fetchedData = {
        username: data.response.username,
        firstName: data.response.firstName,
        lastName: data.response.lastName,
        email: data.response.email,
      };
      setInitialData(fetchedData);
      setFormData((prev) => ({
        ...prev,
        ...fetchedData,
      }));
    } else {
      toast.error(data.response);
    }
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // יצירת גרסאות trimmed לשמות
    const trimmedFirstName = formData.firstName
      ? formData.firstName.trim()
      : '';
    const trimmedLastName = formData.lastName ? formData.lastName.trim() : '';

    // בדיקה: השמות לא צריכים להכיל מספרים או תווים מיוחדים (רק אותיות ורווחים)
    if (/[^A-Za-zא-ת\s]/.test(trimmedFirstName)) {
      setError(
        'First name is not valid (should contain only letters and spaces)'
      );
      return;
    }
    if (/[^A-Za-zא-ת\s]/.test(trimmedLastName)) {
      setError(
        'Last name is not valid (should contain only letters and spaces)'
      );
      return;
    }

    // יצירת משתנים trimmed לסיסמה ולאישור
    const trimmedPassword = formData.password ? formData.password.trim() : '';
    const trimmedPasswordConfirmation = formData.passwordConfirmation
      ? formData.passwordConfirmation.trim()
      : '';

    // בדיקת התאמה בפרונט (אופציונלי, אך מומלץ לחוויית משתמש)
    if (trimmedPassword && trimmedPassword !== trimmedPasswordConfirmation) {
      setError('Passwords do not match');
      return;
    }

    setError('');

    // בניית האובייקט לעדכון: השוואה בין formData ל-initialData
    let updateData = {};
    if (initialData) {
      Object.keys(initialData).forEach((key) => {
        if (formData[key] !== initialData[key]) {
          updateData[key] = formData[key];
        }
      });
    }

    // אם סיסמה הוזנה – נוסיף גם אותה וגם את ה־passwordConfirmation כך שהשרת יקבל את שניהם
    if (trimmedPassword) {
      updateData.password = trimmedPassword;
      updateData.passwordConfirmation = trimmedPasswordConfirmation;
    }

    // אם לא שונה כלום, להודיע למשתמש
    if (Object.keys(updateData).length === 0) {
      toast.info('No changes to update');
      return;
    }

    try {
      const response = await userService.editUser(updateData);
      const data = await response.json();
      if (response.status === StatusCodes.OK) {
        toast.success('User updated successfully!');
        fetchData(); // רענון הנתונים מהשרת
      } else {
        toast.error(data.response);
      }
    } catch (error) {
      console.error('Error updating user info:', error);
      toast.error('Update failed');
    }
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
              disabled
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
