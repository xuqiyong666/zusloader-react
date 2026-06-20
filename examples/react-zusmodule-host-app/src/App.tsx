import { Navigate, Route, Routes } from 'react-router-dom'

import { AdminLayout } from './layouts/AdminLayout.tsx'
import { DashboardPage } from './pages/DashboardPage.tsx'
import { NotFoundPage } from './pages/NotFoundPage.tsx'
import ZusModuleHostPage from './pages/zusmoduleHost/index.tsx'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route
          path="zusmodule"
          element={<ZusModuleHostPage />}
        />
        <Route
          path="zusmodule/:microAppKey/*"
          element={<ZusModuleHostPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
