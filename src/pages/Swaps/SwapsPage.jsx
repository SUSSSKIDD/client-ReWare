import { useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Inbox, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock,
  Package,
  Users,
  Heart,
  MessageCircle
} from 'lucide-react'
import { swapsAPI } from '../../services/api'
import { getImageUrl } from '../../utils/imageUtils'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'

const SwapsPage = () => {
  const [activeTab, setActiveTab] = useState('received')
  const [selectedSwap, setSelectedSwap] = useState(null)
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [responseMessage, setResponseMessage] = useState('')
  const queryClient = useQueryClient()
  const { user } = useAuth()

  const { data: swapsData, isLoading } = useQuery({
    queryKey: ['swaps'],
    queryFn: () => swapsAPI.getAll(),
  })

  const swaps = swapsData?.data?.swaps || swapsData?.swaps || []

  // Separate received and sent swaps using current user from auth
  const receivedSwaps = swaps.filter(swap => {
    const requestedItemOwner = swap.requestedItem?.owner?._id || swap.requestedItem?.owner;
    const isReceived = requestedItemOwner === user?._id;
    console.log('Swap ownership check:', {
      swapId: swap._id,
      requestedItemOwner,
      userId: user?._id,
      isReceived
    });
    return isReceived;
  })
  
  const sentSwaps = swaps.filter(swap => {
    const requester = swap.requester?._id || swap.requester;
    const isSent = requester === user?._id;
    console.log('Swap requester check:', {
      swapId: swap._id,
      requester,
      userId: user?._id,
      isSent
    });
    return isSent;
  })

  const respondMutation = useMutation({
    mutationFn: ({ swapId, action, message }) => 
      swapsAPI.respond(swapId, { action, responseMessage: message }),
    onSuccess: () => {
      queryClient.invalidateQueries(['swaps'])
      queryClient.invalidateQueries(['userStats'])
      setShowResponseModal(false)
      setSelectedSwap(null)
      setResponseMessage('')
      toast.success('Swap response sent successfully!')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to respond to swap')
    }
  })

  const completeMutation = useMutation({
    mutationFn: (swapId) => swapsAPI.complete(swapId),
    onSuccess: () => {
      queryClient.invalidateQueries(['swaps'])
      queryClient.invalidateQueries(['userStats'])
      toast.success('Swap completed successfully!')
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to complete swap')
    }
  })

  const handleRespond = (action) => {
    if (!selectedSwap) return
    
    console.log('Responding to swap:', {
      swapId: selectedSwap._id,
      action,
      message: responseMessage,
      selectedSwap
    });
    
    respondMutation.mutate({
      swapId: selectedSwap._id,
      action,
      message: responseMessage
    })
  }

  const tabs = [
    { 
      id: 'received', 
      label: 'Received', 
      icon: Inbox, 
      count: receivedSwaps.filter(s => s.status === 'pending').length
    },
    { 
      id: 'sent', 
      label: 'Sent', 
      icon: Send, 
      count: sentSwaps.filter(s => s.status === 'pending').length
    }
  ]

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'accepted':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-500" />
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-gray-500" />
      default:
        return <Clock className="w-4 h-4 text-secondary-400" />
    }
  }

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

  const SwapCard = ({ swap, isReceived = false }) => {
    const requestedItemOwner = swap.requestedItem?.owner?._id || swap.requestedItem?.owner;
    const isOwner = requestedItemOwner === user?._id;

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <img
              src={getImageUrl(swap.requestedItem?.images?.[0], swap.requestedItem?._id, 0)}
              alt={swap.requestedItem?.title}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <h3 className="font-semibold text-gray-900">{swap.requestedItem?.title}</h3>
              <p className="text-sm text-gray-600">
                {swap.requestedItem?.category} • {swap.requestedItem?.pointsValue} pts
              </p>
              <div className="flex items-center mt-1">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(swap.status)}`}>
                  {swap.status}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              {new Date(swap.createdAt).toLocaleDateString()}
            </p>
            {getStatusIcon(swap.status)}
          </div>
        </div>

        {/* Swap Details */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Swap Type:</span>
            <span className="font-medium">
              {swap.swapType === 'direct' ? 'Direct Swap' : 'Points Swap'}
            </span>
          </div>

          {swap.swapType === 'direct' && swap.offeredItems?.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Offered Items:</p>
              <div className="flex space-x-2">
                {swap.offeredItems.map((item, index) => (
                  <img
                    key={index}
                    src={getImageUrl(item?.images?.[0], item?._id, 0)}
                    alt={item?.title}
                    className="w-12 h-12 object-cover rounded"
                  />
                ))}
              </div>
            </div>
          )}

          {swap.swapType === 'points' && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Points Offered:</span>
              <span className="font-medium text-green-600">{swap.pointsOffered} pts</span>
            </div>
          )}

          {swap.message && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <MessageCircle className="w-4 h-4 text-gray-400 mt-0.5" />
                <p className="text-sm text-gray-700">{swap.message}</p>
              </div>
            </div>
          )}

          {swap.responseMessage && (
            <div className="bg-blue-50 rounded-lg p-3">
              <div className="flex items-start space-x-2">
                <MessageCircle className="w-4 h-4 text-blue-400 mt-0.5" />
                <p className="text-sm text-blue-700">{swap.responseMessage}</p>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {isReceived && swap.status === 'pending' && (
          <div className="flex space-x-3 mt-4">
            <button
              onClick={() => {
                setSelectedSwap(swap)
                setShowResponseModal(true)
              }}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Respond
            </button>
          </div>
        )}

        {swap.status === 'accepted' && isReceived && (
          <div className="flex space-x-3 mt-4">
            <button
              onClick={() => completeMutation.mutate(swap._id)}
              disabled={completeMutation.isLoading}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {completeMutation.isLoading ? <LoadingSpinner size="sm" /> : 'Complete Swap'}
            </button>
          </div>
        )}

        {swap.status === 'accepted' && !isReceived && (
          <div className="mt-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span className="text-sm text-blue-700 font-medium">
                  Waiting for the other person to complete the swap
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="xl" />
      </div>
    )
  }

  return (
    <>
      <Helmet>
        <title>My Swaps - ReWear</title>
        <meta name="description" content="Manage your swap requests and history" />
      </Helmet>

      <div className="pt-28 px-6 max-w-7xl mx-auto pb-20">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            My Swaps
          </h1>
          <p className="text-gray-600">
            Manage your swap requests and track your exchange history
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Swaps</p>
                <p className="text-2xl font-bold text-gray-900">
                  {swaps.length}
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {swaps.filter(s => s.status === 'pending').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {swaps.filter(s => s.status === 'completed').length}
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Points Earned</p>
                <p className="text-2xl font-bold text-gray-900">
                  {swaps.filter(s => s.status === 'completed').length * 100}
                </p>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="w-4 h-4 mr-2" />
                  {tab.label}
                  {tab.count > 0 && (
                    <span className="ml-2 bg-indigo-100 text-indigo-600 py-0.5 px-2 rounded-full text-xs">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'received' && (
              <div>
                {receivedSwaps.length > 0 ? (
                  <div className="space-y-4">
                    {receivedSwaps.map((swap) => (
                      <SwapCard key={swap._id} swap={swap} isReceived={true} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Inbox className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No received swaps</h3>
                    <p className="text-gray-600">You haven't received any swap requests yet.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'sent' && (
              <div>
                {sentSwaps.length > 0 ? (
                  <div className="space-y-4">
                    {sentSwaps.map((swap) => (
                      <SwapCard key={swap._id} swap={swap} isReceived={false} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No sent swaps</h3>
                    <p className="text-gray-600">You haven't sent any swap requests yet.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Response Modal */}
      {showResponseModal && selectedSwap && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Respond to Swap Request</h3>
              <textarea
                value={responseMessage}
                onChange={(e) => setResponseMessage(e.target.value)}
                placeholder="Add a message (optional)..."
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none mb-4"
              />
              <div className="flex space-x-3">
                <button
                  onClick={() => handleRespond('reject')}
                  disabled={respondMutation.isLoading}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleRespond('accept')}
                  disabled={respondMutation.isLoading}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  Accept
                </button>
                <button
                  onClick={() => {
                    setShowResponseModal(false)
                    setSelectedSwap(null)
                    setResponseMessage('')
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default SwapsPage 