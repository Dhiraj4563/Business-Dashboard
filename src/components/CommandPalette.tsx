import React, { useState, useEffect } from 'react';
import { Search, X, ShoppingBag, Boxes, Users, Truck, FileText, ArrowRight } from 'lucide-react';
import { useERP } from '../context/ERPContext';

export const CommandPalette: React.FC = () => {
  const { 
    isCommandPaletteOpen, 
    setIsCommandPaletteOpen, 
    products, 
    customers, 
    sales, 
    setActiveTab,
    setIsNewOrderModalOpen,
    formatMoney 
  } = useERP();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(!isCommandPaletteOpen);
      }
      if (e.key === 'Escape' && isCommandPaletteOpen) {
        setIsCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen, setIsCommandPaletteOpen]);

  if (!isCommandPaletteOpen) return null;

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(query.toLowerCase()) || 
    p.sku.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(query.toLowerCase()) || 
    c.phone.includes(query)
  ).slice(0, 3);

  const filteredSales = sales.filter(s => 
    s.orderNumber.toLowerCase().includes(query.toLowerCase()) || 
    s.customerName.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3);

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-start justify-center pt-24 p-4 z-50">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search products, orders, customers, or commands..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Area */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-3 text-xs">
          {/* Quick Action */}
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
              Actions
            </span>
            <button
              onClick={() => {
                setIsCommandPaletteOpen(false);
                setIsNewOrderModalOpen(true);
              }}
              className="w-full p-2 rounded-xl hover:bg-blue-50 text-blue-600 flex items-center justify-between font-semibold transition-colors"
            >
              <span>+ Create New Quick Sale Order</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Products */}
          {filteredProducts.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                Products
              </span>
              {filteredProducts.map(prod => (
                <button
                  key={prod.id}
                  onClick={() => {
                    setIsCommandPaletteOpen(false);
                    setActiveTab('inventory');
                  }}
                  className="w-full p-2 rounded-xl hover:bg-slate-50 flex items-center justify-between transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <Boxes className="w-3.5 h-3.5 text-slate-400" />
                    <div>
                      <span className="font-semibold text-slate-800">{prod.name}</span>
                      <span className="text-[10px] text-slate-400 font-mono ml-2">{prod.sku}</span>
                    </div>
                  </div>
                  <span className="font-mono font-semibold text-slate-900">{formatMoney(prod.sellingPrice)}</span>
                </button>
              ))}
            </div>
          )}

          {/* Customers */}
          {filteredCustomers.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                Customers
              </span>
              {filteredCustomers.map(cust => (
                <button
                  key={cust.id}
                  onClick={() => {
                    setIsCommandPaletteOpen(false);
                    setActiveTab('customers');
                  }}
                  className="w-full p-2 rounded-xl hover:bg-slate-50 flex items-center justify-between transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-800">{cust.name}</span>
                  </div>
                  <span className="text-slate-400 font-mono">{cust.phone}</span>
                </button>
              ))}
            </div>
          )}

          {/* Orders */}
          {filteredSales.length > 0 && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 block mb-1">
                Orders
              </span>
              {filteredSales.map(sale => (
                <button
                  key={sale.id}
                  onClick={() => {
                    setIsCommandPaletteOpen(false);
                    setActiveTab('sales');
                  }}
                  className="w-full p-2 rounded-xl hover:bg-slate-50 flex items-center justify-between transition-colors text-left"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-800">{sale.orderNumber}</span>
                    <span className="text-slate-400">({sale.customerName})</span>
                  </div>
                  <span className="font-mono font-bold text-emerald-600">+{formatMoney(sale.grandTotal)}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 px-4">
          <span>Navigate with mouse or keyboard</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
