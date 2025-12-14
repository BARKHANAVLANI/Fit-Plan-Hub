const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  plan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Plan',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  },
  expiresAt: {
    type: Date,
    required: true
  }
}, {
  timestamps: true
});

// Prevent duplicate subscriptions
subscriptionSchema.index({ user: 1, plan: 1 }, { unique: true });

// Calculate expiresAt before saving
subscriptionSchema.pre('save', async function(next) {
  if (this.isNew && !this.expiresAt) {
    try {
      const plan = await mongoose.model('Plan').findById(this.plan);
      if (plan) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + plan.duration);
        this.expiresAt = expiresAt;
      } else {
        // If plan not found, set default 30 days
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30);
        this.expiresAt = expiresAt;
      }
    } catch (error) {
      // If error, set default 30 days
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      this.expiresAt = expiresAt;
    }
  }
  next();
});

module.exports = mongoose.model('Subscription', subscriptionSchema);

