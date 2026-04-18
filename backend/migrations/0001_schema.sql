-- BeMyFarm D1 Schema

CREATE TABLE IF NOT EXISTS fields (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  crop        TEXT NOT NULL,
  area_ha     REAL NOT NULL,
  health_pct  INTEGER DEFAULT 100,
  status      TEXT DEFAULT 'good',
  created_at  TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS soil_readings (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  field_id     TEXT NOT NULL REFERENCES fields(id),
  recorded_at  TEXT DEFAULT (datetime('now')),
  moisture_pct REAL,
  temp_c       REAL,
  ph           REAL,
  nitrogen_ppm REAL,
  phosphorus_ppm REAL,
  potassium_ppm  REAL
);

CREATE TABLE IF NOT EXISTS disease_alerts (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  field_id    TEXT REFERENCES fields(id),
  name        TEXT NOT NULL,
  crop        TEXT NOT NULL,
  severity    TEXT NOT NULL CHECK(severity IN ('high','medium','low')),
  confidence  INTEGER NOT NULL,
  treatment   TEXT,
  symptoms    TEXT,        -- JSON array stored as text
  detected_at TEXT DEFAULT (datetime('now')),
  resolved    INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS water_readings (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  recorded_at   TEXT DEFAULT (datetime('now')),
  ph            REAL,
  dissolved_o2  REAL,
  nitrate       REAL,
  turbidity     REAL,
  conductivity  REAL,
  temp_c        REAL
);

CREATE TABLE IF NOT EXISTS ai_recommendations (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  field_id    TEXT REFERENCES fields(id),
  priority    TEXT NOT NULL CHECK(priority IN ('high','medium','low')),
  category    TEXT NOT NULL,
  title       TEXT NOT NULL,
  reason      TEXT,
  action      TEXT,
  impact      TEXT,
  confidence  INTEGER,
  done        INTEGER DEFAULT 0,
  created_at  TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_soil_field    ON soil_readings(field_id);
CREATE INDEX IF NOT EXISTS idx_disease_field ON disease_alerts(field_id);
CREATE INDEX IF NOT EXISTS idx_ai_field      ON ai_recommendations(field_id);
