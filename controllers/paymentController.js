// controllers/paymentController.js
const Payment = require('../models/Payment');

// Create a new payment record
exports.savePayment = async (req, res) => {
  try {
    const { userId, amount, currency, paymentStatus, stripePaymentIntentId, description } = req.body;

    // Validate required fields
    if (!userId || !amount) {
      return res.status(400).json({
        success: false,
        message: 'User ID and amount are required'
      });
    }

    // Create new payment record
    const payment = new Payment({
      userId,
      amount,
      currency: currency || 'USD',
      paymentStatus: paymentStatus || 'successful',
      stripePaymentIntentId,
      description: description || 'Skill Buddy Payment'
    });

    const savedPayment = await payment.save();

    res.status(201).json({
      success: true,
      message: 'Payment saved successfully',
      payment: savedPayment
    });
  } catch (error) {
    console.error('Error saving payment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save payment',
      error: error.message
    });
  }
};

// Get all payments for a user
exports.getUserPayments = async (req, res) => {
  try {
    const { userId } = req.params;
    const payments = await Payment.find({ userId })
      .populate('userId', 'Fullname email')
      .sort({ transactionDate: -1 });
    res.status(200).json({
      success: true,
      payments
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: error.message
    });
  }
};

// Get all payments (admin)
exports.getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'Fullname email')
      .sort({ transactionDate: -1 });
    res.status(200).json({
      success: true,
      payments
    });
  } catch (error) {
    console.error('Error fetching all payments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payments',
      error: error.message
    });
  }
};

