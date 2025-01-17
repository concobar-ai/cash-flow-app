import React, { useState, useEffect } from 'react';
import { Wrench, AlertTriangle, CheckSquare, Clock } from 'lucide-react';

const MaintenanceTracker = () => {
  const [requests, setRequests] = useState([]);
  const [units, setUnits] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    unitId: '',
    category: 'repair',
    priority: 'normal',
    description: '',
    location: '',
    status: 'pending'
  });

  useEffect(() => {
    const savedRequests = localStorage.getItem('maintenanceRequests');
    const savedUnits = localStorage.getItem('units');
    if (savedRequests) setRequests(JSON.parse(savedRequests));
    if (savedUnits) setUnits(JSON.parse(savedUnits));
  }, []);

  useEffect(() => {
    localStorage.setItem('maintenanceRequests', JSON.stringify(requests));
  }, [requests]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newRequest = {
      ...formData,
      id: Date.now(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      history: [{
        status: 'pending',
        date: new Date().toISOString(),
        note: 'Request created'
      }]
    };

    setRequests(prev => [...prev, newRequest]);
    setFormData({
      unitId: '',
      category: 'repair',
      priority: 'normal',
      description: '',
      location: '',
      status: 'pending'
    });
    setShowForm(false);
  };

  const updateStatus = (id, newStatus) => {
    setRequests(prev => prev.map(request => {
      if (request.id === id) {
        return {
          ...request,
          status: newStatus,
          updatedAt: new Date().toISOString(),
          history: [
            ...request.history,
            {
              status: newStatus,
              date: new Date().toISOString(),
              note: `Status updated to ${newStatus}`
            }
          ]
        };
      }
      return request;
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'in_progress':
        return <Wrench className="h-5 w-5 text-blue-500" />;
      case 'completed':
        return <CheckSquare className="h-5 w-5 text-green-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
    }
  };

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'normal':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Maintenance Requests</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          New Request
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Unit</label>
                <select
                  value={formData.unitId}
                  onChange={(e) => setFormData(prev => ({ ...prev, unitId: e.target.value }))}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Unit</option>
                  {units.map(unit => (
                    <option key={unit.id} value={unit.id}>Unit {unit.number}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="repair">Repair</option>
                  <option value="hvac">HVAC</option>
                  <option value="plumbing">Plumbing</option>
                  <option value="electrical">Electrical</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="low">Low</option>
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full p-2 border rounded"
                  placeholder="e.g., Kitchen, Front entrance"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-2 border rounded"
                rows={3}
                required
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Submit Request
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {requests.map(request => (
          <div key={request.id} className="bg-white p-4 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div className="flex items-start gap-4">
                {getStatusIcon(request.status)}
                <div>
                  <h3 className="font-medium">
                    Unit {units.find(u => u.id === request.unitId)?.number || 'Unknown'} - {request.category}
                  </h3>
                  <p className="text-sm text-gray-500">{request.location}</p>
                  <p className="text-sm text-gray-600 mt-1">{request.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className={`text-xs px-2 py-1 rounded ${getPriorityClass(request.priority)}`}>
                      {request.priority}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusClass(request.status)}`}>
                      {request.status}
                    </span>
                  </div>
                </div>
              </div>
              <select
                value={request.status}
                onChange={(e) => updateStatus(request.id, e.target.value)}
                className="p-1 border rounded text-sm"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        ))}
        {requests.length === 0 && !showForm && (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <Wrench className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No Maintenance Requests</h3>
            <p className="text-gray-500">All caught up! No pending maintenance requests.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceTracker;
