# BeMyFarm — Cloudflare Deployment Guide

## Stack
- **Frontend** → Cloudflare Pages (Vite/React)
- **Backend**  → Cloudflare Workers (fetch handler)
- **Database** → Cloudflare D1 (SQLite at the edge)
- **Cache**    → Cloudflare KV

---

## 1. Login to Cloudflare

```bash
wrangler login
```

---

## 2. Create D1 database

```bash
cd backend
wrangler d1 create bemyfarm-db
```

Copy the `database_id` from the output and paste it in `backend/wrangler.toml`:

```toml
[[d1_databases]]
database_id = "PASTE_HERE"
```

---

## 3. Create KV namespace

```bash
wrangler kv namespace create CACHE
wrangler kv namespace create CACHE --preview
```

Paste the returned `id` and `preview_id` in `backend/wrangler.toml`:

```toml
[[kv_namespaces]]
id         = "PASTE_ID_HERE"
preview_id = "PASTE_PREVIEW_ID_HERE"
```

---

## 4. Run migrations

```bash
# Apply schema
wrangler d1 migrations apply bemyfarm-db

# Seed with sample data
wrangler d1 execute bemyfarm-db --file=migrations/seed.sql
```

---

## 5. Set secrets

```bash
wrangler secret put OPENWEATHER_API_KEY   # from openweathermap.org (free tier)
```

---

## 6. Run locally

```bash
# Terminal 1 — backend worker
cd backend
npm run dev          # → http://localhost:8787

# Terminal 2 — frontend
cd ..
npm run dev          # → http://localhost:5173
```

---

## 7. Deploy backend (Worker)

```bash
cd backend
npm run deploy
```

Note the deployed URL (e.g. `https://bemyfarm-api.myname.workers.dev`).

Update `backend/wrangler.toml`:
```toml
[vars]
CORS_ORIGIN = "https://bemyfarm.pages.dev"   # your Pages domain
```

---

## 8. Deploy frontend (Pages)

Update `.env.production`:
```
VITE_API_URL=https://bemyfarm-api.myname.workers.dev
```

Then build and deploy:
```bash
cd ..
npm run build
wrangler pages deploy dist --project-name bemyfarm
```

---

## API Endpoints Summary

| Method | Path | Description |
|--------|------|-------------|
| GET | `/v1/health` | Health check |
| GET | `/v1/fields` | List all fields |
| GET | `/v1/fields/stats` | KPI cards |
| GET | `/v1/fields/yield-forecast` | Yield chart data |
| GET | `/v1/fields/:id/soil-trend` | Soil trend by field |
| GET | `/v1/weather/current` | Current weather |
| GET | `/v1/weather/forecast` | 7-day forecast |
| GET | `/v1/disease/alerts` | Active disease alerts |
| GET | `/v1/disease/history` | Monthly case history |
| POST | `/v1/disease/alerts` | Create alert |
| PATCH | `/v1/disease/alerts/:id/resolve` | Resolve alert |
| GET | `/v1/water/quality` | Water quality score |
| GET | `/v1/water/trend` | 24h sensor trend |
| POST | `/v1/water/readings` | Ingest sensor data |
| GET | `/v1/ai/recommendations` | AI recommendations |
| PATCH | `/v1/ai/recommendations/:id/done` | Mark done |
| POST | `/v1/ai/soil-ingest` | Ingest soil + auto-recommend |
