import axios from 'axios';

// In dev:  set VITE_API_URL=http://localhost:8787 in .env.local
// In prod: set VITE_API_URL=https://bemyfarm-api.<your-subdomain>.workers.dev in .env.production
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:8787') + '/v1',
  timeout: 8000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('bmf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Field sensor data
export const fieldApi = {
  getStats:        ()                  => api.get('/fields/stats'),
  getSoilTrend:    (fieldId, days = 7) => api.get(`/fields/${fieldId}/soil-trend`, { params: { days } }),
  getYieldForecast:()                  => api.get('/fields/yield-forecast'),
  getFields:       ()                  => api.get('/fields'),
};

// Weather  (pass lat/lon for your farm location)
export const weatherApi = {
  getForecast: (lat, lon) => api.get('/weather/forecast', { params: { lat, lon } }),
  getCurrent:  ()         => api.get('/weather/current'),
};

// Disease detection
export const diseaseApi = {
  getAlerts:    ()         => api.get('/disease/alerts'),
  getHistory:   ()         => api.get('/disease/history'),
  resolveAlert: (id)       => api.patch(`/disease/alerts/${id}/resolve`),
  analyzeImage: (formData) => api.post('/disease/analyze', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

// Water quality
export const waterApi = {
  getQuality:   ()           => api.get('/water/quality'),
  getTrend:     (hours = 24) => api.get('/water/trend', { params: { hours } }),
  ingestReading:(data)       => api.post('/water/readings', data),
};

// AI recommendations + IoT soil ingest
export const aiApi = {
  getRecommendations: ()     => api.get('/ai/recommendations'),
  markDone:           (id)   => api.patch(`/ai/recommendations/${id}/done`),
  ingestSoil:         (data) => api.post('/ai/soil-ingest', data),
};

// Health check
export const healthApi = {
  ping: () => api.get('/health'),
};

export default api;
