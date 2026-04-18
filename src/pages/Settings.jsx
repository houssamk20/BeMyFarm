import { useState } from 'react';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import Topbar from '../components/Topbar';

export default function Settings() {
  const [form, setForm] = useState({
    apiUrl: import.meta.env.VITE_API_URL || '',
    weatherApiKey: '',
    refreshInterval: '30',
    alertEmail: '',
    units: 'metric',
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <>
      <Topbar title="Settings" subtitle="API keys, units, and preferences" />
      <div className="page" style={{ maxWidth: 700 }}>
        <form onSubmit={handleSave}>

          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="section-title"><SettingsIcon size={18} /> API Configuration</div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Backend API URL</label>
              <input
                name="apiUrl"
                className="input"
                placeholder="https://your-api.com/v1"
                value={form.apiUrl}
                onChange={handleChange}
              />
              <span style={styles.hint}>Set VITE_API_URL in .env to pre-fill this.</span>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Weather API Key (OpenWeatherMap)</label>
              <input
                name="weatherApiKey"
                className="input"
                type="password"
                placeholder="sk-..."
                value={form.weatherApiKey}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <div className="section-title"><SettingsIcon size={18} /> Preferences</div>
            <div className="grid-2" style={{ gap: '1rem' }}>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Auto-refresh interval (seconds)</label>
                <select name="refreshInterval" className="input" value={form.refreshInterval} onChange={handleChange}>
                  <option value="15">15s</option>
                  <option value="30">30s</option>
                  <option value="60">1 min</option>
                  <option value="300">5 min</option>
                </select>
              </div>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Units</label>
                <select name="units" className="input" value={form.units} onChange={handleChange}>
                  <option value="metric">Metric (°C, kg, L)</option>
                  <option value="imperial">Imperial (°F, lb, gal)</option>
                </select>
              </div>
            </div>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Alert email address</label>
              <input
                name="alertEmail"
                className="input"
                type="email"
                placeholder="farmer@example.com"
                value={form.alertEmail}
                onChange={handleChange}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 2rem' }}>
            <Save size={16} />
            {saved ? 'Saved!' : 'Save Settings'}
          </button>
        </form>
      </div>
    </>
  );
}

const styles = {
  fieldGroup: { marginBottom: '1rem' },
  label: { display: 'block', fontSize: '0.83rem', fontWeight: 500, color: 'var(--text-muted)', marginBottom: '0.4rem' },
  hint: { fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem', display: 'block' },
};
