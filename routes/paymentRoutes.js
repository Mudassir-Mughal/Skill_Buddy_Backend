const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// Create a new payment record
router.post('/save-payment', paymentController.savePayment);

// Get all payments for a user
router.get('/user/:userId', paymentController.getUserPayments);

// Get all payments (admin)
router.get('/all', paymentController.getAllPayments);

module.exports = router;
