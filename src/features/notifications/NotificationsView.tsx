import React, { useState } from 'react';
import { Bell, CheckCheck, Boxes, ShoppingCart, DollarSign, Info, AlertTriangle } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const NotificationsView: React.FC = () => {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useERP();
  const [filter, setFilter] = useState<'all' | 'inventory' | 'sales' | 'finance'>('all');

  const filteredNotifs = notifications.filter(n => filter === 'all' || n.type === filter);

  const getIcon = (type: string, severity: string) => {
    switch (type) {
      case 'inventory':
        return <Boxes className="w-4 h-4 text-amber-600" />;
      case 'sales':
        return <ShoppingCart className="w-4 h-4 text-emerald-600" />;
      case 'finance':
        return <DollarSign className="w-4 h-4 text-blue-600" />;
      default:
        return <Info className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Notifications Center</h1>
          <p className="text-xs text-slate-400 mt-0.5">Automated inventory threshold alerts, overdue invoices, and sales events</p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="px-3.5 py-2.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors self-start sm:self-auto min-h-[40px]"
        >
          <CheckCheck className="w-4 h-4 text-blue-600" />
          <span>Mark All as Read</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        {(['all', 'inventory', 'sales', 'finance'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`pb-3 px-3 text-xs font-bold capitalize transition-all ${
              filter === tab
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {tab} Alerts
          </button>
        ))}
      </div>

      {/* Notification Stream */}
      <div className="space-y-3">
        {filteredNotifs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400 bg-white rounded-2xl border border-slate-200">
            No notifications found in this category.
          </div>
        ) : (
          filteredNotifs.map(n => (
            <div
              key={n.id}
              onClick={() => markNotificationRead(n.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                !n.isRead
                  ? 'bg-blue-50/40 border-blue-200 shadow-2xs'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-xs">
                {getIcon(n.type, n.severity)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-900 text-xs">{n.title}</span>
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">{n.timestamp}</span>
                </div>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.description}</p>
              </div>

              {!n.isRead && (
                <span className="w-2 h-2 rounded-full bg-blue-600 mt-2 shrink-0" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
