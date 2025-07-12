import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  MessageCircle, 
  Check, 
  X, 
  Package,
  Heart,
  User,
  Calendar
} from 'lucide-react'
import { swapsAPI } from '../../services/api'
import { getImageUrl } from '../../utils/imageUtils'
import Avatar from '../common/Avatar'
import LoadingSpinner from '../common/LoadingSpinner'

const SwapCard = ({ swap, type, statusIcon, statusColor }) => {
  const [showActions, setShowActions] = useState(false)
  const queryClient = useQueryClient()

  const respondMutation = useMutation({
    mutationFn: ({ swapId, action }) => swapsAPI.respond(swapId, action),
    onSuccess: () => {
      queryClient.invalidateQueries(['swaps'])
      setShowActions(false)
    }
  })

  const completeMutation = useMutation({
    mutationFn: (swapId) => swapsAPI.complete(swapId),
    onSuccess: () => {
      queryClient.invalidateQueries(['swaps'])
    }
  })

  const cancelMutation = useMutation({
    mutationFn: (swapId) => swapsAPI.cancel(swapId),
    onSuccess: () => {
      queryClient.invalidateQueries(['swaps'])
    }
  })

  const handleRespond = (action) => {
    respondMutation.mutate({ swapId: swap._id, action })
  }

  const handleComplete = () => {
    completeMutation.mutate(swap._id)
  }

  const handleCancel = () => {
    cancelMutation.mutate(swap._id)
  }

  const isOwner = type === 'received'
  const canRespond = isOwner && swap.status === 'pending'
  const canComplete = swap.status === 'accepted'
  const canCancel = swap.status === 'pending' || swap.status === 'accepted'

  return (
    <div className="card">
      <div className="flex items-start space-x-4">
        {/* Item Image */}
        <div className="flex-shrink-0">
          <img
            src={getImageUrl(swap.requestedItem.images?.[0], swap.requestedItem._id, 0)}
            alt={swap.requestedItem.title}
            className="w-20 h-20 object-cover rounded-lg"
            onError={(e) => {
              e.target.src = '/placeholder-item.svg'
            }}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-secondary-900 mb-1">
                {swap.requestedItem.title}
              </h3>
              <p className="text-sm text-secondary-600 mb-2">
                {swap.requestedItem.category} • {swap.requestedItem.size}
              </p>

              {/* Swap Type */}
              <div className="flex items-center space-x-4 text-sm text-secondary-600 mb-3">
                <div className="flex items-center">
                  {swap.swapType === 'direct' ? (
                    <Package className="w-4 h-4 mr-1" />
                  ) : (
                    <Heart className="w-4 h-4 mr-1" />
                  )}
                  {swap.swapType === 'direct' ? 'Direct Swap' : 'Points Swap'}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  {new Date(swap.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Swap Details */}
              {swap.swapType === 'direct' && swap.offeredItems?.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm text-secondary-600 mb-2">Offered items:</p>
                  <div className="flex space-x-2">
                    {swap.offeredItems.map((item, index) => (
                      <img
                        key={index}
                        src={getImageUrl(item.images?.[0], item._id, 0)}
                        alt={item.title}
                        className="w-12 h-12 object-cover rounded border border-secondary-200"
                      />
                    ))}
                  </div>
                </div>
              )}

              {swap.swapType === 'points' && (
                <div className="mb-3">
                  <p className="text-sm text-secondary-600">
                    Points offered: <span className="font-medium text-primary-600">{swap.pointsOffered}</span>
                  </p>
                </div>
              )}

              {/* Message */}
              {swap.message && (
                <div className="bg-secondary-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-secondary-700">"{swap.message}"</p>
                </div>
              )}

              {/* User Info */}
              <div className="flex items-center space-x-2">
                <Avatar user={type === 'received' ? swap.requester : swap.owner} size="sm" />
                <div>
                  <p className="text-sm font-medium text-secondary-900">
                    {type === 'received' 
                      ? `${swap.requester.firstName} ${swap.requester.lastName}`
                      : `${swap.owner.firstName} ${swap.owner.lastName}`
                    }
                  </p>
                  <p className="text-xs text-secondary-600">
                    @{type === 'received' ? swap.requester.username : swap.owner.username}
                  </p>
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex-shrink-0 ml-4">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusColor}`}>
                {statusIcon}
                <span className="ml-1 capitalize">{swap.status}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-secondary-200">
            <div className="flex items-center space-x-2">
              <button className="btn btn-outline btn-sm">
                <MessageCircle className="w-4 h-4 mr-1" />
                Message
              </button>
              <Link
                to={`/items/${swap.requestedItem._id}`}
                className="btn btn-outline btn-sm"
              >
                <Package className="w-4 h-4 mr-1" />
                View Item
              </Link>
            </div>

            <div className="flex items-center space-x-2">
              {canRespond && (
                <>
                  <button
                    onClick={() => handleRespond('accept')}
                    disabled={respondMutation.isLoading}
                    className="btn btn-primary btn-sm"
                  >
                    {respondMutation.isLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Accept
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleRespond('reject')}
                    disabled={respondMutation.isLoading}
                    className="btn btn-outline btn-sm"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Decline
                  </button>
                </>
              )}

              {canComplete && (
                <button
                  onClick={handleComplete}
                  disabled={completeMutation.isLoading}
                  className="btn btn-primary btn-sm"
                >
                  {completeMutation.isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    'Mark Complete'
                  )}
                </button>
              )}

              {canCancel && (
                <button
                  onClick={handleCancel}
                  disabled={cancelMutation.isLoading}
                  className="btn btn-outline btn-sm"
                >
                  {cancelMutation.isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    'Cancel'
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SwapCard 