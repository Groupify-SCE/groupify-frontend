import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logoLight from '../assets/images/groupify-logo.png';
import '../styles/Navbar.style.css';
import DarkModeToggle from './DarkModeToggle';
import authService from '../services/auth.service';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkStatus = async () => {
      const response = await authService.status();
      if (response.status === 200) {
        setIsAuthenticated(true);
      }
    };

    checkStatus();
  }, [location.pathname]);

  const handleLogout = async () => {
    await authService.logout();
    setIsAuthenticated(false);
    navigate('/');
    toast.success('Logged Out Successfully');
  };

  return (
    <header className="navbar-section">
      <div className="navbar-left">
        <Link to="/" className="navbar-logo">
          <img src={logoLight} alt="Light Logo" className="navbar-logo-img" />
          <h1 className="navbar-logo-text">Groupify</h1>
        </Link>
      </div>

      <div className="navbar-actions">
        {!isAuthenticated ? (
          <>
            <Link to="/login" className="btn">
              Login
            </Link>
            <Link to="/signup" className="btn btn-primary">
              Sign Up
            </Link>
          </>
        ) : (
          <>
            <Link to="/profile" className="btn">
              Profile
            </Link>
            <button onClick={handleLogout} className="btn btn-primary">
              Logout
            </button>
          </>
        )}

        <DarkModeToggle />
      </div>
    </header>
  );
};

export default Navbar;
