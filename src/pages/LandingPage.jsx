import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowRight, 
  Heart, 
  Users, 
  Leaf, 
  Star,
  TrendingUp,
  Shield,
  Zap,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

// Constants for reusable data
const SHOWCASE_ITEMS = [
  {
    id: 1,
    title: 'Vintage Denim Jackets',
    category: 'Jackets',
    imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 2,
    title: 'Sustainable Summer Dresses',
    category: 'Dresses',
    imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 3,
    title: 'Organic Cotton Tees',
    category: 'T-Shirts',
    imageUrl: 'https://images.unsplash.com/photo-1529374255404-311a2a4f1fd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 4,
    title: 'Upcycled Denim',
    category: 'Jeans',
    imageUrl: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 5,
    title: 'Handmade Accessories',
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1591348278863-a8fb3887e2aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  }
];

const FEATURES = [
  {
    icon: Heart,
    title: 'Sustainable Fashion',
    description: 'Give your clothes a second life and reduce textile waste in our community.'
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Connect with like-minded fashion enthusiasts who care about sustainability.'
  },
  {
    icon: Leaf,
    title: 'Eco-Friendly',
    description: 'Every swap helps reduce the environmental impact of fast fashion.'
  },
  {
    icon: Star,
    title: 'Quality Items',
    description: 'Carefully curated items from community members who value quality.'
  }
];

const STATS = [
  { label: 'Active Users', value: '10K+' },
  { label: 'Items Swapped', value: '50K+' },
  { label: 'CO2 Saved', value: '25K kg' },
  { label: 'Happy Swappers', value: '95%' }
];

const HOW_IT_WORKS = [
  {
    step: '1',
    title: 'List Your Items',
    description: 'Upload photos and details of clothing you no longer wear.'
  },
  {
    step: '2',
    title: 'Browse & Connect',
    description: 'Discover items from other community members and initiate swaps.'
  },
  {
    step: '3',
    title: 'Swap & Save',
    description: 'Complete exchanges and earn points for future swaps.'
  }
];

// Animation variants
const CONTAINER_VARIANTS = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const ITEM_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Create infinite carousel items
  const infiniteItems = [...SHOWCASE_ITEMS, ...SHOWCASE_ITEMS, ...SHOWCASE_ITEMS];

  // Auto-scroll for infinite carousel
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    let animationId;
    const speed = 1;

    const animate = () => {
      try {
        carousel.scrollLeft += speed;
        if (carousel.scrollLeft >= carousel.scrollWidth / 3) {
          carousel.scrollLeft = 0;
        }
        animationId = requestAnimationFrame(animate);
      } catch (error) {
        console.error('Carousel animation error:', error);
        cancelAnimationFrame(animationId);
      }
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, []);

  // Carousel controls
  const nextSlide = () => {
    setActiveSlide(prev => (prev === SHOWCASE_ITEMS.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setActiveSlide(prev => (prev === 0 ? SHOWCASE_ITEMS.length - 1 : prev - 1));
  };

  // Drag functionality for carousel
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - carouselRef.current.offsetLeft);
    setScrollLeft(carouselRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - carouselRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    carouselRef.current.scrollLeft = scrollLeft - walk;
  };

  // Intersection observer for scroll animations
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  return (
    <>
      <Helmet>
        <title>ReWear - Community Clothing Exchange | Sustainable Fashion</title>
        <meta 
          name="description" 
          content="Join ReWear's community clothing exchange platform. Swap unused clothing, reduce waste, and embrace sustainable fashion." 
        />
      </Helmet>

      <div className="min-h-screen overflow-hidden">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary-50 to-accent-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-30"
            aria-hidden="true"
          />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
            <div className="text-center">
              <motion.div
                initial="hidden"
                animate="show"
                variants={CONTAINER_VARIANTS}
                className="mb-6"
              >
                <motion.h1 variants={ITEM_VARIANTS} className="text-4xl md:text-6xl font-bold text-secondary-900 mb-2">
                  <span className="inline-block">Sustainable</span>
                </motion.h1>
                <motion.div variants={ITEM_VARIANTS} className="relative inline-block">
                  <span className="relative z-10 text-4xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600">
                    Fashion Exchange
                  </span>
                  <motion.span 
                    className="absolute bottom-0 left-0 w-full h-2 bg-orange-400 z-0"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </motion.div>
              </motion.div>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-secondary-600 mb-8 max-w-3xl mx-auto"
              >
                Join thousands of fashion enthusiasts who are reducing waste and building 
                a sustainable future through clothing swaps and community connections.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                {isAuthenticated ? (
                  <Link
                    to="/items"
                    className="btn btn-primary btn-lg group transform hover:-translate-y-1 transition-transform duration-300 shadow-lg hover:shadow-xl"
                    aria-label="Browse available items"
                  >
                    Browse Items
                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/register"
                      className="btn btn-primary btn-lg group transform hover:-translate-y-1 transition-transform duration-300 shadow-lg hover:shadow-xl"
                      aria-label="Get started with ReWear"
                    >
                      Get Started
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                      to="/items"
                      className="btn btn-outline btn-lg transform hover:-translate-y-1 transition-transform duration-300"
                      aria-label="Browse items without account"
                    >
                      Browse Items
                    </Link>
                  </>
                )}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Showcase Carousel */}
        <section className="py-16 bg-white relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-full bg-gradient-to-r from-white via-transparent to-white z-10" />
          </div>
          
          <div 
            ref={carouselRef}
            className="flex overflow-x-hidden py-8 gap-8 cursor-grab"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            aria-label="Clothing items carousel"
          >
            {infiniteItems.map((item, index) => (
              <motion.div 
                key={`${item.id}-${index}`}
                className="flex-shrink-0 w-80 relative group"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative overflow-hidden rounded-xl h-96">
                  <img 
                    src={item.imageUrl} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-6">
                    <div>
                      <span className="text-sm text-white/80">{item.category}</span>
                      <h3 className="text-xl font-bold text-white">{item.title}</h3>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between mt-4">
            <button 
              onClick={prevSlide}
              className="p-2 rounded-full bg-white shadow-md hover:bg-secondary-50 transition-colors"
              aria-label="Previous item"
            >
              <ChevronLeft className="w-6 h-6 text-secondary-700" />
            </button>
            <button 
              onClick={nextSlide}
              className="p-2 rounded-full bg-white shadow-md hover:bg-secondary-50 transition-colors"
              aria-label="Next item"
            >
              <ChevronRight className="w-6 h-6 text-secondary-700" />
            </button>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white relative overflow-hidden" ref={ref}>
          <div 
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1520006403909-838d6b92c22e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-30"
            aria-hidden="true"
          />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {STATS.map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="text-center p-6 rounded-xl bg-white bg-opacity-90 backdrop-blur-sm shadow-sm"
                  initial={{ opacity: 0, y: 30 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-3xl md:text-4xl font-bold text-primary-600 mb-2">
                    {stat.value}
                  </div>
                  <div className="text-secondary-600">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-secondary-50 relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-30"
            aria-hidden="true"
          />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                Why Choose ReWear?
              </h2>
              <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
                We're building a community that values sustainability, quality, and connection.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {FEATURES.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div 
                    key={index} 
                    className="text-center bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow backdrop-blur-sm bg-opacity-80"
                    whileHover={{ y: -10 }}
                  >
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-8 h-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-secondary-600">
                      {feature.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-24 bg-white relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492707892479-7bc8d5a4ee93?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-30"
            aria-hidden="true"
          />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-4">
                How It Works
              </h2>
              <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
                Getting started with ReWear is simple and rewarding.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {HOW_IT_WORKS.map((step, index) => (
                <motion.div 
                  key={index} 
                  className="text-center bg-white p-8 rounded-xl shadow-sm backdrop-blur-sm bg-opacity-80"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-secondary-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-secondary-600">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-primary-600 to-accent-600 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div 
              className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center"
              aria-hidden="true"
            />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Swapping?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join our community today and start your sustainable fashion journey.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link
                  to="/add-item"
                  className="btn bg-white text-primary-600 hover:bg-secondary-50 btn-lg transform hover:-translate-y-1 transition-transform duration-300 shadow-lg hover:shadow-xl"
                  aria-label="List your first item"
                >
                  List Your First Item
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn bg-white text-primary-600 hover:bg-secondary-50 btn-lg transform hover:-translate-y-1 transition-transform duration-300 shadow-lg hover:shadow-xl"
                    aria-label="Join ReWear"
                  >
                    Join ReWear
                  </Link>
                  <Link
                    to="/login"
                    className="btn btn-outline border-white text-white hover:bg-white hover:text-primary-600 btn-lg transform hover:-translate-y-1 transition-transform duration-300"
                    aria-label="Sign in to your account"
                  >
                    Sign In
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <section className="py-16 bg-secondary-900 text-white relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1483181957632-8bda974cbc91?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-30"
            aria-hidden="true"
          />
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center p-6 bg-secondary-800 rounded-xl bg-opacity-90 backdrop-blur-sm">
                <Shield className="w-12 h-12 text-primary-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure & Safe</h3>
                <p className="text-secondary-300">
                  Your data and transactions are protected with industry-standard security.
                </p>
              </div>
              
              <div className="flex flex-col items-center p-6 bg-secondary-800 rounded-xl bg-opacity-90 backdrop-blur-sm">
                <Zap className="w-12 h-12 text-primary-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Fast & Easy</h3>
                <p className="text-secondary-300">
                  Simple interface designed for quick and effortless clothing exchanges.
                </p>
              </div>
              
              <div className="flex flex-col items-center p-6 bg-secondary-800 rounded-xl bg-opacity-90 backdrop-blur-sm">
                <TrendingUp className="w-12 h-12 text-primary-400 mb-4" />
                <h3 className="text-xl font-semibold mb-2">Growing Community</h3>
                <p className="text-secondary-300">
                  Join thousands of users who are already making a difference.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default LandingPage;