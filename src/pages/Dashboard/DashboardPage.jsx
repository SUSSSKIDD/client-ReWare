import { Helmet } from 'react-helmet-async'
import { Link, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import toast from 'react-hot-toast'
import {
  Plus, Package, Users, Heart,
  ArrowRight, Calendar, MapPin, Star
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { usersAPI } from '../../services/api'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Avatar from '../../components/common/Avatar'
import { motion } from 'framer-motion'

const DashboardPage = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const location = useLocation()

  // Show welcome message if coming from add item page
  useEffect(() => {
    if (location.state?.fromAddItem) {
      toast.success('Item added successfully! Check your updated statistics below.', {
        duration: 4000,
        icon: '🎉'
      })
      
      // Force refresh of stats when coming from add item
      queryClient.invalidateQueries(['userStats'])
      queryClient.invalidateQueries(['userActivity'])
    }
  }, [location.state, queryClient])

  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['userStats'],
    queryFn: () => usersAPI.getStats(),
    enabled: !!user,
    refetchOnWindowFocus: true,
    staleTime: 0, // Always refetch when invalidated
    refetchInterval: 60000 // Refetch every minute
  })

  // Debug logging
  console.log('Dashboard - stats data:', stats)
  console.log('Dashboard - stats data structure:', stats?.data?.stats)
  console.log('Dashboard - stats loading:', statsLoading)
  console.log('Dashboard - stats error:', statsError)
  console.log('Dashboard - location state:', location.state)

  const { data: activity, isLoading: activityLoading, error: activityError } = useQuery({
    queryKey: ['userActivity'],
    queryFn: () => usersAPI.getActivity({ limit: 5 }),
    enabled: !!user,
    refetchOnWindowFocus: true,
    staleTime: 0, // Always refetch when invalidated
    refetchInterval: 60000 // Refetch every minute
  })

  // Debug logging for activity
  console.log('Dashboard - activity data:', activity)
  console.log('Dashboard - activity error:', activityError)

  if (statsLoading || activityLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner size="xl" />
      </div>
    )
  }

  // Handle errors gracefully
  if (statsError || activityError) {
    console.error('Dashboard errors:', { statsError, activityError })
  }

  // Fallback values in case API fails
  const fallbackStats = {
    items: { total: 0, available: 0 },
    swaps: { total: 0, completed: 0, pending: 0 },
    points: user?.points || 0,
    rating: user?.rating || 0,
    reviewsCount: user?.reviewsCount || 0
  }

  const statCards = [
    {
      title: 'Total Items',
      value: stats?.data?.stats?.items?.total || stats?.stats?.items?.total || fallbackStats.items.total,
      icon: Package,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Available Items',
      value: stats?.data?.stats?.items?.available || stats?.stats?.items?.available || fallbackStats.items.available,
      icon: Package,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Swaps',
      value: stats?.data?.stats?.swaps?.total || stats?.stats?.swaps?.total || fallbackStats.swaps.total,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Points Balance',
      value: stats?.data?.stats?.points || stats?.stats?.points || fallbackStats.points,
      icon: Heart,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ]

  const quickActions = [
    {
      title: 'Add New Item',
      description: 'List a clothing item for swap',
      icon: Plus,
      href: '/add-item',
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      title: 'Browse Items',
      description: 'Find items to swap',
      icon: Package,
      href: '/items',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'My Swaps',
      description: 'View your swap history',
      icon: Users,
      href: '/swaps',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  return (
    <>
      <Helmet>
        <title>Dashboard - ReWear</title>
        <meta name="description" content="Your ReWear dashboard" />
      </Helmet>

      <div className="pt-28 px-6 max-w-7xl mx-auto pb-20 relative">
        {/* Background images with low opacity */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-30"></div>
        </div>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.6 }} 
          className="mb-10 relative"
        >
          <div>
            <h1 className="text-4xl font-bold text-indigo-700 drop-shadow-sm">Welcome back, {user?.firstName} 👋</h1>
            <p className="text-gray-600 mt-2 text-sm">Here's what's happening with your ReWear account</p>
          </div>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {statCards.map((stat, index) => (
            <motion.div
              key={index}
              className="rounded-2xl bg-white/90 backdrop-blur-sm p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border border-white/60 hover:border-white/80"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.03, y: -5 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">{stat.title}</p>
                  <h2 className="text-3xl font-bold text-gray-800">{stat.value}</h2>
                </div>
                <div className={`p-4 rounded-xl ${stat.bgColor} shadow-lg`}>
                  <stat.icon className={`w-7 h-7 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions + Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/60"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-indigo-700 mb-1">Quick Actions</h3>
                <p className="text-sm text-gray-600">Jump into action right away</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center shadow-lg">
                <Plus className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
            <div className="space-y-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.href}
                  className="flex items-center bg-white p-5 rounded-xl hover:bg-indigo-50 transition-all duration-300 border border-gray-100 hover:border-indigo-200 hover:shadow-lg group"
                >
                  <div className={`p-3 rounded-xl ${action.bgColor} mr-4 shadow-md group-hover:shadow-lg transition-all duration-300`}>
                    <action.icon className={`w-6 h-6 ${action.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800 group-hover:text-indigo-700 transition-colors">{action.title}</p>
                    <p className="text-sm text-gray-600 group-hover:text-indigo-600 transition-colors mt-1">{action.description}</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 ml-3 transition-all duration-300 group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Recent Activity */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/60"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl font-bold text-indigo-700 mb-1">Recent Activity</h3>
                <p className="text-sm text-gray-600">Your latest uploads and swaps</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center shadow-lg">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>

            <div className="space-y-4">
              {activity?.data?.activities?.length > 0 || activity?.activities?.length > 0 ? (
                (activity?.data?.activities || activity?.activities || []).map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="flex items-center p-5 rounded-xl bg-white border border-gray-200 hover:border-indigo-200 transition-all duration-300 shadow-md hover:shadow-lg"
                    whileHover={{ x: 8, scale: 1.02 }}
                  >
                    <div className="mr-5">
                      {item.type === "item" ? (
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shadow-lg">
                          <Package className="w-6 h-6 text-blue-600" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center shadow-lg">
                          <Users className="w-6 h-6 text-purple-600" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-800">
                        {item.type === "item" ? item.data.title : `Swap ${item.data.status}`}
                      </p>
                      <p className="text-xs text-gray-600 flex items-center mt-2">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(item.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      {item.type === "item" ? (
                        <span className={`text-xs font-bold px-3 py-2 rounded-full ${item.data.isAvailable ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"}`}>
                          {item.data.isAvailable ? "Available" : "Unavailable"}
                        </span>
                      ) : (
                        <span className={`text-xs font-bold px-3 py-2 rounded-full ${
                          item.data.status === "completed" ? "bg-indigo-100 text-indigo-700"
                          : item.data.status === "pending" ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-200 text-gray-700"
                        }`}>
                          {item.data.status}
                        </span>
                      )}
                    </div>
                  </motion.div>
                ))
              ) : (
                <motion.div 
                  className="text-center py-12 bg-white/60 rounded-xl border-2 border-dashed border-gray-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Package className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">No recent activity</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Start by listing an item or making your first swap.
                  </p>
                </motion.div>
              )}
            </div>

            {(activity?.data?.activities?.length > 0 || activity?.activities?.length > 0) && (
              <div className="mt-8 text-right">
                <Link
                  to="/users/activity"
                  className="text-sm font-semibold text-indigo-600 hover:text-indigo-500 transition-all duration-300 inline-flex items-center hover:scale-105"
                >
                  View all activity <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            )}
          </motion.div>
        </div>

        {/* User Profile Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center gap-8 border border-white/60"
        >
          <div className="relative">
            <Avatar user={user} size="2xl" />
            <div className="absolute -bottom-3 -right-3 bg-indigo-100 rounded-full p-2 shadow-lg">
              <Star className="w-6 h-6 text-yellow-500" />
            </div>
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-sm text-gray-600 font-medium">@{user?.username}</p>
            </div>
            {user?.location && (
              <p className="text-sm text-gray-600 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {user.location}
              </p>
            )}
            {user?.bio && (
              <p className="text-gray-700 text-sm leading-relaxed">{user.bio}</p>
            )}
          </div>
          <div className="bg-indigo-50 p-6 rounded-xl shadow-lg border border-indigo-100">
            <div className="flex items-center text-yellow-500 text-sm justify-center mb-2">
              <Star className="w-5 h-5 mr-2" />
              <span className="font-bold text-lg">{user?.rating || 0}</span>
            </div>
            <p className="text-xs text-gray-600 text-center font-medium">Rating</p>
            <div className="mt-4 pt-4 border-t border-indigo-200">
              <p className="text-xl font-bold text-gray-800 text-center">{user?.reviewsCount || 0}</p>
              <p className="text-xs text-gray-600 text-center font-medium">Reviews</p>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  )
}

export default DashboardPage