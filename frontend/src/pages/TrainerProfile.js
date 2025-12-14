import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './TrainerProfile.css';

const TrainerProfile = () => {
  const { id } = useParams();
  const { isAuthenticated, isUser } = useAuth();
  const [trainer, setTrainer] = useState(null);
  const [plans, setPlans] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    fetchTrainerProfile();
  }, [id, isAuthenticated]);

  const fetchTrainerProfile = async () => {
    try {
      const config = isAuthenticated
        ? { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
        : {};
      const response = await axios.get(`/api/trainers/${id}`, config);
      if (response.data && response.data.trainer) {
        setTrainer(response.data.trainer);
        setPlans(response.data.plans || []);
        setIsFollowing(response.data.isFollowing || false);
      } else {
        setTrainer(null);
      }
    } catch (error) {
      console.error('Fetch trainer profile error:', error);
      if (error.response?.status === 404) {
        setTrainer(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!isAuthenticated) {
      alert('Please login to follow trainers');
      return;
    }

    if (!isUser) {
      alert('Only users can follow trainers');
      return;
    }

    setFollowing(true);
    try {
      if (isFollowing) {
        await axios.delete(`/api/follow/${id}`);
        setIsFollowing(false);
        // Show success message
        const message = document.createElement('div');
        message.textContent = 'Unfollowed trainer successfully!';
        message.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; z-index: 1000;';
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 3000);
      } else {
        await axios.post(`/api/follow/${id}`);
        setIsFollowing(true);
        // Show success message
        const message = document.createElement('div');
        message.textContent = 'Following trainer! You\'ll see their plans in your feed.';
        message.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #10b981; color: white; padding: 12px 24px; border-radius: 8px; z-index: 1000;';
        document.body.appendChild(message);
        setTimeout(() => message.remove(), 3000);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update follow status');
    } finally {
      setFollowing(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="container">
        <div className="error-state">
          <h2>Trainer not found</h2>
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="trainer-profile">
      <div className="container">
        <div className="profile-header">
          <div className="profile-avatar-large">
            {trainer.avatar ? (
              <img src={trainer.avatar} alt={trainer.name} />
            ) : (
              <span>👤</span>
            )}
          </div>
          <div className="profile-info">
            <h1>{trainer.name}</h1>
            <p className="profile-bio">{trainer.bio || 'Certified Fitness Trainer'}</p>
            {isUser && (
              <button
                onClick={handleFollow}
                className={`btn ${isFollowing ? 'btn-outline' : 'btn-primary'}`}
                disabled={following}
              >
                {following
                  ? 'Processing...'
                  : isFollowing
                  ? '✓ Following'
                  : '+ Follow Trainer'}
              </button>
            )}
          </div>
        </div>

        <div className="profile-plans">
          <h2>Fitness Plans</h2>
          {plans.length === 0 ? (
            <div className="empty-state">
              <p>This trainer hasn't created any plans yet.</p>
            </div>
          ) : (
            <div className="grid grid-3">
              {plans.map((plan) => (
                <Link key={plan._id} to={`/plans/${plan._id}`} className="plan-card">
                  <div className="plan-image">
                    {plan.image ? (
                      <img src={plan.image} alt={plan.title} />
                    ) : (
                      <div className="plan-image-placeholder">💪</div>
                    )}
                  </div>
                  <div className="plan-content">
                    <h3 className="plan-title">{plan.title}</h3>
                    <p className="plan-description">{plan.description}</p>
                    <div className="plan-meta">
                      <span className="plan-price">${plan.price}</span>
                      <span className="plan-duration">{plan.duration} days</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrainerProfile;

