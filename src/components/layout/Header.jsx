import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { 
  Menu, 
  X, 
  LogOut, 
  Settings, 
  Plus,
  Shield
} from 'lucide-react'
import Avatar from '../common/Avatar'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: 'Browse', href: '/items' },
    { name: 'Swaps', href: '/swaps' },
  ]

  const userNavigation = [
    { name: 'Dashboard', href: '/dashboard' },
  ]

  const adminNavigation = [
    { name: 'Admin Panel', href: '/admin' },
  ]

  const isActive = (path) => location.pathname === path

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
  }

  return (
    <header className="bg-white/95 backdrop-blur-sm shadow-lg border-b border-secondary-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-600 to-accent-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="text-2xl font-bold text-secondary-900">ReWear</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-10">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive(item.href)
                    ? 'text-primary-600 bg-primary-50 shadow-sm'
                    : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 hover:shadow-sm'
                }`}
              >
                {item.name}
              </Link>
            ))}
            {user && userNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                  isActive(item.href)
                    ? 'text-primary-600 bg-primary-50 shadow-sm'
                    : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 hover:shadow-sm'
                }`}
              >
                {item.name}
              </Link>
            ))}
            {user && user.role === 'admin' && adminNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center space-x-2 ${
                  isActive(item.href)
                    ? 'text-red-600 bg-red-50 shadow-sm'
                    : 'text-red-600 hover:text-red-700 hover:bg-red-50 hover:shadow-sm'
                }`}
              >
                <Shield className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center space-x-6">
            {/* Add Item Button */}
            <Link
              to="/add-item"
              className="hidden sm:flex items-center space-x-3 bg-primary-600 text-white px-6 py-3 rounded-xl hover:bg-primary-700 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold">Add Item</span>
            </Link>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-secondary-50 transition-colors"
                >
                  <Avatar user={user} size="sm" />
                  <span className="hidden sm:block text-sm font-medium text-secondary-900">
                    {user.firstName}
                  </span>
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-secondary-200 py-1 z-50">
                    <Link
                      to="/dashboard"
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      <span>Dashboard</span>
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Shield className="w-4 h-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-50 w-full text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="text-secondary-600 hover:text-secondary-900 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 rounded-lg transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-secondary-200">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-primary-600 bg-primary-50'
                      : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {user && (
                <>
                  {userNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActive(item.href)
                          ? 'text-primary-600 bg-primary-50'
                          : 'text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  {user.role === 'admin' && adminNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors flex items-center space-x-2 ${
                        isActive(item.href)
                          ? 'text-red-600 bg-red-50'
                          : 'text-red-600 hover:text-red-700 hover:bg-red-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Shield className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  ))}
                  <Link
                    to="/add-item"
                    className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-secondary-600 hover:text-secondary-900 hover:bg-secondary-50 rounded-md transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Item</span>
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header 