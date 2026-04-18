import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { Droplets, AlertTriangle, CheckCircle, Activity } from 'lucide-react';
import Topbar from '../components/Topbar';
import SeverityBadge from '../components/SeverityBadge';
import { useApiData } from '../hooks/useApiData';
import { waterApi } from '../services/api';
import { waterQuality, waterTrend } from '../data/mockData';

export default function WaterQuality() {
  const { data: quality, refetch } = useApiData(waterApi.getQuality, waterQuality);
  const { data: trend } = useApiData(waterApi.getTrend, waterTrend);

  const scoreColor = quality.overall >= 80
    ? 'var(--accent)'
    : quality.overall >= 60
    ? 'var(--warning)'
    : 'var(--danger)';

  return (
    <>
      <Topbar title="Water Quality Monitor" subtitle="Real-time sensor readings" onRefresh={refetch} />
      <div className="page">

        {/* Score hero + params */}
        <div className="grid-2" style={{ marginBottom: '1.5rem' }}>

          {/* Score ring */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
            <div style={styles.scoreRing(scoreColor)}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: scoreColor }}>{quality.overall}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>/ 100</div>
              </div>
            </div>
            <div>
              <div style={{ textAlign: 'center', fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                {quality.status}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center' }}>Overall Water Quality</div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {quality.parameters.filter(p => p.status === 'warning').map(p => (
                <div key={p.name} className="alert alert-warning" style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem' }}>
                  <AlertTriangle size={13} /> {p.name} needs attention
                </div>
              ))}
              {quality.parameters.every(p => p.status === 'good') && (
                <div className="alert alert-success" style={{ padding: '0.4rem 0.75rem', fontSize: '0.78rem' }}>
                  <CheckCircle size={13} /> All parameters within range
                </div>
              )}
            </div>
          </div>

          {/* Parameters grid */}
          <div className="card">
            <div className="section-title"><Droplets size={18} /> Parameter Readings</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {quality.parameters.map((p) => {
                const pct = ((p.value - p.min) / (p.max - p.min)) * 100;
                return (
                  <div key={p.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.83rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                        {p.name}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '0.83rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {p.value}{p.unit}
                        </span>
                        <SeverityBadge level={p.status} />
                      </div>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${Math.min(100, Math.max(0, pct))}%`,
                          background: p.status === 'good' ? 'var(--accent)' : 'var(--warning)',
                        }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.15rem' }}>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Min {p.min}{p.unit}</span>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Max {p.max}{p.unit}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Trend chart */}
        <div className="card">
          <div className="section-title"><Activity size={18} /> 24-Hour Trend</div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={trend} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="time" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
              <Tooltip
                contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }}
                labelStyle={{ color: 'var(--text-primary)' }}
              />
              <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text-muted)' }} />
              <Line type="monotone" dataKey="ph" stroke="var(--accent)" strokeWidth={2} dot={false} name="pH" />
              <Line type="monotone" dataKey="oxygen" stroke="var(--info)" strokeWidth={2} dot={false} name="O₂ mg/L" />
              <Line type="monotone" dataKey="nitrate" stroke="var(--warning)" strokeWidth={2} dot={false} name="Nitrate mg/L" />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </>
  );
}

const styles = {
  scoreRing: (color) => ({
    width: 140,
    height: 140,
    borderRadius: '50%',
    border: `6px solid ${color}`,
    boxShadow: `0 0 30px ${color}33`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }),
};
