import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { 
  BarChart3, TrendingUp, Calendar, Package, Users, 
  RefreshCw, Filter
} from 'lucide-react'
import { adminAPI } from '../../services/api'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const AdminReportsPage = () => {
  const [reportType, setReportType] = useState('items')
  const [period, setPeriod] = useState('month')

  const { data: reportsData, isLoading } = useQuery({
    queryKey: ['adminReports', reportType, period],
    queryFn: () => adminAPI.getReports({ type: reportType, period }),
    enabled: true
  })

  const report = reportsData?.data?.report || reportsData?.report

  const reportTypes = [
    { id: 'items', label: 'Items Report', icon: Package },
    { id: 'users', label: 'Users Report', icon: Users },
    { id: 'swaps', label: 'Swaps Report', icon: RefreshCw }
  ]

  const periods = [
    { id: 'day', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'year', label: 'This Year' }
  ]

  const renderReportContent = () => {
    if (!report) return null

    switch (reportType) {
      case 'items':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Items</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{report.total}</h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Approved</p>
                  <h3 className="text-2xl font-bold text-green-600 mt-1">{report.approved}</h3>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Rejected</p>
                  <h3 className="text-2xl font-bold text-red-600 mt-1">{report.rejected}</h3>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <h3 className="text-2xl font-bold text-yellow-600 mt-1">{report.pending}</h3>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'users':
        return (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Users</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{report.total}</h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">New Users</p>
                  <h3 className="text-2xl font-bold text-green-600 mt-1">{report.new}</h3>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Users</p>
                  <h3 className="text-2xl font-bold text-purple-600 mt-1">{report.active}</h3>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="w-6 h-6 bg-purple-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        )

      case 'swaps':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Swaps</p>
                  <h3 className="text-2xl font-bold text-gray-800 mt-1">{report.total}</h3>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <RefreshCw className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <h3 className="text-2xl font-bold text-green-600 mt-1">{report.completed}</h3>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="w-6 h-6 bg-green-500 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Pending</p>
                  <h3 className="text-2xl font-bold text-yellow-600 mt-1">{report.pending}</h3>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Cancelled</p>
                  <h3 className="text-2xl font-bold text-red-600 mt-1">{report.cancelled}</h3>
                </div>
                <div className="p-3 bg-red-50 rounded-lg">
                  <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Platform Reports</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-sm">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="border-none outline-none text-sm"
            >
              {reportTypes.map((type) => (
                <option key={type.id} value={type.id}>{type.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="border-none outline-none text-sm"
            >
              {periods.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="xl" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Report Header */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {reportTypes.find(t => t.id === reportType)?.label}
                </h3>
                <p className="text-gray-600">
                  {periods.find(p => p.id === period)?.label} • Generated on {new Date().toLocaleDateString()}
                </p>
              </div>
              <div className="p-3 bg-indigo-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Report Content */}
          {renderReportContent()}

          {/* Summary */}
          {report && (
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Summary</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Report Period</p>
                  <p className="font-medium">{periods.find(p => p.id === period)?.label}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Records</p>
                  <p className="font-medium">{report.total || 0}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Generated At</p>
                  <p className="font-medium">{new Date().toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium text-green-600">Complete</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default AdminReportsPage 