import { Routes, Route } from 'react-router-dom'
import TimelinePage from '@/pages/Timeline/index.tsx'
import HomePage from '@/pages/Home/index.tsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/timeline" element={<TimelinePage />} />
    </Routes>
  )
}
