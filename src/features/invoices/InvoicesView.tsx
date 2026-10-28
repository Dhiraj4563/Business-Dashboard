import React, { useState } from 'react';
import { FileText, Search, Printer, DollarSign, Download, CheckCircle2, Clock, X } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Invoice } from '../../types/erp';

export const InvoicesView: React.FC = () => {
  const { invoices, formatMoney, setViewingInvoice, recordInvoicePayment } = useERP();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.customerName.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalInvoiced = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalPaid = invoices.reduce((sum, i) => sum + i.paidAmount, 0);
  const totalDue = invoices.reduce((sum, i) => sum + i.dueAmount, 0);

  const handleRecordPayment = () => {
    if (!payingInvoice || paymentAmount <= 0) return;
    recordInvoicePayment(payingInvoice.id, paymentAmount);
    setPayingInvoice(null);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Invoice Center</h1>
          <p className="text-xs text-slate-400 mt-0.5">Commercial tax invoices, PAN/VAT compliance, printable copies, and payment collections</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Invoiced Amount</span>
          <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">{formatMoney(totalInvoiced)}</span>
          <span className="text-[10px] text-slate-400 mt-1 block">{invoices.length} tax invoices generated</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Payments Realized</span>
          <span className="text-2xl font-bold font-mono text-emerald-600 mt-1 block">{formatMoney(totalPaid)}</span>
          <span className="text-[10px] text-slate-400 mt-1 block">Cleared invoices & partial receipts</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Remaining Receivables</span>
          <span className="text-2xl font-bold font-mono text-rose-600 mt-1 block">{formatMoney(totalDue)}</span>
          <span className="text-[10px] text-slate-400 mt-1 block">Awaiting customer clearance</span>
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
              placeholder="Search by invoice # or customer..."
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
              <option value="All">All Invoices</option>
              <option value="Paid">Fully Paid</option>
              <option value="Partial">Partial Due</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold border-b border-slate-100 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-5">Invoice #</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Issue Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Tax Total</th>
                <th className="py-3 px-4 text-right">Invoice Amount</th>
                <th className="py-3 px-4 text-right">Balance Due</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredInvoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5 font-mono font-bold text-slate-900">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {inv.customerName}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                    {inv.issueDate}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                    {inv.dueDate}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-slate-500">
                    {formatMoney(inv.taxAmount)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                    {formatMoney(inv.totalAmount)}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono">
                    {inv.dueAmount > 0 ? (
                      <span className="font-bold text-rose-600">{formatMoney(inv.dueAmount)}</span>
                    ) : (
                      <span className="text-emerald-600 font-medium">Cleared</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      inv.status === 'Paid'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setViewingInvoice(inv)}
                        className="px-2.5 py-1 text-[11px] font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg flex items-center gap-1 transition-colors"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Print</span>
                      </button>

                      {inv.dueAmount > 0 && (
                        <button
                          onClick={() => {
                            setPayingInvoice(inv);
                            setPaymentAmount(inv.dueAmount);
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg flex items-center gap-1 transition-colors"
                        >
                          <DollarSign className="w-3 h-3" />
                          <span>Pay</span>
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

      {/* Record Payment Modal */}
      {payingInvoice && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-slate-400">{payingInvoice.invoiceNumber}</span>
                <h3 className="font-bold text-slate-900 text-base">Record Payment</h3>
              </div>
              <button onClick={() => setPayingInvoice(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Billed Customer:</span>
                <span className="font-bold text-slate-900">{payingInvoice.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Due:</span>
                <span className="font-mono font-bold text-rose-600">{formatMoney(payingInvoice.dueAmount)}</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Payment Received</label>
              <input
                type="number"
                min="1"
                max={payingInvoice.dueAmount}
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(Number(e.target.value))}
                className="w-full text-sm font-mono p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setPayingInvoice(null)}
                className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleRecordPayment}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                Save Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
