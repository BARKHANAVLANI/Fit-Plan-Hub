import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './Landing.css';

const Landing = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get('/api/plans');
      setPlans(response.data);
    } catch (error) {
      console.error('Fetch plans error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="landing">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Transform Your Body, <span className="highlight">Transform Your Life</span>
            </h1>
            <p className="hero-subtitle">
              Discover personalized fitness plans from certified trainers. 
              Start your journey to a healthier you today.
            </p>
            {!isAuthenticated && (
              <div className="hero-cta">
                <Link to="/signup" className="btn btn-primary btn-lg">
                  Get Started
                </Link>
                <Link to="/login" className="btn btn-outline btn-lg">
                  Login
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="plans-section">
        <div className="container">
          <h2 className="section-title">Featured Fitness Plans</h2>
          {plans.length === 0 ? (
            <div className="empty-state">
              <p>No plans available yet. Be the first to create one!</p>
            </div>
          ) : (
            <div className="grid grid-3">
              {plans.map((plan) => (
                <PlanCard key={plan._id} plan={plan} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const PlanCard = ({ plan }) => {
  return (
    <Link to={`/plans/${plan._id}`} className="plan-card">
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
        <div className="plan-footer">
          <span className="plan-duration">{plan.duration} days</span>
        </div>
      </div>
    </Link>
  );
};

export default Landing;

