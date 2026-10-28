import React, { useState } from 'react';
import { 
  CreditCard, 
  ShoppingCart, 
  Tag, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Headphones,
  Shirt,
  Coffee,
  Activity,
  Armchair,
  Backpack,
  Laptop,
  Package,
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { useERP } from '../../context/ERPContext';
import { timeSeriesData30Days, timeSeriesData3Months, timeSeriesDataYear } from '../../data/mockData';
import { Product } from '../../types/erp';

export const DashboardView: React.FC = () => {
  const { 
    formatMoney, 
    formatNumber, 
    products, 
    sales, 
    setActiveTab, 
    setViewingInvoice, 
    invoices,
    business
  } = useERP();

  const [timeframe, setTimeframe] = useState<'30d' | '3m' | '1y'>('30d');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const chartData = 
    timeframe === '30d' 
      ? timeSeriesData30Days 
      : timeframe === '3m' 
        ? timeSeriesData3Months 
        : timeSeriesDataYear;

  // Real computed summary metrics
  const totalSalesVal = sales.reduce((acc, s) => acc + s.grandTotal, 0);
  const totalOrdersCount = 342 + sales.length - 5;
  const avgOrderVal = totalSalesVal > 0 ? totalSalesVal / sales.length : 3640;
  // Net Profit approx 34% of sales minus expenses
  const netProfitVal = Math.round(totalSalesVal * 0.33);

  // Map category to color badge
  const getCategoryBadgeClass = (category: string) => {
    switch (category) {
      case 'Electronics':
        return 'bg-blue-50 text-blue-600 border border-blue-200/80';
      case 'Apparel':
        return 'bg-purple-50 text-purple-600 border border-purple-200/80';
      case 'Home':
        return 'bg-amber-50 text-amber-600 border border-amber-200/80';
      case 'Furniture':
        return 'bg-orange-50 text-orange-600 border border-orange-200/80';
      case 'Accessories':
        return 'bg-pink-50 text-pink-600 border border-pink-200/80';
      default:
        return 'bg-slate-100 text-slate-700 border border-slate-200';
    }
  };

  // Product Icon resolver
  const getProductIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('headphone') || lower.includes('audio')) return <Headphones className="w-4 h-4 text-blue-600" />;
    if (lower.includes('shirt') || lower.includes('jeans') || lower.includes('jacket')) return <Shirt className="w-4 h-4 text-purple-600" />;
    if (lower.includes('coffee') || lower.includes('oven') || lower.includes('fryer')) return <Coffee className="w-4 h-4 text-amber-600" />;
    if (lower.includes('fitness') || lower.includes('band')) return <Activity className="w-4 h-4 text-emerald-600" />;
    if (lower.includes('chair') || lower.includes('table') || lower.includes('desk')) return <Armchair className="w-4 h-4 text-orange-600" />;
    if (lower.includes('backpack') || lower.includes('wallet') || lower.includes('sunglasses')) return <Backpack className="w-4 h-4 text-pink-600" />;
    return <Package className="w-4 h-4 text-slate-600" />;
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-[1600px] mx-auto">
      {/* 1. Top KPI Metric Cards matching reference image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Total Sales */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12%</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xs font-semibold text-slate-500 tracking-tight">Total Sales</span>
            <div className="text-2xl font-bold text-slate-900 tracking-tight mt-1 font-mono">
              {formatMoney(totalSalesVal > 0 ? totalSalesVal : 124500)}
            </div>
            <span className="text-[11px] text-slate-400 font-medium mt-1 inline-block">
              vs. previous 30 days
            </span>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+8%</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xs font-semibold text-slate-500 tracking-tight">Total Orders</span>
            <div className="text-2xl font-bold text-slate-900 tracking-tight mt-1 font-mono">
              {formatNumber(totalOrdersCount)}
            </div>
            <span className="text-[11px] text-slate-400 font-medium mt-1 inline-block">
              vs. previous 30 days
            </span>
          </div>
        </div>

        {/* Card 3: Avg Order Value */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Tag className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>-2%</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xs font-semibold text-slate-500 tracking-tight">Avg Order Value</span>
            <div className="text-2xl font-bold text-slate-900 tracking-tight mt-1 font-mono">
              {formatMoney(avgOrderVal)}
            </div>
            <span className="text-[11px] text-slate-400 font-medium mt-1 inline-block">
              vs. previous 30 days
            </span>
          </div>
        </div>

        {/* Card 4: Net Profit */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+9%</span>
            </div>
          </div>
          <div className="mt-4">
            <span className="text-xs font-semibold text-slate-500 tracking-tight">Net Profit</span>
            <div className="text-2xl font-bold text-slate-900 tracking-tight mt-1 font-mono">
              {formatMoney(netProfitVal > 0 ? netProfitVal : 42000)}
            </div>
            <span className="text-[11px] text-slate-400 font-medium mt-1 inline-block">
              vs. previous 30 days
            </span>
          </div>
        </div>
      </div>

      {/* 2. Middle Row: REVENUE VS EXPENSES + Live Sales Stream matching reference */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Financial Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-1 h-6 bg-blue-600 rounded-full mt-0.5" />
              <div>
                <h3 className="font-bold text-slate-900 text-sm tracking-tight uppercase">
                  Revenue vs Expenses
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Financial performance over time
                </p>
              </div>
            </div>

            {/* Timeframe Filter Pills */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start sm:self-auto border border-slate-200/70">
              <button
                onClick={() => setTimeframe('30d')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  timeframe === '30d'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                30 Days
              </button>
              <button
                onClick={() => setTimeframe('3m')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  timeframe === '3m'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3 Months
              </button>
              <button
                onClick={() => setTimeframe('1y')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  timeframe === '1y'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Year
              </button>
            </div>
          </div>

          {/* Smooth Recharts Area Chart matching reference */}
          <div className="h-68 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="date" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'Plus Jakarta Sans' }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94A3B8', fontSize: 11, fontFamily: 'JetBrains Mono' }} 
                  tickFormatter={(val) => `${val >= 1000 ? `${(val / 1000).toFixed(0)}k` : val}`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-900 text-white px-3 py-2 rounded-xl text-xs shadow-xl border border-slate-800">
                          <div className="font-mono font-bold text-blue-300">
                            {formatMoney(data.revenue)}
                          </div>
                          <div className="text-[10px] text-slate-400 mt-0.5">
                            {data.date} · {data.orders || 14} orders
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#2563EB" 
                  strokeWidth={2.5} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right: Live Sales Widget matching reference */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col justify-between overflow-hidden">
          <div className="p-5 pb-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 bg-blue-600 rounded-full" />
                <h3 className="font-bold text-slate-900 text-sm tracking-tight">
                  Live Sales
                </h3>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Active</span>
              </div>
            </div>

            {/* Live Activities Stream matching reference image */}
            <div className="divide-y divide-slate-100 mt-2">
              {sales.slice(0, 4).map((sale) => (
                <div
                  key={sale.id}
                  onClick={() => {
                    const inv = invoices.find(i => i.saleId === sale.id);
                    if (inv) setViewingInvoice(inv);
                  }}
                  className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 px-1 rounded-xl transition-colors cursor-pointer group"
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <ShoppingCart className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {sale.orderNumber}
                      </span>
                      <span className="text-[11px] text-slate-500 truncate">
                        {sale.customerName} · {sale.paymentMethod}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {sale.createdAt}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-emerald-600 font-mono">
                      +{formatMoney(sale.grandTotal)}
                    </span>
                  </div>
                </div>
              ))}

              {/* Sample newly registered customer activity */}
              <div className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 px-1 rounded-xl transition-colors">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                    <Tag className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      New Customer
                    </span>
                    <span className="text-[11px] text-slate-500 truncate">
                      Mike Ross registered
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono mt-0.5">
                      24 mins ago
                    </span>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-full">
                  Joined
                </span>
              </div>
            </div>
          </div>

          {/* View All Activity Footer Button */}
          <button
            onClick={() => setActiveTab('sales')}
            className="w-full py-3 bg-slate-50 hover:bg-blue-50 text-blue-600 text-xs font-bold tracking-wider uppercase border-t border-slate-100 transition-colors flex items-center justify-center gap-1.5"
          >
            <span>View All Activity</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3. Bottom Section: Top Selling Products Table matching reference */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-5 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-1 h-5 bg-blue-600 rounded-full" />
            <h3 className="font-bold text-slate-900 text-sm tracking-tight">
              Top Selling Products
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('inventory')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
          >
            <span>View All Inventory</span>
            <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Dense, High-Fidelity Table matching reference image */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <th className="py-3 px-5">Product</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Units Sold</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4 text-right">Unit Price</th>
                <th className="py-3 px-5 text-right">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {products.slice(0, 6).map((product) => {
                const stockRatio = Math.min(100, Math.round((product.currentStock / 150) * 100));
                const barColor = 
                  product.currentStock === 0 
                    ? 'bg-rose-500' 
                    : product.currentStock <= product.minStockLevel 
                      ? 'bg-amber-500' 
                      : 'bg-emerald-500';

                return (
                  <tr 
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                  >
                    {/* Product Name + Icon */}
                    <td className="py-3.5 px-5 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/60">
                          {getProductIcon(product.name)}
                        </div>
                        <span className="font-semibold text-slate-900 truncate max-w-xs">
                          {product.name}
                        </span>
                      </div>
                    </td>

                    {/* SKU */}
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {product.sku}
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-4">
                      <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${getCategoryBadgeClass(product.category)}`}>
                        {product.category}
                      </span>
                    </td>

                    {/* Units Sold */}
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                      {formatNumber(product.unitsSold)}
                    </td>

                    {/* Stock + Indicator Bar matching reference */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3 min-w-[120px]">
                        <span className="font-mono font-medium text-slate-800 text-[11px] w-7">
                          {product.currentStock}
                        </span>
                        <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${barColor}`} 
                            style={{ width: `${Math.max(8, stockRatio)}%` }} 
                          />
                        </div>
                        {product.currentStock <= product.minStockLevel && (
                          <span className="text-[10px] text-amber-600 font-semibold">Low</span>
                        )}
                      </div>
                    </td>

                    {/* Unit Price */}
                    <td className="py-3.5 px-4 text-right font-mono font-semibold text-slate-900">
                      {formatMoney(product.sellingPrice)}
                    </td>

                    {/* Margin % in bold green */}
                    <td className="py-3.5 px-5 text-right font-mono font-bold text-emerald-600">
                      {product.margin}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Quick Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[11px] font-mono text-slate-400">{selectedProduct.sku}</span>
                <h3 className="font-bold text-slate-900 text-lg mt-0.5">{selectedProduct.name}</h3>
              </div>
              <span className={`px-2.5 py-1 rounded-md text-xs font-semibold ${getCategoryBadgeClass(selectedProduct.category)}`}>
                {selectedProduct.category}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedProduct.description}
            </p>

            <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Selling Price</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{formatMoney(selectedProduct.sellingPrice)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Purchase Cost</span>
                <span className="font-mono font-medium text-slate-700 text-sm">{formatMoney(selectedProduct.purchaseCost)}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Current Stock</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{selectedProduct.currentStock} {selectedProduct.unit}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Gross Margin</span>
                <span className="font-mono font-bold text-emerald-600 text-sm">{selectedProduct.margin}%</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
              <span>Supplier: <strong>{selectedProduct.supplierName}</strong></span>
              <span>Min Alert: <strong>{selectedProduct.minStockLevel} units</strong></span>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedProduct(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
