import { Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/Home/index.tsx'
import TimelinePage from '@/pages/Timeline/index.tsx'
import TagPage from '@/pages/Tag/index.tsx'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/timeline" element={<TimelinePage />} />
      <Route path="/tags" element={<TagPage />} />
    </Routes>
  )
}
