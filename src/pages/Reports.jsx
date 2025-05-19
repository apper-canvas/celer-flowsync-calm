import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Chart from 'react-apexcharts';
import { format } from 'date-fns';
import { getIcon } from '../utils/iconUtils';
import {
  calculateMetrics,
  generateTimelineData,
  categorizeTasksByPriority,
  analyzeTeamPerformance
} from '../utils/dashboardUtils';

const Reports = () => {
  const BarChartIcon = getIcon('bar-chart');
  const LineChartIcon = getIcon('line-chart');
  const PieChartIcon = getIcon('pie-chart');
  const UsersIcon = getIcon('users');

  const [activeTab, setActiveTab] = useState('task-summary');
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching tasks from an API
    const fetchTasks = async () => {
      setIsLoading(true);
      try {
        // Mock data - in a real app, this would be fetched from an API
        const mockTasks = [
          { id: 1, title: 'Design new dashboard', column: 'done', priority: 'high', assignee: { name: 'Alex Morgan' }, dueDate: '2023-07-05' },
          { id: 2, title: 'Create user onboarding flow', column: 'in-progress', priority: 'medium', assignee: { name: 'Jordan Lee' }, dueDate: '2023-07-12' },
          { id: 3, title: 'Implement authentication', column: 'done', priority: 'high', assignee: { name: 'Taylor Kim' }, dueDate: '2023-07-02' },
          { id: 4, title: 'API integration', column: 'todo', priority: 'medium', assignee: { name: 'Alex Morgan' }, dueDate: '2023-07-15' },
          { id: 5, title: 'User testing', column: 'todo', priority: 'low', assignee: { name: 'Jordan Lee' }, dueDate: '2023-07-20' },
          { id: 6, title: 'Bug fixes', column: 'in-progress', priority: 'high', assignee: { name: 'Casey Jones' }, dueDate: '2023-07-10' },
          { id: 7, title: 'Documentation', column: 'todo', priority: 'low', assignee: { name: 'Taylor Kim' }, dueDate: '2023-07-25' },
          { id: 8, title: 'Release planning', column: 'done', priority: 'medium', assignee: { name: 'Casey Jones' }, dueDate: '2023-07-01' }
        ];
        setTasks(mockTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTasks();
  }, []);

  // Generate report data using dashboard utilities
  const metrics = calculateMetrics(tasks);
  const timelineData = generateTimelineData(tasks);
  const priorityData = categorizeTasksByPriority(tasks);
  const teamData = analyzeTeamPerformance(tasks);

  // Chart configurations
  const taskSummaryOptions = {
    chart: {
      stacked: true,
      toolbar: { show: false }
    },
    plotOptions: { bar: { horizontal: false } },
    xaxis: { categories: ['Tasks'] },
    legend: { position: 'top' },
    colors: ['#818cf8', '#14b8a6', '#f43f5e']
  };
  
  const taskSummarySeries = [
    { name: 'To Do', data: [metrics.todoTasks] },
    { name: 'In Progress', data: [metrics.inProgressTasks] },
    { name: 'Completed', data: [metrics.completedTasks] }
  ];

  const completionTrendOptions = {
    chart: { type: 'line', toolbar: { show: false } },
    stroke: { curve: 'smooth', width: 3 },
    xaxis: { categories: timelineData.dates },
    yaxis: { min: 0 },
    colors: ['#4f46e5']
  };

  const completionTrendSeries = [
    { name: 'Completed Tasks', data: timelineData.completedCounts }
  ];

  const priorityDistributionOptions = {
    chart: { type: 'pie' },
    labels: priorityData.labels,
    colors: ['#818cf8', '#14b8a6', '#f43f5e'],
    legend: { position: 'bottom' }
  };

  const priorityDistributionSeries = priorityData.counts;

  const teamPerformanceOptions = {
    chart: { type: 'bar', toolbar: { show: false } },
    plotOptions: { bar: { horizontal: true } },
    xaxis: { categories: teamData.names },
    colors: ['#4f46e5']
  };

  const teamPerformanceSeries = [
    { name: 'Completed Tasks', data: teamData.completedCounts }
  ];

  // Tab configuration
  const tabs = [
    { id: 'task-summary', label: 'Task Summary', icon: BarChartIcon },
    { id: 'completion-trends', label: 'Completion Trends', icon: LineChartIcon },
    { id: 'priority-distribution', label: 'Priority Distribution', icon: PieChartIcon },
    { id: 'team-performance', label: 'Team Performance', icon: UsersIcon }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Report Tabs */}
      <div className="mb-6 border-b border-surface-200 dark:border-surface-700">
        <div className="flex flex-wrap -mb-px">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium border-b-2 rounded-t-lg ${
                activeTab === tab.id
                  ? 'text-primary-dark dark:text-primary-light border-primary-dark dark:border-primary-light'
                  : 'border-transparent hover:text-surface-600 hover:border-surface-300 dark:hover:text-surface-300 dark:hover:border-surface-600'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Report Content */}
      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
          </div>
        ) : (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            <div className="card h-full">
              {activeTab === 'task-summary' && (
                <div className="h-full flex flex-col">
                  <h3 className="text-lg font-semibold mb-4">Task Status Distribution</h3>
                  <div className="flex-1 flex items-center justify-center">
                    <Chart options={taskSummaryOptions} series={taskSummarySeries} type="bar" height={350} width="100%" />
                  </div>
                </div>
              )}

              {activeTab === 'completion-trends' && (
                <div className="h-full flex flex-col">
                  <h3 className="text-lg font-semibold mb-4">Task Completion Trends</h3>
                  <div className="flex-1 flex items-center justify-center">
                    <Chart options={completionTrendOptions} series={completionTrendSeries} type="line" height={350} width="100%" />
                  </div>
                </div>
              )}

              {activeTab === 'priority-distribution' && (
                <div className="h-full flex flex-col">
                  <h3 className="text-lg font-semibold mb-4">Tasks by Priority</h3>
                  <div className="flex-1 flex items-center justify-center">
                    <Chart options={priorityDistributionOptions} series={priorityDistributionSeries} type="pie" height={350} width="100%" />
                  </div>
                </div>
              )}

              {activeTab === 'team-performance' && (
                <div className="h-full flex flex-col">
                  <h3 className="text-lg font-semibold mb-4">Team Member Performance</h3>
                  <div className="flex-1 flex items-center justify-center">
                    <Chart options={teamPerformanceOptions} series={teamPerformanceSeries} type="bar" height={350} width="100%" />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Reports;