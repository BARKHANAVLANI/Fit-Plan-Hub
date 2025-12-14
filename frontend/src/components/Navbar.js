import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="navbar-brand">
            <span className="brand-icon">💪</span>
            FitPlanHub
          </Link>

          <div className="navbar-links">
            {isAuthenticated ? (
              <>
                {user?.role === 'user' && (
                  <>
                    <Link to="/feed">My Feed</Link>
                    <Link to="/subscriptions">My Plans</Link>
                    <Link to="/followed-trainers">Followed Trainers</Link>
                  </>
                )}
                {user?.role === 'trainer' && (
                  <Link to="/trainer/dashboard">Dashboard</Link>
                )}
                <div className="navbar-user">
                  <span className="user-name">{user?.name}</span>
                  <button onClick={handleLogout} className="btn btn-outline btn-sm">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm">
                  Login
                </Link>
                <Link to="/signup" className="btn btn-primary btn-sm">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

