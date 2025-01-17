import React, { useState } from 'react';
import { Bell, Calendar, DollarSign, AlertTriangle } from 'lucide-react';

const NotificationSystem = () => {
  const [notifications] = useState([
    {
      id: 1,
      type: 'lease',
      priority: 'high',
      title: 'Lease Expiring Soon',
      message: 'Unit 101 lease expires in 30 days',
      date: '2024-02-15'
    },
    {
      id: 2,
      type: 'payment',
      priority: 'medium',
      title: 'Rent Payment Due',
      message: 'Unit 103 rent payment due in 5 days',
      date: '2024-01-25'
    },
    {
      id: 3,
      type: 'maintenance',
      priority: 'low',
      title: 'Maintenance Completed',
      message: 'HVAC repair completed for Unit 102',
      date: '2024-01-17'
    }
  ]);

  const getIcon = (type) => {
    switch (type) {
      case 'lease':
        return <Calendar className="h-5 w-5" />;
      case 'payment':
        return <DollarSign className="h-5 w-5" />;
      case 'maintenance':
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 border-red-200';
      case 'medium':
        return 'bg-yellow-50 border-yellow-200';
      case 'low':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Notifications</h2>
        <div className="flex gap-2">
          <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
            Mark All Read
          </button>
          <button className="px-3 py-1 text-sm border rounded hover:bg-gray-50">
            Settings
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map(notification => (
          <div
            key={notification.id}
            className={`p-4 rounded-lg border ${getPriorityClass(notification.priority)}`}
          >
            <div className="flex gap-4">
              {getIcon(notification.type)}
              <div className="flex-1">
                <h3 className="font-semibold">{notification.title}</h3>
                <p className="text-sm text-gray-600">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">{notification.date}</p>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <Bell className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Bell className="h-12 w-12 mx-auto text-gray-400 mb-3" />
          <p>No notifications at this time</p>
        </div>
      )}
    </div>
  );
};

export default NotificationSystem;
