import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  ArrowLeft, 
  Check, 
  X, 
  MessageCircle, 
  Package,
  Heart,
  Calendar,
  MapPin,
  Star,
  Clock
} from 'lucide-react'
import { swapsAPI } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import { getImageUrl } from '../../utils/imageUtils'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Avatar from '../../components/common/Avatar'

const SwapDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: swap, isLoading, error } = useQuery({
    queryKey: ['swap', id],
    queryFn: () => swapsAPI.getById(id),
    enabled: !!id
  })

  const respondMutation = useMutation({
    mutationFn: ({ swapId, action }) => swapsAPI.respond(swapId, action),
    onSuccess: () => {
      queryClient.invalidateQueries(['swap', id])
      queryClient.invalidateQueries(['swaps'])
    }
  })

  const completeMutation = useMutation({
    mutationFn: (swapId) => swapsAPI.complete(swapId),
    onSuccess: () => {
      queryClient.invalidateQueries(['swap', id])
      queryClient.invalidateQueries(['swaps'])
    }
  })

  const cancelMutation = useMutation({
    mutationFn: (swapId) => swapsAPI.cancel(swapId),
    onSuccess: () => {
      queryClient.invalidateQueries(['swap', id])
      queryClient.invalidateQueries(['swaps'])
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="xl" />
      </div>
    )
  }

  if (error || !swap) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary-600">Swap not found</p>
      </div>
    )
  }

  const isOwner = user?._id === swap.owner._id
  const isRequester = user?._id === swap.requester._id
  const canRespond = isOwner && swap.status === 'pending'
  const canComplete = isOwner && swap.status === 'accepted'
  const canCancel = (isOwner || isRequester) && (swap.status === 'pending' || swap.status === 'accepted')

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      case 'accepted':
        return 'text-blue-600 bg-blue-100'
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'rejected':
        return 'text-red-600 bg-red-100'
      case 'cancelled':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-secondary-600 bg-secondary-100'
    }
  }

  const handleRespond = (action) => {
    respondMutation.mutate({ swapId: swap._id, action })
  }

  const handleComplete = () => {
    completeMutation.mutate(swap._id)
  }

  const handleCancel = () => {
    cancelMutation.mutate(swap._id)
  }

  return (
    <>
      <Helmet>
        <title>Swap Details - ReWear</title>
        <meta name="description" content="View swap request details" />
      </Helmet>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-secondary-600 hover:text-secondary-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Swaps
        </button>

        {/* Swap Header */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-secondary-900">
              Swap Request
            </h1>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(swap.status)}`}>
              <span className="capitalize">{swap.status}</span>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-secondary-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(swap.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              {swap.swapType === 'direct' ? (
                <Package className="w-4 h-4 mr-1" />
              ) : (
                <Heart className="w-4 h-4 mr-1" />
              )}
              {swap.swapType === 'direct' ? 'Direct Swap' : 'Points Swap'}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Requested Item */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Requested Item
            </h3>
            
            <div className="flex items-start space-x-4">
              <img
                src={getImageUrl(swap.requestedItem.images?.[0], swap.requestedItem._id, 0)}
                alt={swap.requestedItem.title}
                className="w-24 h-24 object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = '/placeholder-item.svg'
                }}
              />
              <div className="flex-1">
                <h4 className="font-medium text-secondary-900 mb-1">
                  {swap.requestedItem.title}
                </h4>
                <p className="text-sm text-secondary-600 mb-2">
                  {swap.requestedItem.category} • {swap.requestedItem.size}
                </p>
                <div className="flex items-center text-sm text-secondary-600">
                  <Heart className="w-4 h-4 mr-1 text-primary-600" />
                  <span className="font-medium text-primary-600">
                    {swap.requestedItem.pointsValue} points
                  </span>
                </div>
              </div>
            </div>

            {/* Owner Info */}
            <div className="mt-4 pt-4 border-t border-secondary-200">
              <h5 className="text-sm font-medium text-secondary-900 mb-2">Item Owner</h5>
              <div className="flex items-center space-x-3">
                <Avatar user={swap.owner} size="md" />
                <div>
                  <p className="font-medium text-secondary-900">
                    {swap.owner.firstName} {swap.owner.lastName}
                  </p>
                  <p className="text-sm text-secondary-600">@{swap.owner.username}</p>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm text-secondary-600">
                      {swap.owner.rating || 0} ({swap.owner.reviewsCount || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Swap Details */}
          <div className="card">
            <h3 className="text-lg font-semibold text-secondary-900 mb-4">
              Swap Details
            </h3>

            {/* Swap Type */}
            <div className="mb-4">
              <h4 className="font-medium text-secondary-900 mb-2">Swap Type</h4>
              <div className="flex items-center space-x-2">
                {swap.swapType === 'direct' ? (
                  <Package className="w-5 h-5 text-blue-600" />
                ) : (
                  <Heart className="w-5 h-5 text-red-600" />
                )}
                <span className="text-secondary-700">
                  {swap.swapType === 'direct' ? 'Direct Swap' : 'Points Swap'}
                </span>
              </div>
            </div>

            {/* Offered Items or Points */}
            {swap.swapType === 'direct' && swap.offeredItems?.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-secondary-900 mb-2">Offered Items</h4>
                <div className="space-y-3">
                  {swap.offeredItems.map((item, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-secondary-50 rounded-lg">
                      <img
                        src={getImageUrl(item.images?.[0], item._id, 0)}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium text-secondary-900">{item.title}</p>
                        <p className="text-sm text-secondary-600">
                          {item.category} • {item.size}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-primary-600">
                        {item.pointsValue} pts
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {swap.swapType === 'points' && (
              <div className="mb-4">
                <h4 className="font-medium text-secondary-900 mb-2">Points Offered</h4>
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-600" />
                  <span className="text-lg font-bold text-primary-600">
                    {swap.pointsOffered} points
                  </span>
                </div>
              </div>
            )}

            {/* Message */}
            {swap.message && (
              <div className="mb-4">
                <h4 className="font-medium text-secondary-900 mb-2">Message</h4>
                <div className="bg-secondary-50 rounded-lg p-4">
                  <p className="text-secondary-700">"{swap.message}"</p>
                </div>
              </div>
            )}

            {/* Requester Info */}
            <div className="pt-4 border-t border-secondary-200">
              <h4 className="font-medium text-secondary-900 mb-2">Requested By</h4>
              <div className="flex items-center space-x-3">
                <Avatar user={swap.requester} size="md" />
                <div>
                  <p className="font-medium text-secondary-900">
                    {swap.requester.firstName} {swap.requester.lastName}
                  </p>
                  <p className="text-sm text-secondary-600">@{swap.requester.username}</p>
                  <div className="flex items-center mt-1">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="text-sm text-secondary-600">
                      {swap.requester.rating || 0} ({swap.requester.reviewsCount || 0} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-secondary-900 mb-4">
            Actions
          </h3>

          <div className="flex flex-wrap items-center gap-4">
            <button className="btn btn-outline">
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </button>

            {canRespond && (
              <>
                <button
                  onClick={() => handleRespond('accept')}
                  disabled={respondMutation.isLoading}
                  className="btn btn-primary"
                >
                  {respondMutation.isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Accept Swap
                    </>
                  )}
                </button>
                <button
                  onClick={() => handleRespond('reject')}
                  disabled={respondMutation.isLoading}
                  className="btn btn-outline"
                >
                  <X className="w-4 h-4 mr-2" />
                  Decline Swap
                </button>
              </>
            )}

            {canComplete && (
              <button
                onClick={handleComplete}
                disabled={completeMutation.isLoading}
                className="btn btn-primary"
              >
                {completeMutation.isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  'Mark as Complete'
                )}
              </button>
            )}

            {swap.status === 'accepted' && !canComplete && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-blue-700 font-medium">
                    Waiting for the other person to complete the swap
                  </span>
                </div>
              </div>
            )}

            {canCancel && (
              <button
                onClick={handleCancel}
                disabled={cancelMutation.isLoading}
                className="btn btn-outline"
              >
                {cancelMutation.isLoading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  'Cancel Swap'
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default SwapDetailPage 