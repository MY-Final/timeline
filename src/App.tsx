import { BrowserRouter } from 'react-router-dom'
import AppRoutes from '@/router/index.tsx'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  )
}
