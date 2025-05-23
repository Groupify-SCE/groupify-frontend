import React, { useEffect } from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/Landing.page';
import LoginPage from './pages/Login.page';
import SignupPage from './pages/Signup.page';
import NavBar from './components/NavBar';
import ProfilePage from './pages/Profile.page';
import ForgotPasswordPage from './pages/ForgotPassword.page';
import ResetPasswordPage from './pages/ResetPassword.page';
import ProjectPage from './pages/Project.page';
import ProjectManagementPage from './pages/ProjectManagement.page';
import GroupsPage from './pages/Groups.page';
import { ToastContainer } from 'react-toastify';
import './styles/Alert.style.css';

function App() {
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <Router>
      <NavBar />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/projects" element={<ProjectPage />} />
        <Route
          path="/project-management/:id"
          element={<ProjectManagementPage />}
        />
        <Route path="/groups/:id" element={<GroupsPage />} />
      </Routes>
    </Router>
  );
}

export default App;
