const User = require('../models/User');

// POST /api/wallet/transfer
// { senderId, receiverId, amount }
exports.transferWalletFunds = async (req, res) => {
  try {
    const { senderId, receiverId, amount } = req.body;
    if (!senderId || !receiverId || !amount || amount <= 0) {
      return res.status(400).json({ error: 'senderId, receiverId, and positive amount are required' });
    }
    if (senderId === receiverId) {
      return res.status(400).json({ error: 'Cannot transfer to self' });
    }
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    if (!sender || !receiver) {
      return res.status(404).json({ error: 'Sender or receiver not found' });
    }
    if (sender.walletBalance < amount) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }
    sender.walletBalance -= amount;
    receiver.walletBalance += amount;
    await sender.save();
    await receiver.save();
    console.log(`[WalletTransfer] ${amount} transferred from ${senderId} to ${receiverId}`);
    res.json({ success: true, senderBalance: sender.walletBalance, receiverBalance: receiver.walletBalance });
  } catch (err) {
    console.error('[WalletTransfer] Error:', err);
    res.status(500).json({ error: 'Failed to transfer funds', details: err.message });
  }
};

