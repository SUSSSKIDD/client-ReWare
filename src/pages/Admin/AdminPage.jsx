import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { 
  Users, Package, TrendingUp, Shield, 
  Settings, BarChart3, AlertTriangle, CheckCircle,
  ArrowLeft
} from 'lucide-react'
import { adminAPI } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import AdminItemsPage from './AdminItemsPage'
import AdminUsersPage from './AdminUsersPage'
import AdminReportsPage from './AdminReportsPage'

const AdminPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('items')

  // Check if user is admin
  if (!user || user.role !== 'admin') {
    return (
      <div className="pt-28 px-6 max-w-7xl mx-auto pb-20">
        <div className="text-center py-12">
          <Shield className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access the admin panel.</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'items', label: 'Items Management', icon: Package },
    { id: 'users', label: 'Users Management', icon: Users },
    { id: 'reports', label: 'Reports', icon: TrendingUp }
  ]

  const renderContent = () => {
    switch (activeTab) {
      case 'items':
        return <AdminItemsPage />
      case 'users':
        return <AdminUsersPage />
      case 'reports':
        return <AdminReportsPage />
      default:
        return <AdminItemsPage />
    }
  }

  return (
    <>
      <Helmet>
        <title>Admin Panel - ReWear</title>
        <meta name="description" content="ReWear admin panel" />
      </Helmet>

      <div className="pt-28 px-6 max-w-7xl mx-auto pb-20 relative">
        {/* Background */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50 to-orange-50 opacity-50"></div>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Admin Panel</h1>
              <p className="text-gray-600 mt-2">Manage ReWear platform and content</p>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Back to User Mode</span>
              </button>
              <div className="flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm">
                <Shield className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium text-gray-700">Admin Access</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-2 mb-8">
          <div className="flex space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-red-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
          {renderContent()}
        </div>
      </div>
    </>
  )
}

export default AdminPage 