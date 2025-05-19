import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getIcon } from './utils/iconUtils'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import RecentProjects from './pages/RecentProjects'
import { NotificationProvider } from './context/NotificationContext'

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode')
      return savedMode ? JSON.parse(savedMode) : 
        window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    return false
  })

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode))
  }, [isDarkMode])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <NotificationProvider>
      <>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<Home toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />} />
            <Route path="/dashboard" element={<Home toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} activePage="Dashboard" />} />
            <Route path="/recent-projects" element={<Home toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} activePage="Recent Projects" />} />
            <Route path="/calendar" element={<Home toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} activePage="Calendar" />} />
            <Route path="/reports" element={<Home toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} activePage="Reports" />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={isDarkMode ? "dark" : "light"}
        />
      </>
    </NotificationProvider>
  )
}

export default App