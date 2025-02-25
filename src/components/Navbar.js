import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logoLight from '../assets/images/groupify-logo.png';
import '../styles/Navbar.style.css';
import DarkModeToggle from './DarkModeToggle';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

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
