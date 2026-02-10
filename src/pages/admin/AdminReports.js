import React, { useState } from 'react';
import { Search } from 'lucide-react';

function AdminReports(props) {
  const { darkMode } = props;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);

  // Mock reports data
  const mockReports = [
    {
      id: 1,
      type: 'inappropriate_content',
      severity: 'medium',
      status: 'pending',
      title: 'Inappropriate language in item description',
      description: 'User posted item with offensive language in description',
      reportedBy: { name: 'John Doe', email: 'john@example.com' },
      reportedUser: { name: 'Jane Smith', email: 'jane@example.com' },
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: 2,
      type: 'spam',
      severity: 'high',
      status: 'resolved',
      title: 'Spam posting multiple fake items',
      description: 'User is posting multiple fake lost items to spam the platform',
      reportedBy: { name: 'Mike Johnson', email: 'mike@example.com' },
      reportedUser: { name: 'Spam User', email: 'spam@example.com' },
      createdAt: '2024-01-14T15:45:00Z',
      resolvedAt: '2024-01-14T16:30:00Z'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'resolved': return 'text-green-600 bg-green-100';
      case 'dismissed': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
  };

  const handleResolveReport = (reportId, action) => {
    console.log(`Report ${reportId} ${action}d successfully!`);
    alert(`Report ${action}d successfully!`);
    setSelectedReport(null);
  };

  // Report Detail Modal
  if (selectedReport) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto`}>
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Report Details
              </h2>
              <button
                onClick={() => setSelectedReport(null)}
                className={`p-2 rounded-lg hover:bg-gray-100 ${darkMode ? 'hover:bg-gray-700 text-gray-400' : 'text-gray-500'}`}
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  
                  <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {selectedReport.title}
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getSeverityColor(selectedReport.severity)}`}>
                    {selectedReport.severity} severity
                  </span>
                  <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(selectedReport.status)}`}>
                    {selectedReport.status}
                  </span>
                </div>
              </div>

              <div>
                <h4 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-2`}>
                  Description
                </h4>
                <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} leading-relaxed`}>
                  {selectedReport.description}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                    Reported By
                  </h4>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedReport.reportedBy.name}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedReport.reportedBy.email}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-gray-900'} mb-3`}>
                    Reported User
                  </h4>
                  <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {selectedReport.reportedUser.name}
                    </p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedReport.reportedUser.email}
                    </p>
                  </div>
                </div>
              </div>

              {selectedReport.status === 'pending' && (
                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <button
                    onClick={() => handleResolveReport(selectedReport.id, 'dismiss')}
                    className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Dismiss
                  </button>
                  <button
                    onClick={() => handleResolveReport(selectedReport.id, 'resolve')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Resolve
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Reports Management
          </h1>
          <p className={`mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Review and manage user reports and content moderation
          </p>
        </div>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6 mb-6`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              }`}
            />
          </div>
        </div>

        <div className="space-y-4">
          {mockReports.map(report => (
            <div key={report.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow p-6`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    
                    <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {report.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(report.severity)}`}>
                      {report.severity}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(report.status)}`}>
                      {report.status}
                    </span>
                  </div>
                  
                  <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
                    {report.description}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Reported by:
                      </span>
                      <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {report.reportedBy.name}
                      </p>
                    </div>
                    
                    <div>
                      <span className={`font-medium ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Reported user:
                      </span>
                      <p className={`${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {report.reportedUser.name}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      
                      <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {report.resolvedAt && (
                      <div className="flex items-center space-x-1">
                        
                        <span className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          Resolved {new Date(report.resolvedAt).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleViewReport(report)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="View Details"
                  >
                    
                  </button>
                  
                  {report.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleResolveReport(report.id, 'resolve')}
                        className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => handleResolveReport(report.id, 'dismiss')}
                        className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                      >
                        Dismiss
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminReports;