from sqlalchemy import Column, String, Integer, Numeric, Boolean, ForeignKey, DateTime, Text, func
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()

class Business(Base):
    __tablename__ = "businesses"
    id = Column(String(36), primary_key=True)
    name = Column(String(100), nullable=False)
    legal_name = Column(String(200), nullable=False)
    pan_vat_number = Column(String(50), nullable=False)
    country = Column(String(50), default="Nepal")
    currency = Column(String(10), default="NPR")
    default_tax_rate = Column(Numeric(5, 2), default=13.00)
    financial_year = Column(String(50))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Branch(Base):
    __tablename__ = "branches"
    id = Column(String(36), primary_key=True)
    business_id = Column(String(36), ForeignKey("businesses.id"), nullable=False)
    name = Column(String(100), nullable=False)
    code = Column(String(50), nullable=False)
    address = Column(String(255))
    is_main = Column(Boolean, default=False)

class Product(Base):
    __tablename__ = "products"
    id = Column(String(36), primary_key=True, index=True)
    business_id = Column(String(36), ForeignKey("businesses.id"), nullable=False, index=True)
    branch_id = Column(String(36), ForeignKey("branches.id"), nullable=False, index=True)
    sku = Column(String(50), nullable=False, index=True)
    barcode = Column(String(64), index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text)
    category = Column(String(100), nullable=False, index=True)
    unit = Column(String(20), default="pcs")
    purchase_cost = Column(Numeric(12, 2), nullable=False)
    selling_price = Column(Numeric(12, 2), nullable=False)
    tax_rate = Column(Numeric(5, 2), default=13.00)
    current_stock = Column(Integer, default=0, nullable=False)
    min_stock_level = Column(Integer, default=5, nullable=False)
    supplier_id = Column(String(36), ForeignKey("suppliers.id"))
    status = Column(String(30), default="In Stock")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class StockMovement(Base):
    __tablename__ = "stock_movements"
    id = Column(String(36), primary_key=True)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False, index=True)
    movement_type = Column(String(30), nullable=False)  # Sale, Purchase, Adjustment, Return
    quantity_change = Column(Integer, nullable=False)
    stock_before = Column(Integer, nullable=False)
    stock_after = Column(Integer, nullable=False)
    reason = Column(String(255), nullable=False)
    reference_id = Column(String(50), nullable=False)
    performed_by = Column(String(100), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Sale(Base):
    __tablename__ = "sales"
    id = Column(String(36), primary_key=True)
    order_number = Column(String(50), unique=True, nullable=False)
    customer_id = Column(String(36), ForeignKey("customers.id"), nullable=False)
    subtotal = Column(Numeric(12, 2), nullable=False)
    discount_total = Column(Numeric(12, 2), default=0.00)
    tax_total = Column(Numeric(12, 2), default=0.00)
    grand_total = Column(Numeric(12, 2), nullable=False)
    paid_amount = Column(Numeric(12, 2), default=0.00)
    balance_due = Column(Numeric(12, 2), default=0.00)
    payment_method = Column(String(50), nullable=False)
    status = Column(String(30), default="Confirmed")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Invoice(Base):
    __tablename__ = "invoices"
    id = Column(String(36), primary_key=True)
    invoice_number = Column(String(50), unique=True, nullable=False)
    sale_id = Column(String(36), ForeignKey("sales.id"), nullable=False)
    issue_date = Column(DateTime, nullable=False)
    due_date = Column(DateTime, nullable=False)
    subtotal = Column(Numeric(12, 2), nullable=False)
    discount = Column(Numeric(12, 2), default=0.00)
    tax_amount = Column(Numeric(12, 2), default=0.00)
    total_amount = Column(Numeric(12, 2), nullable=False)
    paid_amount = Column(Numeric(12, 2), default=0.00)
    due_amount = Column(Numeric(12, 2), default=0.00)
    status = Column(String(30), default="Unpaid")
