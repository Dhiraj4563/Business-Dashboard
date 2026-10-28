import React, { useState } from 'react';
import { Truck, Plus, Search, Phone, Mail, Building2, X } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const SuppliersView: React.FC = () => {
  const { suppliers, formatMoney, addSupplier } = useERP();
  const [search, setSearch] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newSup, setNewSup] = useState({
    name: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
    panOrGstin: '',
    paymentTerms: 'Net 30 Days',
  });

  const filteredSuppliers = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.contactPerson.toLowerCase().includes(search.toLowerCase()) ||
    s.phone.includes(search)
  );

  const totalPayables = suppliers.reduce((sum, s) => sum + s.outstandingPayable, 0);

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSup.name || !newSup.phone) return;
    addSupplier(newSup);
    setIsAddModalOpen(false);
    setNewSup({
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      panOrGstin: '',
      paymentTerms: 'Net 30 Days',
    });
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Suppliers Directory</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage vendors, wholesale manufacturers, payment terms, and accounts payable</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto min-h-[40px]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Supplier</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Active Vendors</span>
          <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">{suppliers.length}</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Accounts Payable</span>
          <span className="text-2xl font-bold font-mono text-amber-600 mt-1 block">{formatMoney(totalPayables)}</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Credit Terms Standard</span>
          <span className="text-xs text-slate-600 mt-1 block">Most vendors offer 15-30 days credit with verified PAN/GST credentials</span>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by supplier name or contact person..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-slate-50 text-slate-400 font-bold border-b border-slate-100 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-5">Supplier / Company</th>
                <th className="py-3 px-4">Contact Person</th>
                <th className="py-3 px-4">Phone & Email</th>
                <th className="py-3 px-4">Payment Terms</th>
                <th className="py-3 px-4">PAN / Tax ID</th>
                <th className="py-3 px-5 text-right">Outstanding Payable</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredSuppliers.map(s => (
                <tr key={s.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-slate-900">
                    <div>{s.name}</div>
                    <div className="text-[10px] text-slate-400 font-normal">{s.address}</div>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {s.contactPerson}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    <div className="text-slate-800">{s.phone}</div>
                    <div className="text-[10px] text-slate-400 font-sans">{s.email}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 text-slate-700">
                      {s.paymentTerms}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono text-[11px] text-slate-500">
                    {s.panOrGstin}
                  </td>
                  <td className="py-3.5 px-5 text-right font-mono">
                    {s.outstandingPayable > 0 ? (
                      <span className="font-bold text-amber-600">{formatMoney(s.outstandingPayable)}</span>
                    ) : (
                      <span className="text-emerald-600 font-medium">Clear (रू 0)</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Supplier Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Add New Supplier</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSupplier} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Company / Supplier Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Industrial Supplies"
                  value={newSup.name}
                  onChange={(e) => setNewSup({ ...newSup, name: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Contact Person</label>
                <input
                  type="text"
                  placeholder="e.g. Rajesh Maharjan"
                  value={newSup.contactPerson}
                  onChange={(e) => setNewSup({ ...newSup, contactPerson: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +977 1-4200000"
                  value={newSup.phone}
                  onChange={(e) => setNewSup({ ...newSup, phone: e.target.value })}
                  className="w-full p-2 font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="e.g. info@acme.np"
                  value={newSup.email}
                  onChange={(e) => setNewSup({ ...newSup, email: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Payment Terms</label>
                <select
                  value={newSup.paymentTerms}
                  onChange={(e) => setNewSup({ ...newSup, paymentTerms: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Cash on Delivery">Cash on Delivery</option>
                  <option value="Net 15 Days">Net 15 Days</option>
                  <option value="Net 30 Days">Net 30 Days</option>
                  <option value="Net 45 Days">Net 45 Days</option>
                  <option value="50% Advance, Net 30">50% Advance, Net 30</option>
                </select>
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
                  Save Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
