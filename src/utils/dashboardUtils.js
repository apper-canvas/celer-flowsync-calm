import { format, subDays, parseISO, differenceInDays } from 'date-fns'

/**
 * Calculate metrics from tasks data
 * @param {Array} tasks - The tasks array
 * @returns {Object} - Metrics object
 */
export const calculateMetrics = (tasks) => {
  const totalTasks = tasks.length
  const todoTasks = tasks.filter(task => task.column === 'todo').length
  const inProgressTasks = tasks.filter(task => task.column === 'in-progress').length
  const completedTasks = tasks.filter(task => task.column === 'done').length
  
  // Calculate completion rate
  const completionRate = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0
  
  // Compare with previous period (simulation)
  const previousCompletionRate = 42 // This would normally be calculated from historical data
  const completionRateTrendValue = completionRate - previousCompletionRate
  const completionRateTrend = completionRateTrendValue >= 0 ? 'up' : 'down'
  
  // Calculate average completion time (simulation)
  const averageCompletionTime = completedTasks > 0 ? 5.2 : 0 // This would normally be calculated from task history
  
  return {
    totalTasks,
    todoTasks,
    inProgressTasks,
    completedTasks,
    completionRate,
    completionRateTrend,
    completionRateTrendValue: Math.abs(completionRateTrendValue),
    averageCompletionTime
  }
}

/**
 * Generate timeline data for charts
 * @param {Array} tasks - The tasks array
 * @param {number} days - Number of days to include
 * @returns {Object} - Timeline data object
 */
export const generateTimelineData = (tasks, days = 14) => {
  const dates = []
  const completedCounts = []
  const today = new Date()
  
  // Generate dates for the last N days
  for (let i = days - 1; i >= 0; i--) {
    const date = subDays(today, i)
    dates.push(format(date, 'MMM d'))
    
    // Count tasks completed on this date
    const formattedDate = format(date, 'yyyy-MM-dd')
    
    // This is a simulation since we don't have actual completion dates
    // In a real app, you would use task history data
    let count = 0
    if (i < days / 2) {
      // More recent days have actual data
      count = tasks.filter(task => {
        if (task.column !== 'done') return false
        
        // This is a heuristic to simulate completion dates
        // In a real app, you would have actual completion timestamps
        const taskDate = parseISO(task.dueDate)
        const diff = differenceInDays(date, taskDate)
        return diff >= -1 && diff <= 1
      }).length
    } else {
      // Older days have simulated data
      count = Math.floor(Math.random() * 3)
    }
    
    completedCounts.push(count)
  }
  
  return {
    dates,
    completedCounts
  }
}

/**
 * Categorize tasks by priority
 * @param {Array} tasks - The tasks array
 * @returns {Object} - Priority data
 */
export const categorizeTasksByPriority = (tasks) => {
  const priorities = {
    'low': 0,
    'medium': 0,
    'high': 0
  }
  
  // Count tasks by priority
  tasks.forEach(task => {
    if (priorities.hasOwnProperty(task.priority)) {
      priorities[task.priority]++
    }
  })
  
  return {
    labels: Object.keys(priorities).map(p => p.charAt(0).toUpperCase() + p.slice(1)),
    counts: Object.values(priorities)
  }
}

/**
 * Analyze team member performance
 * @param {Array} tasks - The tasks array
 * @returns {Object} - Team performance data
 */
export const analyzeTeamPerformance = (tasks) => {
  const teamMembers = {}
  
  // Group tasks by assignee
  tasks.forEach(task => {
    const name = task.assignee.name
    if (!teamMembers[name]) {
      teamMembers[name] = { total: 0, completed: 0 }
    }
    
    teamMembers[name].total++
    if (task.column === 'done') {
      teamMembers[name].completed++
    }
  })
  
  // Convert to arrays for chart data
  const names = Object.keys(teamMembers)
  const completedCounts = names.map(name => teamMembers[name].completed)
  
  return {
    names,
    completedCounts
  }
}