import React, { useState } from 'react';
import { Wrench, AlertTriangle, CheckSquare } from 'lucide-react';

const MaintenanceTracker = () => {
  const [requests] = useState([
    {
      id: 1,
      unit: '101',
      issue: 'HVAC Repair',
      priority: 'high',
      status: 'pending',
      date: '2024-01-15'
    },
    {
      id: 2,
      unit: '103',
      issue: 'Plumbing Maintenance',
      priority: 'medium',
      status: 'in_progress',
      date: '2024-01-14'
    },
    {
      id: 3,
      unit: '102',
      issue: 'Light Fixture',
      priority: 'low',
      status: 'completed',
      date: '2024-01-13'
    }
  ]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'in_progress':
        return <Wrench className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckSquare className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Maintenance Requests</h2>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          New Request
        </button>
      </div>

      <div className="space-y-4">
        {requests.map(request => (
          <div key={request.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {getStatusIcon(request.status)}
                <div>
                  <h3 className="font-semibold">Unit {request.unit}</h3>
                  <p className="text-sm text-gray-500">{request.issue}</p>
                  <p className="text-xs text-gray-400">{request.date}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded text-xs ${getPriorityClass(request.priority)}`}>
                  {request.priority}
                </span>
                <span className={`px-2 py-1 rounded text-xs ${getStatusClass(request.status)}`}>
                  {request.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MaintenanceTracker;
