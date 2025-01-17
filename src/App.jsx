import React, { useState } from 'react';
import CashFlowAnalysis from './components/CashFlowAnalysis';
import UnitManagement from './components/UnitManagement';
import OccupancyTracking from './components/OccupancyTracking';
import MaintenanceTracker from './components/MaintenanceTracker';
import DataTransfer from './components/DataTransfer';
import NotificationSystem from './components/NotificationSystem';
import { BarChart2, Building, Users, Wrench, Upload, Bell } from 'lucide-react';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const menuItems = [
    { id: 'dashboard', name: 'Dashboard', icon: BarChart2, component: CashFlowAnalysis },
    { id: 'units', name: 'Units', icon: Building, component: UnitManagement },
    { id: 'occupancy', name: 'Occupancy', icon: Users, component: OccupancyTracking },
    { id: 'maintenance', name: 'Maintenance', icon: Wrench, component: MaintenanceTracker },
    { id: 'data', name: 'Data', icon: Upload, component: DataTransfer }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Property Management</h1>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setActiveTab('notifications')}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Bell className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full md:w-64 space-y-1">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                  activeTab === item.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </button>
            ))}
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow p-6">
              {activeTab === 'notifications' ? (
                <NotificationSystem />
              ) : (
                menuItems.find(item => item.id === activeTab)?.component()
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
