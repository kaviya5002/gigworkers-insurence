import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import api from '../../api/axios';
import './FraudDetection.css';

function FraudDetection() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/fraud-alerts')
      .then((res) => setAlerts(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':   return '#EF4444';
      case 'medium': return '#F59E0B';
      case 'low':    return '#3B82F6';
      default:       return '#6B7280';
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      investigating: { text: 'Investigating',  color: '#F59E0B' },
      pending:       { text: 'Pending Review', color: '#3B82F6' },
      resolved:      { text: 'Resolved',       color: '#10B981' },
      fraud_suspected: { text: 'Fraud Suspected', color: '#EF4444' },
    };
    return badges[status] || badges.pending;
  };

  // Map backend Claim fields to UI fields
  const mapAlert = (claim) => ({
    id:       claim._id,
    severity: claim.fraudScore >= 80 ? 'high' : claim.fraudScore >= 60 ? 'medium' : 'low',
    rider:    claim.rider?.name ? `Rider: ${claim.rider.name}` : `Rider #${String(claim.rider?._id || claim.rider).slice(-4)}`,
    issue:    claim.description || claim.claimType,
    amount:   `$${(claim.amount || 0).toLocaleString()}`,
    time:     new Date(claim.createdAt).toLocaleDateString(),
    status:   claim.status,
  });

  const mapped = alerts.map(mapAlert);

  return (
    <div className="fraud-detection">
      <div className="fraud-header">
        <h2 className="section-title">Fraud Detection Alerts</h2>
        <span className="alert-badge">
          {mapped.filter(a => a.status !== 'resolved').length} Active
        </span>
      </div>

      {loading && <p style={{ opacity: 0.6, fontSize: '0.875rem', padding: '1rem 0' }}>Loading...</p>}

      {!loading && mapped.length === 0 && (
        <p style={{ opacity: 0.6, fontSize: '0.875rem', padding: '1rem 0' }}>No fraud alerts found.</p>
      )}

      <div className="alerts-list">
        {mapped.map((alert, index) => (
          <motion.div
            key={alert.id}
            className="alert-card"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="alert-indicator" style={{ background: getSeverityColor(alert.severity) }}></div>

            <div className="alert-content">
              <div className="alert-header-row">
                <h4 className="alert-rider">{alert.rider}</h4>
                <span
                  className="severity-badge"
                  style={{
                    background: `${getSeverityColor(alert.severity)}20`,
                    color: getSeverityColor(alert.severity),
                  }}
                >
                  {alert.severity.toUpperCase()}
                </span>
              </div>

              <p className="alert-issue">{alert.issue}</p>

              <div className="alert-footer">
                <span className="alert-amount">{alert.amount}</span>
                <span className="alert-time">{alert.time}</span>
              </div>

              <div className="alert-status">
                <span
                  className="status-badge"
                  style={{
                    background: `${getStatusBadge(alert.status).color}20`,
                    color: getStatusBadge(alert.status).color,
                  }}
                >
                  {getStatusBadge(alert.status).text}
                </span>
              </div>
            </div>

            <button className="alert-action"><span>→</span></button>
          </motion.div>
        ))}
      </div>

      <button className="btn btn-outline btn-full">View All Alerts</button>
    </div>
  );
}

export default FraudDetection;
