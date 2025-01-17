import React, { useState } from 'react';

const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Property Management</h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 space-y-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'dashboard' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('units')}
              className={`w-full px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'units' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Units
            </button>
            <button
              onClick={() => setActiveTab('occupancy')}
              className={`w-full px-4 py-2 rounded-lg text-sm font-medium ${
                activeTab === 'occupancy' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              Occupancy
            </button>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-2xl font-bold mb-4">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>
              <p>Content for {activeTab} will go here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
