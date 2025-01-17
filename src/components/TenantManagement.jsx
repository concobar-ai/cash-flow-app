import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Plus, Edit2, Trash2, Save } from 'lucide-react';

const TenantManagement = () => {
  const [tenants, setTenants] = useState(() => {
    const savedTenants = localStorage.getItem('tenants');
    return savedTenants ? JSON.parse(savedTenants) : [];
  });
  
  const [editingTenant, setEditingTenant] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    localStorage.setItem('tenants', JSON.stringify(tenants));
  }, [tenants]);

  const initialTenantState = {
    name: '',
    leaseStart: '',
    leaseEnd: '',
    baseRent: '',
    squareFeet: '',
    escalations: [],
    signageRent: '',
    additionalRent: '',
    securityDeposit: ''
  };

  const [formData, setFormData] = useState(initialTenantState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddEscalation = () => {
    setFormData(prev => ({
      ...prev,
      escalations: [
        ...prev.escalations,
        { date: '', amount: '', type: 'fixed' }
      ]
    }));
  };

  const handleSave = () => {
    if (editingTenant !== null) {
      setTenants(prev => prev.map((t, i) => 
        i === editingTenant ? formData : t
      ));
    } else {
      setTenants(prev => [...prev, formData]);
    }
    setFormData(initialTenantState);
    setEditingTenant(null);
    setIsAddingNew(false);
  };

  const handleDelete = (index) => {
    setTenants(prev => prev.filter((_, i) => i !== index));
  };

  const handleEdit = (index) => {
    setEditingTenant(index);
    setFormData(tenants[index]);
    setIsAddingNew(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Tenant Management</h2>
        <button
          onClick={() => {
            setIsAddingNew(true);
            setEditingTenant(null);
            setFormData(initialTenantState);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <Plus className="h-4 w-4" />
          Add New Tenant
        </button>
      </div>

      {(isAddingNew || editingTenant !== null) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingTenant !== null ? 'Edit Tenant' : 'Add New Tenant'}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tenant Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Square Feet</label>
                  <input
                    type="number"
                    name="squareFeet"
                    value={formData.squareFeet}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Lease Start</label>
                  <input
                    type="date"
                    name="leaseStart"
                    value={formData.leaseStart}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Lease End</label>
                  <input
                    type="date"
                    name="leaseEnd"
                    value={formData.leaseEnd}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Base Rent</label>
                  <input
                    type="number"
                    name="baseRent"
                    value={formData.baseRent}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Additional Rent (PSF)</label>
                  <input
                    type="number"
                    name="additionalRent"
                    value={formData.additionalRent}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Rent Escalations</label>
                {formData.escalations.map((escalation, index) => (
                  <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                    <input
                      type="date"
                      value={escalation.date}
                      onChange={(e) => {
                        const newEscalations = [...formData.escalations];
                        newEscalations[index].date = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          escalations: newEscalations
                        }));
                      }}
                      className="p-2 border rounded"
                    />
                    <input
                      type="number"
                      value={escalation.amount}
                      onChange={(e) => {
                        const newEscalations = [...formData.escalations];
                        newEscalations[index].amount = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          escalations: newEscalations
                        }));
                      }}
                      className="p-2 border rounded"
                      placeholder="Amount"
                    />
                    <select
                      value={escalation.type}
                      onChange={(e) => {
                        const newEscalations = [...formData.escalations];
                        newEscalations[index].type = e.target.value;
                        setFormData(prev => ({
                          ...prev,
                          escalations: newEscalations
                        }));
                      }}
                      className="p-2 border rounded"
                    >
                      <option value="fixed">Fixed Amount</option>
                      <option value="percentage">Percentage</option>
                    </select>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={handleAddEscalation}
                  className="text-blue-500 hover:text-blue-600 text-sm"
                >
                  + Add Escalation
                </button>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setFormData(initialTenantState);
                    setEditingTenant(null);
                    setIsAddingNew(false);
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  <Save className="h-4 w-4" />
                  Save
                </button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Tenant</th>
                <th className="text-left p-2">SF</th>
                <th className="text-left p-2">Lease Start</th>
                <th className="text-left p-2">Lease End</th>
                <th className="text-right p-2">Base Rent</th>
                <th className="text-right p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tenants.map((tenant, index) => (
                <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="p-2">{tenant.name}</td>
                  <td className="p-2">{tenant.squareFeet}</td>
                  <td className="p-2">{new Date(tenant.leaseStart).toLocaleDateString()}</td>
                  <td className="p-2">{new Date(tenant.leaseEnd).toLocaleDateString()}</td>
                  <td className="p-2 text-right">${parseFloat(tenant.baseRent).toLocaleString()}</td>
                  <td className="p-2 text-right">
                    <button
                      onClick={() => handleEdit(index)}
                      className="text-blue-500 hover:text-blue-600 mr-2"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(index)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

export default TenantManagement;
