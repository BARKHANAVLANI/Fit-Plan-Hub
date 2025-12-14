const mongoose = require('mongoose');

const followSchema = new mongoose.Schema({
  follower: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  trainer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Prevent duplicate follows
followSchema.index({ follower: 1, trainer: 1 }, { unique: true });

// Prevent users from following themselves
followSchema.pre('save', function(next) {
  if (this.follower.toString() === this.trainer.toString()) {
    const error = new Error('Cannot follow yourself');
    error.status = 400;
    return next(error);
  }
  next();
});

module.exports = mongoose.model('Follow', followSchema);

