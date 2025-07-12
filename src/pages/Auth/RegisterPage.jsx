import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { useForm } from 'react-hook-form'
import { Eye, EyeOff, Mail, Lock, User, AtSign } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import LoadingSpinner from '../../components/common/LoadingSpinner'

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const { register: registerUser, isLoading } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
    const result = await registerUser(data)
    if (result.success) {
      navigate('/dashboard', { replace: true })
    } else {
      setError('root', {
        type: 'manual',
        message: result.error || 'Registration failed'
      })
    }
  }

  return (
    <>
      <Helmet>
        <title>Sign Up - ReWear</title>
        <meta name="description" content="Create your ReWear account" />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden" 
           style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80)' }}>
        {/* Full Background Blur Layer */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
        
        {/* Glass Card Container */}
        <div className="relative z-10 max-w-md w-full">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 overflow-hidden">
            <div className="p-8 sm:p-10">
              {/* Header */}
              <div className="text-center mb-8">
                <Link to="/" className="flex items-center justify-center space-x-2 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-600 to-accent-600 rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-2xl">R</span>
                  </div>
                  <span className="text-3xl font-bold text-white">ReWear</span>
                </Link>
                <h2 className="text-3xl font-bold text-white">Join ReWear</h2>
                <p className="mt-2 text-white/80">
                  Create your account to start swapping
                </p>
              </div>

              {/* Register Form */}
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Name Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-white mb-2">
                      First Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-white/70" />
                      </div>
                      <input
                        id="firstName"
                        type="text"
                        className={`input-glass pl-10 ${errors.firstName ? 'border-red-400' : 'border-white/20'}`}
                        placeholder="First name"
                        {...register('firstName', {
                          required: 'First name is required',
                          minLength: {
                            value: 2,
                            message: 'First name must be at least 2 characters'
                          }
                        })}
                      />
                    </div>
                    {errors.firstName && (
                      <p className="mt-1 text-sm text-red-200">{errors.firstName.message}</p>
                    )}
                  </div>

                  {/* Last Name Field */}
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-white mb-2">
                      Last Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-white/70" />
                      </div>
                      <input
                        id="lastName"
                        type="text"
                        className={`input-glass pl-10 ${errors.lastName ? 'border-red-400' : 'border-white/20'}`}
                        placeholder="Last name"
                        {...register('lastName', {
                          required: 'Last name is required',
                          minLength: {
                            value: 2,
                            message: 'Last name must be at least 2 characters'
                          }
                        })}
                      />
                    </div>
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-200">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                {/* Username Field */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-white mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <AtSign className="h-5 w-5 text-white/70" />
                    </div>
                    <input
                      id="username"
                      type="text"
                      className={`input-glass pl-10 ${errors.username ? 'border-red-400' : 'border-white/20'}`}
                      placeholder="Choose a username"
                      {...register('username', {
                        required: 'Username is required',
                        minLength: {
                          value: 3,
                          message: 'Username must be at least 3 characters'
                        }
                      })}
                    />
                  </div>
                  {errors.username && (
                    <p className="mt-1 text-sm text-red-200">{errors.username.message}</p>
                  )}
                </div>

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
                      className={`input-glass pl-10 pr-10 ${errors.password ? 'border-red-400' : 'border-white/20'}`}
                      placeholder="Create a password"
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

                {/* Confirm Password Field */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-white/70" />
                    </div>
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      className={`input-glass pl-10 pr-10 ${errors.confirmPassword ? 'border-red-400' : 'border-white/20'}`}
                      placeholder="Confirm your password"
                      {...register('confirmPassword', {
                        required: 'Please confirm your password',
                        validate: value => value === password || 'Passwords do not match'
                      })}
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-5 w-5 text-white/70 hover:text-white transition-colors" />
                      ) : (
                        <Eye className="h-5 w-5 text-white/70 hover:text-white transition-colors" />
                      )}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-200">{errors.confirmPassword.message}</p>
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
                    'Create Account'
                  )}
                </button>
              </form>

              {/* Links */}
              <div className="mt-6 text-center">
                <p className="text-sm text-white/80">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    className="font-medium text-white hover:text-primary-200 transition-colors"
                  >
                    Sign in here
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

export default RegisterPage