"use client";

import { useState } from 'react';

export default function Settings() {
  // General Settings
  const [companyName, setCompanyName] = useState('Genesys');
  const [adminEmail, setAdminEmail] = useState('admin@genesys.com');
  const [logoUrl, setLogoUrl] = useState('/logo.png');
  const [primaryColor, setPrimaryColor] = useState('#FF4F1F');
  const [secondaryColor, setSecondaryColor] = useState('#0F1941');
  
  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [dashboardNotifications, setDashboardNotifications] = useState(true);
  const [notifyOnNewSubmission, setNotifyOnNewSubmission] = useState(true);
  const [notifyOnIncomplete, setNotifyOnIncomplete] = useState(true);
  const [digestFrequency, setDigestFrequency] = useState('daily');
  
  // Checklist Settings
  const [requireAllItems, setRequireAllItems] = useState(true);
  const [allowComments, setAllowComments] = useState(true);
  const [showProgressBar, setShowProgressBar] = useState(true);
  const [autoSaveResponses, setAutoSaveResponses] = useState(true);
  const [reminderDays, setReminderDays] = useState(3);
  
  // User Management
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin User', email: 'admin@genesys.com', role: 'admin', lastLogin: '2025-04-15' },
    { id: 2, name: 'HR Manager', email: 'hr@genesys.com', role: 'manager', lastLogin: '2025-04-14' },
    { id: 3, name: 'Department Lead', email: 'lead@genesys.com', role: 'viewer', lastLogin: '2025-04-10' },
  ]);
  
  // Save settings
  const saveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API to save settings
    alert('General settings saved successfully!');
  };
  
  const saveNotificationSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API to save settings
    alert('Notification settings saved successfully!');
  };
  
  const saveChecklistSettings = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would call an API to save settings
    alert('Checklist settings saved successfully!');
  };
  
  // Add new user
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('viewer');
  
  const addUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail) {
      alert('Please fill in all fields');
      return;
    }
    
    // In a real app, this would call an API to add a user
    const newUser = {
      id: users.length + 1,
      name: newUserName,
      email: newUserEmail,
      role: newUserRole,
      lastLogin: 'Never'
    };
    
    setUsers([...users, newUser]);
    setNewUserName('');
    setNewUserEmail('');
    setNewUserRole('viewer');
    alert('User added successfully!');
  };
  
  // Remove user
  const removeUser = (id: number) => {
    if (confirm('Are you sure you want to remove this user?')) {
      setUsers(users.filter(user => user.id !== id));
      alert('User removed successfully!');
    }
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#0F1941] mb-6">Settings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* General Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-[#FF4F1F] mb-4">General Settings</h2>
          
          <form onSubmit={saveGeneralSettings} className="space-y-4">
            <div>
              <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">Company Name:</label>
              <input
                type="text"
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#FF4F1F] focus:outline-none"
              />
            </div>
            
            <div>
              <label htmlFor="adminEmail" className="block text-sm font-medium text-gray-700 mb-1">Admin Email:</label>
              <input
                type="email"
                id="adminEmail"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#FF4F1F] focus:outline-none"
              />
            </div>
            
            <div>
              <label htmlFor="logoUrl" className="block text-sm font-medium text-gray-700 mb-1">Logo URL:</label>
              <input
                type="text"
                id="logoUrl"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#FF4F1F] focus:outline-none"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="primaryColor" className="block text-sm font-medium text-gray-700 mb-1">Primary Color:</label>
                <div className="flex items-center">
                  <input
                    type="color"
                    id="primaryColor"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="h-8 w-8 border rounded mr-2"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#FF4F1F] focus:outline-none"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="secondaryColor" className="block text-sm font-medium text-gray-700 mb-1">Secondary Color:</label>
                <div className="flex items-center">
                  <input
                    type="color"
                    id="secondaryColor"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="h-8 w-8 border rounded mr-2"
                  />
                  <input
                    type="text"
                    value={secondaryColor}
                    onChange={(e) => setSecondaryColor(e.target.value)}
                    className="flex-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#FF4F1F] focus:outline-none"
                  />
                </div>
              </div>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                className="bg-[#FF4F1F] text-white px-4 py-2 rounded-md font-medium hover:bg-[#e63900] transition-colors"
              >
                Save General Settings
              </button>
            </div>
          </form>
        </div>
        
        {/* Notification Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-[#FF4F1F] mb-4">Notification Settings</h2>
          
          <form onSubmit={saveNotificationSettings} className="space-y-4">
            <div>
              <p className="block text-sm font-medium text-gray-700 mb-2">Notification Methods:</p>
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                  />
                  <span className="ml-2 text-sm text-gray-700">Email Notifications</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={dashboardNotifications}
                    onChange={(e) => setDashboardNotifications(e.target.checked)}
                    className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                  />
                  <span className="ml-2 text-sm text-gray-700">Dashboard Notifications</span>
                </label>
              </div>
            </div>
            
            <div>
              <p className="block text-sm font-medium text-gray-700 mb-2">Notification Events:</p>
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={notifyOnNewSubmission}
                    onChange={(e) => setNotifyOnNewSubmission(e.target.checked)}
                    className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                  />
                  <span className="ml-2 text-sm text-gray-700">New Submission</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={notifyOnIncomplete}
                    onChange={(e) => setNotifyOnIncomplete(e.target.checked)}
                    className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                  />
                  <span className="ml-2 text-sm text-gray-700">Incomplete Submissions</span>
                </label>
              </div>
            </div>
            
            <div>
              <label htmlFor="digestFrequency" className="block text-sm font-medium text-gray-700 mb-1">Summary Digest Frequency:</label>
              <select
                id="digestFrequency"
                value={digestFrequency}
                onChange={(e) => setDigestFrequency(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#FF4F1F] focus:outline-none"
              >
                <option value="never">Never</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                className="bg-[#FF4F1F] text-white px-4 py-2 rounded-md font-medium hover:bg-[#e63900] transition-colors"
              >
                Save Notification Settings
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Checklist Settings */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-[#FF4F1F] mb-4">Checklist Settings</h2>
          
          <form onSubmit={saveChecklistSettings} className="space-y-4">
            <div>
              <p className="block text-sm font-medium text-gray-700 mb-2">Form Options:</p>
              <div className="space-y-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={requireAllItems}
                    onChange={(e) => setRequireAllItems(e.target.checked)}
                    className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                  />
                  <span className="ml-2 text-sm text-gray-700">Require All Checklist Items</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={allowComments}
                    onChange={(e) => setAllowComments(e.target.checked)}
                    className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                  />
                  <span className="ml-2 text-sm text-gray-700">Allow Comments</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={showProgressBar}
                    onChange={(e) => setShowProgressBar(e.target.checked)}
                    className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                  />
                  <span className="ml-2 text-sm text-gray-700">Show Progress Bar</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={autoSaveResponses}
                    onChange={(e) => setAutoSaveResponses(e.target.checked)}
                    className="h-4 w-4 text-[#FF4F1F] focus:ring-[#FF4F1F]"
                  />
                  <span className="ml-2 text-sm text-gray-700">Auto-Save Responses</span>
                </label>
              </div>
            </div>
            
            <div>
              <label htmlFor="reminderDays" className="block text-sm font-medium text-gray-700 mb-1">Reminder Days:</label>
              <input
                type="number"
                id="reminderDays"
                min="1"
                max="30"
                value={reminderDays}
                onChange={(e) => setReminderDays(parseInt(e.target.value))}
                className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#FF4F1F] focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Number of days after which to send a reminder for incomplete checklists</p>
            </div>
            
            <div className="pt-2">
              <button
                type="submit"
                className="bg-[#FF4F1F] text-white px-4 py-2 rounded-md font-medium hover:bg-[#e63900] transition-colors"
              >
                Save Checklist Settings
              </button>
            </div>
          </form>
        </div>
        
        {/* User Management */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold text-[#FF4F1F] mb-4">User Management</h2>
          
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-700 mb-2">Add New User</h3>
            <form onSubmit={addUser} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Name"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#FF4F1F] focus:outline-none"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#FF4F1F] focus:outline-none"
                />
              </div>
              <div>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value)}
                  className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-[#FF4F1F] focus:outline-none"
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="viewer">Viewer</option>
                </select>
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-[#0F1941] text-white px-4 py-2 rounded-md font-medium hover:bg-[#1a2456] transition-colors"
                >
                  Add User
                </button>
              </div>
            </form>
          </div>
          
          <div>
            <h3 className="text-md font-medium text-gray-700 mb-2">Current Users</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                    <th className="px-4 py-2 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500 capitalize">{user.role}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-500">{user.lastLogin}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm">
                        <div className="flex space-x-2">
                          <button 
                            className="bg-[#FF4F1F] text-white px-2 py-1 rounded text-xs font-medium hover:bg-[#e63900] transition-colors"
                            onClick={() => alert(`Edit user: ${user.name}`)}
                          >
                            Edit
                          </button>
                          <button 
                            className="bg-red-600 text-white px-2 py-1 rounded text-xs font-medium hover:bg-red-700 transition-colors"
                            onClick={() => removeUser(user.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      {/* System Information */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h2 className="text-lg font-semibold text-[#FF4F1F] mb-4">System Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-500">Application Version</h3>
            <p className="text-lg font-semibold">1.0.0</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-500">Database Status</h3>
            <p className="text-lg font-semibold text-green-600">Connected</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-500">Last Backup</h3>
            <p className="text-lg font-semibold">2025-04-15 03:00 AM</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-md">
            <h3 className="text-sm font-medium text-gray-500">Storage Usage</h3>
            <p className="text-lg font-semibold">128 MB / 5 GB</p>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end space-x-4">
          <button 
            className="bg-[#0F1941] text-white px-4 py-2 rounded-md font-medium hover:bg-[#1a2456] transition-colors"
            onClick={() => alert('Backup initiated')}
          >
            Backup Data
          </button>
          <button 
            className="bg-red-600 text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 transition-colors"
            onClick={() => confirm('Are you sure you want to clear all data? This action cannot be undone.')}
          >
            Clear All Data
          </button>
        </div>
      </div>
    </div>
  );
}
