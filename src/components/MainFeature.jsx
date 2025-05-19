import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { getIcon } from '../utils/iconUtils'

// Task priority options
const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  { value: 'medium', label: 'Medium', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  { value: 'high', label: 'High', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' }
]

// Kanban columns
const COLUMNS = [
  { id: 'todo', title: 'To Do', color: 'border-blue-400' },
  { id: 'in-progress', title: 'In Progress', color: 'border-yellow-400' },
  { id: 'done', title: 'Done', color: 'border-green-400' }
]

// Initial demo tasks
const INITIAL_TASKS = [
  {
    id: '1',
    title: 'Create project wireframes',
    description: 'Design the initial wireframes for the new product landing page',
    column: 'todo',
    assignee: {
      name: 'Alex Morgan',
      avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80',
    },
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString()
  },
  {
    id: '2',
    title: 'Finalize API documentation',
    description: 'Complete the REST API documentation for the developer portal',
    column: 'in-progress',
    assignee: {
      name: 'Morgan Chen',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80',
    },
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000 * 1).toISOString()
  },
  {
    id: '3',
    title: 'Bug fixes for v1.2',
    description: 'Address the critical bugs reported in the latest release',
    column: 'done',
    assignee: {
      name: 'Jamie Wilson',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80',
    },
    priority: 'high',
    dueDate: new Date(Date.now() - 86400000 * 1).toISOString()
  }
]

const MainFeature = () => {
  // Icons
  const PlusIcon = getIcon('plus')
  const XIcon = getIcon('x')
  const CheckCircleIcon = getIcon('check-circle')
  const ClockIcon = getIcon('clock')
  const AlertCircleIcon = getIcon('alert-circle')
  
  // State
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('flowsync-tasks')
    return savedTasks ? JSON.parse(savedTasks) : INITIAL_TASKS
  })
  const [isAddingTask, setIsAddingTask] = useState(false)
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    column: 'todo',
    assignee: {
      name: 'Alex Morgan',
      avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80',
    },
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString() // 7 days from now
  })
  const [draggedTask, setDraggedTask] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  
  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem('flowsync-tasks', JSON.stringify(tasks))
  }, [tasks])
  
  // Handle new task form submission
  const handleAddTask = (e) => {
    e.preventDefault()
    
    if (!newTask.title.trim()) {
      toast.error("Task title cannot be empty")
      return
    }
    
    const task = {
      ...newTask,
      id: Date.now().toString()
    }
    
    setTasks([...tasks, task])
    setNewTask({
      title: '',
      description: '',
      column: 'todo',
      assignee: {
        name: 'Alex Morgan',
        avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80',
      },
      priority: 'medium',
      dueDate: new Date(Date.now() + 86400000 * 7).toISOString()
    })
    setIsAddingTask(false)
    toast.success("Task created successfully")
  }
  
  // Handle task dragging start
  const handleDragStart = (task) => {
    setDraggedTask(task)
  }
  
  // Allow dropping
  const handleDragOver = (e) => {
    e.preventDefault()
  }
  
  // Handle task dropping into a column
  const handleDrop = (columnId) => {
    if (draggedTask && draggedTask.column !== columnId) {
      const updatedTasks = tasks.map(task => 
        task.id === draggedTask.id ? { ...task, column: columnId } : task
      )
      setTasks(updatedTasks)
      toast.info(`Task moved to ${COLUMNS.find(col => col.id === columnId).title}`)
    }
    setDraggedTask(null)
  }

  // Format date to readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    })
  }
  
  // Check if date is past due
  const isPastDue = (dateString) => {
    const dueDate = new Date(dateString)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return dueDate < today
  }
  
  // Delete a task
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId))
    setSelectedTask(null)
    toast.success("Task deleted successfully")
  }
  
  return (
    <div className="flex-1 flex flex-col">
      {/* Header with add button */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-surface-500 dark:text-surface-400">
            {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </span>
          <div className="hidden md:flex space-x-1">
            {COLUMNS.map(column => {
              const count = tasks.filter(task => task.column === column.id).length
              if (count === 0) return null
              return (
                <span 
                  key={column.id}
                  className={`text-xs px-2 py-1 rounded-full ${
                    column.id === 'todo' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    column.id === 'in-progress' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                  }`}
                >
                  {column.title}: {count}
                </span>
              )
            })}
          </div>
        </div>
        
        <button
          onClick={() => setIsAddingTask(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>
      
      {/* Kanban board */}
      <div className="flex-1 flex flex-col md:flex-row gap-4 md:gap-6 overflow-x-auto pb-6">
        {COLUMNS.map(column => (
          <div 
            key={column.id}
            className="flex-1 min-w-[280px] flex flex-col"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(column.id)}
          >
            <div className={`px-3 py-2 font-medium border-t-2 ${column.color} bg-white dark:bg-surface-800 rounded-t-lg`}>
              {column.title} ({tasks.filter(task => task.column === column.id).length})
            </div>
            
            <div className="flex-1 bg-surface-100 dark:bg-surface-800 rounded-b-lg p-2 overflow-y-auto max-h-[calc(100vh-240px)]">
              {tasks.filter(task => task.column === column.id).map(task => (
                <motion.div
                  key={task.id}
                  layoutId={task.id}
                  className="bg-white dark:bg-surface-700 p-3 rounded-lg shadow-sm mb-2 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
                  draggable
                  onDragStart={() => handleDragStart(task)}
                  onClick={() => setSelectedTask(task)}
                  whileHover={{ y: -2 }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-medium line-clamp-2">{task.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      PRIORITY_OPTIONS.find(p => p.value === task.priority).color
                    }`}>
                      {task.priority}
                    </span>
                  </div>
                  
                  <p className="text-xs text-surface-500 dark:text-surface-400 mb-2 line-clamp-2">
                    {task.description || "No description"}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <img 
                        src={task.assignee.avatar} 
                        alt={task.assignee.name}
                        className="w-5 h-5 rounded-full mr-1"
                      />
                      <span className="text-xs truncate max-w-[100px]">
                        {task.assignee.name}
                      </span>
                    </div>
                    
                    <div className={`flex items-center text-xs ${
                      isPastDue(task.dueDate) ? 'text-red-600 dark:text-red-400' : 'text-surface-500 dark:text-surface-400'
                    }`}>
                      {isPastDue(task.dueDate) ? (
                        <AlertCircleIcon className="w-3 h-3 mr-1" />
                      ) : (
                        <ClockIcon className="w-3 h-3 mr-1" />
                      )}
                      <span>{formatDate(task.dueDate)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Add task modal */}
      <AnimatePresence>
        {isAddingTask && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsAddingTask(false)}
          >
            <motion.div
              className="bg-white dark:bg-surface-800 rounded-xl p-6 w-full max-w-md"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">New Task</h2>
                <button 
                  onClick={() => setIsAddingTask(false)}
                  className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              
              <form onSubmit={handleAddTask}>
                <div className="mb-4">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input
                    id="title"
                    type="text"
                    className="form-input"
                    value={newTask.title}
                    onChange={e => setNewTask({...newTask, title: e.target.value})}
                    placeholder="Enter task title"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="description" className="form-label">Description</label>
                  <textarea
                    id="description"
                    className="form-input h-24 resize-none"
                    value={newTask.description}
                    onChange={e => setNewTask({...newTask, description: e.target.value})}
                    placeholder="Enter task description"
                  ></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="column" className="form-label">Status</label>
                    <select
                      id="column"
                      className="form-input"
                      value={newTask.column}
                      onChange={e => setNewTask({...newTask, column: e.target.value})}
                    >
                      {COLUMNS.map(column => (
                        <option key={column.id} value={column.id}>{column.title}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="priority" className="form-label">Priority</label>
                    <select
                      id="priority"
                      className="form-input"
                      value={newTask.priority}
                      onChange={e => setNewTask({...newTask, priority: e.target.value})}
                    >
                      {PRIORITY_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="dueDate" className="form-label">Due Date</label>
                  <input
                    id="dueDate"
                    type="date"
                    className="form-input"
                    value={newTask.dueDate.substring(0, 10)}
                    onChange={e => setNewTask({
                      ...newTask, 
                      dueDate: new Date(e.target.value).toISOString()
                    })}
                    min={new Date().toISOString().substring(0, 10)}
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => setIsAddingTask(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                  >
                    Add Task
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Task details modal */}
      <AnimatePresence>
        {selectedTask && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTask(null)}
          >
            <motion.div
              className="bg-white dark:bg-surface-800 rounded-xl p-6 w-full max-w-md"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold mb-1">{selectedTask.title}</h2>
                  <div className="flex items-center">
                    <span className={`text-xs px-2 py-0.5 rounded-full mr-2 ${
                      PRIORITY_OPTIONS.find(p => p.value === selectedTask.priority).color
                    }`}>
                      {selectedTask.priority}
                    </span>
                    <span className="text-xs text-surface-500 dark:text-surface-400">
                      {COLUMNS.find(col => col.id === selectedTask.column).title}
                    </span>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedTask(null)}
                  className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
                >
                  <XIcon className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mb-4 bg-surface-50 dark:bg-surface-700 p-3 rounded-lg">
                <p className="text-surface-600 dark:text-surface-300 whitespace-pre-line">
                  {selectedTask.description || "No description provided."}
                </p>
              </div>
              
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center">
                  <img 
                    src={selectedTask.assignee.avatar} 
                    alt={selectedTask.assignee.name}
                    className="w-6 h-6 rounded-full mr-2"
                  />
                  <div>
                    <p className="text-sm font-medium">{selectedTask.assignee.name}</p>
                    <p className="text-xs text-surface-500 dark:text-surface-400">Assignee</p>
                  </div>
                </div>
                
                <div className={`flex flex-col items-end ${
                  isPastDue(selectedTask.dueDate) ? 'text-red-600 dark:text-red-400' : 'text-surface-500 dark:text-surface-400'
                }`}>
                  <div className="flex items-center">
                    {isPastDue(selectedTask.dueDate) ? (
                      <AlertCircleIcon className="w-4 h-4 mr-1" />
                    ) : (
                      <ClockIcon className="w-4 h-4 mr-1" />
                    )}
                    <span className="text-sm">
                      {new Date(selectedTask.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs">
                    {isPastDue(selectedTask.dueDate) ? 'Past due' : 'Due date'}
                  </p>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  onClick={() => deleteTask(selectedTask.id)}
                  className="btn btn-outline text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900 dark:hover:bg-opacity-30"
                >
                  Delete Task
                </button>
                
                {selectedTask.column !== 'done' ? (
                  <button
                    onClick={() => {
                      const updatedTasks = tasks.map(task => 
                        task.id === selectedTask.id ? { ...task, column: 'done' } : task
                      )
                      setTasks(updatedTasks)
                      setSelectedTask(null)
                      toast.success("Task marked as complete")
                    }}
                    className="btn btn-primary flex items-center space-x-2"
                  >
                    <CheckCircleIcon className="w-4 h-4" />
                    <span>Mark Complete</span>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      const updatedTasks = tasks.map(task => 
                        task.id === selectedTask.id ? { ...task, column: 'in-progress' } : task
                      )
                      setTasks(updatedTasks)
                      setSelectedTask(null)
                      toast.info("Task moved to In Progress")
                    }}
                    className="btn btn-secondary flex items-center space-x-2"
                  >
                    Reopen Task
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MainFeature