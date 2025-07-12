import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { X, Camera, Plus, Package } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'
import { itemsAPI } from '../../services/api'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const AddItemPage = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError
  } = useForm()

  const createItemMutation = useMutation({
    mutationFn: (data) => itemsAPI.create(data),
    onSuccess: async (data) => {
      console.log('Item created successfully:', data)
      
      // Invalidate all related queries to refresh data
      console.log('Invalidating queries...')
      await Promise.all([
        queryClient.invalidateQueries(['items']),
        queryClient.invalidateQueries(['userItems']),
        queryClient.invalidateQueries(['userStats']),
        queryClient.invalidateQueries(['userActivity'])
      ])
      console.log('Queries invalidated')
      
      // Show success message
      toast.success('Item added successfully!')
      
      // Redirect to dashboard to show updated statistics
      navigate('/dashboard', { state: { fromAddItem: true } })
    },
    onError: (error) => {
      setError('root', {
        type: 'manual',
        message: error.message || 'Failed to create item'
      })
    }
  })

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    const validFiles = files.filter(file =>
      file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024
    )

    if (validFiles.length + images.length > 5) {
      setError('images', {
        type: 'manual',
        message: 'Maximum 5 images allowed'
      })
      return
    }

    setImages(prev => [...prev, ...validFiles])
  }

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const onSubmit = async (data) => {
    if (images.length === 0) {
      setError('images', {
        type: 'manual',
        message: 'At least one image is required'
      })
      return
    }

    setUploading(true)
    try {
      // Create FormData with images and item data
      const formData = new FormData()
      
      // Add images
      images.forEach((image, index) => {
        formData.append('images', image)
      })
      
      // Add item data
      Object.keys(data).forEach(key => {
        formData.append(key, data[key])
      })

      // Create item with FormData
      createItemMutation.mutate(formData)
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'Failed to create item'
      })
    } finally {
      setUploading(false)
    }
  }

  const categories = [
    { value: 'tops', label: 'Tops' },
    { value: 'bottoms', label: 'Bottoms' },
    { value: 'dresses', label: 'Dresses' },
    { value: 'outerwear', label: 'Outerwear' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'accessories', label: 'Accessories' } // Fixed typo from 'accessories' to 'accessories'
  ]

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size']
  const conditions = ['new', 'like-new', 'good', 'fair', 'poor']

  return (
    <div className="relative min-h-screen">
      {/* Background image with low opacity */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-30"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        <Helmet>
          <title>Add Item - ReWear</title>
          <meta name="description" content="Add a new item to your ReWear wardrobe" />
        </Helmet>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-10 text-center"
        >
          <h1 className="text-4xl font-bold text-indigo-700 mb-3">
            Add New Item
          </h1>
          <p className="text-lg text-gray-600">Share your clothing with the ReWear community</p>
        </motion.div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Upload Section */}
          <motion.div 
            whileHover={{ scale: 1.01 }} 
            className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/50"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800">Item Photos</h3>
                <p className="text-sm text-gray-500">Upload up to 5 images</p>
              </div>
              <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                <Camera className="w-5 h-5 text-indigo-600" />
              </div>
            </div>
            
            <div className="border-2 border-dashed border-indigo-200 p-8 rounded-lg text-center bg-indigo-50/50 hover:bg-indigo-50 transition cursor-pointer">
              <input
                id="image-upload"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={images.length >= 5}
              />
              <label htmlFor="image-upload" className="cursor-pointer block">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-indigo-600" />
                </div>
                <p className="text-sm text-gray-600 font-medium">Drag & drop images here</p>
                <p className="text-xs text-gray-500 mt-1">or click to browse</p>
              </label>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-8">
                {images.map((image, index) => (
                  <motion.div 
                    key={index} 
                    className="relative group"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt="preview"
                      className="w-full h-48 object-cover rounded-lg shadow-sm group-hover:shadow-md transition"
                    />
                    <motion.button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition shadow-md"
                      whileHover={{ scale: 1.1 }}
                    >
                      <X className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                ))}
              </div>
            )}
            {errors.images && (
              <motion.p 
                className="text-sm text-red-600 mt-4 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {errors.images.message}
              </motion.p>
            )}
          </motion.div>

          {/* Basic Info */}
          <motion.div 
            whileHover={{ scale: 1.01 }} 
            className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/50 space-y-6"
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xl font-semibold text-gray-800">Basic Info</h3>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-blue-600" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="e.g., Vintage Denim Jacket"
                {...register('title', { required: 'Title is required' })}
              />
              {errors.title && (
                <motion.p 
                  className="text-sm text-red-600 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {errors.title.message}
                </motion.p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  {...register('category', { required: true })}
                >
                  <option value="">Select category</option>
                  {categories.map(c => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                {errors.category && (
                  <motion.p 
                    className="text-sm text-red-600 mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Category is required
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size *</label>
                <select 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  {...register('size', { required: true })}
                >
                  <option value="">Select size</option>
                  {sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
                {errors.size && (
                  <motion.p 
                    className="text-sm text-red-600 mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Size is required
                  </motion.p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
                <select 
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  {...register('condition', { required: true })}
                >
                  <option value="">Select condition</option>
                  {conditions.map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
                {errors.condition && (
                  <motion.p 
                    className="text-sm text-red-600 mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Condition is required
                  </motion.p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Points Value *</label>
                <input
                  type="number"
                  min="1"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                  placeholder="100"
                  {...register('pointsValue', { required: 'Points required' })}
                />
                {errors.pointsValue && (
                  <motion.p 
                    className="text-sm text-red-600 mt-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {errors.pointsValue.message}
                  </motion.p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div 
            whileHover={{ scale: 1.01 }} 
            className="bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/50"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Description *</h3>
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <textarea
              rows={6}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              placeholder="Describe the item in detail (style, fit, material, wear, etc.)"
              {...register('description', { required: 'Description is required' })}
            />
            {errors.description && (
              <motion.p 
                className="text-sm text-red-600 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {errors.description.message}
              </motion.p>
            )}
          </motion.div>

          {/* Submit */}
          {errors.root && (
            <motion.div 
              className="bg-red-50 border-l-4 border-red-500 p-4 mb-6"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <p className="text-red-600 font-medium">{errors.root.message}</p>
            </motion.div>
          )}

          <div className="flex justify-end gap-4">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={createItemMutation.isLoading || uploading}
              className="px-6 py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition flex items-center justify-center gap-2"
            >
              {uploading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Add Item</span>
                </>
              )}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default AddItemPage