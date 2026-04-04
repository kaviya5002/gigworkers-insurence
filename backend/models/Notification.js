const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
  {
    userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true, trim: true },
    type:    { type: String, enum: ['info', 'success', 'warning', 'error'], default: 'info' },
    read:    { type: Boolean, default: false },
    claimId: { type: mongoose.Schema.Types.ObjectId, ref: 'Claim', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Notification', notificationSchema);
