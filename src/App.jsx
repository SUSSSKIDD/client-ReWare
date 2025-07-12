import { Routes, Route } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useAuth } from './hooks/useAuth'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/common/ProtectedRoute'
import LoadingSpinner from './components/common/LoadingSpinner'

// Pages
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/Auth/LoginPage'
import RegisterPage from './pages/Auth/RegisterPage'
import DashboardPage from './pages/Dashboard/DashboardPage'
import ItemsPage from './pages/Items/ItemsPage'
import ItemDetailPage from './pages/Items/ItemDetailPage'
import AddItemPage from './pages/Items/AddItemPage'
import SwapsPage from './pages/Swaps/SwapsPage'
import SwapDetailPage from './pages/Swaps/SwapDetailPage'
import AdminPage from './pages/Admin/AdminPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  const { isLoading } = useAuth()

  if (isLoading) {
    return <LoadingSpinner />
  }

  return (
    <>
      <Helmet>
        <title>ReWear - Community Clothing Exchange</title>
        <meta name="description" content="Exchange unused clothing through direct swaps or points-based redemptions." />
      </Helmet>
      
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Routes with Layout (includes Header navigation) */}
        <Route element={<Layout />}>
          <Route path="/items" element={<ItemsPage />} />
          <Route path="/items/:id" element={<ItemDetailPage />} />
        </Route>
        
        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/add-item" element={<AddItemPage />} />
            <Route path="/swaps" element={<SwapsPage />} />
            <Route path="/swaps/:id" element={<SwapDetailPage />} />
          </Route>
        </Route>
        
        {/* Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminPage />} />
        </Route>
        
        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App 