import React, { useState } from 'react';
import { 
  Truck, 
  Plus, 
  Search, 
  PackageCheck, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  X,
  FileCheck
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { PurchaseOrder } from '../../types/erp';

export const PurchasesView: React.FC = () => {
  const { 
    purchaseOrders, 
    suppliers, 
    products, 
    formatMoney, 
    createPurchaseOrder, 
    receiveGoods 
  } = useERP();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(suppliers[0]?.id || 'sup-01');
  const [selectedProductId, setSelectedProductId] = useState(products[0]?.id || 'prod-01');
  const [orderQty, setOrderQty] = useState(25);
  const [expectedDate, setExpectedDate] = useState('2026-11-10');

  const totalPurchases = purchaseOrders.reduce((sum, p) => sum + p.grandTotal, 0);
  const pendingReceiptCount = purchaseOrders.filter(p => p.status !== 'Received').length;

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    const sup = suppliers.find(s => s.id === selectedSupplierId);
    const prod = products.find(p => p.id === selectedProductId);
    if (!sup || !prod) return;

    createPurchaseOrder({
      supplierId: sup.id,
      supplierName: sup.name,
      items: [
        {
          productId: prod.id,
          productName: prod.name,
          sku: prod.sku,
          quantityOrdered: orderQty,
          unitCost: prod.purchaseCost,
          totalCost: prod.purchaseCost * orderQty,
        },
      ],
      expectedDate,
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Purchase Management</h1>
          <p className="text-xs text-slate-400 mt-0.5">Procurement orders, supplier shipments, and goods receipt verification</p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>New Purchase Order</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Procurement Value</span>
          <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">{formatMoney(totalPurchases)}</span>
          <span className="text-[10px] text-slate-400 mt-1 block">{purchaseOrders.length} purchase orders issued</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pending Shipments</span>
          <span className="text-2xl font-bold font-mono text-amber-600 mt-1 block">{pendingReceiptCount} Pending</span>
          <span className="text-[10px] text-slate-400 mt-1 block">Awaiting goods receipt verification</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Stock Integrity Rule</span>
          <p className="text-xs text-slate-600 mt-1 leading-snug">
            Purchases only increment physical stock when received, preventing premature stock inflation.
          </p>
        </div>
      </div>

      {/* Purchase Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Purchase Orders Ledger</h3>
          <span className="text-xs text-slate-400">Click &apos;Receive Goods&apos; to update inventory stock</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[650px] text-left text-xs">
            <thead className="bg-slate-50 text-slate-400 font-bold border-b border-slate-100 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-5">PO Number</th>
                <th className="py-3 px-4">Supplier</th>
                <th className="py-3 px-4">Ordered Items</th>
                <th className="py-3 px-4">Expected Date</th>
                <th className="py-3 px-4 text-right">Order Total</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {purchaseOrders.map(po => (
                <tr key={po.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5 font-mono font-bold text-slate-900">
                    {po.orderNumber}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800">
                    {po.supplierName}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5">
                      {po.items.map(item => (
                        <div key={item.productId} className="text-slate-800">
                          {item.productName} ({item.quantityOrdered} units)
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                    {po.expectedDate}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                    {formatMoney(po.grandTotal)}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      po.status === 'Received'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {po.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    {po.status !== 'Received' ? (
                      <button
                        onClick={() => receiveGoods(po.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 shadow-xs transition-colors ml-auto cursor-pointer"
                      >
                        <PackageCheck className="w-3.5 h-3.5" />
                        <span>Receive Goods</span>
                      </button>
                    ) : (
                      <span className="text-[11px] font-semibold text-emerald-600 flex items-center justify-end gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Stock Incremented</span>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* New Purchase Order Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Create Purchase Order</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreatePO} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Supplier *</label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
                >
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name} ({s.paymentTerms})</option>)}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Product to Reorder *</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (Stock: {p.currentStock}) - Cost: {formatMoney(p.purchaseCost)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Quantity to Order</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={orderQty}
                  onChange={(e) => setOrderQty(Number(e.target.value))}
                  className="w-full p-2 font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Expected Delivery Date</label>
                <input
                  type="date"
                  value={expectedDate}
                  onChange={(e) => setExpectedDate(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
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
                  Issue Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
