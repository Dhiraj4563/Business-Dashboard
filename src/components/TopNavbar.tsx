import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Bell, 
  Store, 
  ChevronDown, 
  Check, 
  Sparkles,
  HelpCircle,
  AlertTriangle,
  RotateCcw,
  LogOut,
  Menu
} from 'lucide-react';
import { useERP } from '../context/ERPContext';

export const TopNavbar: React.FC = () => {
  const { 
    currentBranch, 
    setCurrentBranch, 
    branches, 
    setIsNewOrderModalOpen, 
    setIsCommandPaletteOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    currency,
    setCurrency,
    resetDemoData,
    logout,
    isMobileMenuOpen,
    setIsMobileMenuOpen
  } = useERP();

  const [isBranchDropdownOpen, setIsBranchDropdownOpen] = useState(false);
  const [isNotifDropdownOpen, setIsNotifDropdownOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const branchRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadNotifs = notifications.filter(n => !n.isRead);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (branchRef.current && !branchRef.current.contains(e.target as Node)) {
        setIsBranchDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="h-16 sm:h-18 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-2 sm:gap-4 sticky top-0 z-30">
      {/* Left zone: Hamburger menu for tablet/mobile + Branch selector */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors shrink-0"
          title="Open menu"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Branch Selector */}
        <div className="relative" ref={branchRef}>
          <button
            onClick={() => setIsBranchDropdownOpen(!isBranchDropdownOpen)}
            className="flex items-center gap-2 sm:gap-3 p-1.5 pr-2.5 sm:pr-3 rounded-xl border border-slate-200/90 hover:border-blue-400/80 hover:bg-slate-50/50 transition-all text-left bg-white shadow-2xs group"
          >
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
              <Store className="w-4 h-4 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-slate-800 tracking-tight truncate max-w-[100px] sm:max-w-none">
                  {currentBranch.name}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-600 transition-transform shrink-0" />
              </div>
              <span className="hidden sm:inline-block text-[10px] font-mono text-slate-400 tracking-wider">
                {currentBranch.code}
              </span>
            </div>
          </button>

          {/* Branch Switcher Dropdown */}
          {isBranchDropdownOpen && (
            <div className="absolute left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
              <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Select Business Branch
              </div>
              {branches.map(branch => (
                <button
                  key={branch.id}
                  onClick={() => {
                    setCurrentBranch(branch);
                    setIsBranchDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between p-2 rounded-lg text-left transition-colors text-xs ${
                    currentBranch.id === branch.id
                      ? 'bg-blue-50 text-blue-700 font-semibold'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div>
                    <div className="font-medium">{branch.name}</div>
                    <div className="text-[10px] text-slate-400">{branch.code} · {branch.address}</div>
                  </div>
                  {currentBranch.id === branch.id && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center: Global Search (adapts between compact and full) */}
      <div className="flex-1 max-w-xl mx-1 sm:mx-2">
        {/* Full input on sm and up */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full h-9 sm:h-10 px-3 sm:px-3.5 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-white hover:border-blue-400 transition-all flex items-center justify-between text-slate-400 text-xs shadow-2xs group"
        >
          <div className="flex items-center gap-2 sm:gap-2.5 truncate">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors shrink-0" />
            <span className="font-normal text-slate-500 truncate text-[11px] sm:text-xs">
              Search orders, customers, items...
            </span>
          </div>
          <kbd className="hidden md:inline-flex items-center gap-0.5 px-2 py-0.5 text-[10px] font-mono bg-white text-slate-500 border border-slate-200 rounded-md shadow-xs shrink-0">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Currency Switcher */}
        <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200/80">
          <button
            onClick={() => setCurrency('NPR')}
            className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
              currency === 'NPR'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Nepalese Rupee (Nepal VAT 13%)"
          >
            NPR (रू)
          </button>
          <button
            onClick={() => setCurrency('INR')}
            className={`px-2 py-1 text-xs font-semibold rounded-md transition-all ${
              currency === 'INR'
                ? 'bg-white text-blue-600 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
            title="Indian Rupee (India GST 18%)"
          >
            INR (₹)
          </button>
        </div>

        {/* Demo Data Reset Trigger */}
        <button
          onClick={() => setIsResetConfirmOpen(true)}
          title="Reset Demo Sample Data"
          className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors border border-transparent hover:border-amber-200"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        {/* Notifications Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifDropdownOpen(!isNotifDropdownOpen)}
            className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors border border-slate-200/80 shadow-2xs"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {isNotifDropdownOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 p-3 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">Notifications</span>
                  {unreadNotifs.length > 0 && (
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {unreadNotifs.length} new
                    </span>
                  )}
                </div>
                {unreadNotifs.length > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] font-medium text-blue-600 hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">No notifications</div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`p-2.5 rounded-xl transition-all cursor-pointer text-xs ${
                        !n.isRead ? 'bg-blue-50/60 border border-blue-100' : 'bg-slate-50/50 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-semibold text-slate-800">{n.title}</span>
                        <span className="text-[10px] text-slate-400 shrink-0 font-mono">{n.timestamp}</span>
                      </div>
                      <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">{n.description}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Lock / Sign Out button */}
        <button
          onClick={logout}
          title="Lock Session / Sign Out"
          className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors border border-slate-200/80 shadow-2xs"
        >
          <LogOut className="w-4 h-4" />
        </button>

        {/* Primary "+ New Order" Button matching reference image */}
        <button
          onClick={() => setIsNewOrderModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs py-2 px-4 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-blue-500/30 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Order</span>
        </button>
      </div>

      {/* Demo Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Reset Demo Data?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              This will restore all products, orders, stock movements, and invoices back to the initial demo state.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setIsResetConfirmOpen(false);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition-colors"
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
