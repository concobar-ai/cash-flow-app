import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DollarSign, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

const PaymentTracker = () => {
  const [payments, setPayments] = useState(() => {
    const savedPayments = localStorage.getItem('payments');
    return savedPayments ? JSON.parse(savedPayments) : [];
  });

  const [tenants, setTenants] = useState(() => {
    const savedTenants = localStorage.getItem('tenants');
    return savedTenants ? JSON.parse(savedTenants) : [];
  });

  const [newPayment, setNewPayment] = useState({
    tenantId: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    type: 'base_rent',
    status: 'received',
    memo: ''
  });

  useEffect(() => {
    localStorage.setItem('payments', JSON.stringify(payments));
  }, [payments]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payment = {
      ...newPayment,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };

    setPayments(prev => [...prev, payment]);
    setNewPayment({
      tenantId: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      type: 'base_rent',
      status: 'received',
      memo: ''
    });
  };

  const calculateBalance = (tenantId) => {
    const tenant = tenants.find(t => t.id === tenantId);
    if (!tenant) return 0;

    const tenantPayments = payments
      .filter(p => p.tenantId === tenantId)
      .reduce((sum, payment) => sum + parseFloat(payment.amount), 0);

    return tenant.baseRent - tenantPayments;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Record Payment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Tenant</label>
                <select
                  value={newPayment.tenantId}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, tenantId: e.target.value }))}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Tenant</option>
                  {tenants.map(tenant => (
                    <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Amount</label>
                <input
                  type="number"
                  value={newPayment.amount}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, amount: e.target.value }))}
                  className="w-full p-2 border rounded"
                  required
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={newPayment.date}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, date: e.target.value }))}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={newPayment.type}
                  onChange={(e) => setNewPayment(prev => ({ ...prev, type: e.target.value }))}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="base_rent">Base Rent</option>
                  <option value="additional_rent">Additional Rent</option>
                  <option value="security_deposit">Security Deposit</option>
                  <option value="signage">Signage</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Memo</label>
              <textarea
                value={newPayment.memo}
                onChange={(e) => setNewPayment(prev => ({ ...prev, memo: e.target.value }))}
                className="w-full p-2 border rounded"
                rows={2}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Record Payment
              </button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {payments
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 10)
              .map(payment => {
                const tenant = tenants.find(t => t.id === payment.tenantId);
                return (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between p-4 border rounded"
                  >
                    <div>
                      <h3 className="font-medium">{tenant?.name || 'Unknown Tenant'}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(payment.date).toLocaleDateString()} • {payment.type.replace('_', ' ')}
                      </p>
                      {payment.memo && (
                        <p className="text-sm text-gray-500 mt-1">{payment.memo}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${parseFloat(payment.amount).toLocaleString()}</p>
                      <p className="text-sm text-gray-500">
                        Balance: ${calculateBalance(payment.tenantId).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentTracker;
