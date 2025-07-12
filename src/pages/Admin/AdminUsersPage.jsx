import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Users, Search, Shield, User, Calendar, Package, 
  TrendingUp, Edit, Save, X
} from 'lucide-react'
import { adminAPI } from '../../services/api'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const AdminUsersPage = () => {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [editingUser, setEditingUser] = useState(null)
  const [editForm, setEditForm] = useState({})
  const queryClient = useQueryClient()

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['adminUsers', search, page],
    queryFn: () => adminAPI.getUsers({ search, page, limit: 20 }),
    enabled: true
  })

  const users = usersData?.data?.users || usersData?.users || []
  const pagination = usersData?.data?.pagination || usersData?.pagination

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }) => adminAPI.updateUserRole(userId, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers'])
      queryClient.invalidateQueries(['adminDashboard'])
      setEditingUser(null)
      setEditForm({})
    },
    onError: (error) => {
      // Error handled silently
    }
  })

  const updatePointsMutation = useMutation({
    mutationFn: ({ userId, points }) => adminAPI.updateUserPoints(userId, { points }),
    onSuccess: () => {
      queryClient.invalidateQueries(['adminUsers'])
      queryClient.invalidateQueries(['adminDashboard'])
      setEditingUser(null)
      setEditForm({})
    },
    onError: (error) => {
      // Error handled silently
    }
  })

  const handleEdit = (user) => {
    setEditingUser(user._id)
    setEditForm({
      role: user.role,
      points: user.points
    })
  }

  const handleSave = () => {
    if (editForm.role !== editingUser.role) {
      updateRoleMutation.mutate({ userId: editingUser, role: editForm.role })
    }
    if (editForm.points !== editingUser.points) {
      updatePointsMutation.mutate({ userId: editingUser, points: editForm.points })
    }
  }

  const handleCancel = () => {
    setEditingUser(null)
    setEditForm({})
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Users Management</h2>
        <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-sm">
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-none outline-none text-sm"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="xl" />
        </div>
      ) : (
        <>
          {/* Users Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Points
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Items
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <User className="w-5 h-5 text-indigo-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.firstName} {user.lastName}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{user.username}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingUser === user._id ? (
                          <select
                            value={editForm.role}
                            onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                            className="text-sm border border-gray-300 rounded px-2 py-1"
                          >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            user.role === 'admin' 
                              ? 'bg-red-100 text-red-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {user.role === 'admin' ? (
                              <>
                                <Shield className="w-3 h-3 mr-1" />
                                Admin
                              </>
                            ) : (
                              <>
                                <User className="w-3 h-3 mr-1" />
                                User
                              </>
                            )}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingUser === user._id ? (
                          <input
                            type="number"
                            value={editForm.points}
                            onChange={(e) => setEditForm({ ...editForm, points: parseInt(e.target.value) || 0 })}
                            className="text-sm border border-gray-300 rounded px-2 py-1 w-20"
                            min="0"
                          />
                        ) : (
                          <div className="text-sm text-gray-900 font-medium">
                            {user.points} pts
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <Package className="w-4 h-4 mr-1" />
                          {user.itemsCount || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(user.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {editingUser === user._id ? (
                          <div className="flex space-x-2">
                            <button
                              onClick={handleSave}
                              disabled={updateRoleMutation.isLoading || updatePointsMutation.isLoading}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Save className="w-4 h-4" />
                            </button>
                            <button
                              onClick={handleCancel}
                              className="text-gray-600 hover:text-gray-900"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleEdit(user)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 mt-6">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-2 bg-white rounded-lg shadow-sm disabled:opacity-50"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm">
                Page {page} of {pagination.totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.totalPages}
                className="px-3 py-2 bg-white rounded-lg shadow-sm disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AdminUsersPage 