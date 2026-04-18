import { Bell, RefreshCw, User } from 'lucide-react';
import { useState } from 'react';

export default function Topbar({ title, subtitle, onRefresh }) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    onRefresh?.();
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <header style={styles.topbar}>
      <div>
        <h1 style={styles.title}>{title}</h1>
        {subtitle && <p style={styles.subtitle}>{subtitle}</p>}
      </div>
      <div style={styles.actions}>
        <button className="btn btn-ghost" onClick={handleRefresh} title="Refresh data" style={{ color: '#ffffff' }}>
          <RefreshCw size={16} style={refreshing ? { animation: 'spin 0.7s linear infinite' } : {}} />
        </button>
        <button className="btn btn-ghost" style={{ position: 'relative', color: '#ffffff' }}>
          <Bell size={16} />
          <span style={styles.notifBadge}>3</span>
        </button>
        <div style={styles.avatar}>
          <User size={16} />
        </div>
      </div>
    </header>
  );
}

const styles = {
  topbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.25rem 2rem',
    borderBottom: '1px solid #2a6014',
    background: 'linear-gradient(90deg, #337418 0%, #5DD62C 100%)',
    position: 'sticky',
    top: 0,
    zIndex: 10,
  },
  title: {
    fontSize: '1.2rem',
    fontWeight: 700,
    color: '#ffffff',
    margin: 0,
  },
  subtitle: {
    fontSize: '0.8rem',
    color: 'rgba(255,255,255,0.75)',
    margin: 0,
  },
  actions: { display: 'flex', alignItems: 'center', gap: '0.5rem' },
  notifBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: 'var(--danger)',
    fontSize: 0,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.2)',
    border: '1px solid rgba(255,255,255,0.6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    cursor: 'pointer',
  },
};
