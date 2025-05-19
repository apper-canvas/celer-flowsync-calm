/**
 * Generate task assignment notification
 * @param {Object} task - The task object
 * @param {Object} assignee - The assignee object
 * @returns {Object} - Notification object
 */
export const createTaskAssignedNotification = (task, assignee) => {
  return {
    type: 'task-assigned',
    title: 'Task Assigned',
    message: `Task "${task.title}" has been assigned to you`,
    taskId: task.id,
    data: {
      task: task,
      assignee: assignee
    }
  };
};

/**
 * Generate task update notification
 * @param {Object} task - The updated task
 * @returns {Object} - Notification object
 */
export const createTaskUpdatedNotification = (task) => {
  return {
    type: 'task-updated',
    title: 'Task Updated',
    message: `Task "${task.title}" has been updated`,
    taskId: task.id,
    data: { task }
  };
};