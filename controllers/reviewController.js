const Review = require('../models/Review');

// Create a review (FE-1, FE-2)
exports.createReview = async (req, res) => {
  try {
    const review = new Review(req.body);
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get reviews for an instructor with sort options (FE-5)
exports.getInstructorReviews = async (req, res) => {
  try {
    const sort = req.query.sort === 'latest' ? { createdAt: -1 } :
                 req.query.sort === 'top' ? { rating: -1 } : { createdAt: -1 };
    const reviews = await Review.find({ instructorId: req.params.id })
      .populate('studentId', 'Fullname')
      .sort(sort);
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Instructor reply to a review (FE-3)
exports.replyToReview = async (req, res) => {
  try {
    const { instructorId, text } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Not found' });
    review.replies.push({ instructorId, text });
    review.updatedAt = Date.now();
    await review.save();
    res.json(review);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Report a review (FE-4)
exports.reportReview = async (req, res) => {
  try {
    const { reporterId, reason } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ error: 'Not found' });
    review.reports.push({ reporterId, reason });
    await review.save();
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

