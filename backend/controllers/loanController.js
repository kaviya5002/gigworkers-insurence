const Loan = require('../models/Loan');
const Transaction = require('../models/Transaction');

// @desc    Apply for a micro loan
// @route   POST /api/loans/apply
// @access  Private (user)
const applyLoan = async (req, res) => {
  try {
    const { amount, purpose } = req.body;

    // Check for existing active loan
    const existingLoan = await Loan.findOne({
      rider: req.user.id,
      status: { $in: ['pending', 'approved', 'disbursed', 'repaying'] },
    });

    if (existingLoan) {
      return res.status(400).json({ success: false, message: 'You already have an active loan' });
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    const loan = await Loan.create({
      rider: req.user.id,
      amount,
      purpose,
      dueDate,
    });

    res.status(201).json({ success: true, data: loan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get rider's loan history
// @route   GET /api/loans/my-loans
// @access  Private (user)
const getMyLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ rider: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: loans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all loans (admin)
// @route   GET /api/loans/all
// @access  Private (admin)
const getAllLoans = async (req, res) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};

    const loans = await Loan.find(query)
      .populate('rider', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: loans });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Approve or reject a loan (admin)
// @route   PUT /api/loans/:id/review
// @access  Private (admin)
const reviewLoan = async (req, res) => {
  try {
    const { status } = req.body; // 'approved' or 'rejected'

    const loan = await Loan.findByIdAndUpdate(
      req.params.id,
      {
        status,
        approvedBy: req.user.id,
        ...(status === 'approved' && { disbursedAt: new Date() }),
      },
      { new: true }
    );

    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan not found' });
    }

    // Record disbursement transaction if approved
    if (status === 'approved') {
      await Transaction.create({
        rider: loan.rider,
        type: 'loan_disbursement',
        amount: loan.amount,
        description: `Micro loan disbursed`,
        status: 'completed',
      });
    }

    res.status(200).json({ success: true, data: loan });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { applyLoan, getMyLoans, getAllLoans, reviewLoan };
