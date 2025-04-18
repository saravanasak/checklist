"use client";

import { useState, useEffect, useCallback } from 'react';
import { ChecklistSubmission } from '@/types';
import { getFilteredSubmissions } from '@/utils/api';

export default function Submissions() {
  const [submissions, setSubmissions] = useState<ChecklistSubmission[]>([]);
  const [allSubmissions, setAllSubmissions] = useState<ChecklistSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  
  // Debounce search to prevent constant API calls
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  
  // Apply search filter client-side
  const applySearchFilter = useCallback((data: ChecklistSubmission[], query: string) => {
    if (!query) return data;
    
    const lowercaseQuery = query.toLowerCase();
    return data.filter(submission => 
      submission.employee_name?.toLowerCase().includes(lowercaseQuery) ||
      submission.employee_id?.toLowerCase().includes(lowercaseQuery) ||
      submission.department?.toLowerCase().includes(lowercaseQuery)
    );
  }, []);
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    
    // Apply client-side filtering immediately
    const filteredResults = applySearchFilter(allSubmissions, value);
    setSubmissions(filteredResults);
  };
  
  // Load submissions data
  useEffect(() => {
    async function loadSubmissions() {
      try {
        setLoading(true);
        setError('');
        
        // Prepare filter parameters
        const filters: {
          department?: string;
          status?: string;
          startDate?: string;
          endDate?: string;
        } = {};
        
        if (departmentFilter !== 'all') {
          filters.department = departmentFilter;
        }
        
        if (statusFilter !== 'all') {
          filters.status = statusFilter;
        }
        
        // Set date filters based on selection
        if (dateFilter !== 'all') {
          const now = new Date();
          const today = now.toISOString().split('T')[0];
          
          switch (dateFilter) {
            case 'today':
              filters.startDate = today;
              filters.endDate = today;
              break;
            case 'week':
              const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString().split('T')[0];
              filters.startDate = weekAgo;
              filters.endDate = today;
              break;
            case 'month':
              const monthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate()).toISOString().split('T')[0];
              filters.startDate = monthAgo;
              filters.endDate = today;
              break;
          }
        }
        
        // Fetch filtered submissions
        const data = await getFilteredSubmissions(filters);
        setAllSubmissions(data);
        
        // Apply search filter if there's an active search
        const filteredData = applySearchFilter(data, searchQuery);
        setSubmissions(filteredData);
      } catch (err) {
        console.error('Error loading submissions:', err);
        setError('Failed to load submissions. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    loadSubmissions();
  }, [departmentFilter, statusFilter, dateFilter, applySearchFilter]);
  
  // Format status for display
  const formatStatus = (status: string) => {
    switch (status) {
      case 'complete':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Complete</span>;
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Pending</span>;
      case 'incomplete':
        return <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Incomplete</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs font-medium">{status}</span>;
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading submissions...</div>;
  }
  
  if (error) {
    return <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>;
  }
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0F1941] mb-6">All Submissions</h1>
      
      {/* Filter Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by name, department, or ID..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-[#FF4F1F] focus:outline-none"
          />
        </div>
        
        <div className="flex flex-wrap gap-4">
          <div>
            <label htmlFor="departmentFilter" className="block text-sm font-medium text-gray-700 mb-1">Department:</label>
            <select
              id="departmentFilter"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#FF4F1F] focus:outline-none"
            >
              <option value="all">All Departments</option>
              <option value="IT Support">IT Support</option>
              <option value="Customer Service">Customer Service</option>
              <option value="Sales">Sales</option>
              <option value="HR">HR</option>
              <option value="Development">Development</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">Status:</label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#FF4F1F] focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="complete">Complete</option>
              <option value="pending">Pending</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700 mb-1">Date:</label>
            <select
              id="dateFilter"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#FF4F1F] focus:outline-none"
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Submissions Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee ID</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submission Date</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Completion %</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {submissions.map((submission) => (
                <tr key={submission.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.employee_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{submission.employee_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.department}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(submission.start_date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(submission.submission_date)}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{formatStatus(submission.status)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{submission.completion_percentage}%</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex space-x-2">
                      <a 
                        href={`/admin/submissions/${submission.id}`}
                        className="bg-[#FF4F1F] text-white px-3 py-1 rounded text-xs font-medium hover:bg-[#e63900] transition-colors"
                      >
                        View
                      </a>
                      <button 
                        className="bg-[#0F1941] text-white px-3 py-1 rounded text-xs font-medium hover:bg-[#1a2456] transition-colors"
                        onClick={() => window.open(`/api/export-pdf/${submission.id}`, '_blank')}
                      >
                        Export
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {submissions.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-sm text-gray-500">No submissions found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
