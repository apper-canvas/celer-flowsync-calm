import { motion } from 'framer-motion'

const ChartContainer = ({ title, children }) => {
  return (
    <motion.div 
      className="chart-container"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <h3 className="text-lg font-medium mb-4 text-surface-800 dark:text-surface-200">
        {title}
      </h3>
      
      {children}
    </motion.div>
  )
}

export default ChartContainer