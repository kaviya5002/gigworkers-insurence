const express = require('express');
const router = express.Router();
const { getStats, getAllRiders, getAllClaims, updateClaimStatus, getFraudAlerts } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.use(protect, adminOnly); // All admin routes require auth + admin role

router.get('/stats', getStats);
router.get('/riders', getAllRiders);
router.get('/claims', getAllClaims);
router.put('/claims/:id', updateClaimStatus);
router.get('/fraud-alerts', getFraudAlerts);

module.exports = router;
