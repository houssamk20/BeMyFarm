import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { AlertTriangle, Leaf, Map, Activity } from 'lucide-react';
import Topbar from '../components/Topbar';
import StatCard from '../components/StatCard';
import LoadingSpinner from '../components/LoadingSpinner';
import SeverityBadge from '../components/SeverityBadge';
import { useApiData } from '../hooks/useApiData';
import { fieldApi } from '../services/api';
import {
  fieldStats, soilTrend, yieldForecast, diseaseAlerts, fields
} from '../data/mockData';

const chartColor = 'var(--accent)';
const chartColorSecondary = '#60a5fa';

export default function Dashboard() {
  const { data: stats, loading: statsLoading, refetch } = useApiData(
    fieldApi.getStats, fieldStats
  );
  const { data: trend } = useApiData(
    () => fieldApi.getSoilTrend('all'), soilTrend
  );
  const { data: forecast } = useApiData(fieldApi.getYieldForecast, yieldForecast);

  return (
    <>
      <Topbar
        title="Dashboard"
        subtitle={`Last updated: ${new Date().toLocaleTimeString()}`}
        onRefresh={refetch}
      />
      <div className="page">

        {/* KPI row */}
        {statsLoading ? <LoadingSpinner /> : (
          <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
            {stats.map((s) => <StatCard key={s.id} {...s} />)}
          </div>
        )}

        {/* Charts row */}
        <div className="grid-2" style={{ marginBottom: '1.5rem' }}>

          {/* Soil moisture trend */}
          <div className="card">
            <div className="section-title">
              <Activity size={18} />
              Soil Moisture & Temp — 7 days
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={trend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="moistureGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={chartColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={chartColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }}
                  labelStyle={{ color: 'var(--text-primary)' }}
                />
                <Area type="monotone" dataKey="moisture" stroke={chartColor} fill="url(#moistureGrad)" name="Moisture %" strokeWidth={2} />
                <Area type="monotone" dataKey="temp" stroke={chartColorSecondary} fill="none" name="Temp °C" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Yield forecast */}
          <div className="card">
            <div className="section-title">
              <Leaf size={18} />
              Yield Forecast (kg/ha)
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={forecast} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }}
                  labelStyle={{ color: 'var(--text-primary)' }}
                />
                <Legend wrapperStyle={{ fontSize: 11, color: 'var(--text-muted)' }} />
                <Bar dataKey="actual" fill={chartColor} radius={[4,4,0,0]} name="Actual" />
                <Bar dataKey="forecast" fill="rgba(34,197,94,0.3)" radius={[4,4,0,0]} name="Forecast" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bottom row: fields + alerts */}
        <div className="grid-2">

          {/* Field status */}
          <div className="card">
            <div className="section-title">
              <Map size={18} />
              Field Status
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {fields.map((f) => (
                <div key={f.id} style={styles.fieldRow}>
                  <div style={styles.fieldInfo}>
                    <span style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.875rem' }}>{f.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{f.crop} · {f.area}</span>
                  </div>
                  <div style={{ flex: 1, padding: '0 1rem' }}>
                    <div className="progress-bar">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${f.health}%`,
                          background: f.health > 80 ? 'var(--accent)' : f.health > 60 ? 'var(--warning)' : 'var(--danger)',
                        }}
                      />
                    </div>
                  </div>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', minWidth: 32 }}>
                    {f.health}%
                  </span>
                  <SeverityBadge level={f.status} />
                </div>
              ))}
            </div>
          </div>

          {/* Disease alerts */}
          <div className="card">
            <div className="section-title">
              <AlertTriangle size={18} />
              Active Disease Alerts
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {diseaseAlerts.map((d) => (
                <div key={d.id} style={styles.alertRow}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{d.name}</span>
                      <SeverityBadge level={d.severity} />
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {d.crop} · {d.field} · {d.confidence}% confidence
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{d.detected}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}

const styles = {
  fieldRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0',
    borderBottom: '1px solid var(--border)',
  },
  fieldInfo: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 90,
  },
  alertRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.5rem 0',
    borderBottom: '1px solid var(--border)',
  },
};
