import { json, err } from '../cors.js';

export async function handleAi(request, env, pathname) {
  const { DB } = env;

  // GET /v1/ai/recommendations
  if (pathname === '/v1/ai/recommendations' && request.method === 'GET') {
    const { results } = await DB.prepare(`
      SELECT r.*, f.name AS field_name
      FROM ai_recommendations r
      LEFT JOIN fields f ON r.field_id = f.id
      WHERE r.done = 0
      ORDER BY CASE r.priority WHEN 'high' THEN 1 WHEN 'medium' THEN 2 ELSE 3 END,
               r.created_at DESC
    `).all();
    return json(results);
  }

  // PATCH /v1/ai/recommendations/:id/done
  const doneMatch = pathname.match(/^\/v1\/ai\/recommendations\/(\d+)\/done$/);
  if (doneMatch && request.method === 'PATCH') {
    await DB.prepare('UPDATE ai_recommendations SET done = 1 WHERE id = ?')
      .bind(doneMatch[1]).run();
    return json({ done: true });
  }

  // POST /v1/ai/recommendations  — create programmatically
  if (pathname === '/v1/ai/recommendations' && request.method === 'POST') {
    const body = await request.json();
    const { field_id, priority, category, title, reason, action, impact, confidence } = body;
    if (!title || !priority || !category) return err('title, priority, category required');

    const { meta } = await DB.prepare(`
      INSERT INTO ai_recommendations (field_id,priority,category,title,reason,action,impact,confidence)
      VALUES (?,?,?,?,?,?,?,?)
    `).bind(field_id, priority, category, title, reason, action, impact, confidence || 0).run();

    return json({ id: meta.last_row_id, created: true }, 201);
  }

  // POST /v1/ai/soil-ingest  — ingest soil readings from IoT sensors
  if (pathname === '/v1/ai/soil-ingest' && request.method === 'POST') {
    const body = await request.json();
    const { field_id, moisture_pct, temp_c, ph, nitrogen_ppm, phosphorus_ppm, potassium_ppm } = body;
    if (!field_id) return err('field_id required');

    await DB.prepare(`
      INSERT INTO soil_readings (field_id,moisture_pct,temp_c,ph,nitrogen_ppm,phosphorus_ppm,potassium_ppm)
      VALUES (?,?,?,?,?,?,?)
    `).bind(field_id, moisture_pct, temp_c, ph, nitrogen_ppm, phosphorus_ppm, potassium_ppm).run();

    // Auto-generate recommendation if moisture is high
    if (moisture_pct > 75) {
      await DB.prepare(`
        INSERT INTO ai_recommendations (field_id,priority,category,title,reason,action,impact,confidence)
        VALUES (?,?,?,?,?,?,?,?)
      `).bind(
        field_id, 'high', 'Irrigation',
        `Reduce irrigation — Field ${field_id}`,
        `Soil moisture at ${moisture_pct}% — overwatering risk detected.`,
        'Skip next irrigation cycle.',
        'Prevent root stress and water waste.',
        88
      ).run();
    }

    return json({ saved: true }, 201);
  }

  return null;
}
