import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logoLight from '../assets/images/groupify-logo.png';
import '../styles/Navbar.style.css';
import DarkModeToggle from './DarkModeToggle';
import authService from '../services/auth.service';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      {/* Top Bar (Desktop Layout) */}
      <header className="navbar-section" data-testid="navBarWrapper">
        {/* Left: Logo */}
        <div className="navbar-left">
          <Link to="/" className="navbar-logo" data-testid="landingNavButton">
            <img src={logoLight} alt="Light Logo" className="navbar-logo-img" />
            <h1 className="navbar-logo-text">Groupify</h1>
          </Link>
        </div>

        {/* Right: Action Buttons (Hidden on mobile) */}
        <div className="navbar-actions">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn" data-testid="loginNavButton">
                Login
              </Link>
              <Link
                to="/signup"
                className="btn btn-primary"
                data-testid="signupNavButton"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                className="btn"
                data-testid="profileNavButton"
              >
                Profile
              </Link>
              <Link
                to="/projects"
                className="btn"
                data-testid="projectsNavButton"
              >
                Projects
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-primary"
                data-testid="logoutNavButton"
              >
                Logout
              </button>
            </>
          )}
          <DarkModeToggle />
        </div>

        {/* Hamburger Icon (Shows on mobile) */}
        {!isSidebarOpen && (
          <div className="mobile-menu-icon" onClick={toggleSidebar}>
            <div className="mobile-bar"></div>
            <div className="mobile-bar"></div>
            <div className="mobile-bar"></div>
          </div>
        )}
      </header>

      {/* Mobile Sidebar */}
      <div className={`mobile-sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="mobile-sidebar-header">
          <button className="mobile-close-btn" onClick={toggleSidebar}>
            &times;
          </button>
        </div>
        <ul className="mobile-sidebar-nav">
          {!isAuthenticated ? (
            <>
              <li
                onClick={() => {
                  toggleSidebar();
                  navigate('/login');
                }}
              >
                Login
              </li>
              <li
                onClick={() => {
                  toggleSidebar();
                  navigate('/signup');
                }}
              >
                Sign Up
              </li>
            </>
          ) : (
            <>
              <li
                onClick={() => {
                  toggleSidebar();
                  navigate('/profile');
                }}
              >
                Profile
              </li>
              <li
                onClick={() => {
                  toggleSidebar();
                  navigate('/projects');
                }}
              >
                Projects
              </li>
              <li onClick={handleLogout}>Logout</li>
            </>
          )}
          <li>
            <DarkModeToggle />
          </li>
        </ul>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="mobile-sidebar-overlay" onClick={toggleSidebar}></div>
      )}
    </>
  );
};

export default Navbar;
