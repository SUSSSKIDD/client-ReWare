import { Link } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Home, Search, Package } from 'lucide-react'

const NotFoundPage = () => {
  return (
    <>
      <Helmet>
        <title>Page Not Found - ReWear</title>
        <meta name="description" content="The page you're looking for doesn't exist" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          {/* 404 Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-primary-600 to-accent-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-6xl font-bold text-secondary-900 mb-2">404</h1>
            <h2 className="text-2xl font-semibold text-secondary-900 mb-4">
              Page Not Found
            </h2>
          </div>

          {/* Message */}
          <p className="text-secondary-600 mb-8 leading-relaxed">
            Oops! The page you're looking for seems to have wandered off. 
            It might have been swapped for something else or is no longer available.
          </p>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Link
              to="/"
              className="btn btn-primary w-full btn-lg"
            >
              <Home className="w-5 h-5 mr-2" />
              Go Home
            </Link>
            
            <Link
              to="/items"
              className="btn btn-outline w-full"
            >
              <Search className="w-4 h-4 mr-2" />
              Browse Items
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-8 pt-8 border-t border-secondary-200">
            <p className="text-sm text-secondary-600 mb-4">
              Looking for something specific?
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                to="/items"
                className="text-primary-600 hover:text-primary-500 transition-colors"
              >
                Browse Items
              </Link>
              <Link
                to="/login"
                className="text-primary-600 hover:text-primary-500 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-primary-600 hover:text-primary-500 transition-colors"
              >
                Create Account
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NotFoundPage 