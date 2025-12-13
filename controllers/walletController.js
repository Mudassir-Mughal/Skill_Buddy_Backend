const User = require('../models/User');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);


// 1. Create Stripe PaymentIntent for wallet top-up
exports.createWalletPaymentIntent = async (req, res) => {
  try {
    const { amount, userId } = req.body;
    if (!amount || !userId) {
      return res.status(400).json({ error: 'Amount and userId are required' });
    }
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100),
      currency: 'usd',
      metadata: { userId },
      payment_method_types: ['card'],
    });
    console.log('[Wallet] Created PaymentIntent:', paymentIntent.id);
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('[Wallet] Error creating PaymentIntent:', err);
    res.status(500).json({ error: 'Failed to create PaymentIntent', details: err.message });
  }
};

// 2. Add wallet balance (credit after payment success in Flutter)
exports.addWalletBalance = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    if (!userId || !amount) {
      return res.status(400).json({ error: 'userId and amount are required' });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.walletBalance += Number(amount);
    await user.save();
    console.log(`Wallet credited: +${amount}`);
    res.json({ walletBalance: user.walletBalance });
  } catch (err) {
    console.error('[Wallet] Error crediting wallet:', err);
    res.status(500).json({ error: 'Failed to credit wallet', details: err.message });
  }
};

// 3. Spend wallet balance
exports.spendWalletBalance = async (req, res) => {
  try {
    const { userId, amount } = req.body;
    if (!userId || !amount) {
      return res.status(400).json({ error: 'userId and amount are required' });
    }
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (user.walletBalance < amount) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }
    user.walletBalance -= Number(amount);
    await user.save();
    console.log(`Wallet spent: -${amount}`);
    res.json({ walletBalance: user.walletBalance });
  } catch (err) {
    console.error('[Wallet] Error spending wallet balance:', err);
    res.status(500).json({ error: 'Failed to spend wallet balance', details: err.message });
  }
};

// 4. Transfer funds between users
exports.transferFunds = async (req, res) => {
  try {
    const { senderId, receiverId, amount } = req.body;
    if (!senderId || !receiverId || !amount) {
      return res.status(400).json({ error: 'senderId, receiverId, and amount are required' });
    }
    if (senderId === receiverId) {
      return res.status(400).json({ error: 'Sender and receiver cannot be the same user' });
    }
    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);
    if (!sender) return res.status(404).json({ error: 'Sender not found' });
    if (!receiver) return res.status(404).json({ error: 'Receiver not found' });
    if (sender.walletBalance < amount) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }
    sender.walletBalance -= Number(amount);
    receiver.walletBalance += Number(amount);
    await sender.save();
    await receiver.save();
    console.log(`Wallet spent: -${amount} (sender)`);
    console.log(`Wallet credited: +${amount} (receiver)`);
    res.json({
      sender: { userId: senderId, walletBalance: sender.walletBalance },
      receiver: { userId: receiverId, walletBalance: receiver.walletBalance }
    });
  } catch (err) {
    console.error('[Wallet] Error transferring funds:', err);
    res.status(500).json({ error: 'Failed to transfer funds', details: err.message });
  }
};
