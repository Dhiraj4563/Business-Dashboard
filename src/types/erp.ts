export type Currency = 'NPR' | 'INR' | 'USD';

export type UserRole = 
  | 'Owner' 
  | 'Administrator' 
  | 'Manager' 
  | 'Cashier' 
  | 'Inventory Staff' 
  | 'Accountant';

export interface BusinessProfile {
  id: string;
  name: string;
  tagline: string;
  legalName: string;
  panVatNumber: string; // PAN for Nepal/India, GSTIN for India
  email: string;
  phone: string;
  address: string;
  city: string;
  country: 'Nepal' | 'India';
  currency: Currency;
  currencySymbol: string;
  defaultTaxRate: number; // e.g. 13 for Nepal VAT, 18 for India GST
  financialYear: string;
  invoicePrefix: string;
  logoUrl?: string;
  isDemoMode: boolean;
}

export interface Branch {
  id: string;
  name: string;
  code: string;
  address: string;
  phone: string;
  isMain: boolean;
}

export interface Category {
  id: string;
  name: string;
  code: string;
  color: string;
}

export interface Product {
  id: string;
  sku: string;
  barcode: string;
  name: string;
  description: string;
  category: string;
  unit: string;
  purchaseCost: number;
  sellingPrice: number;
  taxRate: number;
  openingStock: number;
  currentStock: number;
  minStockLevel: number;
  supplierId: string;
  supplierName: string;
  unitsSold: number;
  margin: number;
  status: 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Archived';
  branchId: string;
}

export interface StockMovement {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  date: string;
  type: 'Purchase' | 'Sale' | 'Adjustment' | 'Transfer' | 'Return';
  quantityChange: number;
  stockBefore: number;
  stockAfter: number;
  reason: string;
  referenceId: string;
  performedBy: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  panOrGstin?: string;
  creditLimit: number;
  outstandingBalance: number;
  totalOrders: number;
  status: 'Active' | 'Blocked';
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  panOrGstin: string;
  paymentTerms: string;
  outstandingPayable: number;
}

export interface SaleItem {
  productId: string;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  discount: number;
  taxAmount: number;
  total: number;
}

export interface Sale {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  customerPhone?: string;
  branchId: string;
  items: SaleItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  paidAmount: number;
  balanceDue: number;
  paymentMethod: 'Cash' | 'Credit Card' | 'Bank Transfer' | 'eSewa' | 'Khalti' | 'UPI';
  status: 'Confirmed' | 'Paid' | 'Partially Paid' | 'Draft' | 'Cancelled';
  createdAt: string;
  createdBy: string;
  notes?: string;
}

export interface PurchaseItem {
  productId: string;
  productName: string;
  sku: string;
  quantityOrdered: number;
  quantityReceived: number;
  unitCost: number;
  totalCost: number;
}

export interface PurchaseOrder {
  id: string;
  orderNumber: string;
  supplierId: string;
  supplierName: string;
  branchId: string;
  items: PurchaseItem[];
  subtotal: number;
  taxTotal: number;
  grandTotal: number;
  status: 'Draft' | 'Ordered' | 'Partially Received' | 'Received' | 'Cancelled';
  paymentStatus: 'Pending' | 'Partially Paid' | 'Paid';
  paidAmount: number;
  expectedDate: string;
  createdAt: string;
  supplierInvoiceRef?: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  saleId: string;
  customerId: string;
  customerName: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  discount: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: 'Paid' | 'Partial' | 'Overdue' | 'Unpaid';
  items: SaleItem[];
}

export interface Expense {
  id: string;
  title: string;
  category: 'Rent' | 'Salaries' | 'Electricity' | 'Transport' | 'Marketing' | 'Maintenance' | 'Office Supplies' | 'Miscellaneous';
  amount: number;
  date: string;
  paymentMethod: 'Cash' | 'Bank Transfer' | 'Digital Wallet';
  vendor: string;
  referenceNumber: string;
  status: 'Approved' | 'Pending Approval' | 'Rejected';
  recordedBy: string;
  notes?: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  branch: string;
  status: 'Active' | 'Suspended';
  lastActive: string;
  permissions: {
    canManageProducts: boolean;
    canCreateSales: boolean;
    canManagePurchases: boolean;
    canViewFinancials: boolean;
    canManageStaff: boolean;
    canModifySettings: boolean;
  };
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'inventory' | 'sales' | 'finance' | 'system';
  severity: 'info' | 'warning' | 'alert' | 'success';
  timestamp: string;
  isRead: boolean;
  link?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  module: string;
  details: string;
  user: string;
  timestamp: string;
  ipAddress: string;
}
