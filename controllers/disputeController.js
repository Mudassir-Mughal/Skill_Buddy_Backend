const Dispute = require('../models/Dispute');

// Create a new dispute for a review
exports.createDispute = async (req, res) => {
  try {
    const { reviewId, instructorId } = req.body;
    const newDispute = new Dispute({
      reviewId,
      instructorId,
      status: 'pending',
    });
    const dispute = await newDispute.save();
    res.status(201).json(dispute);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

