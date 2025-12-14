import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './MySubscriptions.css';

const MySubscriptions = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isUser } = useAuth();

  useEffect(() => {
    if (isUser) {
      fetchSubscriptions();
    }
  }, [isUser]);

  const fetchSubscriptions = async () => {
    try {
      const response = await axios.get('/api/subscriptions');
      // Filter out any subscriptions with missing plans
      const validSubscriptions = response.data.filter(sub => sub.plan);
      setSubscriptions(validSubscriptions);
    } catch (error) {
      console.error('Fetch subscriptions error:', error);
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
    <div className="my-subscriptions">
      <div className="container">
        <div className="subscriptions-header">
          <h1>My Subscribed Plans</h1>
          <p>All the fitness plans you've subscribed to</p>
        </div>

        {subscriptions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h2>No subscriptions yet</h2>
            <p>Start exploring and subscribe to fitness plans!</p>
            <Link to="/" className="btn btn-primary">
              Browse Plans
            </Link>
          </div>
        ) : (
          <div className="subscriptions-grid">
            {subscriptions.map((subscription) => (
              <SubscriptionCard key={subscription._id} subscription={subscription} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const SubscriptionCard = ({ subscription }) => {
  if (!subscription.plan) {
    return null; // Handle case where plan might be deleted
  }
  
  const plan = subscription.plan;
  const expiresAt = subscription.expiresAt ? new Date(subscription.expiresAt) : new Date();
  const isExpired = expiresAt < new Date();

  return (
    <div className="subscription-card">
      <Link to={`/plans/${plan._id}`} className="subscription-link">
        <div className="subscription-image">
          {plan.image ? (
            <img src={plan.image} alt={plan.title} />
          ) : (
            <div className="subscription-image-placeholder">💪</div>
          )}
        </div>
        <div className="subscription-content">
          <div className="subscription-header">
            <h3>{plan.title}</h3>
            <span className={`badge ${isExpired ? 'badge-danger' : 'badge-success'}`}>
              {isExpired ? 'Expired' : 'Active'}
            </span>
          </div>
          <p className="subscription-description">{plan.description}</p>
          <div className="subscription-trainer">
            <span className="trainer-avatar">
              {plan.trainer?.avatar ? (
                <img src={plan.trainer.avatar} alt={plan.trainer.name} />
              ) : (
                <span>👤</span>
              )}
            </span>
            <span>{plan.trainer?.name}</span>
          </div>
          <div className="subscription-meta">
            <div className="meta-item">
              <span className="meta-label">Duration</span>
              <span className="meta-value">{plan.duration} days</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Expires</span>
              <span className="meta-value">
                {expiresAt.toLocaleDateString()}
              </span>
            </div>
          </div>
          <div className="subscription-actions">
            <span className="btn btn-primary btn-sm">View Plan</span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MySubscriptions;

