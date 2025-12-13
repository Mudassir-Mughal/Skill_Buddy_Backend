const express = require('express');
const router = express.Router();
const disputeController = require('../controllers/disputeController');

// @route   POST /api/disputes
// @desc    Create a new dispute for a review
// @access  Public (for now, should be protected)
router.post('/', disputeController.createDispute);

module.exports = router;
