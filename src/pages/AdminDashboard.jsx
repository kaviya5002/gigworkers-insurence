import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useAuth } from '../context/AuthContext';
import AdminStats from '../components/admin/AdminStats';
import PremiumPoolChart from '../components/admin/PremiumPoolChart';
import ClaimsAnalytics from '../components/admin/ClaimsAnalytics';
import FraudDetection from '../components/admin/FraudDetection';
import RiderAnalyticsTable from '../components/admin/RiderAnalyticsTable';
import AIRiskPanel from '../components/admin/AIRiskPanel';
import './AdminDashboard.css';

function AdminDashboard() {
  const [timeRange, setTimeRange] = useState('week');
  const { user, logout }          = useAuth();
  const adminName                 = user?.name?.split(' ')[0] || 'Admin';

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
    });
  }, []);

  return (
    <div className="admin-dashboard">
      <motion.div 
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <h1>Admin Dashboard 📊</h1>
          <p>Welcome, {adminName} — Insurance Provider Control Panel</p>
        </div>
        <div className="header-actions">
          <select
            className="time-range-select"
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button className="btn btn-outline" onClick={logout}>Logout</button>
          <button className="btn btn-primary" onClick={() => window.print()}>Generate Report</button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <AdminStats />
      </motion.div>

      <div className="dashboard-grid">
        <div className="grid-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PremiumPoolChart />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ClaimsAnalytics />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <RiderAnalyticsTable />
          </motion.div>
        </div>

        <div className="grid-right">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <FraudDetection />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <AIRiskPanel />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
