import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { getIcon } from '../utils/iconUtils';
import { getProjects, calculateProjectProgress } from '../utils/projectUtils';
import ProjectCard from '../components/projects/ProjectCard';

const RecentProjects = () => {
  const SearchIcon = getIcon('search');
  const SlidersIcon = getIcon('sliders');
  const PlusIcon = getIcon('plus');
  const LoaderIcon = getIcon('loader');

  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  useEffect(() => {
    // Simulate fetching projects data
    const fetchProjects = async () => {
      try {
        setIsLoading(true);
        // In a real application, this would be an API call
        const data = getProjects();
        setProjects(data);
        setFilteredProjects(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast.error('Failed to load projects. Please try again.');
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    // Apply filters and search
    let result = [...projects];
    
    // Apply search
    if (searchTerm.trim() !== '') {
      result = result.filter(project => 
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Apply status filter
    if (filterStatus !== 'all') {
      result = result.filter(project => project.status === filterStatus);
    }
    
    // Apply sorting
    if (sortBy === 'recent') {
      result.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    } else if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'progress') {
      result.sort((a, b) => calculateProjectProgress(b) - calculateProjectProgress(a));
    }
    
    setFilteredProjects(result);
  }, [projects, searchTerm, filterStatus, sortBy]);

  const handleCreateProject = () => {
    toast.info('Create project functionality will be implemented in a future update.');
  };

  const handleViewProject = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    if (project) {
      toast.success(`Viewing project: ${project.name}`);
      // Navigation would happen here in a real application
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoaderIcon className="w-8 h-8 text-primary animate-spin" />
        <span className="ml-2 text-surface-600 dark:text-surface-400">Loading projects...</span>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 dark:bg-surface-800 focus:ring-2 focus:ring-primary focus:border-primary"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex space-x-3">
          <div className="relative group">
            <button className="px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 flex items-center space-x-2 hover:bg-surface-50 dark:hover:bg-surface-700">
              <SlidersIcon className="w-4 h-4" />
              <span>Filter</span>
            </button>
            
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-800 rounded-lg shadow-lg z-10 p-2 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all">
              <div className="p-2 border-b border-surface-200 dark:border-surface-700 text-xs font-medium text-surface-500 uppercase">Status</div>
              {['all', 'active', 'completed', 'on-hold'].map(status => (
                <button 
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`w-full text-left px-3 py-2 text-sm rounded ${filterStatus === status ? 'bg-primary-light bg-opacity-15 text-primary' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                >
                  {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                </button>
              ))}
              
              <div className="p-2 border-b border-surface-200 dark:border-surface-700 text-xs font-medium text-surface-500 uppercase mt-2">Sort by</div>
              {[
                { id: 'recent', label: 'Most Recent' },
                { id: 'name', label: 'Name' },
                { id: 'progress', label: 'Progress' }
              ].map(option => (
                <button 
                  key={option.id}
                  onClick={() => setSortBy(option.id)}
                  className={`w-full text-left px-3 py-2 text-sm rounded ${sortBy === option.id ? 'bg-primary-light bg-opacity-15 text-primary' : 'hover:bg-surface-100 dark:hover:bg-surface-700'}`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          
          <button 
            onClick={handleCreateProject}
            className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg flex items-center space-x-2 transition-colors"
          >
            <PlusIcon className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProjects.length > 0 ? (
          filteredProjects.map(project => (
            <ProjectCard
              key={project.id}
              project={project}
              onView={() => handleViewProject(project.id)}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-10 px-4 text-center bg-surface-50 dark:bg-surface-800 rounded-lg">
            <svg className="w-16 h-16 text-surface-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-medium text-surface-900 dark:text-white mb-1">No projects found</h3>
            <p className="text-surface-500 dark:text-surface-400 max-w-md">
              {searchTerm 
                ? `No projects match your search for "${searchTerm}". Try different keywords or clear filters.` 
                : "You don't have any projects that match the current filters."}
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default RecentProjects;