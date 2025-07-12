import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Package, Eye, CheckCircle, XCircle, 
  Search, Filter, Calendar, User, AlertTriangle,
  RefreshCw, Info
} from 'lucide-react'
import { adminAPI } from '../../services/api'
import { getImageUrl } from '../../utils/imageUtils'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const AdminItemsPage = () => {
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [selectedItem, setSelectedItem] = useState(null)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const queryClient = useQueryClient()

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1) // Reset to first page when searching
    }, 500)

    return () => clearTimeout(timer)
  }, [search])

  const { data: itemsData, isLoading, error, refetch } = useQuery({
    queryKey: ['adminItems', status, debouncedSearch, page],
    queryFn: () => adminAPI.getItems({ status, search: debouncedSearch, page, limit: 20 }),
    enabled: true,
    staleTime: 0,
    retry: 2
  })

  const items = itemsData?.data?.items || itemsData?.items || []
  const pagination = itemsData?.data?.pagination || itemsData?.pagination

  const approveMutation = useMutation({
    mutationFn: (itemId) => adminAPI.approveItem(itemId),
    onSuccess: (_, itemId) => {
      // Optimistically update the item status in the cache
      queryClient.setQueryData(['adminItems', status, debouncedSearch, page], (oldData) => {
        if (!oldData) return oldData
        
        const items = oldData?.data?.items || oldData?.items || []
        const updatedItems = items.map(item => 
          item._id === itemId 
            ? { ...item, isApproved: true, isRejected: false, rejectionReason: null }
            : item
        )
        
        return {
          ...oldData,
          data: {
            ...oldData.data,
            items: updatedItems
          },
          items: updatedItems
        }
      })
      
      // Also invalidate all admin items queries to ensure consistency
      queryClient.invalidateQueries(['adminItems'])
    },
    onError: (error) => {
      // Error handled silently
    }
  })

  const rejectMutation = useMutation({
    mutationFn: ({ itemId, reason }) => adminAPI.rejectItem(itemId, { reason }),
    onSuccess: (_, { itemId, reason }) => {
      // Optimistically update the item status in the cache
      queryClient.setQueryData(['adminItems', status, debouncedSearch, page], (oldData) => {
        if (!oldData) return oldData
        
        const items = oldData?.data?.items || oldData?.items || []
        const updatedItems = items.map(item => 
          item._id === itemId 
            ? { ...item, isApproved: false, isRejected: true, rejectionReason: reason }
            : item
        )
        
        return {
          ...oldData,
          data: {
            ...oldData.data,
            items: updatedItems
          },
          items: updatedItems
        }
      })
      
      // Also invalidate all admin items queries to ensure consistency
      queryClient.invalidateQueries(['adminItems'])
      setShowRejectModal(false)
      setRejectReason('')
      setSelectedItem(null)
    },
    onError: (error) => {
      // Error handled silently
    }
  })



  const handleReject = () => {
    if (!rejectReason.trim()) {
      return
    }
    rejectMutation.mutate({ itemId: selectedItem._id, reason: rejectReason })
  }

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus)
    setPage(1) // Reset to first page when changing status
  }

  const getStatusBadge = (item) => {
    if (item.isRejected) {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
          Rejected
        </span>
      )
    }
    if (item.isApproved) {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
          Approved
        </span>
      )
    }
    return (
      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
        Pending
      </span>
    )
  }

  const getStatusCount = () => {
    if (!itemsData) return { pending: 0, approved: 0, rejected: 0, total: 0 }
    
    const items = itemsData?.data?.items || itemsData?.items || []
    return {
      pending: items.filter(item => !item.isApproved && !item.isRejected).length,
      approved: items.filter(item => item.isApproved).length,
      rejected: items.filter(item => item.isRejected).length,
      total: pagination?.totalItems || items.length
    }
  }

  const statusCounts = getStatusCount()

  if (error) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Error Loading Items</h3>
            <p className="text-gray-600 mb-4">{error.message || 'Failed to load items'}</p>
            <button
              onClick={() => refetch()}
              className="bg-indigo-500 text-white px-4 py-2 rounded-lg hover:bg-indigo-600 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2 inline" />
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Items Management</h2>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white rounded-lg px-3 py-2 shadow-sm">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search items, users, categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border-none outline-none text-sm w-64"
            />
          </div>
          <select
            value={status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="bg-white rounded-lg px-3 py-2 shadow-sm border-none outline-none text-sm"
          >
            <option value="all">All Items ({statusCounts.total})</option>
            <option value="pending">Pending ({statusCounts.pending})</option>
            <option value="approved">Approved ({statusCounts.approved})</option>
            <option value="rejected">Rejected ({statusCounts.rejected})</option>
          </select>
          <button
            onClick={() => refetch()}
            disabled={isLoading}
            className="bg-indigo-500 text-white p-2 rounded-lg hover:bg-indigo-600 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-800">{statusCounts.total}</p>
            </div>
            <Package className="w-8 h-8 text-indigo-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{statusCounts.approved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">{statusCounts.rejected}</p>
            </div>
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="xl" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Items Found</h3>
            <p className="text-gray-600">
              {search || status !== 'all' 
                ? 'No items match your current filters. Try adjusting your search or status filter.'
                : 'No items have been submitted yet.'
              }
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {items.map((item) => (
              <div key={item._id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                {/* Item Image */}
                <div className="relative aspect-square">
                  <img
                    src={getImageUrl(item.images?.[0], item._id, 0)}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/placeholder-item.svg'
                    }}
                  />
                  <div className="absolute top-2 right-2">
                    {getStatusBadge(item)}
                  </div>
                  {item.rejectionReason && (
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="bg-red-500 text-white text-xs p-2 rounded-lg">
                        <Info className="w-3 h-3 inline mr-1" />
                        Rejected: {item.rejectionReason.substring(0, 50)}...
                      </div>
                    </div>
                  )}
                </div>

                {/* Item Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 truncate">{item.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.description}</p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      <span>{item.owner?.firstName} {item.owner?.lastName}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-indigo-600">{item.pointsValue} pts</span>
                    <span className="text-sm text-gray-500 capitalize">{item.category}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {!item.isApproved && !item.isRejected && (
                      <button
                        onClick={() => approveMutation.mutate(item._id)}
                        disabled={approveMutation.isLoading}
                        className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        {approveMutation.isLoading ? (
                          <LoadingSpinner size="sm" />
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4 mr-1 inline" />
                            Approve
                          </>
                        )}
                      </button>
                    )}
                    
                    {!item.isRejected && (
                      <button
                        onClick={() => {
                          setSelectedItem(item)
                          setShowRejectModal(true)
                        }}
                        disabled={rejectMutation.isLoading}
                        className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        <XCircle className="w-4 h-4 mr-1 inline" />
                        Reject
                      </button>
                    )}


                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="px-3 py-2 bg-white rounded-lg shadow-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                Previous
              </button>
              <span className="px-3 py-2 text-sm">
                Page {page} of {pagination.totalPages} ({pagination.totalItems} items)
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === pagination.totalPages}
                className="px-3 py-2 bg-white rounded-lg shadow-sm disabled:opacity-50 hover:bg-gray-50 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Reject Item</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting "{selectedItem?.title}"
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowRejectModal(false)
                  setRejectReason('')
                  setSelectedItem(null)
                }}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={rejectMutation.isLoading}
                className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {rejectMutation.isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  'Reject Item'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminItemsPage 