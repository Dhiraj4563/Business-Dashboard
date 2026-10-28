import React from 'react';
import { ERPProvider, useERP } from './context/ERPContext';
import { Sidebar } from './components/Sidebar';
import { TopNavbar } from './components/TopNavbar';
import { DashboardView } from './features/dashboard/DashboardView';
import { InventoryView } from './features/inventory/InventoryView';
import { SalesView } from './features/sales/SalesView';
import { PurchasesView } from './features/purchases/PurchasesView';
import { CustomersView } from './features/customers/CustomersView';
import { SuppliersView } from './features/suppliers/SuppliersView';
import { InvoicesView } from './features/invoices/InvoicesView';
import { ExpensesView } from './features/expenses/ExpensesView';
import { ReportsView } from './features/reports/ReportsView';
import { StaffView } from './features/staff/StaffView';
import { NotificationsView } from './features/notifications/NotificationsView';
import { SettingsView } from './features/settings/SettingsView';
import { BackendDocsView } from './features/backend_docs/BackendDocsView';
import { LoginView } from './features/auth/LoginView';
import { NewOrderModal } from './components/NewOrderModal';
import { InvoicePrintModal } from './components/InvoicePrintModal';
import { CommandPalette } from './components/CommandPalette';

const MainLayout: React.FC = () => {
  const { activeTab, isAuthenticated } = useERP();

  if (!isAuthenticated) {
    return <LoginView />;
  }

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'sales':
        return <SalesView />;
      case 'inventory':
        return <InventoryView />;
      case 'customers':
        return <CustomersView />;
      case 'purchases':
        return <PurchasesView />;
      case 'invoices':
        return <InvoicesView />;
      case 'expenses':
        return <ExpensesView />;
      case 'reports':
        return <ReportsView />;
      case 'staff':
        return <StaffView />;
      case 'notifications':
        return <NotificationsView />;
      case 'settings':
        return <SettingsView />;
      case 'backend':
        return <BackendDocsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F4F6FA] text-slate-900 font-sans antialiased">
      {/* Fixed Left Sidebar matching reference image */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <TopNavbar />

        {/* Viewport Content */}
        <main className="flex-1 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Interactive Modals */}
      <NewOrderModal />
      <InvoicePrintModal />
      <CommandPalette />
    </div>
  );
};

export default function App() {
  return (
    <ERPProvider>
      <MainLayout />
    </ERPProvider>
  );
}
