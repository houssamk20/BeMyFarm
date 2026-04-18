// Central mock data — swap these out with real API calls via services/

export const fieldStats = [
  { id: 1, label: 'Soil Moisture', value: '68%', change: '+3%', trend: 'up', unit: '%', icon: 'droplets' },
  { id: 2, label: 'Temperature', value: '24°C', change: '-1°C', trend: 'down', unit: '°C', icon: 'thermometer' },
  { id: 3, label: 'Humidity', value: '72%', change: '+5%', trend: 'up', unit: '%', icon: 'cloud' },
  { id: 4, label: 'Crop Health', value: '89%', change: '+2%', trend: 'up', unit: '%', icon: 'leaf' },
];

export const soilTrend = [
  { day: 'Mon', moisture: 62, temp: 22 },
  { day: 'Tue', moisture: 65, temp: 23 },
  { day: 'Wed', moisture: 70, temp: 25 },
  { day: 'Thu', moisture: 68, temp: 24 },
  { day: 'Fri', moisture: 71, temp: 26 },
  { day: 'Sat', moisture: 69, temp: 23 },
  { day: 'Sun', moisture: 68, temp: 24 },
];

export const yieldForecast = [
  { month: 'Jan', actual: 4200, forecast: 4000 },
  { month: 'Feb', actual: 3800, forecast: 4100 },
  { month: 'Mar', actual: 5100, forecast: 4800 },
  { month: 'Apr', actual: 4700, forecast: 4900 },
  { month: 'May', actual: null, forecast: 5200 },
  { month: 'Jun', actual: null, forecast: 5600 },
];

export const weatherForecast = [
  { day: 'Today',   icon: 'sun',       temp: 24, low: 18, humidity: 60, rain: 5 },
  { day: 'Tue',     icon: 'cloud-sun', temp: 22, low: 16, humidity: 65, rain: 20 },
  { day: 'Wed',     icon: 'cloud-rain',temp: 18, low: 14, humidity: 80, rain: 75 },
  { day: 'Thu',     icon: 'cloud',     temp: 20, low: 15, humidity: 72, rain: 30 },
  { day: 'Fri',     icon: 'sun',       temp: 25, low: 19, humidity: 55, rain: 5 },
  { day: 'Sat',     icon: 'sun',       temp: 27, low: 20, humidity: 50, rain: 0 },
  { day: 'Sun',     icon: 'cloud-sun', temp: 23, low: 17, humidity: 62, rain: 15 },
];

export const soilLayers = [
  { depth: '0–10 cm',  ph: 6.8, nitrogen: 42, phosphorus: 28, potassium: 35, moisture: 68 },
  { depth: '10–30 cm', ph: 6.5, nitrogen: 38, phosphorus: 24, potassium: 30, moisture: 72 },
  { depth: '30–60 cm', ph: 6.2, nitrogen: 30, phosphorus: 18, potassium: 25, moisture: 65 },
];

export const diseaseAlerts = [
  {
    id: 1,
    name: 'Late Blight',
    crop: 'Tomato',
    severity: 'high',
    confidence: 94,
    field: 'Field A',
    detected: '2026-04-17',
    treatment: 'Apply copper-based fungicide; remove infected leaves.',
    symptoms: ['Dark lesions on leaves', 'White mold on underside', 'Rapid spread'],
  },
  {
    id: 2,
    name: 'Powdery Mildew',
    crop: 'Wheat',
    severity: 'medium',
    confidence: 87,
    field: 'Field C',
    detected: '2026-04-16',
    treatment: 'Apply sulfur-based fungicide; improve air circulation.',
    symptoms: ['White powder on leaves', 'Yellowing', 'Stunted growth'],
  },
  {
    id: 3,
    name: 'Root Rot',
    crop: 'Soybean',
    severity: 'low',
    confidence: 71,
    field: 'Field B',
    detected: '2026-04-15',
    treatment: 'Improve drainage; apply fungicide drench.',
    symptoms: ['Wilting', 'Brown root discoloration', 'Poor stand'],
  },
];

export const diseaseHistory = [
  { month: 'Oct', cases: 2 },
  { month: 'Nov', cases: 4 },
  { month: 'Dec', cases: 1 },
  { month: 'Jan', cases: 3 },
  { month: 'Feb', cases: 5 },
  { month: 'Mar', cases: 8 },
  { month: 'Apr', cases: 3 },
];

export const waterQuality = {
  overall: 82,
  status: 'Good',
  parameters: [
    { name: 'pH', value: 7.2, min: 6.5, max: 8.5, unit: '', status: 'good' },
    { name: 'Dissolved Oxygen', value: 7.8, min: 6.0, max: 12.0, unit: 'mg/L', status: 'good' },
    { name: 'Nitrate', value: 4.2, min: 0, max: 10.0, unit: 'mg/L', status: 'good' },
    { name: 'Turbidity', value: 3.5, min: 0, max: 4.0, unit: 'NTU', status: 'warning' },
    { name: 'Conductivity', value: 380, min: 0, max: 600, unit: 'µS/cm', status: 'good' },
    { name: 'Temperature', value: 18.5, min: 10, max: 25, unit: '°C', status: 'good' },
  ],
};

export const waterTrend = [
  { time: '00:00', ph: 7.0, oxygen: 7.5, nitrate: 4.0 },
  { time: '04:00', ph: 7.1, oxygen: 7.8, nitrate: 4.1 },
  { time: '08:00', ph: 7.3, oxygen: 8.2, nitrate: 4.3 },
  { time: '12:00', ph: 7.5, oxygen: 8.8, nitrate: 4.5 },
  { time: '16:00', ph: 7.4, oxygen: 8.5, nitrate: 4.4 },
  { time: '20:00', ph: 7.2, oxygen: 7.9, nitrate: 4.2 },
  { time: '24:00', ph: 7.1, oxygen: 7.6, nitrate: 4.1 },
];

export const aiRecommendations = [
  {
    id: 1,
    priority: 'high',
    category: 'Irrigation',
    title: 'Reduce irrigation by 20% — Field A',
    reason: 'Soil moisture at 68% — above optimal range for this crop stage. Overwatering risk detected.',
    action: 'Skip Tuesday irrigation cycle. Resume Thursday if moisture drops below 60%.',
    impact: 'Save ~340L water, prevent root stress.',
    confidence: 91,
  },
  {
    id: 2,
    priority: 'medium',
    category: 'Fertilization',
    title: 'Apply nitrogen supplement — Field B',
    reason: 'Leaf color index shows 12% deficiency. Soil nitrogen at lower bound for wheat growth stage.',
    action: 'Apply 30 kg/ha urea within next 5 days before rain event.',
    impact: 'Expected +8% yield improvement.',
    confidence: 85,
  },
  {
    id: 3,
    priority: 'high',
    category: 'Pest Control',
    title: 'Spray fungicide — Field A (Tomatoes)',
    reason: 'Late Blight detected at 94% confidence. Spread risk elevated by forecast rain.',
    action: 'Apply copper-based fungicide tomorrow morning before 9 AM.',
    impact: 'Prevent potential 40% crop loss.',
    confidence: 94,
  },
  {
    id: 4,
    priority: 'low',
    category: 'Harvest',
    title: 'Optimal harvest window — Field C',
    reason: 'Wheat moisture content at 14.2%. Forecast shows dry conditions Fri–Sun.',
    action: 'Schedule harvest for Saturday for best grain quality.',
    impact: 'Maximize grain quality and reduce drying costs.',
    confidence: 78,
  },
];

export const fields = [
  { id: 'A', name: 'Field A', crop: 'Tomato', area: '4.2 ha', health: 72, status: 'alert' },
  { id: 'B', name: 'Field B', crop: 'Soybean', area: '3.8 ha', health: 85, status: 'good' },
  { id: 'C', name: 'Field C', crop: 'Wheat', area: '6.1 ha', health: 91, status: 'good' },
  { id: 'D', name: 'Field D', crop: 'Corn', area: '5.5 ha', health: 88, status: 'good' },
];
