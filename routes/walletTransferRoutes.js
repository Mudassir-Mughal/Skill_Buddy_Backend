const express = require('express');
const router = express.Router();
const walletTransferController = require('../controllers/walletTransferController');

// POST /api/wallet/transfer
router.post('/transfer', walletTransferController.transferWalletFunds);

module.exports = router;

