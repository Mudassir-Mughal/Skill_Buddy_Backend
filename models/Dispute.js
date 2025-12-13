const mongoose = require('mongoose');

const DisputeSchema = new mongoose.Schema({
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction', required: true },
  openerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason: { type: String, required: true },
  adminNotes: { type: String },
  status: { type: String, enum: ['open','under_review','resolved','dismissed'], default: 'open' },
  resolutionRating: { type: Number, min: 1, max: 5 }, // FE-13
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Dispute', DisputeSchema);
