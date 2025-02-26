import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import logoLight from '../assets/images/groupify-logo.png';
import '../styles/Navbar.style.css';
import DarkModeToggle from './DarkModeToggle';
import authService from '../services/auth.service';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const response = await authService.status();
      if (response.status === 200) {
        setIsAuthenticated(true);
      }
    };

    checkStatus();
  }, []);

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
          <Link to="/profile" className="btn">
            Profile
          </Link>
        )}

        <DarkModeToggle />
      </div>
    </header>
  );
};

export default Navbar;
