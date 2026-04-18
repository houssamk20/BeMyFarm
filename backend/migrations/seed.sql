-- Seed data for local development

INSERT OR IGNORE INTO fields VALUES ('A','Field A','Tomato',4.2,72,'alert','2024-01-01');
INSERT OR IGNORE INTO fields VALUES ('B','Field B','Soybean',3.8,85,'good','2024-01-01');
INSERT OR IGNORE INTO fields VALUES ('C','Field C','Wheat',6.1,91,'good','2024-01-01');
INSERT OR IGNORE INTO fields VALUES ('D','Field D','Corn',5.5,88,'good','2024-01-01');

INSERT INTO soil_readings (field_id,moisture_pct,temp_c,ph,nitrogen_ppm,phosphorus_ppm,potassium_ppm)
VALUES ('A',68,24,6.8,42,28,35),
       ('B',65,23,6.5,38,24,30),
       ('C',71,25,6.2,30,18,25),
       ('D',69,24,6.6,35,22,32);

INSERT INTO disease_alerts (field_id,name,crop,severity,confidence,treatment,symptoms)
VALUES
  ('A','Late Blight','Tomato','high',94,'Apply copper-based fungicide; remove infected leaves.','["Dark lesions on leaves","White mold on underside","Rapid spread"]'),
  ('C','Powdery Mildew','Wheat','medium',87,'Apply sulfur-based fungicide; improve air circulation.','["White powder on leaves","Yellowing","Stunted growth"]'),
  ('B','Root Rot','Soybean','low',71,'Improve drainage; apply fungicide drench.','["Wilting","Brown root discoloration","Poor stand"]');

INSERT INTO water_readings (ph,dissolved_o2,nitrate,turbidity,conductivity,temp_c)
VALUES (7.2,7.8,4.2,3.5,380,18.5);

INSERT INTO ai_recommendations (field_id,priority,category,title,reason,action,impact,confidence)
VALUES
  ('A','high','Irrigation','Reduce irrigation by 20%','Soil moisture at 68% — overwatering risk.','Skip Tuesday irrigation cycle.','Save ~340L water',91),
  ('B','medium','Fertilization','Apply nitrogen supplement','Leaf color index shows 12% deficiency.','Apply 30 kg/ha urea within 5 days.','Expected +8% yield',85),
  ('A','high','Pest Control','Spray fungicide — Field A','Late Blight detected at 94% confidence.','Apply copper-based fungicide tomorrow.','Prevent 40% crop loss',94),
  ('C','low','Harvest','Optimal harvest window','Wheat moisture at 14.2%. Dry forecast Fri–Sun.','Schedule harvest Saturday.','Maximize grain quality',78);
