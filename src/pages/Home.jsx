import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { getIcon } from '../utils/iconUtils'
import NotificationBell from '../components/notifications/NotificationBell'
import MainFeature from '../components/MainFeature'
import Dashboard from './Dashboard'
import Calendar from './Calendar'
import RecentProjects from './RecentProjects'
import Reports from './Reports'

const Home = ({ toggleDarkMode, isDarkMode, activePage = "My Tasks" }) => {
  const MoonIcon = getIcon('moon')
  const SunIcon = getIcon('sun')
  const LogOutIcon = getIcon('log-out')
  const UsersIcon = getIcon('users')
  
  const navigate = useNavigate()
  const location = useLocation()
  
  // Navigation items
  const navigationItems = [
    "Dashboard",
    "My Tasks",
    "Recent Projects",
    "Calendar",
    "Reports"
  ]
  const [activeMenuItem, setActiveMenuItem] = useState(activePage)
  
  // Mock user data
  const [currentUser] = useState({
    name: 'Alex Morgan',
    avatar: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=120&q=80',
    role: 'Product Manager'
  })

  // Mock workspace data
  const [workspace] = useState({
    name: 'Product Development',
    members: 8
  })

  // Handle navigation
  const handleNavigation = (page) => {
    if (page === 'Dashboard') {
      navigate('/dashboard')
    } else if (page === 'Recent Projects') {
      navigate('/recent-projects')
    } else if (page === 'Calendar') {
      navigate('/calendar')
    } else if (page === 'Reports') {
      navigate('/reports')
    } else {
      navigate('/')
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-surface-800 shadow-sm py-3">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <motion.div 
              initial={{ rotate: -10 }}
              animate={{ rotate: 0 }}
              className="text-primary-dark dark:text-primary-light"
            >
              {/* Logo icon */}
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M16 2V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 9H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path fillRule="evenodd" clipRule="evenodd" d="M19 4H5C3.895 4 3 4.895 3 6V19C3 20.105 3.895 21 5 21H19C20.105 21 21 20.105 21 19V6C21 4.895 20.105 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 13H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 17H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
            <h1 className="text-lg md:text-xl font-bold text-surface-900 dark:text-white">
              Flow<span className="text-primary">Sync</span>
            </h1>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
              aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {isDarkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>
            
            <div className="relative group">
              <button className="flex items-center space-x-2">
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full object-cover border-2 border-white dark:border-surface-700 shadow-sm"
                />
                <span className="hidden md:inline text-surface-800 dark:text-surface-200 font-medium">
                  {currentUser.name}
                </span>
              </button>
              
              <div className="absolute right-0 mt-2 w-48 p-2 bg-white dark:bg-surface-800 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-10">
                <div className="px-4 py-2 border-b border-surface-200 dark:border-surface-700">
                  <p className="text-sm font-medium">{currentUser.name}</p>
                  <p className="text-xs text-surface-500">{currentUser.role}</p>
                </div>
                <button className="w-full mt-1 px-4 py-2 text-left text-sm rounded-md hover:bg-surface-100 dark:hover:bg-surface-700 flex items-center space-x-2 text-surface-700 dark:text-surface-300">
                  <LogOutIcon className="w-4 h-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white dark:bg-surface-800 md:border-r dark:border-surface-700 p-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                Workspace
              </h2>
              <p className="font-medium">{workspace.name}</p>
            </div>
            <div className="flex items-center">
              <UsersIcon className="w-4 h-4 text-primary-dark dark:text-primary-light mr-1" />
              <span className="text-xs text-surface-500 dark:text-surface-400">{workspace.members}</span>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">
              Navigation
            </h2>
            <div className="space-y-2">
              {navigationItems.map((item) => (
                <div key={item} className="mb-2 flex items-center">
                  <div className="flex items-center w-full">
                    <div className="flex-1">
                      <button
                        onClick={() => {
                          if (item === "Home") navigate("/");
                          else
                            navigate(
                              `/${item.toLowerCase().replace(/\s+/g, "-")}`
                            );
                          setActiveMenuItem(item);
                        }}
                        className={`flex items-center w-full py-2 px-4 rounded-md text-left ${
                          item === activePage
                            ? "bg-indigo-100 text-indigo-600 dark:bg-slate-700 dark:text-white"
                            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-800"
                        }`}
                      >
                        {getIcon(item.toLowerCase().replace(/\s+/g, "-"), "mr-3")}
                        {item}
                      </button>
                    </div>
                    
                    {/* Place NotificationBell outside of button for Recent Projects item */}
                    {item === "Recent Projects" && (
                      <div className="ml-2">
                        <NotificationBell />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="divider my-4 border-t border-surface-200 dark:border-surface-700"></div>
          <h2 className="text-sm font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-3">
            Recent Projects
          </h2>
          <div className="space-y-2">
            {['Website Redesign', 'Mobile App Launch', 'Q3 Planning'].map((project, index) => (
              <button
                key={project}
                onClick={() => {
                  handleNavigation('Recent Projects');
                  toast.info(`Navigating to ${project} project details`);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 truncate"
              >
                {project}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Feature (Kanban Board) */}
        <main className="flex-1 p-4 md:p-6 overflow-hidden flex flex-col">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-1">{activePage}</h1>
            <p className="text-surface-500 dark:text-surface-400">
              {activePage === 'Dashboard' 
                ? 'Overview of project progress and team performance' 
                : activePage === 'Reports'
                  ? 'Detailed analytics and performance reports'
                  : 'Manage and organize your tasks effectively'}
            </p>
          </div>
          
          {activePage === 'Dashboard' ? (
            <Dashboard />
          ) : activePage === 'Calendar' ? (
            <Calendar />
          ) : activePage === 'Reports' ? (
            <Reports />
          ) : activePage === 'Recent Projects' ? (
            <RecentProjects />
          ) : (
            <MainFeature />
          )}
        </main>
      </div>
    </div>
  )
}

export default Home