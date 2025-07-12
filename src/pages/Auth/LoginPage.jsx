import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useForm()

  const from = location.state?.from?.pathname || '/dashboard'

  const onSubmit = async (data) => {
    const result = await login(data)
    if (result.success) {
      navigate(from, { replace: true })
    } else {
      setError('root', {
        type: 'manual',
        message: result.error || 'Login failed'
      })
    }
  }

  return (
    <>
      <Helmet>
        <title>Login - ReWear</title>
        <meta name="description" content="Sign in to your ReWear account" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8" 
           style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80)' }}>
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-sm"></div>
        
        <div className="max-w-md w-full z-10">
          {/* Glass Card */}
          <div className="bg-white/20 backdrop-blur-lg rounded-2xl shadow-xl border border-white/30 overflow-hidden">
            <div className="p-8 sm:p-10">
              {/* Header */}
              <div className="text-center mb-8">
                <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-2xl">R</span>
                  </div>
                  <span className="text-3xl font-bold text-white">ReWear</span>
                </Link>
                <h2 className="text-3xl font-bold text-white">Welcome back</h2>
                <p className="mt-2 text-white/80">
                  Sign in to your account to continue
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-white/70" />
                    </div>
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      className={`input-glass pl-10 ${errors.email ? 'border-red-400' : 'border-white/20'}`}
                      placeholder="Enter your email"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address'
                        }
                      })}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-200">{errors.email.message}</p>
                  )}
                </div>

                {/* Password Field */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-white/70" />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="current-password"
                      className={`input-glass pl-10 pr-10 ${errors.password ? 'border-red-400' : 'border-white/20'}`}
                      placeholder="Enter your password"
                      {...register('password', {
                        required: 'Password is required',
                        minLength: {
                          value: 6,
                          message: 'Password must be at least 6 characters'
                        }
                      })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5 text-white/70 hover:text-white transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-white/70 hover:text-white transition-colors" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="mt-1 text-sm text-red-200">{errors.password.message}</p>
                  )}
                </div>

                {/* Error Message */}
                {errors.root && (
                  <div className="bg-red-400/20 border border-red-400/30 rounded-lg p-4 backdrop-blur-sm">
                    <p className="text-sm text-red-100">{errors.root.message}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-glass-primary w-full btn-lg mt-2"
                >
                  {isLoading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    'Sign in'
                  )}
                </button>
              </form>

              {/* Links */}
              <div className="mt-6 text-center">
                <p className="text-sm text-white/80">
                  Don't have an account?{' '}
                  <Link
                    to="/register"
                    className="font-medium text-white hover:text-primary-200 transition-colors"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LoginPage