import { motion } from 'framer-motion';
import { getIcon } from '../../utils/iconUtils';
import { calculateProjectProgress, formatDate, getRelativeTime } from '../../utils/projectUtils';

const ProjectCard = ({ project, onView }) => {
  const ClockIcon = getIcon('clock');
  const CalendarIcon = getIcon('calendar');
  const CheckCircleIcon = getIcon('check-circle');
  const PauseCircleIcon = getIcon('pause-circle');
  const ActivityIcon = getIcon('activity');
  const ArrowRightIcon = getIcon('arrow-right');
  
  const statusIcons = {
    'active': <ActivityIcon className="w-4 h-4 text-green-500" />,
    'on-hold': <PauseCircleIcon className="w-4 h-4 text-amber-500" />,
    'completed': <CheckCircleIcon className="w-4 h-4 text-blue-500" />
  };
  
  const statusColors = {
    'active': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    'on-hold': 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    'completed': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
  };
  
  const priorityColors = {
    'low': 'bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-200',
    'medium': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    'high': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };
  
  const progress = calculateProjectProgress(project);
  
  // Get activity type icon
  const getActivityIcon = (type) => {
    switch (type) {
      case 'comment':
        return getIcon('message-circle')();
      case 'update':
        return getIcon('refresh-cw')();
      case 'milestone':
        return getIcon('flag')();
      case 'completion':
        return getIcon('check-circle')();
      case 'status':
        return getIcon('alert-circle')();
      default:
        return getIcon('circle')();
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-surface-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-surface-200 dark:border-surface-700 overflow-hidden"
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium text-lg text-surface-900 dark:text-white">{project.name}</h3>
          <div className={`text-xs px-2 py-1 rounded-full flex items-center ${statusColors[project.status]}`}>
            {statusIcons[project.status]}
            <span className="ml-1 capitalize">{project.status.replace('-', ' ')}</span>
          </div>
        </div>
        
        <p className="text-surface-600 dark:text-surface-400 text-sm mb-4 line-clamp-2">{project.description}</p>
        
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-surface-500 dark:text-surface-400">Progress</span>
            <span className="text-xs font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-surface-100 dark:bg-surface-700 rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between text-xs text-surface-500 dark:text-surface-400 mb-4">
          <div className="flex items-center">
            <CalendarIcon className="w-3 h-3 mr-1" />
            <span>Due: {formatDate(project.dueDate)}</span>
          </div>
          <div className={`px-2 py-1 rounded-full ${priorityColors[project.priority]}`}>
            {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)} Priority
          </div>
        </div>
        
        <div className="border-t border-surface-100 dark:border-surface-700 pt-4 mt-4">
          <div className="flex justify-between items-center mb-3">
            <div className="flex -space-x-2">
              {project.members.slice(0, 3).map((member, index) => (
                <img 
                  key={member.id}
                  src={member.avatar} 
                  alt={member.name}
                  title={member.name}
                  className="w-6 h-6 rounded-full border-2 border-white dark:border-surface-800"
                />
              ))}
              {project.members.length > 3 && (
                <div className="w-6 h-6 rounded-full bg-surface-200 dark:bg-surface-600 flex items-center justify-center text-xs font-medium border-2 border-white dark:border-surface-800">
                  +{project.members.length - 3}
                </div>
              )}
            </div>
            <div className="text-xs">
              <span className="text-surface-500 dark:text-surface-400">{project.tasks.completed}/{project.tasks.total} tasks</span>
            </div>
          </div>
          
          {project.recentActivity && project.recentActivity.length > 0 && (
            <div className="text-xs text-surface-600 dark:text-surface-400 flex items-start space-x-1">
              <div className="mt-0.5">
                {getActivityIcon(project.recentActivity[0].type)}
              </div>
              <div>
                <span className="font-medium">{project.recentActivity[0].user}</span>
                <span> {project.recentActivity[0].content}</span>
                <div className="text-surface-500 dark:text-surface-500 mt-0.5">
                  <ClockIcon className="inline-block w-3 h-3 mr-1" />
                  {getRelativeTime(project.recentActivity[0].timestamp)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <button
        onClick={() => onView()}
        className="w-full py-3 text-sm font-medium text-center border-t border-surface-200 dark:border-surface-700 text-primary hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors flex items-center justify-center"
      >
        View Details <ArrowRightIcon className="ml-1 w-4 h-4" />
      </button>
    </motion.div>
  );
};

export default ProjectCard;