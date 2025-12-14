import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './TrainerDashboard.css';

const TrainerDashboard = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const { isTrainer } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isTrainer) {
      navigate('/');
      return;
    }
    fetchPlans();
  }, [isTrainer, navigate]);

  const fetchPlans = async () => {
    try {
      const response = await axios.get('/api/plans/trainer/my-plans');
      setPlans(response.data);
    } catch (error) {
      console.error('Fetch plans error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) {
      return;
    }

    try {
      await axios.delete(`/api/plans/${planId}`);
      fetchPlans();
    } catch (error) {
      alert('Failed to delete plan');
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
    <div className="trainer-dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>My Fitness Plans</h1>
          <button
            onClick={() => {
              setEditingPlan(null);
              setShowForm(true);
            }}
            className="btn btn-primary"
          >
            + Create New Plan
          </button>
        </div>

        {showForm && (
          <PlanForm
            plan={editingPlan}
            onClose={() => {
              setShowForm(false);
              setEditingPlan(null);
            }}
            onSuccess={() => {
              setShowForm(false);
              setEditingPlan(null);
              fetchPlans();
            }}
          />
        )}

        {plans.length === 0 ? (
          <div className="empty-state">
            <p>You haven't created any plans yet. Create your first plan!</p>
          </div>
        ) : (
          <div className="grid grid-3">
            {plans.map((plan) => (
              <div key={plan._id} className="plan-card-admin">
                <div className="plan-card-header">
                  <h3>{plan.title}</h3>
                  <div className="plan-actions">
                    <button
                      onClick={() => {
                        setEditingPlan(plan);
                        setShowForm(true);
                      }}
                      className="btn-icon"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(plan._id)}
                      className="btn-icon btn-danger"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <p className="plan-description">{plan.description}</p>
                <div className="plan-stats">
                  <span>${plan.price}</span>
                  <span>{plan.duration} days</span>
                </div>
                <a
                  href={`/plans/${plan._id}`}
                  className="btn btn-outline btn-sm"
                  style={{ marginTop: '12px', display: 'inline-block' }}
                >
                  View Plan
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const PlanForm = ({ plan, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    title: plan?.title || '',
    description: plan?.description || '',
    price: plan?.price || '',
    duration: plan?.duration || '',
    content: plan?.content || '',
    image: plan?.image || ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (plan) {
        await axios.put(`/api/plans/${plan._id}`, formData);
      } else {
        await axios.post('/api/plans', formData);
      }
      onSuccess();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{plan ? 'Edit Plan' : 'Create New Plan'}</h2>
          <button onClick={onClose} className="btn-close">×</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="plan-form">
          <div className="input-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="input-group">
              <label>Price ($)</label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
              />
            </div>

            <div className="input-group">
              <label>Duration (days)</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                required
                min="1"
              />
            </div>
          </div>

          <div className="input-group">
            <label>Full Content (visible to subscribers)</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="6"
            />
          </div>

          <div className="input-group">
            <label>Image URL (optional)</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : plan ? 'Update Plan' : 'Create Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TrainerDashboard;

