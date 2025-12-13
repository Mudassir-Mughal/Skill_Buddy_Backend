const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Create a review (FE-1, FE-2)
router.post('/', reviewController.createReview);

// Get reviews for an instructor with sort options (FE-5)
router.get('/instructor/:id', reviewController.getInstructorReviews);

// Instructor reply to a review (FE-3)
router.post('/:id/reply', reviewController.replyToReview);

// Report a review (FE-4)
router.post('/:id/report', reviewController.reportReview);

module.exports = router;
