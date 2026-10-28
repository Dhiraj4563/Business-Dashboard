import React, { useState } from 'react';
import { Code2, Server, Database, Shield, Layers, FileCode, CheckCircle2, Copy } from 'lucide-react';

export const BackendDocsView: React.FC = () => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const copyToClipboard = (text: string, section: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const sampleFastApiRoute = `# backend/app/api/v1/sales.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.db.session import get_db
from app.schemas.sale import SaleCreate, SaleResponse
from app.services.inventory_service import process_sale_transaction
from app.core.auth import get_current_user

router = APIRouter(prefix="/sales", tags=["Sales"])

@router.post("/", response_model=SaleResponse, status_code=status.HTTP_201_CREATED)
def create_sale(
    sale_in: SaleCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """
    Transactional sale creation:
    1. Validates physical stock availability for each line item.
    2. Atomically creates the sale record and line items.
    3. Decrements stock in the products ledger with an audit trail.
    4. Automatically generates the compliant Tax Invoice record.
    5. Updates customer outstanding receivables if partially paid.
    """
    return process_sale_transaction(db=db, sale_data=sale_in, user_id=current_user.id)
`;

  const sampleSqlAlchemyModel = `# backend/app/models/inventory.py
from sqlalchemy import Column, String, Integer, Numeric, ForeignKey, DateTime, func
from sqlalchemy.orm import relationship
from app.db.base_class import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(String(36), primary_key=True, index=True)
    business_id = Column(String(36), ForeignKey("businesses.id"), nullable=False, index=True)
    branch_id = Column(String(36), ForeignKey("branches.id"), nullable=False, index=True)
    sku = Column(String(50), nullable=False, index=True)
    barcode = Column(String(64), index=True)
    name = Column(String(200), nullable=False)
    category = Column(String(100), nullable=False)
    unit = Column(String(20), default="pcs")
    purchase_cost = Column(Numeric(12, 2), nullable=False)
    selling_price = Column(Numeric(12, 2), nullable=False)
    tax_rate = Column(Numeric(5, 2), default=13.00)
    current_stock = Column(Integer, default=0)
    min_stock_level = Column(Integer, default=5)
    supplier_id = Column(String(36), ForeignKey("suppliers.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
`;

  return (
    <div className="p-6 space-y-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">FastAPI + PostgreSQL Backend Source</h1>
          <p className="text-xs text-slate-400 mt-0.5">Production Python backend architecture, Alembic database migrations, and REST OpenAPI specs</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-semibold bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-xl border border-emerald-200">
            Source in /backend directory
          </span>
        </div>
      </div>

      {/* Tech Stack Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Server className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">FastAPI Framework</span>
          </div>
          <p className="text-xs text-slate-500">Python 3.11+, Pydantic v2 data models, async route handlers, automatic OpenAPI Swagger UI.</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-purple-600 mb-1">
            <Database className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">PostgreSQL + ORM</span>
          </div>
          <p className="text-xs text-slate-500">SQLAlchemy 2.0 with Decimal numeric types for financial math and Alembic migration scripts.</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-amber-600 mb-1">
            <Shield className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">JWT & RBAC</span>
          </div>
          <p className="text-xs text-slate-500">Bcrypt password hashing, OAuth2 Bearer JWT tokens, and multi-tenant business scoping.</p>
        </div>

        <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center gap-2 text-emerald-600 mb-1">
            <Layers className="w-4 h-4" />
            <span className="text-xs font-bold uppercase">Stock Atomicity</span>
          </div>
          <p className="text-xs text-slate-500">Transactional stock ledger commits: Purchases add only on receipt; Sales deduct only on confirm.</p>
        </div>
      </div>

      {/* Code Snippets Preview */}
      <div className="space-y-4">
        <div className="bg-slate-900 rounded-2xl p-5 text-slate-100 shadow-xl border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-blue-400" />
              <span>backend/app/api/v1/sales.py (FastAPI Endpoint)</span>
            </span>
            <button
              onClick={() => copyToClipboard(sampleFastApiRoute, 'route')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1 transition-colors"
            >
              {copiedSection === 'route' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'route' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="mt-3 text-xs font-mono overflow-x-auto text-slate-300 leading-relaxed">
            {sampleFastApiRoute}
          </pre>
        </div>

        <div className="bg-slate-900 rounded-2xl p-5 text-slate-100 shadow-xl border border-slate-800">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-purple-400" />
              <span>backend/app/models/inventory.py (SQLAlchemy 2.0 Entity)</span>
            </span>
            <button
              onClick={() => copyToClipboard(sampleSqlAlchemyModel, 'model')}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1 transition-colors"
            >
              {copiedSection === 'model' ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'model' ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
          <pre className="mt-3 text-xs font-mono overflow-x-auto text-slate-300 leading-relaxed">
            {sampleSqlAlchemyModel}
          </pre>
        </div>
      </div>
    </div>
  );
};
