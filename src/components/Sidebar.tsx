import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Boxes, 
  Users, 
  Truck, 
  FileText, 
  Receipt, 
  BarChart3, 
  Briefcase, 
  Bell, 
  Settings, 
  Code2,
  Store,
  LogOut,
  X,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';
import { useERP } from '../context/ERPContext';

export const Sidebar: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    notifications, 
    currentUser, 
    staff, 
    setCurrentUser, 
    business, 
    logout,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isSidebarCollapsed,
    setIsSidebarCollapsed
  } = useERP();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'sales', label: 'Sales', icon: ShoppingBag },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'purchases', label: 'Purchases', icon: Truck },
    { id: 'invoices', label: 'Invoices', icon: FileText },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'staff', label: 'Employees', icon: Briefcase },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: unreadCount > 0 ? unreadCount : undefined },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'backend', label: 'Backend Architecture', icon: Code2, highlight: true },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full justify-between select-none">
      {/* Brand Header */}
      <div>
        <div className={`p-4 flex items-center justify-between border-b border-slate-100 ${isSidebarCollapsed ? 'px-3 justify-center' : 'px-5'}`}>
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 shrink-0">
              <Store className="w-5 h-5 stroke-[2.2]" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-slate-900 tracking-tight text-base truncate">
                  {business.name || 'Business'}
                </span>
                <span className="text-[11px] font-mono font-medium text-slate-400">
                  v2.4.0 · ERP Lite
                </span>
              </div>
            )}
          </div>

          {/* Close button on mobile/tablet, Collapse toggle on desktop */}
          <div className="flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Close menu"
            >
              <X className="w-5 h-5" />
            </button>

            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className="hidden lg:flex p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isSidebarCollapsed ? <PanelLeft className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Main Navigation Items */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={isSidebarCollapsed ? item.label : undefined}
                className={`w-full flex items-center ${isSidebarCollapsed ? 'justify-center px-2 py-3' : 'justify-between px-3.5 py-2.5'} rounded-xl text-sm font-medium transition-all duration-150 group cursor-pointer ${
                  isActive
                    ? 'bg-blue-50/90 text-blue-600 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50/80'
                }`}
              >
                <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'gap-3'} truncate`}>
                  <Icon
                    className={`w-[18px] h-[18px] transition-colors shrink-0 ${
                      isActive ? 'text-blue-600 stroke-[2.2]' : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                  />
                  {!isSidebarCollapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                </div>

                {!isSidebarCollapsed && item.badge !== undefined && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-4 text-center">
                    {item.badge}
                  </span>
                )}

                {isSidebarCollapsed && item.badge !== undefined && (
                  <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500" />
                )}

                {!isSidebarCollapsed && item.highlight && !isActive && (
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono">
                    API
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Profile Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50">
        <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-between'} p-1.5 rounded-xl transition-all`}>
          {!isSidebarCollapsed ? (
            <>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0 ring-2 ring-slate-100">
                  {currentUser.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-slate-800 truncate">
                    {currentUser.name}
                  </span>
                  <span className="text-[11px] text-slate-400 truncate">
                    {currentUser.role}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <select
                  value={currentUser.id}
                  onChange={(e) => {
                    const selected = staff.find(s => s.id === e.target.value);
                    if (selected) setCurrentUser(selected);
                  }}
                  title="Switch User Role for Testing"
                  className="text-[10px] bg-white border border-slate-200 rounded-md py-1 px-1 text-slate-600 font-medium cursor-pointer hover:border-slate-300"
                >
                  {staff.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.role}
                    </option>
                  ))}
                </select>

                <button
                  onClick={logout}
                  title="Sign Out / Lock Dashboard"
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            </>
          ) : (
            <button
              onClick={logout}
              title="Sign Out"
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Tablet & Mobile Slide-over Drawer with Backdrop */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-2xs z-40 lg:hidden transition-opacity" 
        />
      )}

      {/* Off-canvas Drawer for screens < lg */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl border-r border-slate-200 lg:hidden transform transition-transform duration-200 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Desktop & Large Tablet Landscape Fixed Sidebar */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 bg-white border-r border-slate-200/80 transition-all duration-200 ${
          isSidebarCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
