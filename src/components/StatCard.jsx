import { Droplets, Thermometer, Cloud, Leaf, TrendingUp, TrendingDown } from 'lucide-react';

const icons = { droplets: Droplets, thermometer: Thermometer, cloud: Cloud, leaf: Leaf };

export default function StatCard({ label, value, change, trend, icon }) {
  const Icon = icons[icon] || Leaf;
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <Icon size={22} />
      </div>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
        <div className={`stat-change ${trend}`}>
          {trend === 'up' ? <TrendingUp size={11} style={{ display:'inline', marginRight: 3 }} /> : <TrendingDown size={11} style={{ display:'inline', marginRight: 3 }} />}
          {change} vs yesterday
        </div>
      </div>
    </div>
  );
}
