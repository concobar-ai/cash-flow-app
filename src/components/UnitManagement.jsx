import React, { useState, useEffect } from 'react';
import { Building, DollarSign, Square, Plus, Edit, Trash } from 'lucide-react';

const UnitManagement = () => {
  const [units, setUnits] = useState(() => {
    const savedUnits = localStorage.getItem('units');
    return savedUnits ? JSON.parse(savedUnits) : [];
  });

  const [editingUnit, setEditingUnit] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const initialUnitState = {
    number: '',
    type: 'retail',
    squareFeet: '',
    baseRentPSF: '',
    status: 'available',
    features: [],
    description: ''
  };

  const [formData, setFormData] = useState(initialUnitState);

  useEffect(() => {
    localStorage.setItem('units', JSON.stringify(units));
  }, [units]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingUnit) {
      setUnits(prev => prev.map(unit => 
        unit.id === editingUnit.id ? { ...formData, id: unit.id } : unit
      ));
    } else {
      setUnits(prev => [...prev, { ...formData, id: Date.now() }]);
    }
    setFormData(initialUnitState);
    setEditingUnit(null);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this unit?')) {
      setUnits(prev => prev.filter(unit => unit.id !== id));
    }
  };

  const handleEdit = (unit) => {
    setEditingUnit(unit);
    setFormData(unit);
    setShowForm(true);
  };

  const renderUnitCard = (unit) => (
    <div key={unit.id} className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <Building className="h-5 w-5 text-blue-500" />
          <h3 className="font-semibold">Unit {unit.number}</h3>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(unit)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(unit.id)}
            className="p-1 hover:bg-gray-100 rounded text-red-500"
          >
            <Trash className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-gray-600">
          <Square className="h-4 w-4" />
          <span>{unit.squareFeet} SF</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <DollarSign className="h-4 w-4" />
          <span>${unit.baseRentPSF}/SF</span>
        </div>
        <div className={`inline-block px-2 py-1 rounded text-sm
          ${unit.status === 'available' ? 'bg-green-100 text-green-800' :
            unit.status === 'occupied' ? 'bg-blue-100 text-blue-800' :
            'bg-gray-100 text-gray-800'}`}>
          {unit.status.charAt(0).toUpperCase() + unit.status.slice(1)}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Unit Management</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingUnit(null);
            setFormData(initialUnitState);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Plus className="h-4 w-4" />
          Add Unit
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Unit Number</label>
              <input
                type="text"
                value={formData.number}
                onChange={(e) => setFormData(prev => ({ ...prev, number: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="w-full p-2 border rounded"
              >
                <option value="retail">Retail</option>
                <option value="office">Office</option>
                <option value="restaurant">Restaurant</option>
                <option value="service">Service</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Square Feet</label>
              <input
                type="number"
                value={formData.squareFeet}
                onChange={(e) => setFormData(prev => ({ ...prev, squareFeet: e.target.value }))}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Base Rent PSF</label>
              <input
                type="number"
                value={formData.baseRentPSF}
                onChange={(e) => setFormData(prev => ({ ...prev, baseRentPSF: e.target.value }))}
                className="w-full p-2 border rounded"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                className="w-full p-2 border rounded"
              >
                <option value="available">Available</option>
                <option value="occupied">Occupied</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setFormData(initialUnitState);
                setEditingUnit(null);
              }}
              className="px-4 py-2 border rounded hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {editingUnit ? 'Update Unit' : 'Add Unit'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {units.map(renderUnitCard)}
        {units.length === 0 && !showForm && (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow">
            <Building className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Units Added</h3>
            <p className="text-gray-500">Get started by adding your first unit</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitManagement;
