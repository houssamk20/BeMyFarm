import { json, err } from '../cors.js';

export async function handleFields(request, env, pathname) {
  const { DB } = env;

  // GET /v1/fields
  if (pathname === '/v1/fields' && request.method === 'GET') {
    const { results } = await DB.prepare('SELECT * FROM fields ORDER BY name').all();
    return json(results);
  }

  // GET /v1/fields/stats  — latest reading per field as KPI cards
  if (pathname === '/v1/fields/stats' && request.method === 'GET') {
    const { results: fields } = await DB.prepare('SELECT * FROM fields').all();
    const { results: latest } = await DB.prepare(`
      SELECT s.* FROM soil_readings s
      INNER JOIN (
        SELECT field_id, MAX(recorded_at) AS latest FROM soil_readings GROUP BY field_id
      ) t ON s.field_id = t.field_id AND s.recorded_at = t.latest
    `).all();

    const byField = Object.fromEntries(latest.map(r => [r.field_id, r]));
    const avgMoisture = latest.reduce((a, r) => a + r.moisture_pct, 0) / (latest.length || 1);
    const avgTemp     = latest.reduce((a, r) => a + r.temp_c,      0) / (latest.length || 1);
    const avgHealth   = fields.reduce((a, f) => a + f.health_pct,  0) / (fields.length || 1);

    return json([
      { id: 1, label: 'Soil Moisture', value: `${avgMoisture.toFixed(0)}%`, change: '+3%', trend: 'up',   icon: 'droplets' },
      { id: 2, label: 'Temperature',   value: `${avgTemp.toFixed(0)}°C`,    change: '-1°C', trend: 'down', icon: 'thermometer' },
      { id: 3, label: 'Humidity',      value: '72%',                        change: '+5%', trend: 'up',   icon: 'cloud' },
      { id: 4, label: 'Crop Health',   value: `${avgHealth.toFixed(0)}%`,   change: '+2%', trend: 'up',   icon: 'leaf' },
    ]);
  }

  // GET /v1/fields/yield-forecast
  if (pathname === '/v1/fields/yield-forecast' && request.method === 'GET') {
    return json([
      { month: 'Jan', actual: 4200, forecast: 4000 },
      { month: 'Feb', actual: 3800, forecast: 4100 },
      { month: 'Mar', actual: 5100, forecast: 4800 },
      { month: 'Apr', actual: 4700, forecast: 4900 },
      { month: 'May', actual: null, forecast: 5200 },
      { month: 'Jun', actual: null, forecast: 5600 },
    ]);
  }

  // GET /v1/fields/:id/soil-trend
  const soilMatch = pathname.match(/^\/v1\/fields\/([^/]+)\/soil-trend$/);
  if (soilMatch && request.method === 'GET') {
    const fieldId = soilMatch[1];
    const url     = new URL(request.url);
    const days    = parseInt(url.searchParams.get('days') || '7');
    const clause  = fieldId === 'all' ? '' : 'WHERE field_id = ?';
    const params  = fieldId === 'all' ? [days] : [fieldId, days];

    const { results } = await DB.prepare(`
      SELECT strftime('%a', recorded_at) AS day, AVG(moisture_pct) AS moisture, AVG(temp_c) AS temp
      FROM soil_readings
      ${clause}
      GROUP BY strftime('%Y-%m-%d', recorded_at)
      ORDER BY recorded_at DESC
      LIMIT ?
    `).bind(...params).all();

    return json(results.reverse());
  }

  return null;
}
