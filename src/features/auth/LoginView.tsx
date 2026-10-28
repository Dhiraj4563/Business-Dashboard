import React, { useState } from 'react';
import { 
  Store, 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  User, 
  Building2, 
  Phone, 
  AlertCircle,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { UserRole } from '../../types/erp';

export const LoginView: React.FC = () => {
  const { login, register, business } = useERP();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('aldi.k@bizflow.com');
  const [loginPassword, setLoginPassword] = useState('password123');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regBusinessName, setRegBusinessName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('Owner');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Status & modal states
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const res = login(loginEmail, loginPassword);
    if (!res.success) {
      setErrorMsg(res.message || 'Invalid email or password.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (regPassword !== regConfirmPassword) {
      setErrorMsg('Passwords do not match. Please verify both fields.');
      return;
    }

    if (regPassword.length < 4) {
      setErrorMsg('Password must be at least 4 characters long.');
      return;
    }

    const res = register({
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      role: regRole,
      businessName: regBusinessName || undefined,
    });

    if (!res.success) {
      setErrorMsg(res.message || 'Registration failed.');
    } else {
      setSuccessMsg('Account registered successfully! Welcome to Business.');
    }
  };

  const fillQuickAccount = (email: string) => {
    setAuthMode('login');
    setLoginEmail(email);
    setLoginPassword('password123');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen w-screen bg-[#F8FAFC] flex flex-col justify-between py-8 px-4 sm:px-6 select-none">
      {/* Brand Header */}
      <div className="max-w-md w-full mx-auto flex items-center justify-between pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
            <Store className="w-5 h-5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 tracking-tight text-lg leading-tight">
              {business.name || 'Business'}
            </h2>
            <p className="text-[11px] text-slate-500 font-medium">
              Run Your Business Smarter.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            login('aldi.k@bizflow.com', 'password123');
          }}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/80 hover:bg-blue-100/80 px-3 py-1.5 rounded-lg border border-blue-200/80 transition-colors cursor-pointer"
        >
          Explore Demo
        </button>
      </div>

      {/* Main Container */}
      <div className="max-w-md w-full mx-auto my-auto">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-200/90 space-y-6">
          {/* Clean Segmented Tab Switcher */}
          <div className="grid grid-cols-2 p-1 bg-slate-100 rounded-xl border border-slate-200/80 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthMode('login');
                setErrorMsg('');
              }}
              className={`py-2 rounded-lg transition-all ${
                authMode === 'login'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setAuthMode('register');
                setErrorMsg('');
              }}
              className={`py-2 rounded-lg transition-all ${
                authMode === 'register'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Register New User
            </button>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              {authMode === 'login' ? 'Welcome back' : 'Create an account'}
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              {authMode === 'login'
                ? 'Sign in to manage inventory, sales, customers, and invoices.'
                : 'Register your staff or store profile to begin handling the dashboard.'}
            </p>
          </div>

          {/* Error & Success Messages */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* SIGN IN FORM */}
          {authMode === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email or Phone Number
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="name@business.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/40 focus:bg-white text-xs font-medium text-slate-900 placeholder-slate-400"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsForgotModalOpen(true)}
                    className="text-[11px] font-medium text-blue-600 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/40 focus:bg-white text-xs font-mono text-slate-900 placeholder-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Clean Quick Demo Accounts */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Quick Demo Accounts
                </span>
                <div className="grid grid-cols-2 gap-2 text-left">
                  <button
                    type="button"
                    onClick={() => fillQuickAccount('aldi.k@bizflow.com')}
                    className="p-2 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-xs transition-colors"
                  >
                    <div className="font-semibold text-slate-800">Manager</div>
                    <div className="text-[10px] text-slate-400 truncate">aldi.k@bizflow.com</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillQuickAccount('dhirajbabu456@gmail.com')}
                    className="p-2 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-xs transition-colors"
                  >
                    <div className="font-semibold text-slate-800">Owner</div>
                    <div className="text-[10px] text-slate-400 truncate">dhirajbabu456@gmail.com</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillQuickAccount('pooja.s@bizflow.com')}
                    className="p-2 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-xs transition-colors"
                  >
                    <div className="font-semibold text-slate-800">Cashier</div>
                    <div className="text-[10px] text-slate-400 truncate">pooja.s@bizflow.com</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => fillQuickAccount('gita.a@bizflow.com')}
                    className="p-2 rounded-lg border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 text-xs transition-colors"
                  >
                    <div className="font-semibold text-slate-800">Accountant</div>
                    <div className="text-[10px] text-slate-400 truncate">gita.a@bizflow.com</div>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            /* REGISTER / SIGN UP FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Shrestha"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/40 focus:bg-white text-xs font-medium text-slate-900 placeholder-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Business / Store Name (Optional)
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Kathmandu General Trading"
                    value={regBusinessName}
                    onChange={(e) => setRegBusinessName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/40 focus:bg-white text-xs font-medium text-slate-900 placeholder-slate-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="email"
                      required
                      placeholder="ramesh@mail.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/40 focus:bg-white text-xs font-medium text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="+977 9841..."
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/40 focus:bg-white text-xs font-mono text-slate-900 placeholder-slate-400"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assigned User Role
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as UserRole)}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500 text-xs font-medium text-slate-800"
                >
                  <option value="Owner">Owner (Full Business Access)</option>
                  <option value="Manager">Manager (Operations, POS, Inventory)</option>
                  <option value="Cashier">Cashier (Point of Sale)</option>
                  <option value="Accountant">Accountant (Invoices & Payments)</option>
                  <option value="Inventory Staff">Inventory Staff (Stock & Receipts)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/40 focus:bg-white text-xs font-mono text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={regConfirmPassword}
                      onChange={(e) => setRegConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 bg-slate-50/40 focus:bg-white text-xs font-mono text-slate-900"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl text-xs shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
              >
                <span>Register & Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-[11px] text-slate-500 pt-1">
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setAuthMode('login')}
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Sign in here
                </button>
              </p>
            </form>
          )}
        </div>

        <div className="mt-4 text-center flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Role-Based Access Control (RBAC) & Secure Session</span>
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-md w-full mx-auto text-center text-[11px] text-slate-400 pt-2">
        <span>© 2026 {business.name || 'Business'}. All rights reserved.</span>
      </div>

      {/* Forgot Password Dialog */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm">Reset Password</h3>
            <p className="text-xs text-slate-500">
              Enter your work email address to receive recovery instructions.
            </p>

            {forgotSent ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs space-y-1">
                <div className="font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Reset Instructions Sent</span>
                </div>
                <p className="text-[11px] text-emerald-700">
                  Default demo password for sample users is <strong className="font-mono">password123</strong>.
                </p>
              </div>
            ) : (
              <input
                type="email"
                placeholder="name@business.com"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
              />
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsForgotModalOpen(false);
                  setForgotSent(false);
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Close
              </button>
              {!forgotSent && (
                <button
                  type="button"
                  onClick={() => setForgotSent(true)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs"
                >
                  Send Reset Link
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
