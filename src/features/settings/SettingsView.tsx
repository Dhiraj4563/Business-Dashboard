import React, { useState } from 'react';
import { Settings, Save, RotateCcw, Building, Globe, DollarSign, FileText, CheckCircle2 } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

export const SettingsView: React.FC = () => {
  const { business, updateBusiness, currency, setCurrency, resetDemoData, branches } = useERP();

  const [formData, setFormData] = useState({
    name: business.name,
    tagline: business.tagline,
    legalName: business.legalName,
    panVatNumber: business.panVatNumber,
    email: business.email,
    phone: business.phone,
    address: business.address,
    city: business.city,
    country: business.country,
    defaultTaxRate: business.defaultTaxRate,
    financialYear: business.financialYear,
    invoicePrefix: business.invoicePrefix,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [resetModal, setResetModal] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateBusiness(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Business Profile & System Settings</h1>
          <p className="text-xs text-slate-400 mt-0.5">Configure company credentials, currency localization (NPR/INR), tax rates, and branches</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setResetModal(true)}
            className="px-3.5 py-2.5 bg-white hover:bg-rose-50 border border-slate-200 text-rose-600 text-xs font-semibold rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer min-h-[40px]"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>
        </div>
      </div>

      {savedSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Business settings updated and saved to local state successfully!</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Company Profile Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Building className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Organization Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Product / Brand Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Brand Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Registered Legal Entity Name</label>
              <input
                type="text"
                value={formData.legalName}
                onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">PAN / VAT / GSTIN Number</label>
              <input
                type="text"
                value={formData.panVatNumber}
                onChange={(e) => setFormData({ ...formData, panVatNumber: e.target.value })}
                className="w-full p-2.5 font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-2.5 font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Commercial Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Currency & Tax Localization Card */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Globe className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Currency & Local Tax Rules</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Operating Country</label>
              <select
                value={formData.country}
                onChange={(e) => {
                  const country = e.target.value as 'Nepal' | 'India';
                  const isIndia = country === 'India';
                  setFormData({
                    ...formData,
                    country,
                    defaultTaxRate: isIndia ? 18 : 13,
                  });
                  setCurrency(isIndia ? 'INR' : 'NPR');
                }}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="Nepal">Nepal (NPR रू / 13% VAT)</option>
                <option value="India">India (INR ₹ / 18% GST)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">System Base Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="NPR">Nepalese Rupee (NPR - रू)</option>
                <option value="INR">Indian Rupee (INR - ₹)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Default Tax / VAT %</label>
              <input
                type="number"
                min="0"
                max="30"
                value={formData.defaultTaxRate}
                onChange={(e) => setFormData({ ...formData, defaultTaxRate: Number(e.target.value) })}
                className="w-full p-2.5 font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Current Fiscal / Financial Year</label>
              <input
                type="text"
                value={formData.financialYear}
                onChange={(e) => setFormData({ ...formData, financialYear: e.target.value })}
                className="w-full p-2.5 font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Tax Invoice Number Prefix</label>
              <input
                type="text"
                value={formData.invoicePrefix}
                onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value })}
                className="w-full p-2.5 font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Multi-Branch Management Strip */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
            <Building className="w-4 h-4 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">Configured Business Branches ({branches.length})</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {branches.map(b => (
              <div key={b.id} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{b.name}</span>
                  {b.isMain && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                      Headquarters
                    </span>
                  )}
                </div>
                <div className="text-[11px] font-mono text-slate-400">{b.code}</div>
                <div className="text-[11px] text-slate-500">{b.address}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings Changes</span>
          </button>
        </div>
      </form>

      {/* Reset Confirmation Modal */}
      {resetModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-900 text-base">Reset Demo Data?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              This action clears custom changes and restores the full 50+ product catalog, sample sales, suppliers, and ledger entries back to their default state.
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setResetModal(false)}
                className="px-3.5 py-1.5 bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetDemoData();
                  setResetModal(false);
                }}
                className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg"
              >
                Reset Everything
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
