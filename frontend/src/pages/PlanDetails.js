import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './PlanDetails.css';

// Follow Button Component
const FollowButton = ({ trainerId }) => {
  const { isAuthenticated, isUser } = useAuth();
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (isAuthenticated && isUser) {
      checkFollowStatus();
    } else {
      setChecking(false);
    }
  }, [trainerId, isAuthenticated, isUser]);

  const checkFollowStatus = async () => {
    try {
      const response = await axios.get(`/api/follow/${trainerId}`);
      setIsFollowing(response.data.isFollowing || false);
    } catch (error) {
      setIsFollowing(false);
    } finally {
      setChecking(false);
    }
  };

  const handleFollow = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated || !isUser) {
      alert('Please login as a user to follow trainers');
      return;
    }

    setLoading(true);
    try {
      if (isFollowing) {
        await axios.delete(`/api/follow/${trainerId}`);
        setIsFollowing(false);
      } else {
        await axios.post(`/api/follow/${trainerId}`);
        setIsFollowing(true);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update follow status');
    } finally {
      setLoading(false);
    }
  };

  if (checking || !isUser) return null;

  return (
    <button
      onClick={handleFollow}
      className={`btn btn-sm ${isFollowing ? 'btn-outline' : 'btn-primary'}`}
      disabled={loading}
      style={{ marginLeft: 'auto' }}
    >
      {loading ? '...' : isFollowing ? '✓ Following' : '+ Follow'}
    </button>
  );
};

const PlanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isUser, user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    fetchPlan();
  }, [id, isSubscribed]);

  const fetchPlan = async () => {
    try {
      const response = await axios.get(`/api/plans/${id}`);
      setPlan(response.data);
      setIsSubscribed(response.data.isSubscribed || false);
    } catch (error) {
      console.error('Fetch plan error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!isUser) {
      alert('Only users can subscribe to plans');
      return;
    }

    setSubscribing(true);
    try {
      const response = await axios.post('/api/subscriptions', { planId: id });
      setIsSubscribed(true);
      
      // Refresh the plan data to show full content
      await fetchPlan();
      
      // Show success message
      const message = document.createElement('div');
      message.textContent = '✅ Successfully subscribed! You now have full access to this plan.';
      message.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #10b981; color: white; padding: 16px 24px; border-radius: 8px; z-index: 1000; box-shadow: 0 4px 6px rgba(0,0,0,0.1);';
      document.body.appendChild(message);
      setTimeout(() => message.remove(), 4000);
    } catch (error) {
      console.error('Subscribe error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to subscribe. Please try again.';
      alert(errorMessage);
    } finally {
      setSubscribing(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="container">
        <div className="error-state">
          <h2>Plan not found</h2>
          <Link to="/" className="btn btn-primary">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  const canViewContent = isSubscribed || (user && plan.trainer?._id === user.id);

  return (
    <div className="plan-details">
      <div className="container">
        <div className="plan-details-content">
          <div className="plan-header">
            {plan.image && (
              <div className="plan-image-large">
                <img src={plan.image} alt={plan.title} />
              </div>
            )}
            <div className="plan-info">
              <h1>{plan.title}</h1>
              <div className="plan-trainer-info">
                <Link to={`/trainers/${plan.trainer?._id}`} className="trainer-link">
                  <div className="trainer-avatar-large">
                    {plan.trainer?.avatar ? (
                      <img src={plan.trainer.avatar} alt={plan.trainer.name} />
                    ) : (
                      <span>👤</span>
                    )}
                  </div>
                  <div>
                    <div className="trainer-name">{plan.trainer?.name}</div>
                    <div className="trainer-bio">{plan.trainer?.bio || 'Certified Trainer'}</div>
                  </div>
                </Link>
                {isUser && plan.trainer?._id && (
                  <FollowButton trainerId={plan.trainer._id} />
                )}
              </div>
              <div className="plan-meta-large">
                <div className="meta-item">
                  <span className="meta-label">Price</span>
                  <span className="meta-value">${plan.price}</span>
                </div>
                <div className="meta-item">
                  <span className="meta-label">Duration</span>
                  <span className="meta-value">{plan.duration} days</span>
                </div>
              </div>
              {isSubscribed && (
                <span className="badge badge-success">Subscribed</span>
              )}
            </div>
          </div>

          <div className="plan-body">
            <section className="plan-section">
              <h2>Description</h2>
              <p>{plan.description}</p>
            </section>

            {canViewContent && plan.content ? (
              <section className="plan-section">
                <h2>Full Plan Content</h2>
                <div className="plan-content-full">
                  {plan.content.split('\n').map((line, index) => (
                    <p key={index}>{line}</p>
                  ))}
                </div>
              </section>
            ) : (
              <section className="plan-section locked-section">
                <h2>Full Plan Content</h2>
                <div className="locked-content">
                  <p>🔒 Subscribe to unlock the full plan content</p>
                  {!isAuthenticated ? (
                    <Link to="/login" className="btn btn-primary">
                      Login to Subscribe
                    </Link>
                  ) : !isUser ? (
                    <p className="text-muted">Only users can subscribe to plans</p>
                  ) : (
                    <button
                      onClick={handleSubscribe}
                      className="btn btn-primary"
                      disabled={subscribing}
                    >
                      {subscribing ? 'Processing...' : `Subscribe for $${plan.price}`}
                    </button>
                  )}
                </div>
              </section>
            )}

            {!canViewContent && isUser && (
              <div className="subscribe-cta">
                <button
                  onClick={handleSubscribe}
                  className="btn btn-primary btn-lg"
                  disabled={subscribing}
                >
                  {subscribing ? 'Processing...' : `Subscribe Now - $${plan.price}`}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanDetails;

