import { useState, useEffect, useMemo, useCallback } from 'react'
import { Calendar as BigCalendar, Views, momentLocalizer } from 'react-big-calendar'
import { format, parseISO, addDays, subDays, startOfWeek, endOfWeek, startOfMonth, endOfMonth, isWithinInterval, isSameDay } from 'date-fns'
import { enUS } from 'date-fns/locale'
import { toast } from 'react-toastify'
import { getIcon } from '../utils/iconUtils'
import 'react-big-calendar/lib/css/react-big-calendar.css'

// Create a localizer using date-fns
const localizer = {
  format: (date, format) => format(date, format, { locale: enUS }),
  parse: (str) => new Date(str),
  startOfWeek: (date) => startOfWeek(date, { locale: enUS }),
  getWeekdays: () => Array.from({ length: 7 }, (_, i) => format(addDays(startOfWeek(new Date()), i), 'EEEEEE')),
  formats: {
    dateFormat: 'dd',
    dayFormat: 'dd eee',
    monthHeaderFormat: 'MMMM yyyy',
    weekdayFormat: 'EEEEEE',
    dayHeaderFormat: 'cccc MMM d',
    dayRangeHeaderFormat: ({ start, end }) => `${format(start, 'MMMM dd')} - ${format(end, 'MMMM dd')}`,
    timeGutterFormat: 'HH:mm',
  },
}

const Calendar = () => {
  // Icons
  const FilterIcon = getIcon('filter')
  const CalendarIcon = getIcon('calendar')
  const ChevronLeftIcon = getIcon('chevron-left')
  const ChevronRightIcon = getIcon('chevron-right')
  const RefreshCwIcon = getIcon('refresh-cw')
  
  // State
  const [tasks, setTasks] = useState([])
  const [view, setView] = useState(Views.MONTH)
  const [date, setDate] = useState(new Date())
  const [filteredTasks, setFilteredTasks] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [dateRangeFilter, setDateRangeFilter] = useState({
    start: subDays(new Date(), 30),
    end: addDays(new Date(), 60)
  })
  const [isLoading, setIsLoading] = useState(true)
  
  // Priority color mapping
  const priorityColors = {
    low: 'rbc-event-low',
    medium: 'rbc-event-medium',
    high: 'rbc-event-high'
  }
  
  // Load tasks from localStorage
  useEffect(() => {
    const loadTasks = () => {
      setIsLoading(true)
      try {
        const savedTasks = localStorage.getItem('flowsync-tasks')
        const parsedTasks = savedTasks ? JSON.parse(savedTasks) : []
        setTasks(parsedTasks)
      } catch (error) {
        console.error('Error loading tasks:', error)
        toast.error('Failed to load tasks')
      } finally {
        setIsLoading(false)
      }
    }
    
    loadTasks()
    
    // Setup event listener for tasks changes
    window.addEventListener('storage', (e) => {
      if (e.key === 'flowsync-tasks') {
        loadTasks()
      }
    })
    
    return () => {
      window.removeEventListener('storage', loadTasks)
    }
  }, [])
  
  // Apply filters
  useEffect(() => {
    let filtered = [...tasks]
    
    // Apply status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(task => task.column === statusFilter)
    }
    
    // Apply priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(task => task.priority === priorityFilter)
    }
    
    // Apply date range filter
    filtered = filtered.filter(task => {
      const taskDate = parseISO(task.dueDate)
      return isWithinInterval(taskDate, { start: dateRangeFilter.start, end: dateRangeFilter.end })
    })
    
    setFilteredTasks(filtered)
  }, [tasks, statusFilter, priorityFilter, dateRangeFilter])
  
  // Convert tasks to calendar events
  const events = useMemo(() => {
    return filteredTasks.map(task => ({
      id: task.id,
      title: task.title,
      start: new Date(task.dueDate),
      end: new Date(task.dueDate),
      allDay: true,
      status: task.column,
      priority: task.priority,
      description: task.description,
      assignee: task.assignee
    }))
  }, [filteredTasks])
  
  // Handle event drag and drop
  const onEventDrop = useCallback(({ event, start, end }) => {
    // Update the task due date
    const updatedTasks = tasks.map(task => {
      if (task.id === event.id) {
        return {
          ...task,
          dueDate: start.toISOString()
        }
      }
      return task
    })
    
    // Save to localStorage
    localStorage.setItem('flowsync-tasks', JSON.stringify(updatedTasks))
    setTasks(updatedTasks)
    
    // Show success message
    toast.success(`Task "${event.title}" rescheduled to ${format(start, 'MMM d, yyyy')}`)
  }, [tasks])
  
  // Event styling
  const eventPropGetter = useCallback((event) => {
    return {
      className: priorityColors[event.priority] || '',
    }
  }, [])
  
  // Custom toolbar with filters
  const CustomToolbar = ({ date, onNavigate, onView, label }) => (
    <div className="calendar-header">
      <div className="flex items-center space-x-2">
        <button 
          className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-700"
          onClick={() => onNavigate('TODAY')}
        >
          Today
        </button>
        <button 
          className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-700"
          onClick={() => onNavigate('PREV')}
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <button 
          className="p-1 rounded hover:bg-surface-100 dark:hover:bg-surface-700"
          onClick={() => onNavigate('NEXT')}
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold">{label}</h3>
      </div>
      
      <div className="flex space-x-2">
        <button 
          className={`px-2 py-1 rounded text-sm ${view === 'month' ? 'bg-primary text-white' : 'bg-surface-100 dark:bg-surface-700'}`}
          onClick={() => onView('month')}
        >
          Month
        </button>
        <button 
          className={`px-2 py-1 rounded text-sm ${view === 'week' ? 'bg-primary text-white' : 'bg-surface-100 dark:bg-surface-700'}`}
          onClick={() => onView('week')}
        >
          Week
        </button>
        <button 
          className={`px-2 py-1 rounded text-sm ${view === 'day' ? 'bg-primary text-white' : 'bg-surface-100 dark:bg-surface-700'}`}
          onClick={() => onView('day')}
        >
          Day
        </button>
      </div>
    </div>
  )
  
  return (
    <div className="flex-1 flex flex-col h-full">
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center">
            <RefreshCwIcon className="w-12 h-12 text-primary animate-spin mb-4" />
            <h3 className="text-lg font-medium">Loading calendar...</h3>
          </div>
        </div>
      ) : (
        <div className="calendar-container">
          <div className="calendar-filters">
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <FilterIcon className="w-4 h-4 mr-1 text-surface-500 dark:text-surface-400" />
                <span className="text-sm font-medium">Status:</span>
            </div>
            <select 
              className="form-input text-sm py-1 px-2"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </div>
            
          <div className="flex items-center gap-2 ml-4">
            <div className="flex items-center">
              <FilterIcon className="w-4 h-4 mr-1 text-surface-500 dark:text-surface-400" />
              <span className="text-sm font-medium">Date Range:</span>
            </div>
            <div className="flex items-center">
              <input 
                type="date" 
                className="form-input text-sm py-1 px-2" 
                value={format(dateRangeFilter.start, 'yyyy-MM-dd')}
                onChange={(e) => {
                  const newStart = e.target.value ? new Date(e.target.value) : subDays(new Date(), 30);
                  setDateRangeFilter(prev => ({ ...prev, start: newStart }));
                }}
              />
              <span className="text-sm mx-1">to</span>
              <input 
                type="date" 
                className="form-input text-sm py-1 px-2"
                value={format(dateRangeFilter.end, 'yyyy-MM-dd')}
                onChange={(e) => {
                  const newEnd = e.target.value ? new Date(e.target.value) : addDays(new Date(), 60);
                  setDateRangeFilter(prev => ({ ...prev, end: newEnd }));
                }}
              />
            </div>
            
              <button
                className="text-sm text-primary hover:text-primary-dark ml-2"
                onClick={() => {
                  setDateRangeFilter({
                    start: subDays(new Date(), 30),
                    end: addDays(new Date(), 60)
                  });
                  setStatusFilter('all');
                  setPriorityFilter('all');
                }}
              >
                Reset Filters
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Priority:</span>
              <select 
                className="form-input text-sm py-1 px-2"
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            views={['month', 'week', 'day']}
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            onEventDrop={onEventDrop}
            eventPropGetter={eventPropGetter}
            draggableAccessor={() => true}
            selectable
            popup
            components={{
              toolbar: CustomToolbar
            }}
            onSelectEvent={(event) => {
              toast.info(`Task: ${event.title} - Due: ${format(event.start, 'MMM d, yyyy')}`)
            }}
          />
        </div>
      )}
    </div>
  )
}

export default Calendar