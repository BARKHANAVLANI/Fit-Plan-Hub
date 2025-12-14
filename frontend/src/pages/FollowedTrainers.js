import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './FollowedTrainers.css';

const FollowedTrainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isUser } = useAuth();

  useEffect(() => {
    if (isUser) {
      fetchFollowedTrainers();
    }
  }, [isUser]);

  const fetchFollowedTrainers = async () => {
    try {
      const response = await axios.get('/api/follow');
      setTrainers(response.data);
    } catch (error) {
      console.error('Fetch followed trainers error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnfollow = async (trainerId) => {
    if (!window.confirm('Are you sure you want to unfollow this trainer?')) {
      return;
    }

    try {
      await axios.delete(`/api/follow/${trainerId}`);
      fetchFollowedTrainers();
    } catch (error) {
      alert('Failed to unfollow trainer');
    }
  };

  if (!isUser) {
    return (
      <div className="container">
        <div className="error-state">
          <h2>Access Denied</h2>
          <p>This page is only available for users.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="followed-trainers">
      <div className="container">
        <div className="page-header">
          <h1>My Followed Trainers</h1>
          <p>Trainers you're following - see their latest plans in your feed!</p>
        </div>

        {trainers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h2>No trainers followed yet</h2>
            <p>Start following trainers to see their plans in your personalized feed!</p>
            <Link to="/" className="btn btn-primary">
              Browse Trainers
            </Link>
          </div>
        ) : (
          <div className="trainers-grid">
            {trainers.map((trainer) => (
              <div key={trainer._id} className="trainer-card">
                <Link to={`/trainers/${trainer._id}`} className="trainer-card-link">
                  <div className="trainer-avatar">
                    {trainer.avatar ? (
                      <img src={trainer.avatar} alt={trainer.name} />
                    ) : (
                      <span>👤</span>
                    )}
                  </div>
                  <div className="trainer-info">
                    <h3>{trainer.name}</h3>
                    <p className="trainer-bio">{trainer.bio || 'Certified Fitness Trainer'}</p>
                    <p className="trainer-email">{trainer.email}</p>
                  </div>
                </Link>
                <div className="trainer-actions">
                  <Link to={`/trainers/${trainer._id}`} className="btn btn-outline btn-sm">
                    View Profile
                  </Link>
                  <button
                    onClick={() => handleUnfollow(trainer._id)}
                    className="btn btn-outline btn-sm btn-danger"
                  >
                    Unfollow
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FollowedTrainers;

