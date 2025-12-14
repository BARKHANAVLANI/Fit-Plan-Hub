const express = require('express');
const Subscription = require('../models/Subscription');
const Plan = require('../models/Plan');
const { authenticate, isUser } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/subscriptions
// @desc    Subscribe to a plan (simulate payment)
// @access  Private (User only)
router.post('/', authenticate, isUser, async (req, res) => {
  try {
    const { planId } = req.body;

    if (!planId) {
      return res.status(400).json({ message: 'Plan ID is required' });
    }

    // Check if plan exists
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Check if already subscribed
    const existingSubscription = await Subscription.findOne({
      user: req.user._id,
      plan: planId
    });

    if (existingSubscription && existingSubscription.status === 'active') {
      return res.status(400).json({ message: 'Already subscribed to this plan' });
    }

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + plan.duration);

    // Simulate payment success - create subscription
    const subscription = new Subscription({
      user: req.user._id,
      plan: planId,
      status: 'active',
      expiresAt: expiresAt
    });

    await subscription.save();
    await subscription.populate({
      path: 'plan',
      select: 'title description price duration image',
      populate: { path: 'trainer', select: 'name email bio avatar' }
    });
    await subscription.populate('user', 'name email');

    res.status(201).json({
      message: 'Subscription successful',
      subscription
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already subscribed to this plan' });
    }
    console.error('Subscribe error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({ 
      message: error.message || 'Server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @route   GET /api/subscriptions
// @desc    Get user's subscriptions
// @access  Private (User only)
router.get('/', authenticate, isUser, async (req, res) => {
  try {
    const subscriptions = await Subscription.find({ user: req.user._id })
      .populate({
        path: 'plan',
        select: 'title description price duration image trainer',
        populate: { path: 'trainer', select: 'name email bio avatar' }
      })
      .sort({ createdAt: -1 });

    // Filter out subscriptions where plan was deleted
    const validSubscriptions = subscriptions.filter(sub => sub.plan !== null);

    res.json(validSubscriptions);
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/subscriptions/:planId
// @desc    Check if user is subscribed to a plan
// @access  Private
router.get('/:planId', authenticate, async (req, res) => {
  try {
    const subscription = await Subscription.findOne({
      user: req.user._id,
      plan: req.params.planId,
      status: 'active'
    });

    res.json({ isSubscribed: !!subscription });
  } catch (error) {
    console.error('Check subscription error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

