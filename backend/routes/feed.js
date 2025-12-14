const express = require('express');
const Follow = require('../models/Follow');
const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');
const { authenticate, isUser } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/feed
// @desc    Get personalized feed (plans from followed trainers)
// @access  Private (User only)
router.get('/', authenticate, isUser, async (req, res) => {
  try {
    // Get list of followed trainers
    const follows = await Follow.find({ follower: req.user._id });
    const trainerIds = follows.map(f => f.trainer);

    if (trainerIds.length === 0) {
      return res.json([]);
    }

    // Get plans from followed trainers
    const plans = await Plan.find({ trainer: { $in: trainerIds } })
      .populate('trainer', 'name email bio avatar')
      .sort({ createdAt: -1 });

    // Check which plans user has subscribed to
    const planIds = plans.map(p => p._id);
    const subscriptions = await Subscription.find({
      user: req.user._id,
      plan: { $in: planIds },
      status: 'active'
    });

    const subscribedPlanIds = new Set(
      subscriptions.map(s => s.plan.toString())
    );

    // Add isSubscribed flag to each plan
    const plansWithSubscription = plans.map(plan => ({
      ...plan.toObject(),
      isSubscribed: subscribedPlanIds.has(plan._id.toString())
    }));

    res.json(plansWithSubscription);
  } catch (error) {
    console.error('Get feed error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

