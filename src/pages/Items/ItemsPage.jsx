import { useState, useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { 
  Search, 
  Filter, 
  Grid, 
  List,
  SlidersHorizontal,
  X,
  Plus,
  Package
} from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { itemsAPI } from '../../services/api'
import ItemCard from '../../components/items/ItemCard'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import FilterSidebar from '../../components/items/FilterSidebar'
import { motion } from 'framer-motion'

const ItemsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    size: searchParams.get('size') || '',
    condition: searchParams.get('condition') || '',
    minPoints: searchParams.get('minPoints') || '',
    maxPoints: searchParams.get('maxPoints') || '',
    sortBy: searchParams.get('sortBy') || 'createdAt',
    sortOrder: searchParams.get('sortOrder') || 'desc',
    page: searchParams.get('page') || 1
  })

  const { data, isLoading, error } = useQuery({
    queryKey: ['items', filters],
    queryFn: () => itemsAPI.getAll(filters),
    keepPreviousData: true
  })

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value && key !== 'page') params.set(key, value)
    })
    setSearchParams(params)
  }, [filters, setSearchParams])

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const handleSearch = (searchTerm) => {
    setFilters(prev => ({ ...prev, search: searchTerm, page: 1 }))
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      size: '',
      condition: '',
      minPoints: '',
      maxPoints: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1
    })
  }

  const hasActiveFilters = Object.entries(filters).some(
    ([key, value]) => value && !['sortBy', 'sortOrder', 'page'].includes(key)
  )

  return (
    <div className="relative min-h-screen">
      {/* Background image with low opacity */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-30"></div>
      </div>

      <Helmet>
        <title>Browse Items - ReWear</title>
        <meta name="description" content="Browse and discover clothing items for swap on ReWear" />
      </Helmet>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12 text-center"
        >
          <h1 className="text-5xl font-bold text-indigo-700 mb-4 drop-shadow-sm">Browse Items</h1>
          <p className="text-xl text-gray-600">Discover clothing items from our community</p>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div 
          className="flex flex-wrap gap-4 justify-center mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Link
            to="/dashboard"
            className="inline-flex items-center px-6 py-3 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all duration-300 hover:scale-105 shadow-sm"
          >
            Dashboard
          </Link>
          <Link
            to="/swaps"
            className="inline-flex items-center px-6 py-3 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-all duration-300 hover:scale-105 shadow-sm"
          >
            Swaps
          </Link>
          <Link
            to="/add-item"
            className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all duration-300 hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add Item
          </Link>
        </motion.div>

        {/* Search and Filters Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl border border-white/60 p-8 mb-10"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search items..."
                  className="w-full px-5 py-4 pl-12 rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 bg-white/90 text-lg"
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Filter Toggle */}
            <div className="flex items-center gap-3">
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-4 bg-white border border-gray-300 rounded-xl text-gray-700 font-semibold flex items-center gap-3 hover:bg-gray-50 transition-all duration-300 shadow-sm"
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </motion.button>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">
                <motion.button
                  onClick={() => setViewMode('grid')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 ${viewMode === 'grid' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`}
                >
                  <Grid className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={() => setViewMode('list')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 ${viewMode === 'list' ? 'bg-indigo-600 text-white' : 'text-gray-600'}`}
                >
                  <List className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <motion.div 
              className="flex items-center flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="text-sm text-gray-600">Active filters:</span>
              {filters.category && (
                <motion.span 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                >
                  {filters.category}
                  <button
                    onClick={() => handleFilterChange({ category: '' })}
                    className="ml-1.5 -mr-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              )}
              {filters.size && (
                <motion.span 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                >
                  {filters.size}
                  <button
                    onClick={() => handleFilterChange({ size: '' })}
                    className="ml-1.5 -mr-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              )}
              {filters.condition && (
                <motion.span 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                >
                  {filters.condition}
                  <button
                    onClick={() => handleFilterChange({ condition: '' })}
                    className="ml-1.5 -mr-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              )}
              {(filters.minPoints || filters.maxPoints) && (
                <motion.span 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                >
                  {filters.minPoints && filters.maxPoints 
                    ? `${filters.minPoints}-${filters.maxPoints} points`
                    : filters.minPoints 
                    ? `${filters.minPoints}+ points`
                    : `${filters.maxPoints} points max`
                  }
                  <button
                    onClick={() => handleFilterChange({ minPoints: '', maxPoints: '' })}
                    className="ml-1.5 -mr-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              )}
              <motion.button
                onClick={clearFilters}
                whileHover={{ scale: 1.05 }}
                className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Clear all
              </motion.button>
            </motion.div>
          )}
        </motion.div>

        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            isOpen={showFilters}
            onClose={() => setShowFilters(false)}
          />

          {/* Items Grid */}
          <div className="flex-1">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <LoadingSpinner size="xl" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Error loading items</p>
              </div>
            ) : data?.data?.items?.length === 0 ? (
              <motion.div 
                className="text-center py-12 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-white/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-800 mb-2">
                  No items found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search terms
                </p>
              </motion.div>
            ) : (
              <>
                {/* Results Count */}
                <motion.div 
                  className="flex justify-between items-center mb-6 bg-white/90 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-white/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <p className="text-gray-600">
                    {data?.data?.pagination?.totalItems || 0} items found
                  </p>
                  <select
                    value={`${filters.sortBy}-${filters.sortOrder}`}
                    onChange={(e) => {
                      const [sortBy, sortOrder] = e.target.value.split('-')
                      handleFilterChange({ sortBy, sortOrder })
                    }}
                    className="px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-white"
                  >
                    <option value="createdAt-desc">Newest first</option>
                    <option value="createdAt-asc">Oldest first</option>
                    <option value="pointsValue-asc">Price: Low to High</option>
                    <option value="pointsValue-desc">Price: High to Low</option>
                    <option value="views-desc">Most Popular</option>
                  </select>
                </motion.div>

                {/* Items Grid */}
                <motion.div
                  className={`grid gap-6 ${
                    viewMode === 'grid' 
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                      : 'grid-cols-1'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ staggerChildren: 0.1 }}
                >
                  {data?.data?.items?.map((item) => (
                    <motion.div
                      key={item._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      <ItemCard item={item} viewMode={viewMode} />
                    </motion.div>
                  ))}
                </motion.div>

                {/* Pagination */}
                {data?.data?.pagination && data.data.pagination.totalPages > 1 && (
                  <motion.div 
                    className="flex justify-center mt-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex items-center gap-2">
                      <motion.button
                        onClick={() => handleFilterChange({ page: data.data.pagination.currentPage - 1 })}
                        disabled={!data.data.pagination.hasPrev}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50"
                      >
                        Previous
                      </motion.button>
                      
                      {Array.from({ length: data.data.pagination.totalPages }, (_, i) => i + 1).map((page) => (
                        <motion.button
                          key={page}
                          onClick={() => handleFilterChange({ page })}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 rounded-lg font-medium ${
                            page === data.data.pagination.currentPage 
                              ? 'bg-indigo-600 text-white' 
                              : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </motion.button>
                      ))}
                      
                      <motion.button
                        onClick={() => handleFilterChange({ page: data.data.pagination.currentPage + 1 })}
                        disabled={!data.data.pagination.hasNext}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition disabled:opacity-50"
                      >
                        Next
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default ItemsPage