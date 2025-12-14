const express = require('express');
const User = require('../models/User');
const Plan = require('../models/Plan');
const Follow = require('../models/Follow');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/trainers
// @desc    Get all trainers
// @access  Public
router.get('/', async (req, res) => {
  try {
    const trainers = await User.find({ role: 'trainer' })
      .select('name email bio avatar createdAt')
      .sort({ createdAt: -1 });

    res.json(trainers);
  } catch (error) {
    console.error('Get trainers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/trainers/:id
// @desc    Get trainer profile
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    // Validate ObjectId format
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid trainer ID format' });
    }

    const trainer = await User.findById(req.params.id)
      .select('name email bio avatar createdAt role');

    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    if (trainer.role !== 'trainer') {
      return res.status(404).json({ message: 'Trainer not found' });
    }

    // Get trainer's plans
    const plans = await Plan.find({ trainer: trainer._id })
      .sort({ createdAt: -1 });

    // Check if current user is following (if authenticated)
    let isFollowing = false;
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.split(' ')[1];
        if (token && process.env.JWT_SECRET) {
          const jwt = require('jsonwebtoken');
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          const follow = await Follow.findOne({
            follower: decoded.userId,
            trainer: trainer._id
          });
          isFollowing = !!follow;
        }
      } catch (error) {
        // Not authenticated or invalid token, ignore
      }
    }

    res.json({
      trainer,
      plans,
      isFollowing
    });
  } catch (error) {
    console.error('Get trainer profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

