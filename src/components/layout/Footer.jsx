import { Link } from 'react-router-dom'
import { Heart, Twitter, Instagram, Facebook } from 'lucide-react'

const Footer = () => {
  return (
    <footer className="bg-secondary-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold">ReWear</span>
            </Link>
            <p className="text-secondary-300 mb-4 max-w-md">
              Join our community of sustainable fashion enthusiasts. Exchange unused clothing 
              through direct swaps or points-based redemptions.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-secondary-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-secondary-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-secondary-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/items" className="text-secondary-300 hover:text-white transition-colors">
                  Browse Items
                </Link>
              </li>
              <li>
                <Link to="/add-item" className="text-secondary-300 hover:text-white transition-colors">
                  Add Item
                </Link>
              </li>
              <li>
                <Link to="/swaps" className="text-secondary-300 hover:text-white transition-colors">
                  My Swaps
                </Link>
              </li>

            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-secondary-300 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-secondary-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-secondary-400 text-sm">
            © 2024 ReWear. All rights reserved.
          </p>
          <p className="text-secondary-400 text-sm flex items-center mt-2 md:mt-0">
            Made with <Heart className="w-4 h-4 mx-1 text-red-500" /> for sustainable fashion
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 