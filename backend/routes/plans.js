const express = require('express');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');
const User = require('../models/User');
const { authenticate, isTrainer } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/plans
// @desc    Get all plans (preview for non-subscribed users)
// @access  Public
router.get('/', async (req, res) => {
  try {
    const plans = await Plan.find()
      .populate('trainer', 'name email bio avatar')
      .sort({ createdAt: -1 });

    res.json(plans);
  } catch (error) {
    console.error('Get plans error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/plans/:id
// @desc    Get plan by ID (full details if subscribed)
// @access  Public (authenticated users see full details if subscribed)
router.get('/:id', async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id)
      .populate('trainer', 'name email bio avatar');

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // If not authenticated, return preview only
    if (!req.headers.authorization) {
      return res.json({
        ...plan.toObject(),
        content: undefined, // Hide full content
        isSubscribed: false
      });
    }

    // Try to authenticate (optional)
    try {
      if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET not configured');
      }
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (user) {
        // Check if user is subscribed
        const subscription = await Subscription.findOne({
          user: user._id,
          plan: plan._id,
          status: 'active'
        });

        // If user is not subscribed and not the trainer, return preview only
        if (!subscription && plan.trainer._id.toString() !== user._id.toString()) {
          return res.json({
            ...plan.toObject(),
            content: undefined, // Hide full content
            isSubscribed: false
          });
        }

        return res.json({
          ...plan.toObject(),
          isSubscribed: !!subscription
        });
      }
    } catch (authError) {
      // Invalid token, return preview
    }

    // Default: return preview
    res.json({
      ...plan.toObject(),
      content: undefined,
      isSubscribed: false
    });
  } catch (error) {
    console.error('Get plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/plans
// @desc    Create a new plan
// @access  Private (Trainer only)
router.post('/', authenticate, isTrainer, [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('duration').isInt({ min: 1 }).withMessage('Duration must be at least 1 day'),
  body('content').optional()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, price, duration, content, image } = req.body;

    const plan = new Plan({
      title,
      description,
      price,
      duration,
      content: content || '',
      image: image || '',
      trainer: req.user._id
    });

    await plan.save();
    await plan.populate('trainer', 'name email bio avatar');

    res.status(201).json(plan);
  } catch (error) {
    console.error('Create plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/plans/:id
// @desc    Update a plan
// @access  Private (Trainer only, own plans)
router.put('/:id', authenticate, isTrainer, [
  body('title').optional().trim().notEmpty(),
  body('description').optional().trim().notEmpty(),
  body('price').optional().isFloat({ min: 0 }),
  body('duration').optional().isInt({ min: 1 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Check ownership
    if (plan.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this plan' });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        plan[key] = req.body[key];
      }
    });

    await plan.save();
    await plan.populate('trainer', 'name email bio avatar');

    res.json(plan);
  } catch (error) {
    console.error('Update plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/plans/:id
// @desc    Delete a plan
// @access  Private (Trainer only, own plans)
router.delete('/:id', authenticate, isTrainer, async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Check ownership
    if (plan.trainer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this plan' });
    }

    await Plan.findByIdAndDelete(req.params.id);
    res.json({ message: 'Plan deleted successfully' });
  } catch (error) {
    console.error('Delete plan error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/plans/trainer/my-plans
// @desc    Get trainer's own plans
// @access  Private (Trainer only)
router.get('/trainer/my-plans', authenticate, isTrainer, async (req, res) => {
  try {
    const plans = await Plan.find({ trainer: req.user._id })
      .populate('trainer', 'name email bio avatar')
      .sort({ createdAt: -1 });

    res.json(plans);
  } catch (error) {
    console.error('Get trainer plans error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

