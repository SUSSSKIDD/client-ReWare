import { X } from 'lucide-react'

const FilterSidebar = ({ filters, onFilterChange, isOpen, onClose }) => {
  const categories = [
    { value: 'tops', label: 'Tops' },
    { value: 'bottoms', label: 'Bottoms' },
    { value: 'dresses', label: 'Dresses' },
    { value: 'outerwear', label: 'Outerwear' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'accessories', label: 'Accessories' }
  ]

  const sizes = [
    { value: 'XS', label: 'XS' },
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
    { value: 'XXL', label: 'XXL' },
    { value: 'One Size', label: 'One Size' }
  ]

  const conditions = [
    { value: 'new', label: 'New' },
    { value: 'like-new', label: 'Like New' },
    { value: 'good', label: 'Good' },
    { value: 'fair', label: 'Fair' },
    { value: 'poor', label: 'Poor' }
  ]

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 bg-white shadow-lg lg:shadow-none border-r border-secondary-200 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-secondary-200 lg:hidden">
            <h3 className="text-lg font-semibold text-secondary-900">Filters</h3>
            <button
              onClick={onClose}
              className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Category Filter */}
            <div>
              <h4 className="font-medium text-secondary-900 mb-3">Category</h4>
              <div className="space-y-2">
                {categories.map((category) => (
                  <label key={category.value} className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      value={category.value}
                      checked={filters.category === category.value}
                      onChange={(e) => onFilterChange({ category: e.target.value })}
                      className="w-4 h-4 text-primary-600 border-secondary-300 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-secondary-700">
                      {category.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Size Filter */}
            <div>
              <h4 className="font-medium text-secondary-900 mb-3">Size</h4>
              <div className="grid grid-cols-2 gap-2">
                {sizes.map((size) => (
                  <label key={size.value} className="flex items-center">
                    <input
                      type="radio"
                      name="size"
                      value={size.value}
                      checked={filters.size === size.value}
                      onChange={(e) => onFilterChange({ size: e.target.value })}
                      className="w-4 h-4 text-primary-600 border-secondary-300 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-secondary-700">
                      {size.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Condition Filter */}
            <div>
              <h4 className="font-medium text-secondary-900 mb-3">Condition</h4>
              <div className="space-y-2">
                {conditions.map((condition) => (
                  <label key={condition.value} className="flex items-center">
                    <input
                      type="radio"
                      name="condition"
                      value={condition.value}
                      checked={filters.condition === condition.value}
                      onChange={(e) => onFilterChange({ condition: e.target.value })}
                      className="w-4 h-4 text-primary-600 border-secondary-300 focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-secondary-700">
                      {condition.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Points Range Filter */}
            <div>
              <h4 className="font-medium text-secondary-900 mb-3">Points Range</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-secondary-700 mb-1">
                    Minimum Points
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minPoints}
                    onChange={(e) => onFilterChange({ minPoints: e.target.value })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm text-secondary-700 mb-1">
                    Maximum Points
                  </label>
                  <input
                    type="number"
                    placeholder="1000"
                    value={filters.maxPoints}
                    onChange={(e) => onFilterChange({ maxPoints: e.target.value })}
                    className="input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-secondary-200">
            <button
              onClick={() => {
                onFilterChange({
                  category: '',
                  size: '',
                  condition: '',
                  minPoints: '',
                  maxPoints: ''
                })
              }}
              className="btn btn-outline w-full"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default FilterSidebar 