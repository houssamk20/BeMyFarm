import { json, err } from '../cors.js';

export async function handleWater(request, env, pathname) {
  const { DB } = env;

  // GET /v1/water/quality  — latest reading + computed score
  if (pathname === '/v1/water/quality' && request.method === 'GET') {
    const reading = await DB.prepare(`
      SELECT * FROM water_readings ORDER BY recorded_at DESC LIMIT 1
    `).first();

    if (!reading) return json({ overall: 0, status: 'No data', parameters: [] });

    const parameters = [
      { name: 'pH',                value: reading.ph,           min: 6.5, max: 8.5,  unit: '',      status: reading.ph >= 6.5 && reading.ph <= 8.5 ? 'good' : 'warning' },
      { name: 'Dissolved Oxygen',  value: reading.dissolved_o2, min: 6.0, max: 12.0, unit: 'mg/L',  status: reading.dissolved_o2 >= 6 ? 'good' : 'warning' },
      { name: 'Nitrate',           value: reading.nitrate,      min: 0,   max: 10.0, unit: 'mg/L',  status: reading.nitrate <= 10 ? 'good' : 'warning' },
      { name: 'Turbidity',         value: reading.turbidity,    min: 0,   max: 4.0,  unit: 'NTU',   status: reading.turbidity <= 4 ? 'good' : 'warning' },
      { name: 'Conductivity',      value: reading.conductivity, min: 0,   max: 600,  unit: 'µS/cm', status: reading.conductivity <= 600 ? 'good' : 'warning' },
      { name: 'Temperature',       value: reading.temp_c,       min: 10,  max: 25,   unit: '°C',    status: reading.temp_c >= 10 && reading.temp_c <= 25 ? 'good' : 'warning' },
    ];

    const goodCount = parameters.filter(p => p.status === 'good').length;
    const overall   = Math.round((goodCount / parameters.length) * 100);
    const status    = overall >= 80 ? 'Good' : overall >= 60 ? 'Fair' : 'Poor';

    return json({ overall, status, parameters });
  }

  // GET /v1/water/trend
  if (pathname === '/v1/water/trend' && request.method === 'GET') {
    const url   = new URL(request.url);
    const hours = parseInt(url.searchParams.get('hours') || '24');

    const { results } = await DB.prepare(`
      SELECT strftime('%H:%M', recorded_at) AS time,
             ph, dissolved_o2 AS oxygen, nitrate
      FROM water_readings
      WHERE recorded_at >= datetime('now', ? || ' hours')
      ORDER BY recorded_at
    `).bind(`-${hours}`).all();

    if (results.length === 0) {
      return json([
        { time: '00:00', ph: 7.0, oxygen: 7.5, nitrate: 4.0 },
        { time: '06:00', ph: 7.2, oxygen: 7.8, nitrate: 4.1 },
        { time: '12:00', ph: 7.4, oxygen: 8.2, nitrate: 4.3 },
        { time: '18:00', ph: 7.3, oxygen: 8.0, nitrate: 4.2 },
        { time: '24:00', ph: 7.1, oxygen: 7.6, nitrate: 4.1 },
      ]);
    }

    return json(results);
  }

  // POST /v1/water/readings  — ingest sensor data
  if (pathname === '/v1/water/readings' && request.method === 'POST') {
    const body = await request.json();
    const { ph, dissolved_o2, nitrate, turbidity, conductivity, temp_c } = body;

    await DB.prepare(`
      INSERT INTO water_readings (ph, dissolved_o2, nitrate, turbidity, conductivity, temp_c)
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(ph, dissolved_o2, nitrate, turbidity, conductivity, temp_c).run();

    return json({ saved: true }, 201);
  }

  return null;
}
