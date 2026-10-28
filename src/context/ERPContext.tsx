import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  BusinessProfile, Branch, Product, Customer, Supplier, Sale, PurchaseOrder, 
  Invoice, Expense, StaffMember, NotificationItem, StockMovement, AuditLog, 
  Currency, SaleItem, UserRole 
} from '../types/erp';
import { 
  initialBusiness, initialBranches, initialProducts, initialCustomers, 
  initialSuppliers, initialSales, initialPurchaseOrders, initialInvoices, 
  initialExpenses, initialStaff, initialNotifications, initialStockMovements, 
  initialAuditLogs 
} from '../data/mockData';

interface ERPContextType {
  business: BusinessProfile;
  updateBusiness: (updates: Partial<BusinessProfile>) => void;
  branches: Branch[];
  currentBranch: Branch;
  setCurrentBranch: (branch: Branch) => void;
  currentUser: StaffMember;
  setCurrentUser: (user: StaffMember) => void;
  isAuthenticated: boolean;
  login: (emailOrPhone: string, password: string) => { success: boolean; message?: string };
  register: (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role?: UserRole;
    businessName?: string;
  }) => { success: boolean; message?: string };
  logout: () => void;
  products: Product[];
  sales: Sale[];
  purchaseOrders: PurchaseOrder[];
  invoices: Invoice[];
  expenses: Expense[];
  customers: Customer[];
  suppliers: Supplier[];
  staff: StaffMember[];
  notifications: NotificationItem[];
  stockMovements: StockMovement[];
  auditLogs: AuditLog[];
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatMoney: (amount: number) => string;
  formatNumber: (val: number) => string;
  createSale: (data: {
    customerId: string;
    customerName: string;
    customerPhone?: string;
    items: SaleItem[];
    subtotal: number;
    discountTotal: number;
    taxTotal: number;
    grandTotal: number;
    paidAmount: number;
    paymentMethod: Sale['paymentMethod'];
    notes?: string;
  }) => Sale;
  createPurchaseOrder: (data: {
    supplierId: string;
    supplierName: string;
    items: { productId: string; productName: string; sku: string; quantityOrdered: number; unitCost: number; totalCost: number }[];
    expectedDate: string;
  }) => PurchaseOrder;
  receiveGoods: (poId: string) => void;
  adjustStock: (productId: string, newStock: number, reason: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'unitsSold' | 'status' | 'margin'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  archiveProduct: (id: string) => void;
  addCustomer: (cust: Omit<Customer, 'id' | 'outstandingBalance' | 'totalOrders'>) => Customer;
  addSupplier: (sup: Omit<Supplier, 'id' | 'outstandingPayable'>) => Supplier;
  addExpense: (exp: Omit<Expense, 'id' | 'status' | 'recordedBy'>) => Expense;
  recordInvoicePayment: (invoiceId: string, amount: number) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  resetDemoData: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isNewOrderModalOpen: boolean;
  setIsNewOrderModalOpen: (open: boolean) => void;
  isCommandPaletteOpen: boolean;
  setIsCommandPaletteOpen: (open: boolean) => void;
  viewingInvoice: Invoice | null;
  setViewingInvoice: (invoice: Invoice | null) => void;
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean) => void;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

export const ERPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [business, setBusiness] = useState<BusinessProfile>(() => {
    const saved = localStorage.getItem('bizflow_business');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.name === 'BizFlow ERP' || !parsed.name) parsed.name = 'Business';
        return parsed;
      } catch (e) {
        return initialBusiness;
      }
    }
    return initialBusiness;
  });

  const [branches] = useState<Branch[]>(initialBranches);
  const [currentBranch, setCurrentBranch] = useState<Branch>(initialBranches[0]);
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);

  const [currentUser, setCurrentUser] = useState<StaffMember>(() => {
    const savedUser = localStorage.getItem('bizflow_auth_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        return initialStaff[0];
      }
    }
    return initialStaff[0];
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('bizflow_is_authenticated') === 'true';
  });

  const [currency, setCurrencyState] = useState<Currency>(business.currency);

  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('bizflow_products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [sales, setSales] = useState<Sale[]>(() => {
    const saved = localStorage.getItem('bizflow_sales');
    return saved ? JSON.parse(saved) : initialSales;
  });

  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => {
    const saved = localStorage.getItem('bizflow_po');
    return saved ? JSON.parse(saved) : initialPurchaseOrders;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem('bizflow_invoices');
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('bizflow_expenses');
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem('bizflow_customers');
    return saved ? JSON.parse(saved) : initialCustomers;
  });

  const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
    const saved = localStorage.getItem('bizflow_suppliers');
    return saved ? JSON.parse(saved) : initialSuppliers;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(initialNotifications);
  const [stockMovements, setStockMovements] = useState<StockMovement[]>(initialStockMovements);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(initialAuditLogs);

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  // Sync to local storage for persistence across reloads
  useEffect(() => {
    localStorage.setItem('bizflow_business', JSON.stringify(business));
  }, [business]);

  useEffect(() => {
    localStorage.setItem('bizflow_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('bizflow_sales', JSON.stringify(sales));
  }, [sales]);

  useEffect(() => {
    localStorage.setItem('bizflow_invoices', JSON.stringify(invoices));
  }, [invoices]);

  useEffect(() => {
    localStorage.setItem('bizflow_expenses', JSON.stringify(expenses));
  }, [expenses]);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    const symbol = newCurrency === 'NPR' ? 'रू' : newCurrency === 'INR' ? '₹' : '$';
    const updated = { ...business, currency: newCurrency, currencySymbol: symbol };
    setBusiness(updated);
  };

  const updateBusiness = (updates: Partial<BusinessProfile>) => {
    setBusiness(prev => ({ ...prev, ...updates }));
  };

  // Safe monetary formatting
  const formatMoney = (amount: number): string => {
    const sym = business.currencySymbol || (currency === 'NPR' ? 'रू' : currency === 'INR' ? '₹' : '$');
    // Multiplier if user chose INR while default base was NPR (1 INR ~ 1.60 NPR)
    let displayAmount = amount;
    if (business.currency === 'INR' && currency === 'INR') {
      // standard display
      displayAmount = amount * 0.625; // 100 NPR = 62.5 INR
    } else if (business.currency === 'USD') {
      displayAmount = amount / 135;
    }

    return `${sym} ${displayAmount.toLocaleString(undefined, {
      minimumFractionDigits: displayAmount % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatNumber = (val: number): string => {
    return val.toLocaleString();
  };

  const createSale = (data: {
    customerId: string;
    customerName: string;
    customerPhone?: string;
    items: SaleItem[];
    subtotal: number;
    discountTotal: number;
    taxTotal: number;
    grandTotal: number;
    paidAmount: number;
    paymentMethod: Sale['paymentMethod'];
    notes?: string;
  }): Sale => {
    const nextNum = 1025 + sales.length;
    const orderNumber = `Order #${nextNum}`;
    const saleId = `sale-${nextNum}`;
    const balanceDue = Math.max(0, data.grandTotal - data.paidAmount);
    const status: Sale['status'] = balanceDue <= 0 ? 'Paid' : data.paidAmount > 0 ? 'Partially Paid' : 'Confirmed';

    const newSale: Sale = {
      id: saleId,
      orderNumber,
      customerId: data.customerId,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      branchId: currentBranch.id,
      items: data.items,
      subtotal: data.subtotal,
      discountTotal: data.discountTotal,
      taxTotal: data.taxTotal,
      grandTotal: data.grandTotal,
      paidAmount: data.paidAmount,
      balanceDue,
      paymentMethod: data.paymentMethod,
      status,
      createdAt: 'Just now',
      createdBy: currentUser.name,
      notes: data.notes,
    };

    // 1. Traceable Stock Ledger Update (Inventory Rule: Sales reduce stock only when confirmed/paid)
    const newStockMovements: StockMovement[] = [];
    setProducts(prevProducts =>
      prevProducts.map(p => {
        const item = data.items.find(i => i.productId === p.id);
        if (item) {
          const newQty = Math.max(0, p.currentStock - item.quantity);
          newStockMovements.push({
            id: `mov-${Date.now()}-${p.id}`,
            productId: p.id,
            productName: p.name,
            sku: p.sku,
            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
            type: 'Sale',
            quantityChange: -item.quantity,
            stockBefore: p.currentStock,
            stockAfter: newQty,
            reason: `Sale ${orderNumber}`,
            referenceId: saleId,
            performedBy: currentUser.name,
          });

          const newUnitsSold = p.unitsSold + item.quantity;
          const status = newQty === 0 ? 'Out of Stock' : newQty <= p.minStockLevel ? 'Low Stock' : 'In Stock';
          return {
            ...p,
            currentStock: newQty,
            unitsSold: newUnitsSold,
            status,
          };
        }
        return p;
      })
    );

    setStockMovements(prev => [...newStockMovements, ...prev]);

    // 2. Generate Commercial Invoice
    const invoiceId = `inv-${nextNum}`;
    const newInvoice: Invoice = {
      id: invoiceId,
      invoiceNumber: `${business.invoicePrefix}${nextNum}`,
      saleId,
      customerId: data.customerId,
      customerName: data.customerName,
      issueDate: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      subtotal: data.subtotal,
      discount: data.discountTotal,
      taxAmount: data.taxTotal,
      totalAmount: data.grandTotal,
      paidAmount: data.paidAmount,
      dueAmount: balanceDue,
      status: balanceDue <= 0 ? 'Paid' : data.paidAmount > 0 ? 'Partial' : 'Unpaid',
      items: data.items,
    };

    setSales(prev => [newSale, ...prev]);
    setInvoices(prev => [newInvoice, ...prev]);

    // 3. Customer Ledger
    if (data.customerId && data.customerId !== 'cust-04') {
      setCustomers(prev =>
        prev.map(c => {
          if (c.id === data.customerId) {
            return {
              ...c,
              totalOrders: c.totalOrders + 1,
              outstandingBalance: c.outstandingBalance + balanceDue,
            };
          }
          return c;
        })
      );
    }

    // 4. Audit Log & Notification
    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        action: 'Create Sale Order',
        module: 'Sales',
        details: `Created ${orderNumber} for ${data.customerName} (${formatMoney(data.grandTotal)})`,
        user: currentUser.name,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        ipAddress: '192.168.1.10',
      },
      ...prev,
    ]);

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'New Sale Completed',
        description: `${orderNumber} processed for ${data.customerName} (${formatMoney(data.grandTotal)} via ${data.paymentMethod}).`,
        type: 'sales',
        severity: 'success',
        timestamp: 'Just now',
        isRead: false,
      },
      ...prev,
    ]);

    return newSale;
  };

  const createPurchaseOrder = (data: {
    supplierId: string;
    supplierName: string;
    items: { productId: string; productName: string; sku: string; quantityOrdered: number; unitCost: number; totalCost: number }[];
    expectedDate: string;
  }): PurchaseOrder => {
    const nextNum = 503 + purchaseOrders.length;
    const orderNumber = `PO-2081-${nextNum}`;
    const subtotal = data.items.reduce((sum, i) => sum + i.totalCost, 0);
    const taxTotal = subtotal * (business.defaultTaxRate / 100);
    const grandTotal = subtotal + taxTotal;

    const newPO: PurchaseOrder = {
      id: `po-${nextNum}`,
      orderNumber,
      supplierId: data.supplierId,
      supplierName: data.supplierName,
      branchId: currentBranch.id,
      items: data.items.map(i => ({ ...i, quantityReceived: 0 })),
      subtotal,
      taxTotal,
      grandTotal,
      status: 'Ordered',
      paymentStatus: 'Pending',
      paidAmount: 0,
      expectedDate: data.expectedDate,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setPurchaseOrders(prev => [newPO, ...prev]);

    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        action: 'Create Purchase Order',
        module: 'Purchases',
        details: `Issued ${orderNumber} to ${data.supplierName} (${formatMoney(grandTotal)})`,
        user: currentUser.name,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        ipAddress: '192.168.1.10',
      },
      ...prev,
    ]);

    return newPO;
  };

  // Inventory Rule: Purchases increase stock ONLY when received
  const receiveGoods = (poId: string) => {
    const po = purchaseOrders.find(p => p.id === poId);
    if (!po || po.status === 'Received') return;

    const newStockMovements: StockMovement[] = [];
    setProducts(prevProducts =>
      prevProducts.map(prod => {
        const item = po.items.find(i => i.productId === prod.id);
        if (item) {
          const qtyToAdd = item.quantityOrdered - item.quantityReceived;
          const newQty = prod.currentStock + qtyToAdd;
          newStockMovements.push({
            id: `mov-${Date.now()}-${prod.id}`,
            productId: prod.id,
            productName: prod.name,
            sku: prod.sku,
            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
            type: 'Purchase',
            quantityChange: +qtyToAdd,
            stockBefore: prod.currentStock,
            stockAfter: newQty,
            reason: `Goods Received ${po.orderNumber}`,
            referenceId: po.id,
            performedBy: currentUser.name,
          });

          return {
            ...prod,
            currentStock: newQty,
            status: newQty === 0 ? 'Out of Stock' : newQty <= prod.minStockLevel ? 'Low Stock' : 'In Stock',
          };
        }
        return prod;
      })
    );

    setStockMovements(prev => [...newStockMovements, ...prev]);

    setPurchaseOrders(prev =>
      prev.map(p =>
        p.id === poId
          ? {
              ...p,
              status: 'Received',
              items: p.items.map(i => ({ ...i, quantityReceived: i.quantityOrdered })),
            }
          : p
      )
    );

    // Update supplier payable
    setSuppliers(prev =>
      prev.map(s => {
        if (s.id === po.supplierId) {
          return {
            ...s,
            outstandingPayable: s.outstandingPayable + po.grandTotal,
          };
        }
        return s;
      })
    );

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        title: 'Goods Received & Stock Updated',
        description: `Shipment for ${po.orderNumber} received. Stock has been incremented.`,
        type: 'inventory',
        severity: 'success',
        timestamp: 'Just now',
        isRead: false,
      },
      ...prev,
    ]);
  };

  // Stock Adjustment with Reason and Audit Trail
  const adjustStock = (productId: string, newStock: number, reason: string) => {
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    const diff = newStock - prod.currentStock;
    const movement: StockMovement = {
      id: `mov-${Date.now()}`,
      productId: prod.id,
      productName: prod.name,
      sku: prod.sku,
      date: new Date().toISOString().replace('T', ' ').substring(0, 16),
      type: 'Adjustment',
      quantityChange: diff,
      stockBefore: prod.currentStock,
      stockAfter: newStock,
      reason,
      referenceId: `ADJ-${Date.now().toString().slice(-6)}`,
      performedBy: currentUser.name,
    };

    setStockMovements(prev => [movement, ...prev]);

    setProducts(prev =>
      prev.map(p => {
        if (p.id === productId) {
          const status = newStock === 0 ? 'Out of Stock' : newStock <= p.minStockLevel ? 'Low Stock' : 'In Stock';
          return { ...p, currentStock: newStock, status };
        }
        return p;
      })
    );

    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        action: 'Stock Adjustment',
        module: 'Inventory',
        details: `Adjusted ${prod.name} (${prod.sku}) from ${prod.currentStock} to ${newStock} units. Reason: ${reason}`,
        user: currentUser.name,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        ipAddress: '192.168.1.10',
      },
      ...prev,
    ]);
  };

  const addProduct = (productData: Omit<Product, 'id' | 'unitsSold' | 'status' | 'margin'>): Product => {
    const id = `prod-${Date.now()}`;
    const margin = Math.round(((productData.sellingPrice - productData.purchaseCost) / productData.sellingPrice) * 100);
    const status: Product['status'] =
      productData.currentStock === 0 ? 'Out of Stock' : productData.currentStock <= productData.minStockLevel ? 'Low Stock' : 'In Stock';

    const newProd: Product = {
      ...productData,
      id,
      unitsSold: 0,
      margin,
      status,
    };

    setProducts(prev => [newProd, ...prev]);

    setStockMovements(prev => [
      {
        id: `mov-${Date.now()}`,
        productId: id,
        productName: newProd.name,
        sku: newProd.sku,
        date: new Date().toISOString().replace('T', ' ').substring(0, 16),
        type: 'Adjustment',
        quantityChange: newProd.openingStock,
        stockBefore: 0,
        stockAfter: newProd.openingStock,
        reason: 'Opening Stock Entry',
        referenceId: 'OPEN-STOCK',
        performedBy: currentUser.name,
      },
      ...prev,
    ]);

    return newProd;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => {
        if (p.id === id) {
          const updated = { ...p, ...updates };
          if (updates.sellingPrice !== undefined || updates.purchaseCost !== undefined) {
            updated.margin = Math.round(((updated.sellingPrice - updated.purchaseCost) / updated.sellingPrice) * 100);
          }
          if (updated.currentStock === 0) updated.status = 'Out of Stock';
          else if (updated.currentStock <= updated.minStockLevel) updated.status = 'Low Stock';
          else updated.status = 'In Stock';
          return updated;
        }
        return p;
      })
    );
  };

  const archiveProduct = (id: string) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, status: 'Archived' } : p)));
  };

  const addCustomer = (cust: Omit<Customer, 'id' | 'outstandingBalance' | 'totalOrders'>): Customer => {
    const newCust: Customer = {
      ...cust,
      id: `cust-${Date.now()}`,
      outstandingBalance: 0,
      totalOrders: 0,
    };
    setCustomers(prev => [newCust, ...prev]);
    return newCust;
  };

  const addSupplier = (sup: Omit<Supplier, 'id' | 'outstandingPayable'>): Supplier => {
    const newSup: Supplier = {
      ...sup,
      id: `sup-${Date.now()}`,
      outstandingPayable: 0,
    };
    setSuppliers(prev => [newSup, ...prev]);
    return newSup;
  };

  const addExpense = (exp: Omit<Expense, 'id' | 'status' | 'recordedBy'>): Expense => {
    const newExp: Expense = {
      ...exp,
      id: `exp-${Date.now()}`,
      status: 'Approved',
      recordedBy: currentUser.name,
    };
    setExpenses(prev => [newExp, ...prev]);
    return newExp;
  };

  const recordInvoicePayment = (invoiceId: string, amount: number) => {
    setInvoices(prev =>
      prev.map(inv => {
        if (inv.id === invoiceId) {
          const newPaid = inv.paidAmount + amount;
          const due = Math.max(0, inv.totalAmount - newPaid);
          return {
            ...inv,
            paidAmount: newPaid,
            dueAmount: due,
            status: due <= 0 ? 'Paid' : 'Partial',
          };
        }
        return inv;
      })
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const login = (emailOrPhone: string, password: string): { success: boolean; message?: string } => {
    const cleanInput = emailOrPhone.trim().toLowerCase();
    const matched = staff.find(
      s => s.email.toLowerCase() === cleanInput || s.phone.includes(cleanInput)
    );

    if (password.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters long.' };
    }

    const authenticatedUser = matched || {
      id: `staff-${Date.now()}`,
      name: emailOrPhone.split('@')[0] || 'Store Administrator',
      email: emailOrPhone.includes('@') ? emailOrPhone : `${emailOrPhone}@bizflow.local`,
      phone: '+977 9841000000',
      role: 'Administrator' as const,
      branch: 'Main Branch',
      status: 'Active' as const,
      lastActive: 'Just now',
      permissions: {
        canManageProducts: true,
        canCreateSales: true,
        canManagePurchases: true,
        canViewFinancials: true,
        canManageStaff: true,
        canModifySettings: true,
      },
    };

    setCurrentUser(authenticatedUser);
    setIsAuthenticated(true);
    localStorage.setItem('bizflow_is_authenticated', 'true');
    localStorage.setItem('bizflow_auth_user', JSON.stringify(authenticatedUser));

    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        action: 'User Sign In',
        module: 'Security & Auth',
        details: `${authenticatedUser.name} (${authenticatedUser.role}) signed in successfully`,
        user: authenticatedUser.name,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        ipAddress: '192.168.1.42',
      },
      ...prev,
    ]);

    return { success: true };
  };

  const register = (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role?: UserRole;
    businessName?: string;
  }): { success: boolean; message?: string } => {
    const cleanEmail = userData.email.trim().toLowerCase();
    const existing = staff.find(s => s.email.toLowerCase() === cleanEmail);
    if (existing) {
      return { success: false, message: 'An account with this email already exists. Please sign in.' };
    }

    if (userData.password.length < 4) {
      return { success: false, message: 'Password must be at least 4 characters long.' };
    }

    const newRole: UserRole = userData.role || 'Owner';
    const newMember: StaffMember = {
      id: `staff-${Date.now()}`,
      name: userData.name.trim(),
      email: cleanEmail,
      phone: userData.phone.trim() || '+977 9800000000',
      role: newRole,
      branch: 'Main Branch',
      status: 'Active',
      lastActive: 'Just registered',
      permissions: {
        canManageProducts: true,
        canCreateSales: true,
        canManagePurchases: true,
        canViewFinancials: true,
        canManageStaff: newRole === 'Owner' || newRole === 'Administrator',
        canModifySettings: newRole === 'Owner',
      },
    };

    setStaff(prev => [...prev, newMember]);
    setCurrentUser(newMember);
    setIsAuthenticated(true);
    localStorage.setItem('bizflow_is_authenticated', 'true');
    localStorage.setItem('bizflow_auth_user', JSON.stringify(newMember));

    if (userData.businessName) {
      updateBusiness({ name: userData.businessName });
    }

    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        action: 'User Registration',
        module: 'Security & Auth',
        details: `${newMember.name} registered as ${newMember.role}`,
        user: newMember.name,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        ipAddress: '192.168.1.42',
      },
      ...prev,
    ]);

    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('bizflow_is_authenticated');
    setAuditLogs(prev => [
      {
        id: `log-${Date.now()}`,
        action: 'User Sign Out',
        module: 'Security & Auth',
        details: `${currentUser.name} signed out and locked the session`,
        user: currentUser.name,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        ipAddress: '192.168.1.42',
      },
      ...prev,
    ]);
  };

  const resetDemoData = () => {
    localStorage.clear();
    setBusiness(initialBusiness);
    setProducts(initialProducts);
    setSales(initialSales);
    setPurchaseOrders(initialPurchaseOrders);
    setInvoices(initialInvoices);
    setExpenses(initialExpenses);
    setCustomers(initialCustomers);
    setSuppliers(initialSuppliers);
    setStaff(initialStaff);
    setNotifications(initialNotifications);
    setStockMovements(initialStockMovements);
    setAuditLogs(initialAuditLogs);
    setIsAuthenticated(true);
    localStorage.setItem('bizflow_is_authenticated', 'true');
  };

  return (
    <ERPContext.Provider
      value={{
        business,
        updateBusiness,
        branches,
        currentBranch,
        setCurrentBranch,
        currentUser,
        setCurrentUser,
        isAuthenticated,
        login,
        register,
        logout,
        products,
        sales,
        purchaseOrders,
        invoices,
        expenses,
        customers,
        suppliers,
        staff,
        notifications,
        stockMovements,
        auditLogs,
        currency,
        setCurrency,
        formatMoney,
        formatNumber,
        createSale,
        createPurchaseOrder,
        receiveGoods,
        adjustStock,
        addProduct,
        updateProduct,
        archiveProduct,
        addCustomer,
        addSupplier,
        addExpense,
        recordInvoicePayment,
        markNotificationRead,
        markAllNotificationsRead,
        resetDemoData,
        activeTab,
        setActiveTab,
        isNewOrderModalOpen,
        setIsNewOrderModalOpen,
        isCommandPaletteOpen,
        setIsCommandPaletteOpen,
        viewingInvoice,
        setViewingInvoice,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => {
  const context = useContext(ERPContext);
  if (!context) throw new Error('useERP must be used within an ERPProvider');
  return context;
};
