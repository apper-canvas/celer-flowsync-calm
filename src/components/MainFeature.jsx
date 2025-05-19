import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { formatDistanceToNow } from 'date-fns'
import { getIcon } from '../utils/iconUtils' 
import { fileTypeFromBuffer } from 'file-type-browser'

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
      id: '1',
      name: 'Alex Morgan',
      avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80',
    },
    comments: [{
      id: 'c1',
      name: 'Alex Morgan',
      avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80',
      text: 'Initial wireframes look good. Let\'s discuss the layout in our next meeting.',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      replies: []
    }],
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    attachments: []
  },
  {
    id: '2',
    title: 'Finalize API documentation',
    description: 'Complete the REST API documentation for the developer portal',
    column: 'in-progress',
    assignee: {
      id: '2',
      name: 'Morgan Chen',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80',
    },
    comments: [],
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000 * 1).toISOString(),
    attachments: []
  },
  {
    id: '3',
    title: 'Bug fixes for v1.2',
    description: 'Address the critical bugs reported in the latest release',
    column: 'done',
    assignee: {
      id: '3',
      name: 'Jamie Wilson',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80',
    },
    comments: [],
    priority: 'low',
    dueDate: new Date(Date.now() - 86400000 * 1).toISOString(),
    attachments: []
  }
]

const MainFeature = () => {
  // Icons
  const PlusIcon = getIcon('plus')
  const SendIcon = getIcon('send')
  const ReplyIcon = getIcon('reply')
  const MessageCircleIcon = getIcon('message-circle')
  const CornerDownRightIcon = getIcon('corner-down-right')
  const XIcon = getIcon('x')
  const CheckCircleIcon = getIcon('check-circle')
  const ClockIcon = getIcon('clock')
  const AlertCircleIcon = getIcon('alert-circle')
  const PaperclipIcon = getIcon('paperclip')
  const FileIcon = getIcon('file')
  const FileTextIcon = getIcon('file-text')
  const ImageIcon = getIcon('image')
  const FileArchiveIcon = getIcon('file-archive')
  const TrashIcon = getIcon('trash')
  const UploadIcon = getIcon('upload')
  
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
      id: '1',
      name: 'Alex Morgan',
      avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80',
    },
    priority: 'medium',
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString() // 7 days from now
  })
  const [draggedTask, setDraggedTask] = useState(null)
  const [selectedTask, setSelectedTask] = useState(null)
  const [newComment, setNewComment] = useState('')
  const [replyTo, setReplyTo] = useState(null)
  const [replyText, setReplyText] = useState('')
  const [isDraggingFile, setIsDraggingFile] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  
  // Refs
  const commentInputRef = useRef(null)
  const fileInputRef = useRef(null)
  const dragCounter = useRef(0)
  const dropZoneRef = useRef(null)
  
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
      id: Date.now().toString(),
      comments: [],
      attachments: []
    }
    
    setTasks([...tasks, task])
    setNewTask({
      title: '',
      comments: [],
      description: '',
      column: 'todo',
      attachments: [],
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
  
  // Add a comment to a task
  const addComment = (e) => {
    e.preventDefault()
    
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty")
      return
    }
    
    const comment = {
      id: `c-${Date.now()}`,
      text: newComment,
      name: 'You', // In a real app, this would be the current user
      avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80',
      timestamp: new Date().toISOString(),
      replies: []
    }
    
    const updatedTasks = tasks.map(task => 
      task.id === selectedTask.id 
        ? { ...task, comments: [...(task.comments || []), comment] } 
        : task
    )
    
    setTasks(updatedTasks)
    setSelectedTask({...selectedTask, comments: [...(selectedTask.comments || []), comment]})
    setNewComment('')
    toast.success("Comment added successfully")
  }
  
  // Add a reply to a comment
  const addReply = (commentId) => {
    if (!replyText.trim()) {
      toast.error("Reply cannot be empty")
      return
    }
    
    const addReplyToComment = (comments) => {
      return comments.map(comment => {
        if (comment.id === commentId) {
          const reply = {
            id: `r-${Date.now()}`,
            text: replyText,
            name: 'You', // In a real app, this would be the current user
            avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80',
            timestamp: new Date().toISOString(),
            replies: []
          }
          return { 
            ...comment, 
            replies: [...(comment.replies || []), reply] 
          }
        } else if (comment.replies && comment.replies.length > 0) {
          return { 
            ...comment, 
            replies: addReplyToComment(comment.replies) 
          }
        }
        return comment
      })
    }
    
    const updatedTasks = tasks.map(task => {
      if (task.id === selectedTask.id) {
        const updatedComments = addReplyToComment(task.comments || [])
        return { ...task, comments: updatedComments }
      }
      return task
    })
    
    setTasks(updatedTasks)
    
    // Update selected task to reflect changes
    const updatedSelectedTask = updatedTasks.find(task => task.id === selectedTask.id)
    setSelectedTask(updatedSelectedTask)
    
    setReplyTo(null)
    setReplyText('')
    toast.success("Reply added successfully")
  }

  // Convert bytes to readable format
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Get icon based on file type
  const getFileIcon = (type) => {
    if (type.startsWith('image/')) {
      return ImageIcon;
    } else if (type.startsWith('text/') || type.includes('document') || type.includes('pdf')) {
      return FileTextIcon;
    } else if (type.includes('zip') || type.includes('compressed')) {
      return FileArchiveIcon;
    } else {
      return FileIcon;
    }
  }

  // Handle file drag events
  const handleDragIn = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDraggingFile(true);
    }
  }

  const handleDragOut = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDraggingFile(false);
    }
  }

  const handleFileDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  }

  const handleFileDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(false);
    dragCounter.current = 0;
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }

  // Handle file upload
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  }

  // Process files (validation and upload)
  const handleFiles = async (files) => {
    const allowedTypes = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'application/msword', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel', 
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/zip', 'application/x-zip-compressed',
      'text/plain'
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    // Convert FileList to Array
    const fileArray = Array.from(files);
    
    // Validate files
    for (const file of fileArray) {
      if (file.size > maxSize) {
        toast.error(`File ${file.name} is too large. Maximum size is 5MB.`);
        return;
      }
      
      // Validate file type using file-type-browser
      const arrayBuffer = await file.arrayBuffer();
      const buffer = new Uint8Array(arrayBuffer);
      const fileType = await fileTypeFromBuffer(buffer);
      
      const mimeType = fileType ? fileType.mime : file.type;
      
      if (!allowedTypes.includes(mimeType)) {
        toast.error(`File type ${mimeType} is not supported.`);
        return;
      }
    }
    
    setUploading(true);
    
    // Simulate upload progress
    let progress = 0;
    const progressInterval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(progressInterval);
        setUploading(false);
        setUploadProgress(0);
        
        // Add attachments to task
        const newAttachments = fileArray.map(file => ({
          id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          size: file.size,
          type: file.type,
          data: URL.createObjectURL(file) // Create a blob URL for preview
        }));
        
        const updatedTasks = tasks.map(task => 
          task.id === selectedTask.id 
            ? { ...task, attachments: [...(task.attachments || []), ...newAttachments] } 
            : task
        );
        
        setTasks(updatedTasks);
        const updatedTask = updatedTasks.find(task => task.id === selectedTask.id);
        setSelectedTask(updatedTask);
        toast.success(`${fileArray.length} file(s) uploaded successfully`);
      }
    }, 200);
  }

  // Delete attachment
  const deleteAttachment = (attachmentId) => {
    const updatedTasks = tasks.map(task => 
      task.id === selectedTask.id 
        ? { 
            ...task, 
            attachments: task.attachments.filter(att => att.id !== attachmentId) 
          } 
        : task
    );
    
    setTasks(updatedTasks);
    const updatedTask = updatedTasks.find(task => task.id === selectedTask.id);
    setSelectedTask(updatedTask);
    toast.success("Attachment deleted successfully");
  }
  
  // Format relative time (e.g., "2 minutes ago")
  const formatRelativeTime = (dateString) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true })
  }
  
  // Render a comment and its replies
  const renderComment = (comment, level = 0) => {
    return (
      <div key={comment.id} className={`comment ${level > 0 ? 'comment-reply' : ''}`}>
        <div className="comment-header">
          <div className="comment-user">
            <img 
              src={comment.avatar} 
              alt={comment.name} 
              className="w-6 h-6 rounded-full mr-2"
            />
            <span className="font-medium">{comment.name}</span>
          </div>
          <span className="text-xs text-surface-500 dark:text-surface-400">
            {formatRelativeTime(comment.timestamp)}
          </span>
        </div>
        
        <div className="comment-body">
          <p>{comment.text}</p>
        </div>
        
        <div className="comment-actions">
          <button 
            className="text-xs text-primary-dark dark:text-primary-light flex items-center"
            onClick={() => {
              setReplyTo(comment.id)
              setReplyText('')
              setTimeout(() => {
                commentInputRef.current?.focus()
              }, 100)
            }}
          >
            <ReplyIcon className="w-3 h-3 mr-1" />
            Reply
          </button>
        </div>
        
        {replyTo === comment.id && (
          <div className="reply-form">
            <div className="flex items-center space-x-2 mb-1">
              <CornerDownRightIcon className="w-3 h-3 text-surface-400" />
              <span className="text-xs text-surface-500 dark:text-surface-400">
                Replying to {comment.name}
              </span>
            </div>
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Write a reply..."
                className="form-input text-sm py-1 flex-1"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                ref={commentInputRef}
              />
              <div className="flex space-x-2 ml-2">
                <button
                  className="btn btn-sm btn-outline text-xs py-1"
                  onClick={() => setReplyTo(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-sm btn-primary text-xs py-1 flex items-center"
                  onClick={() => addReply(comment.id)}
                >
                  <SendIcon className="w-3 h-3 mr-1" />
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
        
        {comment.replies && comment.replies.length > 0 && (
          <div className="replies">
            {comment.replies.map(reply => renderComment(reply, level + 1))}
          </div>
        )}
      </div>
    )
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
                <p className="text-surface-700 dark:text-surface-300 whitespace-pre-line">
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
              {/* Comments section */}
              <div className="mt-6 border-t border-surface-200 dark:border-surface-700 pt-4">
                <div className="flex items-center mb-4">
                  <MessageCircleIcon className="w-5 h-5 mr-2 text-surface-500 dark:text-surface-400" />
                  <h3 className="text-lg font-medium">
                    Comments 
                    {selectedTask.comments && selectedTask.comments.length > 0 && 
                      <span className="text-surface-500 dark:text-surface-400 text-sm font-normal ml-2">
                        ({selectedTask.comments.length})
                      </span>
                    }
                  </h3>
                </div>
                
                {/* Comment form */}
                <form onSubmit={addComment} className="mb-4">
                  <div className="flex">
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      className="form-input flex-1"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="btn btn-primary ml-2"
                      disabled={!newComment.trim()}
                    >
                      <SendIcon className="w-4 h-4" />
                    </button>
                  </div>
                </form>
                
                {/* Comments list */}
                <div className="space-y-4 max-h-60 overflow-y-auto comments-container">
                  {!selectedTask.comments || selectedTask.comments.length === 0 ? (
                    <p className="text-surface-500 dark:text-surface-400 text-sm text-center py-4">No comments yet. Be the first to comment!</p>
                  ) : (
                    selectedTask.comments.map(comment => renderComment(comment))
                  )}
                </div>
              </div>
              
              {/* Attachments section */}
              <div className="attachments-container">
                <div className="flex items-center mb-4">
                  <PaperclipIcon className="w-5 h-5 mr-2 text-surface-500 dark:text-surface-400" />
                  <h3 className="text-lg font-medium">
                    Attachments
                    {selectedTask.attachments && selectedTask.attachments.length > 0 && 
                      <span className="text-surface-500 dark:text-surface-400 text-sm font-normal ml-2">
                        ({selectedTask.attachments.length})
                      </span>
                    }
                  </h3>
                </div>
                
                {/* Attachment list */}
                {selectedTask.attachments && selectedTask.attachments.length > 0 && (
                  <div className="mb-4">
                    {selectedTask.attachments.map((attachment) => (
                      <div key={attachment.id} className="attachment-card">
                        <div className="attachment-preview">
                          {attachment.type.startsWith('image/') ? (
                            <img src={attachment.data} alt={attachment.name} />
                          ) : (
                            <div className="attachment-icon">
                              {React.createElement(getFileIcon(attachment.type), { className: "w-4 h-4" })}
                            </div>
                          )}
                        </div>
                        <div className="attachment-info">
                          <div className="attachment-name">{attachment.name}</div>
                          <div className="attachment-size">{formatFileSize(attachment.size)}</div>
                        </div>
                        <button 
                          className="attachment-action p-1 rounded-full bg-surface-200 dark:bg-surface-600 hover:bg-surface-300 dark:hover:bg-surface-500"
                          onClick={() => deleteAttachment(attachment.id)}
                        >
                          <TrashIcon className="w-3 h-3 text-surface-600 dark:text-surface-300" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Upload area */}
                <div 
                  ref={dropZoneRef}
                  className={`attachment-dropzone ${isDraggingFile ? 'attachment-dropzone-active' : ''}`}
                  onDragEnter={handleDragIn}
                  onDragLeave={handleDragOut}
                  onDragOver={handleFileDragOver}
                  onDrop={handleFileDrop}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    multiple 
                  />
                  {uploading ? (
                    <div>
                      <p className="text-sm mb-2">Uploading files... {uploadProgress}%</p>
                      <div className="upload-progress" style={{ width: `${uploadProgress}%` }}></div>
                    </div>
                  ) : (
                    <div>
                      <UploadIcon className="w-12 h-12 mx-auto mb-2 text-surface-400 dark:text-surface-500" />
                      <p className="text-surface-600 dark:text-surface-300 text-sm">
                        {isDraggingFile ? 'Drop files here' : 'Drag and drop files here or click to upload'}
                      </p>
                      <button 
                        className="btn btn-outline mt-3 text-sm py-1 px-3"
                        onClick={() => fileInputRef.current.click()}
                      >
                        Browse Files
                      </button>
                      <p className="text-xs text-surface-500 dark:text-surface-400 mt-2">
                        Supported files: Images, PDFs, Documents, Archives (Max: 5MB)
                      </p>
                    </div>
                  )}
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