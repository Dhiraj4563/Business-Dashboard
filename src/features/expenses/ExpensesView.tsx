import React, { useState } from 'react';
import { Receipt, Plus, Search, CheckCircle, Clock, X, DollarSign } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Expense } from '../../types/erp';

export const ExpensesView: React.FC = () => {
  const { expenses, formatMoney, addExpense } = useERP();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newExp, setNewExp] = useState({
    title: '',
    category: 'Rent' as Expense['category'],
    amount: 15000,
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'Bank Transfer' as Expense['paymentMethod'],
    vendor: '',
    referenceNumber: '',
    notes: '',
  });

  const categories = ['All', 'Rent', 'Salaries', 'Electricity', 'Transport', 'Marketing', 'Office Supplies', 'Miscellaneous'];

  const filteredExpenses = expenses.filter(e => {
    const matchesSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.vendor.toLowerCase().includes(search.toLowerCase()) ||
      e.referenceNumber.toLowerCase().includes(search.toLowerCase());
    const matchesCat = categoryFilter === 'All' || e.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  const totalExpenseVal = expenses.reduce((sum, e) => sum + e.amount, 0);

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExp.title || newExp.amount <= 0) return;
    addExpense(newExp);
    setIsAddModalOpen(false);
    setNewExp({
      title: '',
      category: 'Rent',
      amount: 15000,
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'Bank Transfer',
      vendor: '',
      referenceNumber: '',
      notes: '',
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Expense Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">Track overheads, rent, payroll, utilities, marketing, and logistics</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto min-h-[40px]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Operating Expenses</span>
          <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">{formatMoney(totalExpenseVal)}</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Approval Enforcement</span>
          <span className="text-xs text-slate-600 mt-1 block">Every recorded payment is audited with reference vouchers and receipts</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Major Cost Driver</span>
          <span className="text-sm font-bold text-slate-900 mt-1 block">Salaries & Showroom Rent</span>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, vendor, or voucher #..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs p-1.5 px-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
            >
              {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead className="bg-slate-50 text-slate-400 font-bold border-b border-slate-100 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-5">Expense Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Vendor / Payee</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Method & Ref</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredExpenses.map(e => (
                <tr key={e.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-slate-900">
                    <div>{e.title}</div>
                    <div className="text-[10px] text-slate-400 font-normal">Recorded by {e.recordedBy}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                      {e.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {e.vendor}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                    {e.date}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    <div className="text-slate-800">{e.paymentMethod}</div>
                    <div className="text-[10px] text-slate-400">{e.referenceNumber}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                    {formatMoney(e.amount)}
                  </td>
                  <td className="py-3.5 px-5">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Record Operating Expense</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Expense Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Internet Broadband Fibre Bill"
                  value={newExp.title}
                  onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newExp.category}
                  onChange={(e) => setNewExp({ ...newExp, category: e.target.value as any })}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
                >
                  {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Amount *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={newExp.amount}
                  onChange={(e) => setNewExp({ ...newExp, amount: Number(e.target.value) })}
                  className="w-full p-2 font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Vendor / Payee</label>
                <input
                  type="text"
                  placeholder="e.g. WorldLink Communications"
                  value={newExp.vendor}
                  onChange={(e) => setNewExp({ ...newExp, vendor: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={newExp.paymentMethod}
                  onChange={(e) => setNewExp({ ...newExp, paymentMethod: e.target.value as any })}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Cash">Cash</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Digital Wallet">Digital Wallet (eSewa / Khalti / UPI)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Voucher / Reference #</label>
                <input
                  type="text"
                  placeholder="e.g. REF-2081-990"
                  value={newExp.referenceNumber}
                  onChange={(e) => setNewExp({ ...newExp, referenceNumber: e.target.value })}
                  className="w-full p-2 font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs"
                >
                  Record Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
