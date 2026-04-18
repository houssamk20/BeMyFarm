import { json, err } from '../cors.js';

const CACHE_TTL = 600; // 10 minutes

export async function handleWeather(request, env, pathname) {
  const { CACHE, OPENWEATHER_API_KEY } = env;
  const url = new URL(request.url);

  // GET /v1/weather/current
  if (pathname === '/v1/weather/current' && request.method === 'GET') {
    const cached = await CACHE?.get('weather:current');
    if (cached) return json(JSON.parse(cached));

    if (OPENWEATHER_API_KEY) {
      const lat = url.searchParams.get('lat') || '36.7369';
      const lon = url.searchParams.get('lon') || '3.0865';
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
      );
      if (res.ok) {
        const ow = await res.json();
        const data = {
          temp:     Math.round(ow.main.temp),
          humidity: ow.main.humidity,
          desc:     ow.weather[0].description,
          wind:     ow.wind.speed,
        };
        await CACHE?.put('weather:current', JSON.stringify(data), { expirationTtl: CACHE_TTL });
        return json(data);
      }
    }

    // Fallback static data
    return json({ temp: 24, humidity: 60, desc: 'clear sky', wind: 12 });
  }

  // GET /v1/weather/forecast
  if (pathname === '/v1/weather/forecast' && request.method === 'GET') {
    const cached = await CACHE?.get('weather:forecast');
    if (cached) return json(JSON.parse(cached));

    if (OPENWEATHER_API_KEY) {
      const lat = url.searchParams.get('lat') || '36.7369';
      const lon = url.searchParams.get('lon') || '3.0865';
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric&cnt=7`
      );
      if (res.ok) {
        const ow = await res.json();
        const days = ['Today','Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
        const data = ow.list.slice(0, 7).map((item, i) => ({
          day:      days[i] || `Day ${i}`,
          icon:     item.weather[0].main === 'Rain' ? 'cloud-rain' : item.weather[0].main === 'Clouds' ? 'cloud' : 'sun',
          temp:     Math.round(item.main.temp_max),
          low:      Math.round(item.main.temp_min),
          humidity: item.main.humidity,
          rain:     Math.round((item.pop || 0) * 100),
        }));
        await CACHE?.put('weather:forecast', JSON.stringify(data), { expirationTtl: CACHE_TTL });
        return json(data);
      }
    }

    // Fallback
    return json([
      { day: 'Today',   icon: 'sun',        temp: 24, low: 18, humidity: 60, rain: 5  },
      { day: 'Tue',     icon: 'cloud-sun',  temp: 22, low: 16, humidity: 65, rain: 20 },
      { day: 'Wed',     icon: 'cloud-rain', temp: 18, low: 14, humidity: 80, rain: 75 },
      { day: 'Thu',     icon: 'cloud',      temp: 20, low: 15, humidity: 72, rain: 30 },
      { day: 'Fri',     icon: 'sun',        temp: 25, low: 19, humidity: 55, rain: 5  },
      { day: 'Sat',     icon: 'sun',        temp: 27, low: 20, humidity: 50, rain: 0  },
      { day: 'Sun',     icon: 'cloud-sun',  temp: 23, low: 17, humidity: 62, rain: 15 },
    ]);
  }

  return null;
}
