import { Routes, Route } from 'react-router-dom'
import GlobeHome from './pages/GlobeHome.jsx'
import TrailExperience from './pages/TrailExperience.jsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<GlobeHome />} />
      <Route path="/trail/:trailId" element={<TrailExperience />} />
    </Routes>
  )
}
