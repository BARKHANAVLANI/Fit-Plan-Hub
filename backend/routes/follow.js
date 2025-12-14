const express = require('express');
const Follow = require('../models/Follow');
const User = require('../models/User');
const { authenticate, isUser } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/follow/:trainerId
// @desc    Follow a trainer
// @access  Private (User only)
router.post('/:trainerId', authenticate, isUser, async (req, res) => {
  try {
    const trainerId = req.params.trainerId;

    // Check if trainer exists and is a trainer
    const trainer = await User.findById(trainerId);
    if (!trainer) {
      return res.status(404).json({ message: 'Trainer not found' });
    }
    if (trainer.role !== 'trainer') {
      return res.status(400).json({ message: 'User is not a trainer' });
    }

    // Check if already following
    const existingFollow = await Follow.findOne({
      follower: req.user._id,
      trainer: trainerId
    });

    if (existingFollow) {
      return res.status(400).json({ message: 'Already following this trainer' });
    }

    // Create follow
    const follow = new Follow({
      follower: req.user._id,
      trainer: trainerId
    });

    await follow.save();
    await follow.populate('trainer', 'name email bio avatar');

    res.status(201).json({
      message: 'Successfully followed trainer',
      follow
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Already following this trainer' });
    }
    if (error.status === 400) {
      return res.status(400).json({ message: error.message });
    }
    console.error('Follow error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/follow/:trainerId
// @desc    Unfollow a trainer
// @access  Private (User only)
router.delete('/:trainerId', authenticate, isUser, async (req, res) => {
  try {
    const follow = await Follow.findOneAndDelete({
      follower: req.user._id,
      trainer: req.params.trainerId
    });

    if (!follow) {
      return res.status(404).json({ message: 'Not following this trainer' });
    }

    res.json({ message: 'Successfully unfollowed trainer' });
  } catch (error) {
    console.error('Unfollow error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/follow
// @desc    Get user's followed trainers
// @access  Private (User only)
router.get('/', authenticate, isUser, async (req, res) => {
  try {
    const follows = await Follow.find({ follower: req.user._id })
      .populate('trainer', 'name email bio avatar')
      .sort({ createdAt: -1 });

    res.json(follows.map(f => f.trainer));
  } catch (error) {
    console.error('Get follows error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/follow/:trainerId
// @desc    Check if user is following a trainer
// @access  Private
router.get('/:trainerId', authenticate, async (req, res) => {
  try {
    const follow = await Follow.findOne({
      follower: req.user._id,
      trainer: req.params.trainerId
    });

    res.json({ isFollowing: !!follow });
  } catch (error) {
    console.error('Check follow error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

