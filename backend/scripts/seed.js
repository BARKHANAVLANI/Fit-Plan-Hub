const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const Plan = require('../models/Plan');
const Follow = require('../models/Follow');
const Subscription = require('../models/Subscription');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fitplanhub');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Plan.deleteMany({});
    await Follow.deleteMany({});
    await Subscription.deleteMany({});
    console.log('Cleared existing data');

    // Create trainers
    const trainer1 = await User.create({
      name: 'John Fitness',
      email: 'john@trainer.com',
      password: 'password123',
      role: 'trainer',
      bio: 'Certified personal trainer with 10 years of experience',
      avatar: 'https://i.pravatar.cc/150?img=12'
    });

    const trainer2 = await User.create({
      name: 'Sarah Strong',
      email: 'sarah@trainer.com',
      password: 'password123',
      role: 'trainer',
      bio: 'Strength and conditioning specialist',
      avatar: 'https://i.pravatar.cc/150?img=47'
    });

    const trainer3 = await User.create({
      name: 'Mike Muscle',
      email: 'mike@trainer.com',
      password: 'password123',
      role: 'trainer',
      bio: 'Bodybuilding coach and nutrition expert',
      avatar: 'https://i.pravatar.cc/150?img=33'
    });

    console.log('Created trainers');

    // Create users
    const user1 = await User.create({
      name: 'Alice User',
      email: 'alice@user.com',
      password: 'password123',
      role: 'user'
    });

    const user2 = await User.create({
      name: 'Bob User',
      email: 'bob@user.com',
      password: 'password123',
      role: 'user'
    });

    console.log('Created users');

    // Create plans
    const plan1 = await Plan.create({
      title: '30-Day Weight Loss Challenge',
      description: 'A comprehensive 30-day program designed to help you lose weight and build healthy habits.',
      price: 49.99,
      duration: 30,
      content: 'Week 1: Cardio focus with 5 workouts per week\nWeek 2: Strength training introduction\nWeek 3: HIIT workouts\nWeek 4: Full body transformation\n\nNutrition guide included!',
      trainer: trainer1._id
    });

    const plan2 = await Plan.create({
      title: 'Muscle Building Program',
      description: 'Build lean muscle mass with this 60-day intensive program.',
      price: 79.99,
      duration: 60,
      content: 'Progressive overload training\n6-day split routine\nNutrition macros calculator\nRecovery protocols\nSupplement guide',
      trainer: trainer2._id
    });

    const plan3 = await Plan.create({
      title: 'Beginner Fitness Starter',
      description: 'Perfect for those just starting their fitness journey.',
      price: 29.99,
      duration: 21,
      content: '3 workouts per week\nBasic movement patterns\nForm corrections\nHome workout alternatives\nMotivation tips',
      trainer: trainer1._id
    });

    const plan4 = await Plan.create({
      title: 'Advanced Powerlifting',
      description: 'For experienced lifters looking to increase their max lifts.',
      price: 99.99,
      duration: 90,
      content: 'Periodized training program\nTechnique refinement\nAccessory work\nPeaking strategies\nCompetition prep',
      trainer: trainer3._id
    });

    console.log('Created plans');

    // Create subscriptions
    await Subscription.create({
      user: user1._id,
      plan: plan1._id,
      status: 'active'
    });

    await Subscription.create({
      user: user1._id,
      plan: plan2._id,
      status: 'active'
    });

    console.log('Created subscriptions');

    // Create follows
    await Follow.create({
      follower: user1._id,
      trainer: trainer1._id
    });

    await Follow.create({
      follower: user1._id,
      trainer: trainer2._id
    });

    await Follow.create({
      follower: user2._id,
      trainer: trainer1._id
    });

    console.log('Created follows');

    console.log('\n✅ Seed data created successfully!');
    console.log('\nTest Accounts:');
    console.log('Trainers:');
    console.log('  - john@trainer.com / password123');
    console.log('  - sarah@trainer.com / password123');
    console.log('  - mike@trainer.com / password123');
    console.log('\nUsers:');
    console.log('  - alice@user.com / password123');
    console.log('  - bob@user.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seedData();

