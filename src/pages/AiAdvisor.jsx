import { useState } from 'react';
import { Sparkles, CheckCircle, Filter, TrendingUp, Droplets, Bug, Scissors } from 'lucide-react';
import Topbar from '../components/Topbar';
import SeverityBadge from '../components/SeverityBadge';
import { useApiData } from '../hooks/useApiData';
import { aiApi } from '../services/api';
import { aiRecommendations } from '../data/mockData';

const categoryIcons = {
  Irrigation: Droplets,
  Fertilization: TrendingUp,
  'Pest Control': Bug,
  Harvest: Scissors,
};

const FILTERS = ['All', 'high', 'medium', 'low'];

export default function AiAdvisor() {
  const { data: recs, refetch, setData } = useApiData(aiApi.getRecommendations, aiRecommendations);
  const [filter, setFilter] = useState('All');
  const [done, setDone] = useState(new Set());

  const visible = (recs || aiRecommendations).filter(
    (r) => filter === 'All' || r.priority === filter
  );

  const markDone = (id) => {
    setDone((prev) => new Set([...prev, id]));
    aiApi.markDone(id).catch(() => {});
  };

  return (
    <>
      <Topbar title="AI Advisor" subtitle="Intelligent recommendations powered by field data" onRefresh={refetch} />
      <div className="page">

        {/* Summary bar */}
        <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
          <SummaryCard label="High Priority" count={aiRecommendations.filter(r => r.priority === 'high').length} color="var(--danger)" />
          <SummaryCard label="Medium Priority" count={aiRecommendations.filter(r => r.priority === 'medium').length} color="var(--warning)" />
          <SummaryCard label="Completed Today" count={done.size} color="var(--accent)" />
        </div>

        {/* Filter row */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem', alignSelf: 'center' }}>
            <Filter size={14} style={{ display: 'inline', marginRight: 4 }} />Filter:
          </span>
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={filter === f ? 'btn btn-primary' : 'btn btn-outline'}
              style={{ padding: '0.35rem 1rem' }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Recommendation cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {visible.map((rec) => {
            const Icon = categoryIcons[rec.category] || Sparkles;
            const isDone = done.has(rec.id);
            return (
              <div key={rec.id} className="card" style={{ opacity: isDone ? 0.5 : 1, transition: 'opacity 0.3s' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>

                  {/* Icon */}
                  <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: 'var(--accent-glow)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--accent)', flexShrink: 0,
                  }}>
                    <Icon size={20} />
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                      <SeverityBadge level={rec.priority} />
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', background: 'var(--border)', padding: '0.1rem 0.5rem', borderRadius: 999 }}>
                        {rec.category}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--accent)', marginLeft: 'auto' }}>
                        {rec.confidence}% confidence
                      </span>
                    </div>

                    <div style={{ fontWeight: 600, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
                      {rec.title}
                    </div>

                    <div style={styles.infoGrid}>
                      <div>
                        <div style={styles.infoLabel}>Why</div>
                        <p style={styles.infoText}>{rec.reason}</p>
                      </div>
                      <div>
                        <div style={styles.infoLabel}>Recommended Action</div>
                        <p style={styles.infoText}>{rec.action}</p>
                      </div>
                      <div>
                        <div style={styles.infoLabel}>Expected Impact</div>
                        <p style={{ ...styles.infoText, color: 'var(--accent)' }}>{rec.impact}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div style={{ flexShrink: 0 }}>
                    {isDone ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent)', fontSize: '0.85rem' }}>
                        <CheckCircle size={16} /> Done
                      </div>
                    ) : (
                      <button className="btn btn-primary" onClick={() => markDone(rec.id)}>
                        <CheckCircle size={14} /> Mark Done
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}

          {visible.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
              <Sparkles size={32} style={{ margin: '0 auto 0.75rem' }} />
              <p>No recommendations for this filter.</p>
            </div>
          )}
        </div>

      </div>
    </>
  );
}

function SummaryCard({ label, count, color }) {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2rem', fontWeight: 800, color }}>{count}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{label}</div>
    </div>
  );
}

const styles = {
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
    gap: '0.75rem',
    marginTop: '0.5rem',
  },
  infoLabel: {
    fontSize: '0.7rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    marginBottom: '0.2rem',
  },
  infoText: {
    fontSize: '0.83rem',
    color: 'var(--text-secondary)',
    lineHeight: 1.5,
  },
};
