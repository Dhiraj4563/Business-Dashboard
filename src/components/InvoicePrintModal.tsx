import React from 'react';
import { X, Printer, Download, Store, CheckCircle, Clock } from 'lucide-react';
import { useERP } from '../context/ERPContext';

export const InvoicePrintModal: React.FC = () => {
  const { viewingInvoice, setViewingInvoice, business, formatMoney } = useERP();

  if (!viewingInvoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto no-print">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-8">
        {/* Modal Toolbar (hidden on print) */}
        <div className="px-6 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">
              Tax Invoice {viewingInvoice.invoiceNumber}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                viewingInvoice.status === 'Paid'
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {viewingInvoice.status.toUpperCase()}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={() => setViewingInvoice(null)}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Commercial Printable Tax Invoice Body */}
        <div className="p-8 space-y-6 text-slate-800 bg-white" id="printable-invoice">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-6">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                  <Store className="w-4 h-4" />
                </div>
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
                  {business.legalName}
                </h1>
              </div>
              <p className="text-xs text-slate-500 mt-1">{business.address}, {business.city}, {business.country}</p>
              <p className="text-xs font-mono font-medium text-slate-600 mt-0.5">
                {business.panVatNumber} · Phone: {business.phone}
              </p>
            </div>

            <div className="text-right">
              <span className="text-xs uppercase tracking-widest font-bold text-blue-600 block">
                TAX INVOICE
              </span>
              <span className="text-base font-mono font-bold text-slate-900 mt-0.5 block">
                {viewingInvoice.invoiceNumber}
              </span>
              <span className="text-xs text-slate-400 font-mono block mt-1">
                Date: {viewingInvoice.issueDate}
              </span>
            </div>
          </div>

          {/* Bill To */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Billed To
              </span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                {viewingInvoice.customerName}
              </span>
              <span className="text-slate-500 mt-0.5 block">Customer ID: {viewingInvoice.customerId}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Invoice Details
              </span>
              <span className="text-slate-600 mt-0.5 block">Payment Status: <strong>{viewingInvoice.status}</strong></span>
              <span className="text-slate-600 mt-0.5 block font-mono">Due Date: {viewingInvoice.dueDate}</span>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Item Description</th>
                  <th className="py-2.5 px-3">SKU</th>
                  <th className="py-2.5 px-3 text-right">Qty</th>
                  <th className="py-2.5 px-3 text-right">Rate</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {viewingInvoice.items.map((item, index) => (
                  <tr key={item.productId}>
                    <td className="py-2.5 px-3 text-slate-400 font-mono">{index + 1}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{item.productName}</td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-400">{item.sku}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-medium">{item.quantity}</td>
                    <td className="py-2.5 px-3 text-right font-mono">{formatMoney(item.unitPrice)}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold">{formatMoney(item.unitPrice * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary & Totals */}
          <div className="flex justify-end pt-2">
            <div className="w-64 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span className="font-mono">{formatMoney(viewingInvoice.subtotal)}</span>
              </div>
              {viewingInvoice.discount > 0 && (
                <div className="flex justify-between text-rose-600">
                  <span>Discount:</span>
                  <span className="font-mono">-{formatMoney(viewingInvoice.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-600">
                <span>VAT/Tax ({business.defaultTaxRate}%):</span>
                <span className="font-mono">{formatMoney(viewingInvoice.taxAmount)}</span>
              </div>
              <div className="flex justify-between text-base font-bold text-slate-900 pt-2 border-t border-slate-200">
                <span>Grand Total:</span>
                <span className="font-mono text-blue-600">{formatMoney(viewingInvoice.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Amount Paid:</span>
                <span className="font-mono font-semibold text-emerald-600">{formatMoney(viewingInvoice.paidAmount)}</span>
              </div>
              {viewingInvoice.dueAmount > 0 && (
                <div className="flex justify-between text-rose-600 font-bold">
                  <span>Balance Due:</span>
                  <span className="font-mono">{formatMoney(viewingInvoice.dueAmount)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer Terms */}
          <div className="pt-6 border-t border-slate-200 text-[10px] text-slate-400 text-center space-y-1">
            <p>Goods once sold can only be exchanged within 7 days in original condition with tax invoice.</p>
            <p className="font-medium">Thank you for your business! · Powered by {business.name}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
