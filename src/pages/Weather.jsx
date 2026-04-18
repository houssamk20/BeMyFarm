import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Cloud, Thermometer, Droplets, Wind } from 'lucide-react';
import Topbar from '../components/Topbar';
import { useApiData } from '../hooks/useApiData';
import { weatherApi, fieldApi } from '../services/api';
import { weatherForecast, soilLayers, soilTrend } from '../data/mockData';

const weatherIcons = {
  sun: '☀️', 'cloud-sun': '⛅', 'cloud-rain': '🌧️', cloud: '☁️',
};

export default function Weather() {
  const { data: forecast, refetch } = useApiData(weatherApi.getForecast, weatherForecast);
  const { data: trend } = useApiData(() => fieldApi.getSoilTrend('all'), soilTrend);

  const today = forecast[0];

  return (
    <>
      <Topbar title="Weather & Field Analysis" subtitle="Real-time conditions + soil data" onRefresh={refetch} />
      <div className="page">

        {/* Current conditions hero */}
        <div className="card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, #337418 0%, #5DD62C 100%)', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <span style={{ fontSize: '4rem' }}>{weatherIcons[today?.icon] || '🌤️'}</span>
              <div>
                <div style={{ fontSize: '3rem', fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>
                  {today?.temp}°C
                </div>
                <div style={{ color: 'rgba(255,255,255,0.8)', marginTop: '0.25rem' }}>Low {today?.low}°C · Today</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <MetricPill icon={<Droplets size={16} />} label="Humidity" value={`${today?.humidity}%`} />
              <MetricPill icon={<Cloud size={16} />} label="Rain chance" value={`${today?.rain}%`} />
              <MetricPill icon={<Wind size={16} />} label="Condition" value="Favorable" />
            </div>
          </div>
        </div>

        {/* 7-day forecast strip */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div className="section-title"><Cloud size={18} /> 7-Day Forecast</div>
          <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
            {forecast.map((d, i) => (
              <div key={i} style={styles.forecastCard}>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>{d.day}</div>
                <div style={{ fontSize: '1.75rem', margin: '0.5rem 0' }}>{weatherIcons[d.icon] || '🌤️'}</div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{d.temp}°</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{d.low}°</div>
                <div style={{ fontSize: '0.72rem', color: d.rain > 50 ? 'var(--info)' : 'var(--text-muted)', marginTop: '0.25rem' }}>
                  💧 {d.rain}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="grid-2" style={{ marginBottom: '1.5rem' }}>
          <div className="card">
            <div className="section-title"><Thermometer size={18} /> Temperature Trend</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Line type="monotone" dataKey="temp" stroke="var(--warning)" strokeWidth={2} dot={false} name="Temp °C" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="card">
            <div className="section-title"><Droplets size={18} /> Soil Moisture Trend</div>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={trend} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Tooltip contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Line type="monotone" dataKey="moisture" stroke="var(--accent)" strokeWidth={2} dot={false} name="Moisture %" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Soil profile table */}
        <div className="card">
          <div className="section-title"><Droplets size={18} /> Soil Profile by Depth</div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Depth</th>
                  <th>pH</th>
                  <th>Nitrogen (ppm)</th>
                  <th>Phosphorus (ppm)</th>
                  <th>Potassium (ppm)</th>
                  <th>Moisture</th>
                </tr>
              </thead>
              <tbody>
                {soilLayers.map((row) => (
                  <tr key={row.depth}>
                    <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{row.depth}</td>
                    <td>{row.ph}</td>
                    <td>{row.nitrogen}</td>
                    <td>{row.phosphorus}</td>
                    <td>{row.potassium}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div className="progress-bar" style={{ flex: 1 }}>
                          <div className="progress-bar-fill" style={{ width: `${row.moisture}%` }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', minWidth: 32 }}>{row.moisture}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </>
  );
}

function MetricPill({ icon, label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'rgba(255,255,255,0.75)', fontSize: '0.75rem' }}>
        {icon} {label}
      </div>
      <span style={{ fontWeight: 700, color: '#ffffff' }}>{value}</span>
    </div>
  );
}

const styles = {
  forecastCard: {
    background: 'var(--bg-secondary)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '0.75rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: 80,
    textAlign: 'center',
    flex: '0 0 auto',
  },
};
