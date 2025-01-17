import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Bell, Calendar, DollarSign, Wrench, FileText, Clock } from 'lucide-react';

const NotificationSystem = () => {
  const [notifications, setNotifications] = useState([]);
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('notificationSettings');
    return savedSettings ? JSON.parse(savedSettings) : {
      leaseExpirations: true,
      rentIncreases: true,
      maintenance: true,
      payments: true,
      documents: true,
      advanceNotice: 30 // days
    };
  });

  useEffect(() => {
    checkForNotifications();
    // Check every hour for new notifications
    const interval = setInterval(checkForNotifications, 3600000);
    return () => clearInterval(interval);
  }, []);

  const checkForNotifications = () => {
    const newNotifications = [];
    const today = new Date();
    const advanceDate = new Date(today.setDate(today.getDate() + settings.advanceNotice));

    // Check lease expirations
    if (settings.leaseExpirations) {
      const tenants = JSON.parse(localStorage.getItem('tenants') || '[]');
      tenants.forEach(tenant => {
        const leaseEnd = new Date(tenant.leaseEnd);
        if (leaseEnd <= advanceDate) {
          newNotifications.push({
            id: Date.now() + Math.random(),
            type: 'lease',
            priority: leaseEnd <= today ? 'high' : 'medium',
            title: `Lease Expiring: ${tenant.name}`,
            message: `Lease expires on ${leaseEnd.toLocaleDateString()}`,
            date: leaseEnd,
            icon: Calendar
          });
        }
      });
    }

    // Check rent increases
    if (settings.rentIncreases) {
      const tenants = JSON.parse(localStorage.getItem('tenants') || '[]');
      tenants.forEach(tenant => {
        if (tenant.escalations) {
          tenant.escalations.forEach(escalation => {
            const escalationDate = new Date(escalation.date);
            if (escalationDate <= advanceDate) {
              newNotifications.push({
                id: Date.now() + Math.random(),
                type: 'rent',
                priority: 'medium',
                title: `Rent Increase: ${tenant.name}`,
                message: `Rent increase of ${escalation.type === 'percentage' ? escalation.amount + '%' : '$' + escalation.amount} due on ${escalationDate.toLocaleDateString()}`,
                date: escalationDate,
                icon: DollarSign
              });
            }
          });
        }
      });
    }

    // Check maintenance schedules
    if (settings.maintenance) {
      const units = JSON.parse(localStorage.getItem('units') || '[]');
      units.forEach(unit => {
        if (unit.maintenanceSchedule) {
          unit.maintenanceSchedule.forEach(maintenance => {
            const dueDate = new Date(maintenance.dueDate);
            if (dueDate <= advanceDate) {
              newNotifications.push({
                id: Date.now() + Math.random(),
                type: 'maintenance',
                priority: dueDate <= today ? 'high' : 'medium',
                title: `Maintenance Due: Unit ${unit.number}`,
                message: `${maintenance.type} maintenance due on ${dueDate.toLocaleDateString()}`,
                date: dueDate,
                icon: Wrench
              });
            }
          });
        }
      });
    }

    // Check payment reminders
    if (settings.payments) {
      const tenants = JSON.parse(localStorage.getItem('tenants') || '[]');
      tenants.forEach(tenant => {
        const nextPaymentDate = new Date(tenant.nextPaymentDate);
        if (nextPaymentDate <= advanceDate) {
          newNotifications.push({
            id: Date.now() + Math.random(),
            type: 'payment',
            priority: nextPaymentDate <= today ? 'high' : 'low',
            title: `Payment Due: ${tenant.name}`,
            message: `Rent payment of $${tenant.baseRent} due on ${nextPaymentDate.toLocaleDateString()}`,
            date: nextPaymentDate,
            icon: DollarSign
          });
        }
      });
    }

    // Check document expirations
    if (settings.documents) {
      const documents = JSON.parse(localStorage.getItem('documents') || '[]');
      documents.forEach(doc => {
        if (doc.expirationDate) {
          const expiration = new Date(doc.expirationDate);
          if (expiration <= advanceDate) {
            newNotifications.push({
              id: Date.now() + Math.random(),
              type: 'document',
              priority: expiration <= today ? 'high' : 'low',
              title: `Document Expiring: ${doc.name}`,
              message: `Document expires on ${expiration.toLocaleDateString()}`,
              date: expiration,
              icon: FileText
            });
          }
        }
      });
    }

    setNotifications(newNotifications.sort((a, b) => a.date - b.date));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Notifications</span>
            <button
              onClick={checkForNotifications}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <Clock className="h-5 w-5" />
            </button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Settings */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
              {Object.entries(settings).map(([key, value]) => (
                key !== 'advanceNotice' && (
                  <button
                    key={key}
                    onClick={() => setSettings(prev => ({
                      ...prev,
                      [key]: !prev[key]
                    }))}
                    className={`p-2 rounded ${value ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </button>
                )
              ))}
            </div>

            {/* Advance Notice Setting */}
            <div className="flex items-center gap-2">
              <span className="text-sm">Advance Notice:</span>
              <select
                value={settings.advanceNotice}
                onChange={(e) => setSettings(prev => ({
                  ...prev,
                  advanceNotice: parseInt(e.target.value)
                }))}
                className="p-1 border rounded"
              >
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
                <option value={60}>60 days</option>
                <option value={90}>90 days</option>
              </select>
            </div>

            {/* Notifications List */}
            <div className="space-y-2">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 rounded flex items-start gap-4 ${getPriorityColor(notification.priority)}`}
                >
                  <notification.icon className="h-5 w-5 mt-1" />
                  <div>
                    <h3 className="font-medium">{notification.title}</h3>
                    <p className="text-sm">{notification.message}</p>
                    <p className="text-xs mt-1">
                      Due: {new Date(notification.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
              {notifications.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No notifications found
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationSystem;
