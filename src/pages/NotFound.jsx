import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getIcon } from '../utils/iconUtils'

const NotFound = () => {
  const navigate = useNavigate()
  const ArrowLeftIcon = getIcon('arrow-left')
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div 
        className="max-w-md w-full text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div 
          className="mb-6 inline-block"
          variants={itemVariants}
        >
          <div className="bg-primary-light bg-opacity-20 p-6 rounded-full inline-block">
            <svg className="w-16 h-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-3xl md:text-4xl font-extrabold text-surface-900 dark:text-white mb-2"
          variants={itemVariants}
        >
          Page Not Found
        </motion.h1>
        
        <motion.p 
          className="text-surface-600 dark:text-surface-300 mb-8"
          variants={itemVariants}
        >
          The page you are looking for doesn't exist or has been moved.
        </motion.p>
        
        <motion.div variants={itemVariants}>
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary flex items-center space-x-2 mx-auto"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            <span>Go back home</span>
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default NotFound