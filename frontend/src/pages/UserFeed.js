import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './UserFeed.css';

const UserFeed = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isUser } = useAuth();

  useEffect(() => {
    if (isUser) {
      fetchFeed();
    }
  }, [isUser]);

  const fetchFeed = async () => {
    try {
      const response = await axios.get('/api/feed');
      setPlans(response.data);
    } catch (error) {
      console.error('Fetch feed error:', error);
    } finally {
      setLoading(false);
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
    <div className="user-feed">
      <div className="container">
        <div className="feed-header">
          <h1>My Personalized Feed</h1>
          <p>Plans from trainers you follow</p>
        </div>

        {plans.length === 0 ? (
          <div className="empty-feed">
            <div className="empty-icon">📭</div>
            <h2>No plans yet</h2>
            <p>Start following trainers to see their plans in your feed!</p>
            <Link to="/" className="btn btn-primary">
              Browse All Plans
            </Link>
          </div>
        ) : (
          <div className="grid grid-3">
            {plans.map((plan) => (
              <FeedPlanCard key={plan._id} plan={plan} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FeedPlanCard = ({ plan }) => {
  return (
    <Link to={`/plans/${plan._id}`} className="feed-plan-card">
      {plan.isSubscribed && (
        <div className="subscribed-badge">
          <span className="badge badge-success">Subscribed</span>
        </div>
      )}
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
          <div className="plan-trainer">
            <span className="trainer-avatar">
              {plan.trainer?.avatar ? (
                <img src={plan.trainer.avatar} alt={plan.trainer.name} />
              ) : (
                <span>👤</span>
              )}
            </span>
            <span>{plan.trainer?.name}</span>
          </div>
          <div className="plan-price">${plan.price}</div>
        </div>
      </div>
    </Link>
  );
};

export default UserFeed;

