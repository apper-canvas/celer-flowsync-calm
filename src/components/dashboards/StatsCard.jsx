import { motion } from 'framer-motion'
import { getIcon } from '../../utils/iconUtils'

const StatsCard = ({ title, value, description, icon, color, trend, trendValue }) => {
  const IconComponent = icon
  const TrendUpIcon = getIcon('trending-up')
  const TrendDownIcon = getIcon('trending-down')

  return (
    <motion.div 
      className="stats-card"
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex justify-between items-start mb-2">
        <div className={`p-2 rounded-lg ${color} bg-opacity-10 dark:bg-opacity-20`}>
          <IconComponent className={`w-5 h-5 ${color}`} />
        </div>
        {trend && (
          <div className={`stats-card-trend ${trend === 'up' ? 'stats-card-trend-up' : 'stats-card-trend-down'}`}>
            {trend === 'up' ? (
              <TrendUpIcon className="w-3 h-3 mr-1" />
            ) : (
              <TrendDownIcon className="w-3 h-3 mr-1" />
            )}
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div className="stats-card-title">{title}</div>
      <div className="stats-card-value">{value}</div>
      <div className="stats-card-description">{description}</div>
    </motion.div>
  )
}

export default StatsCard