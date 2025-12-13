const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  paymentStatus: {
    type: String,
    enum: ['successful', 'failed', 'pending', 'canceled'],
    default: 'successful'
  },
  paymentMethod: {
    type: String,
    default: 'stripe'
  },
  stripePaymentIntentId: {
    type: String
  },
  transactionDate: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    default: 'Skill Buddy Payment'
  }
});

module.exports = mongoose.model('Payment', PaymentSchema);
