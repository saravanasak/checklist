"use client";

import { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Reports() {
  const [reportType, setReportType] = useState('summary');
  const [dateRange, setDateRange] = useState('week');
  const [customDateRange, setCustomDateRange] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [department, setDepartment] = useState('all');
  const [format, setFormat] = useState('pdf');
  const [includeCharts, setIncludeCharts] = useState(true);
  const [includeDetails, setIncludeDetails] = useState(true);
  const [includeComments, setIncludeComments] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  
  // Set default dates
  useState(() => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const weekAgo = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString().split('T')[0];
    
    setStartDate(weekAgo);
    setEndDate(today);
  });
  
  // Handle date range change
  const handleDateRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setDateRange(value);
    setCustomDateRange(value === 'custom');
  };
  
  // Generate report
  const generateReport = () => {
    // Validate custom date range if selected
    if (dateRange === 'custom' && (!startDate || !endDate)) {
      alert('Please select both start and end dates');
      return;
    }
    
    // In a real application, this would call an API to generate the report
    console.log('Generating report with options:', {
      reportType,
      dateRange,
      customDates: dateRange === 'custom' ? { startDate, endDate } : null,
      department,
      format,
      includeCharts,
      includeDetails,
      includeComments
    });
    
    // Show preview
    setPreviewVisible(true);
  };
  
  // Schedule report
  const scheduleReport = () => {
    // In a real application, this would call an API to schedule the report
    alert('Report scheduled for regular delivery');
  };
  
  // Sample data for report preview
  const sampleChartData = {
    labels: ['Question 1', 'Question 2', 'Question 3', 'Question 4', 'Question 5', 'Question 6', 'Question 7', 'Question 8', 'Question 9', 'Question 10', 'Question 11', 'Question 12'],
    datasets: [
      {
        label: 'Yes Responses',
        data: [95, 92, 88, 90, 85, 78, 94, 89, 82, 75, 91, 87],
        backgroundColor: '#2ecc71',
      },
      {
        label: 'No Responses',
        data: [5, 8, 12, 10, 15, 22, 6, 11, 18, 15, 9, 13],
        backgroundColor: '#e74c3c',
      }
    ]
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0F1941] mb-6">Generate Reports</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Report Options */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-[#FF4F1F] mb-4">Report Options</h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="reportType" className="block text-sm font-medium text-gray-700 mb-1">Report Type:</label>
              <select
                id="reportType"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#FF4F1F] focus:outline-none"
              >
                <option value="summary">Summary Report</option>
                <option value="detailed">Detailed Report</option>
                <option value="compliance">Compliance Report</option>
                <option value="department">Department Analysis</option>
                <option value="trend">Trend Analysis</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">Date Range:</label>
              <select
                id="dateRange"
                value={dateRange}
                onChange={handleDateRangeChange}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#FF4F1F] focus:outline-none"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
            
            {customDateRange && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">Start Date:</label>
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#FF4F1F] focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">End Date:</label>
                  <input
                    type="date"
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#FF4F1F] focus:outline-none"
                  />
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">Department:</label>
              <select
                id="department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#FF4F1F] focus:outline-none"
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
              <label htmlFor="format" className="block text-sm font-medium text-gray-700 mb-1">Format:</label>
              <select
                id="format"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#FF4F1F] focus:outline-none"
              >
                <option value="pdf">PDF</option>
                <option value="excel">Excel</option>
                <option value="csv">CSV</option>
              </select>
            </div>
            
            <div>
              <p className="block text-sm font-medium text-gray-700 mb-1">Include:</p>
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={includeCharts}
                    onChange={(e) => setIncludeCharts(e.target.checked)}
                    className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                  />
                  <span className="ml-2 text-sm text-gray-700">Charts and Graphs</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={includeDetails}
                    onChange={(e) => setIncludeDetails(e.target.checked)}
                    className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                  />
                  <span className="ml-2 text-sm text-gray-700">Detailed Responses</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={includeComments}
                    onChange={(e) => setIncludeComments(e.target.checked)}
                    className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                  />
                  <span className="ml-2 text-sm text-gray-700">Comments and Notes</span>
                </label>
              </div>
            </div>
            
            <div className="flex gap-4 pt-2">
              <button
                onClick={generateReport}
                className="bg-[#FF4F1F] text-white px-4 py-2 rounded-md font-medium hover:bg-[#e63900] transition-colors"
              >
                Generate Report
              </button>
              <button
                onClick={scheduleReport}
                className="bg-[#0F1941] text-white px-4 py-2 rounded-md font-medium hover:bg-[#1a2456] transition-colors"
              >
                Schedule Report
              </button>
            </div>
          </div>
        </div>
        
        {/* Report Preview */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-[#FF4F1F] mb-4">Report Preview</h2>
          
          {previewVisible ? (
            <div className="space-y-4">
              <h3 className="text-xl font-bold text-center text-[#0F1941]">
                {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
              </h3>
              
              <div className="text-sm text-gray-700 space-y-2">
                <p>
                  <strong>Date Range:</strong> {dateRange === 'custom' ? `${startDate} to ${endDate}` : dateRange}
                </p>
                <p>
                  <strong>Department:</strong> {department === 'all' ? 'All Departments' : department}
                </p>
                <p>
                  <strong>Format:</strong> {format.toUpperCase()}
                </p>
              </div>
              
              {includeCharts && (
                <div className="mt-4">
                  <h4 className="text-md font-semibold mb-2">Question Response Analysis</h4>
                  <div className="h-64">
                    <Bar 
                      data={sampleChartData} 
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
              )}
              
              {includeDetails && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h4 className="text-md font-semibold mb-2">Detailed Responses</h4>
                  <p className="text-sm text-gray-500">Detailed response data would appear here</p>
                </div>
              )}
              
              {includeComments && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h4 className="text-md font-semibold mb-2">Comments and Notes</h4>
                  <p className="text-sm text-gray-500 italic">Comments and notes would appear here</p>
                </div>
              )}
              
              <div className="mt-4 text-center">
                <button
                  onClick={() => alert('Report downloaded')}
                  className="bg-[#0F1941] text-white px-4 py-2 rounded-md font-medium hover:bg-[#1a2456] transition-colors"
                >
                  Download {format.toUpperCase()}
                </button>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center border border-dashed border-gray-300 rounded-md">
              <p className="text-gray-500">Select report options and click "Generate Report" to see a preview</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Saved Reports */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-lg font-semibold text-[#FF4F1F] mb-4">Saved Reports</h2>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report Name</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Range</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Generated On</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Format</th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Monthly Summary - April 2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Summary</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apr 1 - Apr 30, 2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apr 18, 2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">PDF</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <button className="bg-[#FF4F1F] text-white px-3 py-1 rounded text-xs font-medium hover:bg-[#e63900] transition-colors">
                      View
                    </button>
                    <button className="bg-[#0F1941] text-white px-3 py-1 rounded text-xs font-medium hover:bg-[#1a2456] transition-colors">
                      Download
                    </button>
                    <button className="bg-red-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-700 transition-colors">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">Q1 Compliance Report</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Compliance</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jan 1 - Mar 31, 2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apr 5, 2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Excel</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <button className="bg-[#FF4F1F] text-white px-3 py-1 rounded text-xs font-medium hover:bg-[#e63900] transition-colors">
                      View
                    </button>
                    <button className="bg-[#0F1941] text-white px-3 py-1 rounded text-xs font-medium hover:bg-[#1a2456] transition-colors">
                      Download
                    </button>
                    <button className="bg-red-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-700 transition-colors">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">IT Department Analysis</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Department</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jan 1 - Apr 15, 2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apr 16, 2025</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">PDF</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="flex space-x-2">
                    <button className="bg-[#FF4F1F] text-white px-3 py-1 rounded text-xs font-medium hover:bg-[#e63900] transition-colors">
                      View
                    </button>
                    <button className="bg-[#0F1941] text-white px-3 py-1 rounded text-xs font-medium hover:bg-[#1a2456] transition-colors">
                      Download
                    </button>
                    <button className="bg-red-600 text-white px-3 py-1 rounded text-xs font-medium hover:bg-red-700 transition-colors">
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
