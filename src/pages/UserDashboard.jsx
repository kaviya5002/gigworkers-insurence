import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useAuth } from '../context/AuthContext';
import { RiderDataProvider } from '../context/RiderDataContext';
import EarningsOverview from '../components/dashboard/EarningsOverview';
import WeeklyEarningsChart from '../components/dashboard/WeeklyEarningsChart';
import AIRiskMonitoring from '../components/dashboard/AIRiskMonitoring';
import SmartRelocation from '../components/dashboard/SmartRelocation';
import InsuranceWallet from '../components/dashboard/InsuranceWallet';
import MicroLoanAccess from '../components/dashboard/MicroLoanAccess';
import Notifications from '../components/dashboard/Notifications';
import DynamicPricing from '../components/dashboard/DynamicPricing';
import './UserDashboard.css';

function UserDashboard() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const firstName        = user?.name?.split(' ')[0] || 'Rider';

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <RiderDataProvider>
      <div className="user-dashboard">
      <motion.div 
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="header-content">
          <h1>Welcome back, {firstName}! 👋</h1>
          <p>Here's what's happening with your rides today</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-outline" onClick={() => navigate('/user-dashboard')}>View Profile</button>
          <button className="btn btn-primary" onClick={logout}>Logout</button>
        </div>
      </motion.div>

      <div className="dashboard-grid">
        <div className="grid-main">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <EarningsOverview />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <WeeklyEarningsChart />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <AIRiskMonitoring />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <SmartRelocation />
          </motion.div>

          <div className="grid-row">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <InsuranceWallet />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              <DynamicPricing />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <MicroLoanAccess />
            </motion.div>
          </div>
        </div>

        <div className="grid-sidebar">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Notifications />
          </motion.div>
        </div>
      </div>
      </div>
    </RiderDataProvider>
  );
}

export default UserDashboard;
