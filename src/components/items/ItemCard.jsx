import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Eye, MapPin, Star, Package } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { itemsAPI } from '../../services/api'
import { getImageUrl } from '../../utils/imageUtils'
import Avatar from '../common/Avatar'
import LoadingSpinner from '../common/LoadingSpinner'

const ItemCard = ({ item, viewMode = 'grid' }) => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const [imageIndex, setImageIndex] = useState(0)

  // Debug logging
  console.log('ItemCard - item:', item);
  console.log('ItemCard - item._id:', item?._id);

  // Safety check for undefined item
  if (!item || !item._id) {
    return (
      <div className="card">
        <div className="p-4 text-center text-secondary-600">
          Item not available
        </div>
      </div>
    )
  }

  const likeMutation = useMutation({
    mutationFn: () => itemsAPI.toggleLike(item._id),
    onSuccess: () => {
      queryClient.invalidateQueries(['items'])
    }
  })

  const handleLike = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (user) {
      likeMutation.mutate()
    }
  }

  const formatPoints = (points) => {
    return points.toLocaleString()
  }

  const getConditionColor = (condition) => {
    const colors = {
      'new': 'text-green-600 bg-green-100',
      'like-new': 'text-blue-600 bg-blue-100',
      'good': 'text-yellow-600 bg-yellow-100',
      'fair': 'text-orange-600 bg-orange-100',
      'poor': 'text-red-600 bg-red-100'
    }
    return colors[condition] || 'text-secondary-600 bg-secondary-100'
  }

  if (viewMode === 'list') {
    return (
      <Link to={`/items/${item._id || 'unknown'}`} className="block">
        <div className="card hover:shadow-medium transition-shadow">
          <div className="flex">
            {/* Image */}
            <div className="w-32 h-32 flex-shrink-0">
              <img
                src={getImageUrl(item.images?.[imageIndex] || item.images?.[0], item._id, imageIndex)}
                alt={item.title}
                className="w-full h-full object-cover rounded-l-lg"
                onError={(e) => {
                  e.target.src = '/placeholder-item.svg'
                }}
              />
            </div>

            {/* Content */}
            <div className="flex-1 p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-semibold text-secondary-900 line-clamp-1">
                  {item.title}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className={`badge ${getConditionColor(item.condition)}`}>
                    {item.condition}
                  </span>
                  {user && (
                    <button
                      onClick={handleLike}
                      disabled={likeMutation.isLoading}
                      className="p-1 hover:bg-secondary-100 rounded transition-colors"
                    >
                      {likeMutation.isLoading ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <Heart 
                          className={`w-4 h-4 ${item.isLiked ? 'fill-red-500 text-red-500' : 'text-secondary-400'}`} 
                        />
                      )}
                    </button>
                  )}
                </div>
              </div>

              <p className="text-secondary-600 text-sm mb-3 line-clamp-2">
                {item.description}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-sm text-secondary-600">
                  <div className="flex items-center">
                    <Package className="w-4 h-4 mr-1" />
                    {item.category}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    {item.location || 'No location'}
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {item.views}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-lg font-bold text-primary-600">
                    {formatPoints(item.pointsValue)} pts
                  </div>
                  <div className="text-sm text-secondary-600">
                    Size: {item.size}
                  </div>
                </div>
              </div>

              {/* Owner Info */}
              <div className="flex items-center mt-3 pt-3 border-t border-secondary-200">
                <Avatar user={item.owner} size="sm" />
                <div className="ml-2">
                  <p className="text-sm font-medium text-secondary-900">
                    {item.owner.firstName} {item.owner.lastName}
                  </p>
                  <div className="flex items-center text-xs text-secondary-600">
                    <Star className="w-3 h-3 mr-1 text-yellow-500" />
                    {item.owner.rating || 0} ({item.owner.reviewsCount || 0} reviews)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link to={`/items/${item._id || 'unknown'}`} className="block group">
      <div className="card hover:shadow-medium transition-shadow">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          <img
            src={getImageUrl(item.images?.[imageIndex] || item.images?.[0], item._id, imageIndex)}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.src = '/placeholder-item.svg'
            }}
          />
          
          {/* Image Navigation */}
          {item.images?.length > 1 && (
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {item.images.map((_, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.preventDefault()
                    setImageIndex(index)
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === imageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}

          {/* Like Button */}
          {user && (
            <button
              onClick={handleLike}
              disabled={likeMutation.isLoading}
              className="absolute top-2 right-2 p-2 bg-white/80 hover:bg-white rounded-full transition-colors"
            >
              {likeMutation.isLoading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Heart 
                  className={`w-4 h-4 ${item.isLiked ? 'fill-red-500 text-red-500' : 'text-secondary-400'}`} 
                />
              )}
            </button>
          )}

          {/* Condition Badge */}
          <div className="absolute top-2 left-2">
            <span className={`badge ${getConditionColor(item.condition)}`}>
              {item.condition}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-secondary-900 mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
            {item.title}
          </h3>
          
          <p className="text-secondary-600 text-sm mb-3 line-clamp-2">
            {item.description}
          </p>

          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 text-sm text-secondary-600">
              <Package className="w-4 h-4" />
              <span>{item.category}</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-secondary-600">
              <Eye className="w-4 h-4" />
              <span>{item.views}</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-secondary-600">
              Size: {item.size}
            </div>
            <div className="text-lg font-bold text-primary-600">
              {formatPoints(item.pointsValue)} pts
            </div>
          </div>

          {/* Owner Info */}
          <div className="flex items-center mt-3 pt-3 border-t border-secondary-200">
            <Avatar user={item.owner} size="sm" />
            <div className="ml-2 flex-1">
              <p className="text-sm font-medium text-secondary-900">
                {item.owner.firstName} {item.owner.lastName}
              </p>
              <div className="flex items-center text-xs text-secondary-600">
                <Star className="w-3 h-3 mr-1 text-yellow-500" />
                {item.owner.rating || 0} ({item.owner.reviewsCount || 0})
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ItemCard 