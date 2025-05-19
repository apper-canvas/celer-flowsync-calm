import { format, formatDistance } from 'date-fns';

/**
 * Get mock project data
 * @returns {Array} - Array of project objects
 */
export const getProjects = () => {
  return [
    {
      id: 'proj-001',
      name: 'Website Redesign',
      description: 'Complete overhaul of the company website with new brand guidelines',
      status: 'active',
      priority: 'high',
      progress: 65,
      startDate: '2023-07-15',
      dueDate: '2023-09-30',
      lastUpdated: '2023-08-12T14:30:00Z',
      members: [
        { id: 'user-1', name: 'Alex Morgan', avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80' },
        { id: 'user-2', name: 'Taylor Swift', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80' },
        { id: 'user-3', name: 'James Smith', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80' }
      ],
      tasks: {
        total: 24,
        completed: 16
      },
      recentActivity: [
        { type: 'comment', user: 'Taylor Swift', content: 'Homepage design approved by client', timestamp: '2023-08-12T14:30:00Z' },
        { type: 'update', user: 'Alex Morgan', content: 'Updated project timeline', timestamp: '2023-08-10T09:15:00Z' }
      ]
    },
    {
      id: 'proj-002',
      name: 'Mobile App Launch',
      description: 'Develop and launch iOS and Android mobile applications',
      status: 'active',
      priority: 'high',
      progress: 78,
      startDate: '2023-06-01',
      dueDate: '2023-09-15',
      lastUpdated: '2023-08-15T11:20:00Z',
      members: [
        { id: 'user-1', name: 'Alex Morgan', avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80' },
        { id: 'user-4', name: 'Emily Johnson', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80' }
      ],
      tasks: {
        total: 32,
        completed: 25
      },
      recentActivity: [
        { type: 'milestone', user: 'System', content: 'Beta testing phase completed', timestamp: '2023-08-15T11:20:00Z' },
        { type: 'comment', user: 'Emily Johnson', content: 'iOS build ready for App Store review', timestamp: '2023-08-14T16:45:00Z' }
      ]
    },
    {
      id: 'proj-003',
      name: 'Q3 Planning',
      description: 'Strategic planning and goal setting for Q3 2023',
      status: 'completed',
      priority: 'medium',
      progress: 100,
      startDate: '2023-06-15',
      dueDate: '2023-07-30',
      lastUpdated: '2023-07-30T15:10:00Z',
      members: [
        { id: 'user-1', name: 'Alex Morgan', avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80' },
        { id: 'user-5', name: 'Michael Brown', avatar: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80' }
      ],
      tasks: {
        total: 18,
        completed: 18
      },
      recentActivity: [
        { type: 'completion', user: 'Alex Morgan', content: 'Project marked as completed', timestamp: '2023-07-30T15:10:00Z' },
        { type: 'comment', user: 'Michael Brown', content: 'All goals have been defined and documented', timestamp: '2023-07-29T11:30:00Z' }
      ]
    },
    {
      id: 'proj-004',
      name: 'Product Feature Rollout',
      description: 'Implementation of new features for the core product',
      status: 'active',
      priority: 'medium',
      progress: 42,
      startDate: '2023-07-20',
      dueDate: '2023-10-15',
      lastUpdated: '2023-08-16T09:45:00Z',
      members: [
        { id: 'user-3', name: 'James Smith', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80' },
        { id: 'user-4', name: 'Emily Johnson', avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80' },
        { id: 'user-5', name: 'Michael Brown', avatar: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80' }
      ],
      tasks: {
        total: 28,
        completed: 12
      },
      recentActivity: [
        { type: 'update', user: 'Emily Johnson', content: 'Added new task for API documentation', timestamp: '2023-08-16T09:45:00Z' },
        { type: 'milestone', user: 'System', content: 'First feature module completed', timestamp: '2023-08-12T13:20:00Z' }
      ]
    },
    {
      id: 'proj-005',
      name: 'Marketing Campaign',
      description: 'Q4 digital marketing campaign planning and execution',
      status: 'on-hold',
      priority: 'low',
      progress: 15,
      startDate: '2023-08-01',
      dueDate: '2023-11-30',
      lastUpdated: '2023-08-10T16:30:00Z',
      members: [
        { id: 'user-2', name: 'Taylor Swift', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80' }
      ],
      tasks: {
        total: 20,
        completed: 3
      },
      recentActivity: [
        { type: 'status', user: 'Taylor Swift', content: 'Project put on hold pending budget approval', timestamp: '2023-08-10T16:30:00Z' },
        { type: 'comment', user: 'Taylor Swift', content: 'Initial campaign strategies drafted', timestamp: '2023-08-05T14:15:00Z' }
      ]
    }
  ];
};

/**
 * Calculate project progress percentage
 * @param {Object} project - Project object
 * @returns {number} - Progress percentage
 */
export const calculateProjectProgress = (project) => {
  if (project.progress !== undefined) return project.progress;
  return project.tasks.total > 0 ? Math.round((project.tasks.completed / project.tasks.total) * 100) : 0;
};

/**
 * Format date for display
 * @param {string} dateString - ISO date string
 * @returns {string} - Formatted date
 */
export const formatDate = (dateString) => {
  return format(new Date(dateString), 'MMM d, yyyy');
};

/**
 * Get relative time from now
 * @param {string} dateString - ISO date string
 * @returns {string} - Relative time (e.g. "2 days ago")
 */
export const getRelativeTime = (dateString) => {
  return formatDistance(new Date(dateString), new Date(), { addSuffix: true });
};