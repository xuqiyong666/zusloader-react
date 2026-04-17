import { BrowserRouter, Route, Routes } from 'react-router-dom'

import { MicroAppDevPage } from './pages/MicroAppDevPage'
import { HomePage } from './pages/HomePage.tsx'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dev/:appKey" element={<MicroAppDevPage />} />
        <Route path="/dev/:appKey/:pagePath" element={<MicroAppDevPage />} />
        <Route path="*" element={<div>Page Not Found</div>} />
      </Routes>
    </BrowserRouter>
  )
}
