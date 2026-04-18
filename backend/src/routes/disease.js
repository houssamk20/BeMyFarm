import { json, err } from '../cors.js';

export async function handleDisease(request, env, pathname) {
  const { DB } = env;

  // GET /v1/disease/alerts
  if (pathname === '/v1/disease/alerts' && request.method === 'GET') {
    const { results } = await DB.prepare(`
      SELECT da.*, f.name AS field
      FROM disease_alerts da
      LEFT JOIN fields f ON da.field_id = f.id
      WHERE da.resolved = 0
      ORDER BY CASE da.severity WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END
    `).all();

    return json(results.map(r => ({
      ...r,
      symptoms: JSON.parse(r.symptoms || '[]'),
      detected: r.detected_at?.split('T')[0],
    })));
  }

  // GET /v1/disease/history
  if (pathname === '/v1/disease/history' && request.method === 'GET') {
    const { results } = await DB.prepare(`
      SELECT strftime('%b', detected_at) AS month, COUNT(*) AS cases
      FROM disease_alerts
      GROUP BY strftime('%Y-%m', detected_at)
      ORDER BY detected_at
      LIMIT 7
    `).all();
    return json(results);
  }

  // POST /v1/disease/alerts  — create new alert
  if (pathname === '/v1/disease/alerts' && request.method === 'POST') {
    const body = await request.json();
    const { field_id, name, crop, severity, confidence, treatment, symptoms } = body;
    if (!name || !crop || !severity) return err('name, crop, severity required');

    const { meta } = await DB.prepare(`
      INSERT INTO disease_alerts (field_id,name,crop,severity,confidence,treatment,symptoms)
      VALUES (?,?,?,?,?,?,?)
    `).bind(field_id, name, crop, severity, confidence || 0, treatment || '', JSON.stringify(symptoms || [])).run();

    return json({ id: meta.last_row_id, created: true }, 201);
  }

  // PATCH /v1/disease/alerts/:id/resolve
  const resolveMatch = pathname.match(/^\/v1\/disease\/alerts\/(\d+)\/resolve$/);
  if (resolveMatch && request.method === 'PATCH') {
    await DB.prepare('UPDATE disease_alerts SET resolved = 1 WHERE id = ?')
      .bind(resolveMatch[1]).run();
    return json({ resolved: true });
  }

  return null;
}
