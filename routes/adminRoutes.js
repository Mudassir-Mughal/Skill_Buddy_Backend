const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Admin Login
router.post('/login', adminController.login);

// User Management
router.get('/users', adminController.getAllUsers);
router.post('/users', adminController.createUser);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);

// Review Management
router.get('/reviews', adminController.getAllReviews);
router.delete('/reviews/:id', adminController.deleteReview);

// Dispute Management
router.get('/disputes', adminController.getAllDisputes);

// Get reported reviews (FE-2 for admin handling reports)
router.get('/reported-reviews', adminController.getReportedReviews);

// Resolve a review report (mark as resolved or remove review)
router.post('/review/:id/resolve', adminController.resolveReviewReport);

// Admin can query transactions and generate simple report endpoints (FE-6)
router.get('/transactions/report', adminController.getTransactionsReport);

// Approve instructor skills / qualifications (FE-1 admin)
router.post('/instructor/:id/approve', adminController.approveInstructor);

module.exports = router;
