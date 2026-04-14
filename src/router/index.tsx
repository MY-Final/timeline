import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'

const HomePage = lazy(() => import('@/pages/Home/index.tsx'))
const TimelinePage = lazy(() => import('@/pages/Timeline/index.tsx'))
const TagPage = lazy(() => import('@/pages/Tag/index.tsx'))

export default function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/tags" element={<TagPage />} />
      </Routes>
    </Suspense>
  )
}
