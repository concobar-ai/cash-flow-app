import React, { useState } from 'react';
import { BarChart2, Building, Users, Wrench, Upload, Bell } from 'lucide-react';
import CashFlowAnalysis from './components/CashFlowAnalysis';
import UnitManagement from './components/UnitManagement';
import OccupancyTracking from './components/OccupancyTracking';
import MaintenanceTracker from './components/MaintenanceTracker';
import DataTransfer from './components/DataTransfer';
import NotificationSystem from './components/NotificationSystem';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard': return 'Financial Dashboard';
      case 'units': return 'Unit Management';
      case 'occupancy': return 'Occupancy Tracking';
      case 'maintenance': return 'Maintenance Requests';
      case 'data': return 'Data Management';
      default: return 'Property Management';
    }
  };

  const renderComponent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <CashFlowAnalysis />;
      case 'units':
        return <UnitManagement />;
      case 'occupancy':
        return <OccupancyTracking />;
      case 'maintenance':
        return <MaintenanceTracker />;
      case 'data':
        return <DataTransfer />;
      case 'notifications':
        return <NotificationSystem />;
      default:
        return <CashFlowAnalysis />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-gray-800">{getPageTitle()}</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button 
                onClick={() => setActiveTab('notifications')} 
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Bell className="h-5 w-5" />
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
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'dashboard' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart2 className="h-5 w-5" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('units')}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'units' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Building className="h-5 w-5" />
              Units
            </button>
            <button
              onClick={() => setActiveTab('occupancy')}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'occupancy' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="h-5 w-5" />
              Occupancy
            </button>
            <button
              onClick={() => setActiveTab('maintenance')}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'maintenance' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Wrench className="h-5 w-5" />
              Maintenance
            </button>
            <button
              onClick={() => setActiveTab('data')}
              className={`w-full flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'data' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Upload className="h-5 w-5" />
              Data
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1">
            <div className="bg-white rounded-lg shadow p-6">
              {renderComponent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
