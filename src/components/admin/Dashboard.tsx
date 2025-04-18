"use client";

import { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Pie, Bar, Line } from 'react-chartjs-2';
import { DashboardStats, DepartmentBreakdown, QuestionAnalysis, TrendData, ChecklistSubmission } from '@/types';
import { getDashboardStats, getDepartmentBreakdown, getQuestionAnalysis, getTrendData, getAllSubmissions } from '@/utils/api';

// Register ChartJS components
ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function Dashboard() {
  const [dateRange, setDateRange] = useState('week');
  const [customDateRange, setCustomDateRange] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [departmentData, setDepartmentData] = useState<DepartmentBreakdown[]>([]);
  const [questionData, setQuestionData] = useState<QuestionAnalysis[]>([]);
  const [trendData, setTrendData] = useState<TrendData[]>([]);
  const [recentActivity, setRecentActivity] = useState<ChecklistSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Set default dates
  useEffect(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString().split('T')[0];
    
    setStartDate(weekAgo);
    setEndDate(today);
  }, []);

  // Load dashboard data
  useEffect(() => {
    async function loadDashboardData() {
      try {
        setLoading(true);
        setError('');

        // Fetch all data in parallel
        const [statsData, departmentBreakdown, questionAnalysis, trend, submissions] = await Promise.all([
          getDashboardStats(),
          getDepartmentBreakdown(),
          getQuestionAnalysis(),
          getTrendData(dateRange as 'week' | 'month' | 'quarter' | 'year'),
          getAllSubmissions()
        ]);

        setStats(statsData);
        setDepartmentData(departmentBreakdown);
        setQuestionData(questionAnalysis);
        setTrendData(trend);
        setRecentActivity(submissions.slice(0, 5)); // Get 5 most recent submissions
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [dateRange]);

  // Handle date range change
  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setDateRange(value);
    setCustomDateRange(value === 'custom');
  };

  // Apply custom date filter
  const applyCustomDateFilter = () => {
    // Implement custom date filtering logic
    console.log('Applying custom date filter:', { startDate, endDate });
    // Reload data with custom date range
  };

  // Prepare chart data
  const departmentChartData = {
    labels: departmentData.map(d => d.department),
    datasets: [
      {
        data: departmentData.map(d => d.count),
        backgroundColor: [
          '#FF4F1F',
          '#0F1941',
          '#ff7a55',
          '#1a2456',
          '#ff9b7d',
          '#2c3e70'
        ],
        borderWidth: 1
      }
    ]
  };

  const trendChartData = {
    labels: trendData.map(d => d.date),
    datasets: [
      {
        label: 'Submissions',
        data: trendData.map(d => d.count),
        borderColor: '#FF4F1F',
        backgroundColor: 'rgba(255, 79, 31, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4
      }
    ]
  };

  const questionChartData = {
    labels: questionData.map(d => d.question),
    datasets: [
      {
        label: 'Yes Responses',
        data: questionData.map(d => d.yes_count),
        backgroundColor: '#2ecc71',
      },
      {
        label: 'No Responses',
        data: questionData.map(d => d.no_count),
        backgroundColor: '#e74c3c',
      }
    ]
  };

  // Format status for display
  const formatStatus = (status: string) => {
    switch (status) {
      case 'complete':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Complete
          </span>
        );
      case 'incomplete':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Incomplete
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-2xl font-bold text-[#0F1941]">Dashboard</h1>
        
        {/* Date Filter */}
        <div className="flex flex-col sm:flex-row gap-2">
          <select
            value={dateRange}
            onChange={handleDateRangeChange}
            className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#FF4F1F] focus:outline-none"
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last 90 Days</option>
            <option value="year">Last 365 Days</option>
            <option value="custom">Custom Range</option>
          </select>
          
          {customDateRange && (
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#FF4F1F] focus:outline-none"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#FF4F1F] focus:outline-none"
              />
              <button
                onClick={applyCustomDateFilter}
                className="px-4 py-2 bg-[#FF4F1F] text-white rounded-md hover:bg-[#e63900] transition-colors"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF4F1F]"></div>
        </div>
      )}
      
      {/* Error State */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}
      
      {/* Stats Cards */}
      {stats && !loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#FF4F1F]">
            <h3 className="text-sm font-medium text-gray-500">Total Submissions</h3>
            <p className="text-3xl font-bold text-[#0F1941]">{stats.total_submissions}</p>
            <p className="text-sm text-gray-500 mt-1">All time</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#0F1941]">
            <h3 className="text-sm font-medium text-gray-500">Completion Rate</h3>
            <p className="text-3xl font-bold text-[#0F1941]">{stats.completion_rate.toFixed(1)}%</p>
            <p className="text-sm text-gray-500 mt-1">Based on all submissions</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#FF4F1F]">
            <h3 className="text-sm font-medium text-gray-500">Avg. Completion Time</h3>
            <p className="text-3xl font-bold text-[#0F1941]">{stats.avg_completion_time.toFixed(1)} days</p>
            <p className="text-sm text-gray-500 mt-1">From start to submission</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-[#0F1941]">
            <h3 className="text-sm font-medium text-gray-500">Pending Submissions</h3>
            <p className="text-3xl font-bold text-[#0F1941]">{stats.pending_submissions}</p>
            <p className="text-sm text-gray-500 mt-1">No change from last period</p>
          </div>
        </div>
      )}
      
      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-[#0F1941] mb-4 text-center">Submissions by Department</h3>
          <div className="h-64">
            <Pie data={departmentChartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold text-[#0F1941] mb-4 text-center">Completion Trend</h3>
          <div className="h-64">
            <Line 
              data={trendChartData} 
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>
      
      {/* Charts Row 2 */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h3 className="text-lg font-semibold text-[#0F1941] mb-4 text-center">Question Completion Analysis</h3>
        <div className="h-80">
          <Bar 
            data={questionChartData} 
            options={{
              maintainAspectRatio: false,
              scales: {
                x: {
                  stacked: true,
                },
                y: {
                  stacked: true,
                  beginAtZero: true
                }
              }
            }} 
          />
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold text-[#0F1941] mb-4">Recent Activity</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission Date</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentActivity.map((activity, index) => (
                <tr key={activity.id || index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{activity.employee_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{activity.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(activity.submission_date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatStatus(activity.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#FF4F1F] hover:text-[#e63900]">
                    <a href={`/admin/submissions/${activity.id}`}>View</a>
                  </td>
                </tr>
              ))}
              
              {recentActivity.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">No recent activity found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
