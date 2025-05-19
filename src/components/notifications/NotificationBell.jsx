import React, { useState, useRef, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useNotifications } from '../../context/NotificationContext';
import { getIcon } from '../../utils/iconUtils';

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const BellIcon = getIcon('bell');
  const CheckIcon = getIcon('check');
  const AlertCircleIcon = getIcon('alert-circle');
  const ClipboardIcon = getIcon('clipboard');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const formatRelativeTime = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return 'some time ago';
    }
  };

  const getNotificationIcon = (type) => {
    if (type === 'task-assigned') return ClipboardIcon;
    if (type === 'task-updated') return AlertCircleIcon;
    return BellIcon;
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    // Additional handling could be added here (like navigation)
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="relative p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <BellIcon className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 rounded-full bg-primary">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-surface-800 rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="p-3 border-b border-surface-200 dark:border-surface-700 flex justify-between items-center">
            <h3 className="font-medium">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                className="text-xs text-primary-dark dark:text-primary-light flex items-center"
                onClick={markAllAsRead}
              >
                <CheckIcon className="w-3 h-3 mr-1" />
                Mark all as read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-surface-500 dark:text-surface-400">
                No notifications yet
              </div>
            ) : (
              notifications.map(notification => (
                <div key={notification.id} onClick={() => handleNotificationClick(notification)} className={`p-3 border-b border-surface-200 dark:border-surface-700 hover:bg-surface-100 dark:hover:bg-surface-700 cursor-pointer ${!notification.read ? 'bg-blue-50 dark:bg-blue-900 dark:bg-opacity-20' : ''}`}>
                  <div className="flex items-start">
                    {React.createElement(getNotificationIcon(notification.type), { className: "w-5 h-5 mr-3 mt-0.5 text-primary-dark dark:text-primary-light" })}
                    <div className="flex-1">
                      <p className="text-sm mb-1 font-medium">{notification.title}</p>
                      <p className="text-xs mb-1">{notification.message}</p>
                      <p className="text-xs text-surface-500 dark:text-surface-400">{formatRelativeTime(notification.timestamp)}</p>
                    </div>
                    {!notification.read && <div className="w-2 h-2 bg-primary rounded-full mt-1"></div>}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;