import { useState } from 'react'
import { X, Package, Heart } from 'lucide-react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { swapsAPI, itemsAPI } from '../../services/api'
import { getImageUrl } from '../../utils/imageUtils'
import LoadingSpinner from '../common/LoadingSpinner'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const SwapModal = ({ item, onClose, actionType = 'swap' }) => {
  const { user } = useAuth()
  // Default swapType: points if user has enough points, else direct
  const defaultSwapType = (actionType === 'redeem')
    ? 'points'
    : ((user?.points || 0) >= item.pointsValue ? 'points' : 'direct')
  const [swapType, setSwapType] = useState(defaultSwapType)
  const [selectedItems, setSelectedItems] = useState([])
  const [message, setMessage] = useState('')
  const [formError, setFormError] = useState('')
  const queryClient = useQueryClient()
  const isOwner = user?._id === item.owner?._id

  // Fetch user's available items for direct swap
  const { data: userItemsData, isLoading: loadingUserItems } = useQuery({
    queryKey: ['userItems', user?._id],
    queryFn: () => itemsAPI.getByUser(user._id, { isAvailable: true, isApproved: true }),
    enabled: !!user?._id && swapType === 'direct' && actionType !== 'redeem'
  })

  const userItems = userItemsData?.data?.items || userItemsData?.items || []

  const createSwapMutation = useMutation({
    mutationFn: (data) => {
      // If owner is redeeming their own item, use the owner redemption endpoint
      if (isOwner && actionType === 'redeem') {
        console.log('Calling owner redemption endpoint for item:', item._id)
        return itemsAPI.redeemByOwner(item._id)
      }
      // Otherwise use the regular swap creation
      return swapsAPI.create(data)
    },
    onSuccess: (data) => {
      // Show success message
      if (isOwner && actionType === 'redeem') {
        toast.success(`Item purchased successfully! ${data.pointsDeducted} points deducted.`)
      } else {
        toast.success('Swap request sent successfully!')
      }
      
      // Invalidate relevant queries
      queryClient.invalidateQueries(['swaps'])
      queryClient.invalidateQueries(['items'])
      queryClient.invalidateQueries(['userStats'])
      queryClient.invalidateQueries(['userActivity'])
      onClose(isOwner && actionType === 'redeem')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to process request')
    }
  })

  const handleItemToggle = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setFormError('')
    
    // If owner is redeeming their own item, no additional data needed
    if (isOwner && actionType === 'redeem') {
      createSwapMutation.mutate()
      return
    }
    
    if (swapType === 'direct' && selectedItems.length === 0) {
      setFormError('Please select at least one of your items to offer for swap.')
      return
    }
    
    const swapData = {
      requestedItem: item._id,
      swapType,
      message,
      ...(swapType === 'direct' && { offeredItems: selectedItems }),
      ...(swapType === 'points' && { pointsOffered: item.pointsValue })
    }

    createSwapMutation.mutate(swapData)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-secondary-200">
          <h2 className="text-xl font-semibold text-secondary-900">
            {actionType === 'redeem' 
              ? (isOwner ? 'Purchase Your Item' : 'Redeem with Points') 
              : 'Request Swap'
            }
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Item Preview */}
          <div className="flex items-center space-x-4 p-4 bg-secondary-50 rounded-lg">
            <img
              src={getImageUrl(item.images?.[0], item._id, 0)}
              alt={item.title}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-medium text-secondary-900">{item.title}</h3>
              <p className="text-sm text-secondary-600">{item.category} • {item.size}</p>
              <div className="flex items-center mt-1">
                <Heart className="w-4 h-4 text-primary-600 mr-1" />
                <span className="text-sm font-medium text-primary-600">
                  {item.pointsValue} points
                </span>
              </div>
            </div>
          </div>

          {/* Swap Type Selection */}
          {actionType !== 'redeem' && (
            <div>
              <h3 className="font-medium text-secondary-900 mb-3">Swap Type</h3>
              <div className="space-y-3">
                <label className="flex items-center p-3 border border-secondary-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                  <input
                    type="radio"
                    name="swapType"
                    value="direct"
                    checked={swapType === 'direct'}
                    onChange={(e) => setSwapType(e.target.value)}
                    className="w-4 h-4 text-primary-600 border-secondary-300 focus:ring-primary-500"
                  />
                  <div className="ml-3">
                    <div className="font-medium text-secondary-900">Direct Swap</div>
                    <div className="text-sm text-secondary-600">
                      Exchange with items from your wardrobe
                    </div>
                  </div>
                </label>

                <label className="flex items-center p-3 border border-secondary-200 rounded-lg cursor-pointer hover:border-primary-300 transition-colors">
                  <input
                    type="radio"
                    name="swapType"
                    value="points"
                    checked={swapType === 'points'}
                    onChange={(e) => setSwapType(e.target.value)}
                    className="w-4 h-4 text-primary-600 border-secondary-300 focus:ring-primary-500"
                  />
                  <div className="ml-3">
                    <div className="font-medium text-secondary-900">Points Swap</div>
                    <div className="text-sm text-secondary-600">
                      Use your points balance ({item.pointsValue} points)
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Points Redemption Info */}
          {actionType === 'redeem' && (
            <div className="bg-primary-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-secondary-900">Item Cost:</span>
                <span className="text-lg font-bold text-primary-600">{item.pointsValue.toLocaleString()} points</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium text-secondary-900">Your Balance:</span>
                <span className="text-lg font-bold text-secondary-900">{user?.points || 0} points</span>
              </div>
              <div className={`mt-3 p-3 rounded-lg ${
                (user?.points || 0) >= item.pointsValue 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}>
                <div className={`flex items-center ${
                  (user?.points || 0) >= item.pointsValue ? 'text-green-800' : 'text-red-800'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    (user?.points || 0) >= item.pointsValue ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium">
                    {(user?.points || 0) >= item.pointsValue 
                      ? (isOwner ? 'You can purchase this item' : 'Sufficient points available') 
                      : 'Insufficient points balance'
                    }
                  </span>
                </div>
              </div>
              {isOwner && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center text-blue-800">
                    <div className="w-2 h-2 rounded-full mr-2 bg-blue-500"></div>
                    <span className="text-sm font-medium">
                      As the owner, you can purchase this item to remove it from your listings
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Direct Swap Items Selection */}
          {swapType === 'direct' && (
            <div>
              <h3 className="font-medium text-secondary-900 mb-3">
                Select Items to Offer ({selectedItems.length} selected)
              </h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {loadingUserItems ? (
                  <div className="text-center py-8">
                    <LoadingSpinner size="md" />
                    <p className="text-sm text-secondary-600 mt-2">Loading your items...</p>
                  </div>
                ) : userItems.length === 0 ? (
                  <div className="text-center py-8 text-secondary-600">
                    <Package className="w-8 h-8 mx-auto mb-2" />
                    <p className="text-sm">No available items found</p>
                    <p className="text-xs mt-1">Upload some items to your wardrobe first</p>
                  </div>
                ) : (
                  userItems.map((userItem) => (
                    <label
                      key={userItem._id}
                      className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedItems.includes(userItem._id)
                          ? 'border-primary-500 bg-primary-50'
                          : 'border-secondary-200 hover:border-primary-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(userItem._id)}
                        onChange={() => handleItemToggle(userItem._id)}
                        className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
                      />
                      <img
                        src={getImageUrl(userItem.images?.[0], userItem._id, 0)}
                        alt={userItem.title}
                        className="w-12 h-12 object-cover rounded ml-3"
                      />
                      <div className="ml-3 flex-1">
                        <div className="font-medium text-secondary-900 text-sm">{userItem.title}</div>
                        <div className="text-xs text-secondary-600">{userItem.category} • {userItem.pointsValue} pts</div>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Message to Owner
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell the owner why you'd like to swap for this item..."
              rows={4}
              className="w-full p-3 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
            />
          </div>

          {/* Error Message */}
          {formError && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-2 text-sm font-medium">
              {formError}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-secondary-100 text-secondary-700 py-3 rounded-lg font-medium hover:bg-secondary-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg font-semibold shadow-md hover:bg-indigo-700 transition-colors disabled:opacity-50"
              disabled={createSwapMutation.isLoading ||
                (swapType === 'direct' && selectedItems.length === 0) ||
                (swapType === 'points' && (user?.points || 0) < item.pointsValue)
              }
            >
              {createSwapMutation.isLoading ? <LoadingSpinner size="sm" /> : (
                actionType === 'redeem'
                  ? (isOwner ? 'Purchase Item' : 'Redeem with Points')
                  : 'Send Swap Request'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SwapModal 