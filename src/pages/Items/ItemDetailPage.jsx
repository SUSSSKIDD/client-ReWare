import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { 
  Heart, 
  Share2, 
  MapPin, 
  Star, 
  Package, 
  Calendar,
  Eye,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  XCircle
} from 'lucide-react'
import { itemsAPI, swapsAPI } from '../../services/api'
import { useAuth } from '../../hooks/useAuth'
import { getImageUrl } from '../../utils/imageUtils'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Avatar from '../../components/common/Avatar'
import SwapModal from '../../components/swaps/SwapModal'
import toast from 'react-hot-toast'

const ItemDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [showSwapModal, setShowSwapModal] = useState(false)
  const [swapActionType, setSwapActionType] = useState('swap')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const { data: itemResponse, isLoading, error } = useQuery({
    queryKey: ['item', id],
    queryFn: () => itemsAPI.getById(id),
    enabled: !!id
  })

  // Extract item data from response
  const item = itemResponse?.data?.item || itemResponse?.item

  // Debug logging
  console.log('ItemDetailPage - itemResponse:', itemResponse)
  console.log('ItemDetailPage - item:', item)

  // Reset currentImageIndex when item changes
  useEffect(() => {
    if (item?.images?.length) {
      setCurrentImageIndex(0)
    }
  }, [item?._id])

  // Ensure currentImageIndex is within bounds
  useEffect(() => {
    if (item?.images?.length && currentImageIndex >= item.images.length) {
      setCurrentImageIndex(0)
    }
  }, [item?.images?.length, currentImageIndex])

  const likeMutation = useMutation({
    mutationFn: () => itemsAPI.toggleLike(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['item', id])
    }
  })

  const handleLike = () => {
    if (user) {
      likeMutation.mutate()
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.description,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  const nextImage = () => {
    if (!item?.images?.length) return;
    setCurrentImageIndex((prev) => 
      prev === item.images.length - 1 ? 0 : prev + 1
    )
  }

  const prevImage = () => {
    if (!item?.images?.length) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? item.images.length - 1 : prev - 1
    )
  }

  const markUnavailableMutation = useMutation({
    mutationFn: (itemId) => itemsAPI.markUnavailable(itemId),
    onSuccess: () => {
      toast.success('Item marked as unavailable successfully')
      queryClient.invalidateQueries(['item', id])
      queryClient.invalidateQueries(['userStats'])
      queryClient.invalidateQueries(['userActivity'])
      navigate('/my-listings')
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to mark item as unavailable')
    }
  })

  const handleMarkUnavailable = () => {
    if (window.confirm('Are you sure you want to mark this item as unavailable? This action cannot be undone.')) {
      markUnavailableMutation.mutate(id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="xl" />
      </div>
    )
  }

  if (error || !item) {
    return (
      <div className="text-center py-12">
        <p className="text-secondary-600">Item not found</p>
      </div>
    )
  }

  const isOwner = user?._id === item.owner?._id

  return (
    <>
      <Helmet>
        <title>{item.title} - ReWear</title>
        <meta name="description" content={item.description} />
      </Helmet>

      <div className="pt-28 px-6 max-w-7xl mx-auto pb-20 relative">
        {/* Background images with low opacity */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-30"></div>
        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-indigo-600 hover:text-indigo-900 mb-6 transition-colors bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm hover:shadow-md"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Items
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-xl shadow-lg bg-white/80 backdrop-blur-sm">
              <img
                src={getImageUrl(item.images?.[currentImageIndex], item._id, currentImageIndex)}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = '/placeholder-item.svg'
                }}
              />
              
              {/* Navigation Arrows */}
              {item.images?.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full transition-all shadow-lg hover:shadow-xl"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-700" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full transition-all shadow-lg hover:shadow-xl"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-700" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {item.images?.length > 1 && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium backdrop-blur-sm">
                  {currentImageIndex + 1} / {item.images.length}
                </div>
              )}

              {/* Availability Badge */}
              <div className="absolute top-4 right-4">
                <div className={`px-4 py-2 rounded-full text-sm font-medium shadow-lg ${
                  item.isAvailable 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </div>
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {item.images?.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto p-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg">
                {item.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${
                      index === currentImageIndex 
                        ? 'border-indigo-600 shadow-lg' 
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    <img
                      src={getImageUrl(image, item._id, index)}
                      alt={`${item.title} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Item Details */}
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-3xl font-bold text-gray-800">
                  {item.title}
                </h1>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleLike}
                    disabled={likeMutation.isLoading}
                    className="p-3 hover:bg-red-50 rounded-full transition-colors"
                  >
                    {likeMutation.isLoading ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <Heart 
                        className={`w-6 h-6 ${item.isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} 
                      />
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-3 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <Share2 className="w-6 h-6 text-gray-400" />
                  </button>
                </div>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  {item.views || 0} views
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Package className="w-4 h-4 mr-2" />
                  {item.category}
                </div>
              </div>
            </div>

            {/* Points and Availability */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 shadow-lg border border-indigo-100">
              <div className="flex items-center justify-between mb-4">
                <div className="text-3xl font-bold text-indigo-600">
                  {item.pointsValue?.toLocaleString() || 0} points
                </div>
                <div className={`px-4 py-2 rounded-full text-sm font-medium shadow-sm ${
                  item.isAvailable 
                    ? 'bg-green-500 text-white' 
                    : 'bg-red-500 text-white'
                }`}>
                  {item.isAvailable ? 'Available' : 'Unavailable'}
                </div>
              </div>
              <p className="text-sm text-gray-600">
                Points value for this item • {item.condition} condition
              </p>
            </div>

            {/* Description */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-800 mb-4 text-lg">Description</h3>
              <p className="text-gray-700 leading-relaxed text-base">
                {item.description}
              </p>
            </div>

            {/* Item Details */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <h3 className="font-semibold text-gray-800 mb-4 text-lg">Item Details</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Category</h4>
                  <p className="text-gray-600 capitalize">{item.category}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Size</h4>
                  <p className="text-gray-600">{item.size}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Condition</h4>
                  <p className="text-gray-600 capitalize">{item.condition}</p>
                </div>
                <div className="space-y-2">
                  <h4 className="font-medium text-gray-900">Brand</h4>
                  <p className="text-gray-600">{item.brand || 'Unknown'}</p>
                </div>
                {item.location && (
                  <div className="space-y-2 col-span-2">
                    <h4 className="font-medium text-gray-900">Location</h4>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2" />
                      {item.location}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Owner Info */}
            {item.owner && (
              <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <h3 className="font-semibold text-gray-800 mb-4 text-lg">Listed by</h3>
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center space-x-4">
                    <Avatar user={item.owner} size="xl" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {item.owner.firstName} {item.owner.lastName}
                      </h4>
                      <p className="text-gray-600 text-sm">@{item.owner.username}</p>
                      <div className="flex items-center mt-2">
                        <Star className="w-5 h-5 text-yellow-500 mr-2" />
                        <span className="text-sm font-medium text-gray-700">
                          {item.owner.rating || 0} ({item.owner.reviewsCount || 0} reviews)
                        </span>
                      </div>
                      <div className="flex items-center mt-3 space-x-6 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 mr-2" />
                          <span>{item.owner.itemsCount || 0} items listed</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>Member since {new Date(item.owner.createdAt).getFullYear()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col space-y-3">
              {isOwner ? (
                <div className="space-y-4">
                  {item.isAvailable && (
                    <button
                      onClick={handleMarkUnavailable}
                      disabled={markUnavailableMutation.isLoading}
                      className="w-full bg-red-600 text-white py-4 px-6 rounded-lg hover:bg-red-700 transition-colors font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {markUnavailableMutation.isLoading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <>
                          <XCircle className="w-5 h-5 mr-2 inline" />
                          Mark as Unavailable
                        </>
                      )}
                    </button>
                  )}
                  {!item.isAvailable && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="text-xl font-semibold text-gray-800 mb-2">
                        Item Unavailable
                      </div>
                      <p className="text-gray-600">
                        This item has been marked as unavailable and is no longer visible to other users.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {item.isAvailable ? (
                    <>
                      <button
                        onClick={() => {
                          setSwapActionType('swap')
                          setShowSwapModal(true)
                        }}
                        className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-lg"
                      >
                        Request Swap
                      </button>
                      <button
                        onClick={() => {
                          setSwapActionType('redeem')
                          setShowSwapModal(true)
                        }}
                        className="w-full bg-purple-600 text-white py-4 px-6 rounded-lg hover:bg-purple-700 transition-colors font-semibold text-lg"
                      >
                        Redeem via Points ({item.pointsValue?.toLocaleString() || 0} pts)
                      </button>
                    </>
                  ) : (
                    <div className="text-center py-8 bg-red-50 rounded-lg border border-red-200">
                      <div className="text-xl font-semibold text-red-800 mb-2">
                        Item Unavailable
                      </div>
                      <p className="text-red-600">
                        This item is currently not available for swaps or redemption.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Item Purchased Successfully!</h3>
            <p className="text-gray-600 mb-6">
              Your item has been removed from your listings and the points have been deducted from your balance.
            </p>
            <button
              onClick={() => {
                setShowSuccessMessage(false)
                navigate('/dashboard')
              }}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Swap Modal */}
      {showSwapModal && (
        <SwapModal
          item={item}
          onClose={() => setShowSwapModal(false)}
          actionType={swapActionType}
        />
      )}
    </>
  )
}

export default ItemDetailPage 