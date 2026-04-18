import { useState, useRef } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Bug, Upload, AlertTriangle, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import Topbar from '../components/Topbar';
import SeverityBadge from '../components/SeverityBadge';
import { useApiData } from '../hooks/useApiData';
import { diseaseApi } from '../services/api';
import { diseaseAlerts, diseaseHistory } from '../data/mockData';

export default function Disease() {
  const { data: alerts, refetch } = useApiData(diseaseApi.getAlerts, diseaseAlerts);
  const { data: history } = useApiData(diseaseApi.getHistory, diseaseHistory);

  const [expanded, setExpanded] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const fileRef = useRef();

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreviewUrl(URL.createObjectURL(file));
    setAnalysisResult(null);
  };

  const handleAnalyze = async () => {
    if (!previewUrl) return;
    setAnalyzing(true);
    // Simulate AI response (replace with diseaseApi.analyzeImage(formData))
    await new Promise((r) => setTimeout(r, 1800));
    setAnalysisResult({
      disease: 'Early Blight',
      crop: 'Tomato',
      confidence: 88,
      severity: 'medium',
      treatment: 'Apply chlorothalonil fungicide. Remove and destroy affected foliage.',
    });
    setAnalyzing(false);
  };

  return (
    <>
      <Topbar title="Disease Detection" subtitle="AI-powered crop health analysis" onRefresh={refetch} />
      <div className="page">

        <div className="grid-2" style={{ marginBottom: '1.5rem' }}>

          {/* Image uploader */}
          <div className="card">
            <div className="section-title"><Upload size={18} /> Analyze Crop Image</div>
            <div
              style={styles.uploadZone}
              onClick={() => fileRef.current.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files[0];
                if (file) { fileRef.current.files = e.dataTransfer.files; handleFile({ target: { files: [file] } }); }
              }}
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" style={{ maxHeight: 180, maxWidth: '100%', borderRadius: 8, objectFit: 'contain' }} />
              ) : (
                <>
                  <Upload size={32} color="var(--text-muted)" />
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    Click or drag a crop photo here
                  </p>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFile} />
            <button
              className="btn btn-primary"
              style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}
              onClick={handleAnalyze}
              disabled={!previewUrl || analyzing}
            >
              {analyzing ? 'Analyzing...' : 'Run AI Detection'}
            </button>

            {analysisResult && (
              <div className="alert alert-warning" style={{ marginTop: '1rem' }}>
                <AlertTriangle size={18} />
                <div>
                  <strong>{analysisResult.disease}</strong> detected on {analysisResult.crop}
                  <br />
                  <span style={{ fontSize: '0.8rem' }}>
                    {analysisResult.confidence}% confidence · Severity: {analysisResult.severity}
                  </span>
                  <br />
                  <span style={{ fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
                    Treatment: {analysisResult.treatment}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* History chart */}
          <div className="card">
            <div className="section-title"><Bug size={18} /> Detection History (last 7 months)</div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={history} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Bar dataKey="cases" fill="var(--danger)" radius={[4,4,0,0]} name="Cases" fillOpacity={0.8} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Active alerts */}
        <div className="card">
          <div className="section-title"><AlertTriangle size={18} /> Active Alerts ({alerts.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {alerts.map((alert) => (
              <div key={alert.id} style={styles.alertCard}>
                <div style={styles.alertHeader} onClick={() => setExpanded(expanded === alert.id ? null : alert.id)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                    <SeverityBadge level={alert.severity} />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                        {alert.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {alert.crop} · {alert.field} · Detected {alert.detected}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <span style={styles.confidence}>{alert.confidence}%</span>
                    {expanded === alert.id ? <ChevronUp size={16} color="var(--text-muted)" /> : <ChevronDown size={16} color="var(--text-muted)" />}
                  </div>
                </div>

                {expanded === alert.id && (
                  <div style={styles.alertBody}>
                    <div className="grid-2" style={{ gap: '1rem' }}>
                      <div>
                        <div style={styles.infoLabel}>Symptoms</div>
                        <ul style={styles.symptomList}>
                          {alert.symptoms.map((s) => (
                            <li key={s} style={{ color: 'var(--text-secondary)', fontSize: '0.83rem', marginBottom: '0.2rem' }}>• {s}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <div style={styles.infoLabel}>Recommended Treatment</div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.83rem' }}>{alert.treatment}</p>
                        <button className="btn btn-outline" style={{ marginTop: '0.75rem' }}>
                          <CheckCircle size={14} /> Mark as Treated
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </>
  );
}

const styles = {
  uploadZone: {
    border: '2px dashed var(--border-light)',
    borderRadius: 'var(--radius-sm)',
    padding: '2rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'border-color 0.2s',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 160,
    background: 'var(--bg-secondary)',
  },
  alertCard: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    overflow: 'hidden',
  },
  alertHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0.875rem 1rem',
    cursor: 'pointer',
  },
  alertBody: {
    padding: '1rem',
    borderTop: '1px solid var(--border)',
    background: 'var(--bg-card)',
  },
  confidence: {
    fontSize: '0.8rem',
    fontWeight: 700,
    color: 'var(--accent)',
    background: 'var(--accent-glow)',
    padding: '0.15rem 0.5rem',
    borderRadius: 999,
  },
  infoLabel: {
    fontSize: '0.72rem',
    fontWeight: 600,
    color: 'var(--text-muted)',
    letterSpacing: '0.06em',
    textTransform: 'uppercase',
    marginBottom: '0.4rem',
  },
  symptomList: { listStyle: 'none', padding: 0 },
};
