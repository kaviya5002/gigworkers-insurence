require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Route imports
const authRoutes = require('./routes/authRoutes');
const riderRoutes = require('./routes/riderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const insuranceRoutes = require('./routes/insuranceRoutes');
const loanRoutes     = require('./routes/loanRoutes');
const aiRoutes       = require('./routes/aiRoutes');
const earningsRoutes = require('./routes/earningsRoutes');
const claimsRoutes   = require('./routes/claimsRoutes');
const registrationRoutes = require('./modules/registration-intelligence/registrationRoutes');
const policyRoutes       = require('./modules/policy-engine/policyRoutes');
const pricingRoutes      = require('./modules/pricing-engine/pricingRoutes');
const claimsIntelligenceRoutes = require('./modules/claims-intelligence/claimsRoutes');
const automationRoutes          = require('./modules/automation-engine/automationRoutes');
const profileRoutes             = require('./modules/profile-settings/profileRoutes');
const advancedPolicyRoutes      = require('./modules/advanced-policy-intelligence/advancedPolicyRoutes');

const app = express();

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// ─── Routes ──────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/rider', riderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/insurance', insuranceRoutes);
app.use('/api/loans',    loanRoutes);
app.use('/api/ai',       aiRoutes);
app.use('/api/earnings', earningsRoutes);
app.use('/api/claims',   claimsRoutes);
app.use('/api/registration', registrationRoutes);
app.use('/api/policy',       policyRoutes);
app.use('/api/pricing',      pricingRoutes);
app.use('/api/claims-intelligence', claimsIntelligenceRoutes);
app.use('/api/automation',   automationRoutes);
app.use('/api',              profileRoutes);
app.use('/api/policy',       advancedPolicyRoutes);

// ─── Health Check ─────────────────────────────────────────────
app.get('/', (req, res) => {
  res.status(200).json({ success: true, message: '🚀 ResilientRider API is running' });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: '🚀 ResilientRider API is running',
    environment: process.env.NODE_ENV,
  });
});

// ─── 404 Handler ──────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// ─── Global Error Handler ─────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: err.message || 'Internal Server Error' });
});

// ─── Connect DB then Start Server ────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV}`);
  });
};

startServer();
