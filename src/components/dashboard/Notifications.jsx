import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useRiderData } from '../../context/RiderDataContext';
import './Notifications.css';

function Notifications() {
  const { metrics } = useRiderData();
  const [read, setRead] = useState({});

  const notifications = metrics?.notifications || [
    { id: 0, type: 'info', icon: '📋', title: 'Welcome!', message: 'Log your first ride to get AI-powered notifications.', time: 'Now' }
  ];

  const markAsRead = (id) => setRead(prev => ({ ...prev, [id]: true }));
  const unreadCount = notifications.filter(n => !read[n.id] && !n.read).length;

  return (
    <div className="notifications">
      <div className="notifications-header">
        <h2 className="section-title">Notifications</h2>
        {unreadCount > 0 && <span className="unread-badge">{unreadCount}</span>}
      </div>

      <div className="notifications-list">
        <AnimatePresence>
          {notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              className={`notification-item ${notification.type} ${(read[notification.id] || notification.read) ? 'read' : ''}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => markAsRead(notification.id)}
              whileHover={{ scale: 1.02 }}
            >
              <div className="notification-icon">{notification.icon}</div>
              <div className="notification-content">
                <h4 className="notification-title">{notification.title}</h4>
                <p className="notification-message">{notification.message}</p>
                <span className="notification-time">{notification.time}</span>
              </div>
              {!read[notification.id] && !notification.read && <div className="unread-dot"></div>}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <button className="btn btn-outline btn-full">View All Notifications</button>
    </div>
  );
}

export default Notifications;
