import { motion } from 'framer-motion';
import './SettingsSection.css';

/**
 * SettingsSection — reusable card for both User and Admin profile pages.
 *
 * Props:
 *   title    {string}   — section heading
 *   items    {Array}    — [{ key, label, description?, value, onChange }]
 *   children {ReactNode} — optional extra content below toggles
 */
function SettingsSection({ title, items = [], children }) {
  return (
    <motion.div
      className="settings-section card"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <h3 className="settings-section__title">{title}</h3>

      {items.length > 0 && (
        <div className="settings-section__list">
          {items.map((item) => (
            <div key={item.key} className="settings-toggle-row">
              <div className="settings-toggle-row__info">
                <span className="settings-toggle-row__label">{item.label}</span>
                {item.description && (
                  <span className="settings-toggle-row__desc">{item.description}</span>
                )}
              </div>
              {/* Toggle — same visual style as DarkModeToggle */}
              <button
                className={`settings-toggle ${item.value ? 'settings-toggle--on' : 'settings-toggle--off'}`}
                onClick={() => item.onChange(!item.value)}
                aria-label={`Toggle ${item.label}`}
                role="switch"
                aria-checked={item.value}
              >
                <motion.span
                  className="settings-toggle__thumb"
                  layout
                  transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                />
              </button>
            </div>
          ))}
        </div>
      )}

      {children && <div className="settings-section__extra">{children}</div>}
    </motion.div>
  );
}

export default SettingsSection;
