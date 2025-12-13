const User = require('../models/User');
const Review = require('../models/Review');
const Dispute = require('../models/Dispute');
const Payment = require('../models/Payment');

// Hardcoded admin credentials (for now)
const ADMIN_EMAIL = 'admin@skillbuddy.com';
const ADMIN_PASSWORD = 'admin123';

// Admin Login
exports.login = (req, res) => {
    const { email, password } = req.body;
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        res.status(200).json({ message: 'Admin login successful' });
    } else {
        res.status(401).json({ message: 'Invalid admin credentials' });
    }
};

// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

// Get all reviews
exports.getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({});
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching reviews', error });
    }
};

// Get all disputes
exports.getAllDisputes = async (req, res) => {
    try {
        const disputes = await Dispute.find({}).populate('reviewId');
        res.status(200).json(disputes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching disputes', error });
    }
};

// Delete a review
exports.deleteReview = async (req, res) => {
    try {
        const { id } = req.params;
        const review = await Review.findByIdAndDelete(id);
        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }
        // Also delete any disputes associated with this review
        await Dispute.deleteMany({ reviewId: id });
        res.status(200).json({ message: 'Review and associated disputes deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting review', error });
    }
};

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: 'Error creating user', error });
    }
};

// Update a user
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: 'Error updating user', error });
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error });
    }
};

// Get reported reviews (FE-2 for admin handling reports)
exports.getReportedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ 'reports.0': { $exists: true } });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Resolve a review report (mark as resolved or remove review)
exports.resolveReviewReport = async (req, res) => {
  try {
    const { action } = req.body; // 'dismiss' or 'remove'
    if (action === 'remove') {
      await Review.findByIdAndDelete(req.params.id);
      return res.json({ success: true });
    }
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    review.reports.forEach(r => r.resolved = true);
    await review.save();
    res.json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Admin can query transactions and generate simple report endpoints (FE-6)
exports.getTransactionsReport = async (req, res) => {
  try {
    // example: total completed amount in a date range
    const match = { paymentStatus: 'successful' };
    const aggregate = await Payment.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
    ]);
    res.json(aggregate[0] || { total: 0, count: 0 });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Approve instructor skills / qualifications (FE-1 admin)
exports.approveInstructor = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, { $set: { instructorApproved: true } }, { new: true });
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
