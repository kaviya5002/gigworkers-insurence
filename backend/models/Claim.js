const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema(
  {
    rider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    insurancePlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'InsurancePlan',
      required: true,
    },
    claimType: {
      type: String,
      enum: ['accident', 'medical', 'vehicle_damage', 'theft', 'emergency'],
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Claim amount is required'],
    },
    approvedAmount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
      required: [true, 'Claim description is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['submitted', 'under_review', 'approved', 'rejected', 'paid', 'fraud_suspected'],
      default: 'submitted',
    },
    incidentDate: {
      type: Date,
      required: true,
    },
    incidentLocation: {
      type: String,
      trim: true,
    },
    documents: [
      {
        name: String,
        url: String,
      },
    ],
    // Parametric trigger fields
    isParametric: {
      type: Boolean,
      default: false,
    },
    triggerCondition: {
      type: String,
      trim: true,
    },
    fraudScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Claim', claimSchema);
