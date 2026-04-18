import { corsHeaders, json, err } from './cors.js';
import { handleFields  } from './routes/fields.js';
import { handleWeather } from './routes/weather.js';
import { handleDisease } from './routes/disease.js';
import { handleWater   } from './routes/water.js';
import { handleAi      } from './routes/ai.js';

export default {
  async fetch(request, env, ctx) {
    const url      = new URL(request.url);
    const pathname = url.pathname;
    const origin   = request.headers.get('Origin') || '*';
    const cors     = corsHeaders(env.CORS_ORIGIN || origin);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: cors });
    }

    // Route to handler
    let response;
    try {
      if (pathname.startsWith('/v1/fields'))  response = await handleFields(request, env, pathname);
      else if (pathname.startsWith('/v1/weather')) response = await handleWeather(request, env, pathname);
      else if (pathname.startsWith('/v1/disease')) response = await handleDisease(request, env, pathname);
      else if (pathname.startsWith('/v1/water'))   response = await handleWater(request, env, pathname);
      else if (pathname.startsWith('/v1/ai'))      response = await handleAi(request, env, pathname);
      else if (pathname === '/v1/health')          response = json({ status: 'ok', ts: Date.now() });
    } catch (e) {
      console.error(e);
      response = err('Internal server error', 500);
    }

    if (!response) response = err('Not found', 404);

    // Attach CORS headers to every response
    Object.entries(cors).forEach(([k, v]) => response.headers.set(k, v));
    return response;
  },
};
