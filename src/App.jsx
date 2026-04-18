import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Weather from './pages/Weather';
import Disease from './pages/Disease';
import WaterQuality from './pages/WaterQuality';
import AiAdvisor from './pages/AiAdvisor';
import Settings from './pages/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/"          element={<Dashboard />} />
          <Route path="/weather"   element={<Weather />} />
          <Route path="/disease"   element={<Disease />} />
          <Route path="/water"     element={<WaterQuality />} />
          <Route path="/ai"        element={<AiAdvisor />} />
          <Route path="/settings"  element={<Settings />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
