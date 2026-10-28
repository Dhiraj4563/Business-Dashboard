import React, { useState } from 'react';
import { 
  Boxes, 
  Search, 
  Plus, 
  Download, 
  Upload, 
  Filter, 
  AlertTriangle, 
  History, 
  Edit3, 
  Archive, 
  Check, 
  X,
  ArrowUpDown
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { Product } from '../../types/erp';

export const InventoryView: React.FC = () => {
  const { 
    products, 
    formatMoney, 
    formatNumber, 
    adjustStock, 
    addProduct, 
    updateProduct, 
    archiveProduct,
    stockMovements,
    suppliers 
  } = useERP();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [adjustingProduct, setAdjustingProduct] = useState<Product | null>(null);
  const [newStockVal, setNewStockVal] = useState<number>(0);
  const [adjustmentReason, setAdjustmentReason] = useState('Physical Stock Audit Count');
  const [activeTab, setActiveTab] = useState<'catalog' | 'movements'>('catalog');

  // Form state for new product
  const [newProd, setNewProd] = useState({
    name: '',
    sku: '',
    barcode: '',
    description: '',
    category: 'Electronics',
    unit: 'pcs',
    purchaseCost: 1000,
    sellingPrice: 1500,
    taxRate: 13,
    openingStock: 20,
    currentStock: 20,
    minStockLevel: 5,
    supplierId: suppliers[0]?.id || 'sup-01',
    supplierName: suppliers[0]?.name || 'Apex Electronics',
    branchId: 'br-01',
  });

  const categories = ['All', 'Electronics', 'Apparel', 'Home', 'Furniture', 'Accessories', 'Hardware'];

  const filteredProducts = products.filter(p => {
    if (p.status === 'Archived') return false;
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.barcode.includes(search);
    const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStatus = statusFilter === 'All' || p.status === statusFilter;
    return matchesSearch && matchesCat && matchesStatus;
  });

  // Inventory valuation
  const totalStockUnits = products.reduce((acc, p) => acc + p.currentStock, 0);
  const totalValuation = products.reduce((acc, p) => acc + (p.currentStock * p.purchaseCost), 0);
  const lowStockCount = products.filter(p => p.currentStock <= p.minStockLevel && p.currentStock > 0).length;
  const outOfStockCount = products.filter(p => p.currentStock === 0).length;

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.sku) return;

    const sup = suppliers.find(s => s.id === newProd.supplierId);
    addProduct({
      ...newProd,
      supplierName: sup?.name || newProd.supplierName,
      currentStock: newProd.openingStock,
      branchId: 'br-01',
    });

    setIsAddModalOpen(false);
    setNewProd({
      name: '',
      sku: '',
      barcode: '',
      description: '',
      category: 'Electronics',
      unit: 'pcs',
      purchaseCost: 1000,
      sellingPrice: 1500,
      taxRate: 13,
      openingStock: 20,
      currentStock: 20,
      minStockLevel: 5,
      supplierId: suppliers[0]?.id || 'sup-01',
      supplierName: suppliers[0]?.name || 'Apex Electronics',
      branchId: 'br-01',
    });
  };

  const handleExportCSV = () => {
    const headers = ['SKU', 'Name', 'Category', 'Unit', 'Purchase Cost', 'Selling Price', 'Current Stock', 'Min Level', 'Status'];
    const rows = filteredProducts.map(p => [
      p.sku,
      `"${p.name.replace(/"/g, '""')}"`,
      p.category,
      p.unit,
      p.purchaseCost,
      p.sellingPrice,
      p.currentStock,
      p.minStockLevel,
      p.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `bizflow_inventory_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-[1600px] mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Products & Inventory</h1>
          <p className="text-xs text-slate-400 mt-0.5">Manage stock ledgers, valuation, low-stock reorder thresholds, and movements</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl shadow-2xs flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total SKUs</span>
          <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">{products.length}</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Stock on Hand</span>
          <span className="text-2xl font-bold font-mono text-slate-900 mt-1 block">{formatNumber(totalStockUnits)} units</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Inventory Valuation (Cost)</span>
          <span className="text-2xl font-bold font-mono text-blue-600 mt-1 block">{formatMoney(totalValuation)}</span>
        </div>
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Attention Needed</span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm font-bold font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
              {lowStockCount} Low
            </span>
            <span className="text-sm font-bold font-mono text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
              {outOfStockCount} Out
            </span>
          </div>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`pb-3 px-2 text-xs font-bold transition-all relative ${
            activeTab === 'catalog'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Product Catalog ({filteredProducts.length})
        </button>
        <button
          onClick={() => setActiveTab('movements')}
          className={`pb-3 px-2 text-xs font-bold transition-all relative ${
            activeTab === 'movements'
              ? 'text-blue-600 border-b-2 border-blue-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Stock Movement Ledger ({stockMovements.length})
        </button>
      </div>

      {activeTab === 'catalog' ? (
        /* Catalog View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          {/* Filters Bar */}
          <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, SKU, or barcode..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="text-xs p-1.5 px-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
              >
                {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs p-1.5 px-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 focus:outline-none"
              >
                <option value="All">All Stock Statuses</option>
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold border-b border-slate-100 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-5">Product Details</th>
                  <th className="py-3 px-4">SKU / Barcode</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Cost Price</th>
                  <th className="py-3 px-4 text-right">Selling Price</th>
                  <th className="py-3 px-4 text-right">Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredProducts.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-5 font-semibold text-slate-900">
                      <div>{p.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal line-clamp-1">{p.description}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px]">
                      <div className="text-slate-800">{p.sku}</div>
                      <div className="text-[10px] text-slate-400">{p.barcode}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-500">
                      {formatMoney(p.purchaseCost)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {formatMoney(p.sellingPrice)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold">
                      <span className={p.currentStock <= p.minStockLevel ? 'text-amber-600' : 'text-slate-900'}>
                        {p.currentStock} {p.unit}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.status === 'In Stock'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : p.status === 'Low Stock'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                      }`}>
                        {p.status}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setAdjustingProduct(p);
                            setNewStockVal(p.currentStock);
                          }}
                          className="px-2.5 py-1 text-[11px] font-semibold bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        >
                          Adjust
                        </button>
                        <button
                          onClick={() => archiveProduct(p.id)}
                          className="p-1 text-slate-400 hover:text-rose-600 rounded"
                          title="Archive"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Stock Movements Ledger View */
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Traceable Stock Ledger</h3>
            <span className="text-xs text-slate-400">All inventory alterations have an audited reason</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] text-left text-xs">
              <thead className="bg-slate-50 text-slate-400 font-bold border-b border-slate-100 uppercase text-[11px] tracking-wider">
                <tr>
                  <th className="py-3 px-5">Timestamp</th>
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-right">Change</th>
                  <th className="py-3 px-4 text-right">Before → After</th>
                  <th className="py-3 px-4">Reason & Reference</th>
                  <th className="py-3 px-5">Performed By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {stockMovements.map(m => (
                  <tr key={m.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-5 font-mono text-[11px] text-slate-400">{m.date}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div>{m.productName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{m.sku}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        m.type === 'Purchase' 
                          ? 'bg-emerald-50 text-emerald-700' 
                          : m.type === 'Sale'
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-amber-50 text-amber-700'
                      }`}>
                        {m.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold">
                      <span className={m.quantityChange > 0 ? 'text-emerald-600' : 'text-rose-600'}>
                        {m.quantityChange > 0 ? `+${m.quantityChange}` : m.quantityChange}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-slate-500">
                      {m.stockBefore} → <strong className="text-slate-900">{m.stockAfter}</strong>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{m.reason}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{m.referenceId}</div>
                    </td>
                    <td className="py-3 px-5 text-slate-600">{m.performedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {adjustingProduct && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-slate-400">{adjustingProduct.sku}</span>
                <h3 className="font-bold text-slate-900 text-base">Adjust Stock: {adjustingProduct.name}</h3>
              </div>
              <button onClick={() => setAdjustingProduct(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between text-xs">
              <span className="text-slate-500">Current Stock on Record:</span>
              <span className="font-mono font-bold text-slate-900">{adjustingProduct.currentStock} {adjustingProduct.unit}</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">New Physical Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={newStockVal}
                onChange={(e) => setNewStockVal(Number(e.target.value))}
                className="w-full text-sm font-mono p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Audit Reason (Mandatory)</label>
              <select
                value={adjustmentReason}
                onChange={(e) => setAdjustmentReason(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
              >
                <option value="Physical Stock Audit Count">Physical Stock Audit Count</option>
                <option value="Damaged / Broken Goods Write-off">Damaged / Broken Goods Write-off</option>
                <option value="Expired Goods Removal">Expired Goods Removal</option>
                <option value="Received Unrecorded Replacement">Received Unrecorded Replacement</option>
                <option value="Customer Return Restock">Customer Return Restock</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setAdjustingProduct(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  adjustStock(adjustingProduct.id, newStockVal, adjustmentReason);
                  setAdjustingProduct(null);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-xs"
              >
                Commit Adjustment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Add New Product to Catalog</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wireless Ergonomic Mouse"
                    value={newProd.name}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">SKU *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EL-8821"
                    value={newProd.sku}
                    onChange={(e) => setNewProd({ ...newProd, sku: e.target.value })}
                    className="w-full p-2 font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Barcode</label>
                  <input
                    type="text"
                    placeholder="e.g. 8901234567890"
                    value={newProd.barcode}
                    onChange={(e) => setNewProd({ ...newProd, barcode: e.target.value })}
                    className="w-full p-2 font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={newProd.category}
                    onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
                  >
                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Unit</label>
                  <select
                    value={newProd.unit}
                    onChange={(e) => setNewProd({ ...newProd, unit: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="pcs">Pieces (pcs)</option>
                    <option value="kg">Kilograms (kg)</option>
                    <option value="box">Box (box)</option>
                    <option value="set">Set (set)</option>
                    <option value="meter">Meter (m)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Purchase Cost</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newProd.purchaseCost}
                    onChange={(e) => setNewProd({ ...newProd, purchaseCost: Number(e.target.value) })}
                    className="w-full p-2 font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Selling Price</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={newProd.sellingPrice}
                    onChange={(e) => setNewProd({ ...newProd, sellingPrice: Number(e.target.value) })}
                    className="w-full p-2 font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Opening Stock</label>
                  <input
                    type="number"
                    min="0"
                    value={newProd.openingStock}
                    onChange={(e) => setNewProd({ ...newProd, openingStock: Number(e.target.value) })}
                    className="w-full p-2 font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Minimum Alert Threshold</label>
                  <input
                    type="number"
                    min="1"
                    value={newProd.minStockLevel}
                    onChange={(e) => setNewProd({ ...newProd, minStockLevel: Number(e.target.value) })}
                    className="w-full p-2 font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block font-bold text-slate-700 mb-1">Supplier</label>
                  <select
                    value={newProd.supplierId}
                    onChange={(e) => setNewProd({ ...newProd, supplierId: e.target.value })}
                    className="w-full p-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
                  >
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
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
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
