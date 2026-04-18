import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Cloud, Bug, Droplets, Sparkles, Settings, Leaf
} from 'lucide-react';

const links = [
  { to: '/',           label: 'Dashboard',       icon: LayoutDashboard },
  { to: '/weather',    label: 'Weather & Field',  icon: Cloud },
  { to: '/disease',    label: 'Disease Detection',icon: Bug },
  { to: '/water',      label: 'Water Quality',    icon: Droplets },
  { to: '/ai',         label: 'AI Advisor',       icon: Sparkles },
  { to: '/settings',   label: 'Settings',         icon: Settings },
];

export default function Sidebar() {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <Leaf size={22} color="var(--accent)" />
        <span style={styles.logoText}>BeMyFarm</span>
      </div>

      <nav style={styles.nav}>
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            style={({ isActive }) => ({
              ...styles.link,
              ...(isActive ? styles.linkActive : {}),
            })}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div style={styles.footer}>
        <div style={styles.statusDot} />
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Live sensors connected</span>
      </div>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: 220,
    minWidth: 220,
    background: '#ffffff',
    borderRight: '1px solid #d4edc4',
    borderTop: '4px solid #5DD62C',
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    position: 'sticky',
    top: 0,
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.6rem',
    padding: '1.25rem 1.25rem 1rem',
    borderBottom: '1px solid var(--border)',
  },
  logoText: {
    fontWeight: 700,
    fontSize: '1.1rem',
    color: 'var(--text-primary)',
    letterSpacing: '-0.3px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.15rem',
    padding: '0.75rem 0.5rem',
    flex: 1,
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.65rem',
    padding: '0.6rem 0.85rem',
    borderRadius: 'var(--radius-sm)',
    color: 'var(--text-muted)',
    fontSize: '0.875rem',
    fontWeight: '500',
    transition: 'all 0.15s',
  },
  linkActive: {
    background: 'rgba(93,214,44,0.15)',
    color: '#337418',
    borderLeft: '3px solid #5DD62C',
    paddingLeft: 'calc(0.85rem - 3px)',
    fontWeight: '600',
  },
  footer: {
    padding: '1rem 1.25rem',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#5DD62C',
    boxShadow: '0 0 6px #5DD62C',
  },
};
