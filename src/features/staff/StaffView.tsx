import React, { useState } from 'react';
import { Briefcase, Plus, Search, Shield, Check, X, UserCheck } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { StaffMember, UserRole } from '../../types/erp';

export const StaffView: React.FC = () => {
  const { staff, currentUser, setCurrentUser } = useERP();
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [staffList, setStaffList] = useState<StaffMember[]>(staff);

  const [newStaff, setNewStaff] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Cashier' as UserRole,
    branch: 'Main Branch',
  });

  const handleTogglePermission = (staffId: string, permKey: keyof StaffMember['permissions']) => {
    setStaffList(prev =>
      prev.map(s => {
        if (s.id === staffId) {
          return {
            ...s,
            permissions: {
              ...s.permissions,
              [permKey]: !s.permissions[permKey],
            },
          };
        }
        return s;
      })
    );
  };

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStaff.name || !newStaff.email) return;

    const member: StaffMember = {
      id: `staff-${Date.now()}`,
      name: newStaff.name,
      email: newStaff.email,
      phone: newStaff.phone,
      role: newStaff.role,
      branch: newStaff.branch,
      status: 'Active',
      lastActive: 'Just invited',
      permissions: {
        canManageProducts: newStaff.role === 'Owner' || newStaff.role === 'Administrator' || newStaff.role === 'Inventory Staff',
        canCreateSales: newStaff.role !== 'Accountant' && newStaff.role !== 'Inventory Staff',
        canManagePurchases: newStaff.role === 'Owner' || newStaff.role === 'Administrator' || newStaff.role === 'Inventory Staff',
        canViewFinancials: newStaff.role === 'Owner' || newStaff.role === 'Administrator' || newStaff.role === 'Accountant',
        canManageStaff: newStaff.role === 'Owner' || newStaff.role === 'Administrator',
        canModifySettings: newStaff.role === 'Owner',
      },
    };

    setStaffList(prev => [...prev, member]);
    setIsInviteOpen(false);
  };

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Staff & Permissions (RBAC)</h1>
          <p className="text-xs text-slate-400 mt-0.5">Role-based access control, branch assignments, and granular functional permissions</p>
        </div>

        <button
          onClick={() => setIsInviteOpen(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-colors cursor-pointer self-start sm:self-auto min-h-[40px]"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Invite Staff Member</span>
        </button>
      </div>

      {/* Staff Directory & Permission Matrix */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900 text-sm">Active Team Members & Assigned Roles</h3>
          <span className="text-xs text-slate-400">Click permission checks to toggle granular access</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[760px]">
            <thead className="bg-slate-50 text-slate-400 font-bold border-b border-slate-100 uppercase text-[11px] tracking-wider">
              <tr>
                <th className="py-3 px-5">Employee</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Branch</th>
                <th className="py-3 px-3 text-center">Manage Products</th>
                <th className="py-3 px-3 text-center">Create Sales</th>
                <th className="py-3 px-3 text-center">Purchases</th>
                <th className="py-3 px-3 text-center">Financials</th>
                <th className="py-3 px-3 text-center">Staff Admin</th>
                <th className="py-3 px-3 text-center">Settings</th>
                <th className="py-3 px-5 text-right">Switch As</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {staffList.map(member => (
                <tr key={member.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5 font-bold text-slate-900">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {member.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <div>{member.name}</div>
                        <div className="text-[10px] text-slate-400 font-normal">{member.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                      {member.role}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-slate-600 font-medium">
                    {member.branch}
                  </td>

                  {/* Permission Checkboxes */}
                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => handleTogglePermission(member.id, 'canManageProducts')}
                      className={`w-5 h-5 rounded-md inline-flex items-center justify-center transition-colors ${
                        member.permissions.canManageProducts ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-300'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => handleTogglePermission(member.id, 'canCreateSales')}
                      className={`w-5 h-5 rounded-md inline-flex items-center justify-center transition-colors ${
                        member.permissions.canCreateSales ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-300'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => handleTogglePermission(member.id, 'canManagePurchases')}
                      className={`w-5 h-5 rounded-md inline-flex items-center justify-center transition-colors ${
                        member.permissions.canManagePurchases ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-300'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => handleTogglePermission(member.id, 'canViewFinancials')}
                      className={`w-5 h-5 rounded-md inline-flex items-center justify-center transition-colors ${
                        member.permissions.canViewFinancials ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-300'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => handleTogglePermission(member.id, 'canManageStaff')}
                      className={`w-5 h-5 rounded-md inline-flex items-center justify-center transition-colors ${
                        member.permissions.canManageStaff ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-300'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => handleTogglePermission(member.id, 'canModifySettings')}
                      className={`w-5 h-5 rounded-md inline-flex items-center justify-center transition-colors ${
                        member.permissions.canModifySettings ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-300'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </td>

                  <td className="py-3.5 px-5 text-right">
                    <button
                      onClick={() => setCurrentUser(member)}
                      className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                        currentUser.id === member.id
                          ? 'bg-slate-900 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {currentUser.id === member.id ? 'Active' : 'Switch'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Staff Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Invite Staff Member</h3>
              <button onClick={() => setIsInviteOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddStaff} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sujan Shrestha"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sujan@bizflow.np"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone</label>
                <input
                  type="text"
                  placeholder="e.g. +977 9800000000"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  className="w-full p-2 font-mono rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Role</label>
                <select
                  value={newStaff.role}
                  onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value as any })}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Cashier">Cashier</option>
                  <option value="Inventory Staff">Inventory Staff</option>
                  <option value="Manager">Manager</option>
                  <option value="Accountant">Accountant</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Assigned Branch</label>
                <select
                  value={newStaff.branch}
                  onChange={(e) => setNewStaff({ ...newStaff, branch: e.target.value })}
                  className="w-full p-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-blue-500"
                >
                  <option value="Main Branch">Main Branch</option>
                  <option value="Biratnagar Outlet">Biratnagar Outlet</option>
                  <option value="Pokhara Lakeside Hub">Pokhara Lakeside Hub</option>
                  <option value="All Branches">All Branches</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold shadow-xs"
                >
                  Send Invitation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
