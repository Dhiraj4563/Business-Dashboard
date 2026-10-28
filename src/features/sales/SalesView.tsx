import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Plus, 
  FileText, 
  Printer, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  X,
  CreditCard
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Sale } from '../../types/erp';

export const SalesView: React.FC = () => {
  const { 
    sales, 
    formatMoney, 
    setIsNewOrderModalOpen, 
    setViewingInvoice, 
    invoices, 
    recordInvoicePayment 
  } = useERP();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [collectPaymentSale, setCollectPaymentSale] = useState<Sale | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const filteredSales = sales.filter(s => {
    const matchesSearch = 
      s.orderNumber.toLowerCase().includes(search.toLowerCase()) || 
      s.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || s.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalRevenue = sales.reduce((sum, s) => sum + s.grandTotal, 0);
  const totalCollected = sales.reduce((sum, s) => sum + s.paidAmount, 0);
  const totalReceivables = sales.reduce((sum, s) => sum + s.balanceDue, 0);

  const handleCollectRemaining = () => {
    if (!collectPaymentSale || paymentAmount <= 0) return;
    const inv = invoices.find(i => i.saleId === collectPaymentSale.id);
    if (inv) {
      recordInvoicePayment(inv.id, paymentAmount);
    }
    setCollectPaymentSale(null);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Sales Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">Track point-of-sale orders, wholesale shipments, payments, and invoices</p>
        </div>

        <button
          onClick={() => setIsNewOrderModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Quick Sale</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Billed Revenue</span>
          <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">{formatMoney(totalRevenue)}</span>
          <span className="text-[10px] text-slate-400 mt-1 block">{sales.length} orders recorded</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Cash & Digital Collected</span>
          <span className="text-2xl font-bold font-mono text-emerald-600 mt-1 block">{formatMoney(totalCollected)}</span>
          <span className="text-[10px] text-slate-400 mt-1 block">Settled in bank / register</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Outstanding Receivables</span>
          <span className="text-2xl font-bold font-mono text-rose-600 mt-1 block">{formatMoney(totalReceivables)}</span>
          <span className="text-[10px] text-slate-400 mt-1 block">Due from credit accounts</span>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by order # or customer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs p-1.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Paid">Fully Paid</option>
              <option value="Partially Paid">Partially Paid</option>
              <option value="Confirmed">Confirmed / Unpaid</option>
            </select>
          </div>
        </div>

        {/* Sales Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold border-b border-slate-100 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-5">Order #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Time</th>
                <th className="py-3 px-4">Payment Method</th>
                <th className="py-3 px-4 text-right">Grand Total</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSales.map(sale => (
                <tr key={sale.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-5 font-mono font-bold text-slate-900">
                    {sale.orderNumber}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    <div>{sale.customerName}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{sale.items.length} line items</div>
                  </td>
                  <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                    {sale.createdAt}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    {formatMoney(sale.grandTotal)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono">
                    {sale.balanceDue > 0 ? (
                      <span className="font-bold text-rose-600">{formatMoney(sale.balanceDue)}</span>
                    ) : (
                      <span className="text-slate-400">रू 0</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      sale.status === 'Paid'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : sale.status === 'Partially Paid'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="py-3 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          const inv = invoices.find(i => i.saleId === sale.id);
                          if (inv) setViewingInvoice(inv);
                        }}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <FileText className="w-3 h-3" />
                        <span>Invoice</span>
                      </button>

                      {sale.balanceDue > 0 && (
                        <button
                          onClick={() => {
                            setCollectPaymentSale(sale);
                            setPaymentAmount(sale.balanceDue);
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <DollarSign className="w-3 h-3" />
                          <span>Collect</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Collect Balance Modal */}
      {collectPaymentSale && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-slate-400">{collectPaymentSale.orderNumber}</span>
                <h3 className="font-bold text-slate-900 text-base">Collect Due Payment</h3>
              </div>
              <button onClick={() => setCollectPaymentSale(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Customer:</span>
                <span className="font-bold text-slate-900">{collectPaymentSale.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Remaining Balance:</span>
                <span className="font-mono font-bold text-rose-600">{formatMoney(collectPaymentSale.balanceDue)}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Collection Amount</label>
              <input
                type="number"
                min="1"
                max={collectPaymentSale.balanceDue}
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className="w-full text-sm font-mono p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setCollectPaymentSale(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleCollectRemaining}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                Record Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
