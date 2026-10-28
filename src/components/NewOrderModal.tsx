import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingCart, 
  CheckCircle2, 
  Printer, 
  CreditCard,
  User,
  AlertCircle
} from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { Product, SaleItem } from '../types/erp';

export const NewOrderModal: React.FC = () => {
  const { 
    isNewOrderModalOpen, 
    setIsNewOrderModalOpen, 
    products, 
    customers, 
    formatMoney, 
    createSale, 
    business,
    setViewingInvoice,
    invoices
  } = useERP();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || 'cust-04');
  const [cartItems, setCartItems] = useState<{ product: Product; quantity: number; discount: number }[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'Cash' | 'Credit Card' | 'Bank Transfer' | 'eSewa' | 'Khalti' | 'UPI'>('Cash');
  const [customPaidAmount, setCustomPaidAmount] = useState<string>('');
  const [orderNotes, setOrderNotes] = useState('');
  const [orderSuccess, setOrderSuccess] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isNewOrderModalOpen) return null;

  const filteredProducts = products
    .filter(p => p.status !== 'Archived' && (
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.barcode.includes(searchTerm)
    ))
    .slice(0, 8);

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId) || customers[0];

  const addToCart = (product: Product) => {
    if (product.currentStock <= 0) {
      setErrorMsg(`Cannot add ${product.name}: Out of stock.`);
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

    setCartItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.currentStock) {
          setErrorMsg(`Stock limit reached for ${product.name} (${product.currentStock} in stock).`);
          setTimeout(() => setErrorMsg(''), 3000);
          return prev;
        }
        return prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1, discount: 0 }];
    });
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems(prev => {
      return prev.map(i => {
        if (i.product.id === productId) {
          const newQty = i.quantity + delta;
          if (newQty <= 0) return null;
          if (newQty > i.product.currentStock) {
            setErrorMsg(`Only ${i.product.currentStock} units available.`);
            setTimeout(() => setErrorMsg(''), 3000);
            return i;
          }
          return { ...i, quantity: newQty };
        }
        return i;
      }).filter(Boolean) as { product: Product; quantity: number; discount: number }[];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(i => i.product.id !== productId));
  };

  // Financial calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.sellingPrice * item.quantity), 0);
  const discountTotal = cartItems.reduce((sum, item) => sum + item.discount, 0);
  const taxableAmount = Math.max(0, subtotal - discountTotal);
  const taxTotal = Math.round(taxableAmount * (business.defaultTaxRate / 100));
  const grandTotal = taxableAmount + taxTotal;
  const paidAmount = customPaidAmount !== '' ? Number(customPaidAmount) : grandTotal;

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      setErrorMsg('Please add at least one product to the order.');
      return;
    }

    const saleItems: SaleItem[] = cartItems.map(item => {
      const itemSubtotal = item.product.sellingPrice * item.quantity;
      const itemTax = itemSubtotal * (business.defaultTaxRate / 100);
      return {
        productId: item.product.id,
        productName: item.product.name,
        sku: item.product.sku,
        quantity: item.quantity,
        unitPrice: item.product.sellingPrice,
        discount: item.discount,
        taxAmount: itemTax,
        total: itemSubtotal + itemTax - item.discount,
      };
    });

    const newSale = createSale({
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      items: saleItems,
      subtotal,
      discountTotal,
      taxTotal,
      grandTotal,
      paidAmount,
      paymentMethod,
      notes: orderNotes,
    });

    setOrderSuccess(newSale);
  };

  const handleClose = () => {
    setIsNewOrderModalOpen(false);
    setCartItems([]);
    setOrderSuccess(null);
    setSearchTerm('');
    setCustomPaidAmount('');
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-4 sm:px-6 py-3.5 sm:py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm sm:text-base">New Quick Sale / POS</h2>
              <p className="text-[11px] text-slate-400">Process retail or wholesale sales order with real-time stock adjustment</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {orderSuccess ? (
          /* Order Confirmation View */
          <div className="p-6 sm:p-8 text-center space-y-4 my-auto overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center shadow-md">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Order Completed Successfully!</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {orderSuccess.orderNumber} for <strong>{orderSuccess.customerName}</strong> has been confirmed. Stock was deducted from the inventory ledger.
            </p>

            <div className="p-4 bg-slate-50 rounded-xl max-w-sm mx-auto text-xs space-y-2 border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-400">Grand Total:</span>
                <span className="font-mono font-bold text-slate-900">{formatMoney(orderSuccess.grandTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Amount Paid:</span>
                <span className="font-mono font-semibold text-emerald-600">{formatMoney(orderSuccess.paidAmount)}</span>
              </div>
              {orderSuccess.balanceDue > 0 && (
                <div className="flex justify-between text-rose-600 font-semibold">
                  <span>Balance Due:</span>
                  <span className="font-mono">{formatMoney(orderSuccess.balanceDue)}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
              <button
                onClick={() => {
                  const inv = invoices.find(i => i.saleId === orderSuccess.id);
                  if (inv) {
                    setViewingInvoice(inv);
                    handleClose();
                  }
                }}
                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs min-h-[44px]"
              >
                <Printer className="w-4 h-4" />
                <span>View & Print Tax Invoice</span>
              </button>
              <button
                onClick={handleClose}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold min-h-[44px]"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          /* Normal Order Form Grid */
          <div className="grid grid-cols-1 md:grid-cols-12 flex-1 overflow-y-auto md:overflow-hidden">
            {/* Left Column: Product Catalog Search (7 cols) */}
            <div className="md:col-span-7 p-4 sm:p-5 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col md:overflow-y-auto space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Product search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Scan barcode, search SKU or product name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-blue-500 focus:outline-none"
                  autoFocus
                />
              </div>

              {/* Product List */}
              <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Select Item to Add
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {filteredProducts.map(product => {
                    const isOutOfStock = product.currentStock <= 0;
                    return (
                      <div
                        key={product.id}
                        onClick={() => !isOutOfStock && addToCart(product)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                          isOutOfStock 
                            ? 'opacity-50 bg-slate-50 border-slate-200 cursor-not-allowed' 
                            : 'bg-white border-slate-200 hover:border-blue-500 hover:shadow-xs'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-mono text-slate-400">{product.sku}</span>
                            <span className="text-[10px] font-semibold text-slate-500">{product.category}</span>
                          </div>
                          <h4 className="font-semibold text-slate-900 text-xs mt-1 line-clamp-1">{product.name}</h4>
                        </div>

                        <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-100">
                          <span className="font-mono font-bold text-blue-600 text-xs">
                            {formatMoney(product.sellingPrice)}
                          </span>
                          <span className={`text-[10px] font-medium ${isOutOfStock ? 'text-rose-500' : 'text-slate-500'}`}>
                            {isOutOfStock ? '0 in stock' : `${product.currentStock} in stock`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Cart & Payment (5 cols) */}
            <div className="md:col-span-5 p-5 flex flex-col justify-between bg-slate-50/50 overflow-y-auto space-y-4">
              <div className="space-y-3">
                {/* Customer Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Customer
                  </label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                    className="w-full text-xs font-medium p-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
                  >
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.outstandingBalance > 0 ? `(Due: ${formatMoney(c.outstandingBalance)})` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Cart Items */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Order Items ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
                  </span>

                  {cartItems.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400 bg-white rounded-xl border border-slate-200 border-dashed">
                      Cart is empty. Click any product on the left to add.
                    </div>
                  ) : (
                    <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                      {cartItems.map(item => (
                        <div key={item.product.id} className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center justify-between gap-2 shadow-2xs">
                          <div className="min-w-0 flex-1">
                            <span className="font-semibold text-slate-900 text-xs block truncate">{item.product.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{formatMoney(item.product.sellingPrice)} × {item.quantity}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => updateQuantity(item.product.id, -1)}
                              className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-mono font-bold w-5 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, 1)}
                              className="p-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 ml-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                    Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['Cash', 'Credit Card', 'Bank Transfer', 'eSewa', 'Khalti', 'UPI'] as const).map(m => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setPaymentMethod(m)}
                        className={`py-1.5 px-2 text-[11px] font-medium rounded-lg border transition-all ${
                          paymentMethod === m
                            ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Amount Paid (supports partial payment) */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      Amount Collected
                    </label>
                    <span className="text-[10px] text-slate-400">Leave blank for full</span>
                  </div>
                  <input
                    type="number"
                    placeholder={`Full: ${grandTotal}`}
                    value={customPaidAmount}
                    onChange={(e) => setCustomPaidAmount(e.target.value)}
                    className="w-full text-xs font-mono p-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Order Totals Summary */}
              <div className="pt-3 border-t border-slate-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal:</span>
                  <span className="font-mono">{formatMoney(subtotal)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>VAT/Tax ({business.defaultTaxRate}%):</span>
                  <span className="font-mono">{formatMoney(taxTotal)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-slate-900 pt-1 border-t border-slate-200">
                  <span>Grand Total:</span>
                  <span className="font-mono text-blue-600">{formatMoney(grandTotal)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={cartItems.length === 0}
                  className="w-full mt-3 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 text-white font-semibold rounded-xl text-xs shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  Confirm & Complete Order ({formatMoney(grandTotal)})
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
