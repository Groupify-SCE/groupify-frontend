import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.style.css';
import logo from '../assets/images/groupify-logo.png';

const Navbar = () => {
  const isAuthenticated = false;

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="logo">
            <img src={logo} alt="Groupify Logo" className="logo-image" />
          </Link>
          <div className="nav-buttons">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="btn">
                  Login
                </Link>
                <Link to="/signup" className="btn">
                  Sign Up
                </Link>
              </>
            ) : (
              <Link to="/profile" className="btn">
                Profile
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
