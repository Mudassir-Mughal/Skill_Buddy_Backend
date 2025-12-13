const express = require('express');
const router = express.Router();
const walletController = require('../controllers/walletController');

// Create Stripe PaymentIntent for wallet top-up
router.post('/create-payment-intent', walletController.createWalletPaymentIntent);

// Add to wallet balance after payment success
router.post('/add', walletController.addWalletBalance);

// Spend wallet balance
router.post('/spend', walletController.spendWalletBalance);

// Transfer funds between users
router.post('/transfer', walletController.transferFunds);

module.exports = router;
