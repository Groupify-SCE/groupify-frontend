import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import userService from '../services/user.service';
import { StatusCodes } from 'http-status-codes';
import '../styles/ProfilePage.style.css';

function ProfilePage() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const response = await userService.userInfo();
    const data = await response.json();
    if (response.status === StatusCodes.OK) {
      setUsername(data.response.username);
    } else {
      toast.error(data.response);
    }
  }

  return (
    <div className="profile-container">
      <h1 className="profile-header">Welcome Back {username}!</h1>
    </div>
  );
}

export default ProfilePage;
