import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format, subDays } from 'date-fns'
import { getIcon } from '../utils/iconUtils'
import { calculateMetrics, generateTimelineData, categorizeTasksByPriority, analyzeTeamPerformance } from '../utils/dashboardUtils'
import StatsCard from '../components/dashboards/StatsCard'
import ChartContainer from '../components/dashboards/ChartContainer'
import Chart from 'react-apexcharts'

const Dashboard = () => {
  // Icons
  const CheckSquareIcon = getIcon('check-square')
  const ClockIcon = getIcon('clock')
  const ListIcon = getIcon('list')
  const TrendingUpIcon = getIcon('trending-up')
  const RefreshCwIcon = getIcon('refresh-cw')
  
  // State
  const [tasks, setTasks] = useState([])
  const [metrics, setMetrics] = useState({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    completionRate: 0,
    averageCompletionTime: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Check dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark')
      setIsDarkMode(isDark)
    }
    
    checkDarkMode()
    
    // Set up an observer to detect theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          checkDarkMode()
        }
      })
    })
    
    observer.observe(document.documentElement, { attributes: true })
    
    return () => observer.disconnect()
  }, [])

  // Load tasks from localStorage
  useEffect(() => {
    const loadTasks = () => {
      setIsLoading(true)
      try {
        const savedTasks = localStorage.getItem('flowsync-tasks')
        const parsedTasks = savedTasks ? JSON.parse(savedTasks) : []
        setTasks(parsedTasks)
        
        // Calculate metrics
        const calculatedMetrics = calculateMetrics(parsedTasks)
        setMetrics(calculatedMetrics)
      } catch (error) {
        console.error('Error loading tasks:', error)
      } finally {
        setIsLoading(false)
        setLastUpdated(new Date())
      }
    }
    
    loadTasks()
    
    // Set up interval to refresh data
    const intervalId = setInterval(loadTasks, 30000) // Refresh every 30 seconds
    
    return () => clearInterval(intervalId)
  }, [])

  // Prepare chart data
  const taskStatusData = {
    series: [
      metrics.todoTasks || 0,
      metrics.inProgressTasks || 0,
      metrics.completedTasks || 0
    ],
    options: {
      chart: {
        type: 'pie',
        foreColor: isDarkMode ? '#cbd5e1' : '#475569'
      },
      labels: ['To Do', 'In Progress', 'Done'],
      colors: ['#818cf8', '#facc15', '#34d399'],
      legend: {
        position: 'bottom'
      },
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200
          },
          legend: {
            position: 'bottom'
          }
        }
      }],
      tooltip: {
        theme: isDarkMode ? 'dark' : 'light'
      }
    }
  }

  const timelineData = generateTimelineData(tasks, 14)
  const completionTrendData = {
    series: [{
      name: 'Tasks Completed',
      data: timelineData.completedCounts
    }],
    options: {
      chart: {
        type: 'line',
        foreColor: isDarkMode ? '#cbd5e1' : '#475569',
        toolbar: {
          show: false
        }
      },
      stroke: {
        curve: 'smooth',
        width: 3
      },
      colors: ['#34d399'],
      xaxis: {
        categories: timelineData.dates,
        labels: {
          rotate: -45,
          style: {
            fontSize: '10px'
          }
        }
      },
      tooltip: {
        theme: isDarkMode ? 'dark' : 'light'
      }
    }
  }

  const priorityData = categorizeTasksByPriority(tasks)
  const priorityChartData = {
    series: priorityData.counts,
    options: {
      chart: {
        type: 'donut',
        foreColor: isDarkMode ? '#cbd5e1' : '#475569'
      },
      labels: priorityData.labels,
      colors: ['#818cf8', '#facc15', '#f87171'],
      legend: {
        position: 'bottom'
      },
      tooltip: {
        theme: isDarkMode ? 'dark' : 'light'
      }
    }
  }

  const teamData = analyzeTeamPerformance(tasks)
  const teamChartData = {
    series: [{
      name: 'Tasks Completed',
      data: teamData.completedCounts
    }],
    options: {
      chart: {
        type: 'bar',
        foreColor: isDarkMode ? '#cbd5e1' : '#475569',
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          borderRadius: 4
        }
      },
      colors: ['#0d9488'],
      xaxis: {
        categories: teamData.names
      },
      tooltip: {
        theme: isDarkMode ? 'dark' : 'light'
      }
    }
  }

  return (
    <div className="flex-1 flex flex-col">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <RefreshCwIcon className="w-12 h-12 text-primary animate-spin mb-4" />
            <h3 className="text-lg font-medium">Loading dashboard data...</h3>
          </div>
        </div>
      ) : (
        <>
          {/* Last updated info */}
          <div className="flex justify-end mb-4">
            <span className="text-xs text-surface-500 dark:text-surface-400">
              Last updated: {format(lastUpdated, 'MMM d, yyyy HH:mm:ss')}
            </span>
          </div>
          
          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard 
              title="Total Tasks" 
              value={metrics.totalTasks} 
              description="All tasks in the project"
              icon={ListIcon}
              color="text-primary"
            />
            <StatsCard 
              title="Completed Tasks" 
              value={metrics.completedTasks} 
              description="Tasks marked as done"
              icon={CheckSquareIcon}
              color="text-green-500"
            />
            <StatsCard 
              title="In Progress" 
              value={metrics.inProgressTasks} 
              description="Tasks currently being worked on"
              icon={ClockIcon}
              color="text-yellow-500"
            />
            <StatsCard 
              title="Completion Rate" 
              value={`${metrics.completionRate}%`} 
              description="Percentage of completed tasks"
              icon={TrendingUpIcon}
              color="text-secondary"
              trend={metrics.completionRateTrend}
              trendValue={`${metrics.completionRateTrendValue}%`}
            />
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <ChartContainer title="Task Status Distribution">
              <Chart 
                options={taskStatusData.options}
                series={taskStatusData.series}
                type="pie"
                height={300}
              />
            </ChartContainer>
            
            <ChartContainer title="Task Completion Trend">
              <Chart 
                options={completionTrendData.options}
                series={completionTrendData.series}
                type="line"
                height={300}
              />
            </ChartContainer>
            
            <ChartContainer title="Team Member Performance">
              <Chart 
                options={teamChartData.options}
                series={teamChartData.series}
                type="bar"
                height={300}
              />
            </ChartContainer>
            
            <ChartContainer title="Task Priority Distribution">
              <Chart 
                options={priorityChartData.options}
                series={priorityChartData.series}
                type="donut"
                height={300}
              />
            </ChartContainer>
          </div>
        </>
      )}
    </div>
  )
}

export default Dashboard