import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import api from '../../api/axios';
import './RiderAnalyticsTable.css';

function RiderAnalyticsTable() {
  const [riders, setRiders]   = useState([]);
  const [total, setTotal]     = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [page, setPage]       = useState(1);
  const pages                  = Math.ceil(total / 10) || 1;

  useEffect(() => {
    setLoading(true);
    api
      .get(`/admin/riders?page=${page}&limit=10&search=${search}`)
      .then((res) => {
        setRiders(res.data.data);
        setTotal(res.data.pagination?.total || 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [page, search]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':  return '#10B981';
      case 'warning': return '#F59E0B';
      default:        return '#6B7280';
    }
  };

  const getSafetyScoreColor = (score) => {
    if (score >= 95) return '#10B981';
    if (score >= 90) return '#3B82F6';
    if (score >= 85) return '#F59E0B';
    return '#EF4444';
  };

  return (
    <div className="rider-analytics-table">
      <div className="table-header">
        <h2 className="section-title">Rider Analytics</h2>
        <div className="table-actions">
          <input
            type="search"
            placeholder="Search riders..."
            className="search-input"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          />
          <button className="btn btn-outline">Export CSV</button>
        </div>
      </div>

      <div className="table-container">
        <table className="analytics-table">
          <thead>
            <tr>
              <th>Rider ID</th>
              <th>Name</th>
              <th>Deliveries</th>
              <th>Earnings</th>
              <th>Safety Score</th>
              <th>Claims</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="8" style={{ textAlign: 'center', opacity: 0.6, padding: '1rem' }}>Loading...</td></tr>
            ) : riders.map((rider, index) => (
              <motion.tr
                key={rider._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <td className="rider-id">{String(rider._id).slice(-6).toUpperCase()}</td>
                <td className="rider-name">{rider.name}</td>
                <td>{rider.totalDeliveries || 0}</td>
                <td className="earnings">${(rider.totalEarnings || 0).toLocaleString()}</td>
                <td>
                  <div className="safety-score">
                    <span
                      className="score-badge"
                      style={{
                        background: `${getSafetyScoreColor(rider.riskScore || 90)}20`,
                        color: getSafetyScoreColor(rider.riskScore || 90),
                      }}
                    >
                      {rider.riskScore || 90}
                    </span>
                  </div>
                </td>
                <td>
                  <span className={`claims-count ${(rider.totalClaims || 0) > 0 ? 'has-claims' : ''}`}>
                    {rider.totalClaims || 0}
                  </span>
                </td>
                <td>
                  <span className="status-indicator" style={{ background: getStatusColor('active') }}>
                    active
                  </span>
                </td>
                <td><button className="action-btn">View</button></td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <span className="showing-text">Showing {riders.length} of {total} riders</span>
        <div className="pagination">
          <button className="page-btn" onClick={() => setPage((p) => Math.max(1, p - 1))}>←</button>
          {Array.from({ length: Math.min(3, pages) }, (_, i) => i + 1).map((p) => (
            <button key={p} className={`page-btn ${page === p ? 'active' : ''}`} onClick={() => setPage(p)}>{p}</button>
          ))}
          <button className="page-btn" onClick={() => setPage((p) => Math.min(pages, p + 1))}>→</button>
        </div>
      </div>
    </div>
  );
}

export default RiderAnalyticsTable;
