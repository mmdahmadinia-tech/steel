import React, { useState } from 'react';
import { mockUsers, User } from '../data/mockData';

export default function UsersPage() {
  const [users] = useState<User[]>(mockUsers);
  const [showModal, setShowModal] = useState(false);

  const getRoleName = (role: string) => {
    const roles: Record<string, string> = {
      admin: 'مدیر سامانه',
      eaf_user: 'کاربر EAF',
      lf_user: 'کاربر LF',
      ccm_user: 'کاربر CCM',
      shift_supervisor: 'سرپرست شیفت',
      production_manager: 'مدیر تولید',
      analyst: 'تحلیلگر فرایند',
      it_admin: 'مسئول IT',
    };
    return roles[role] || role;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800">مدیریت کاربران</h2>
          <p className="text-sm text-gray-500">ایجاد، ویرایش و مدیریت حساب‌های کاربری</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn-primary">
          + کاربر جدید
        </button>
      </div>

      {/* Users Table */}
      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">نام کاربری</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">نام کامل</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">نقش</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">دسترسی واحدها</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">وضعیت</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-sm">{user.username}</td>
                  <td className="px-4 py-3 font-medium">{user.fullName}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                      {getRoleName(user.role)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {user.unitAccess.map(u => (
                        <span key={u} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                          {u}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {user.isActive ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                        ✓ فعال
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                        ✗ غیرفعال
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">ویرایش</button>
                      <button className="text-amber-600 hover:text-amber-800 text-sm">مجوزها</button>
                      {user.id !== '1' && (
                        <button className="text-red-600 hover:text-red-800 text-sm">
                          {user.isActive ? 'غیرفعال' : 'فعال'}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permissions Matrix */}
      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4">ماتریس دسترسی‌ها</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500">مجوز</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">مدیر</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">EAF</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">LF</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">CCM</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">سرپرست</th>
                <th className="px-3 py-2 text-center text-xs font-medium text-gray-500">مدیر تولید</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {[
                { name: 'مشاهده', roles: [true, true, true, true, true, true] },
                { name: 'ایجاد', roles: [true, true, true, true, true, false] },
                { name: 'ویرایش', roles: [true, true, true, true, true, false] },
                { name: 'تأیید', roles: [true, false, false, false, true, false] },
                { name: 'مدیریت کاربران', roles: [true, false, false, false, false, false] },
                { name: 'مشاهده گزارش‌ها', roles: [true, false, false, false, true, true] },
                { name: 'سوابق تغییرات', roles: [true, false, false, false, true, true] },
                { name: 'پشتیبان‌گیری', roles: [true, false, false, false, false, false] },
              ].map(row => (
                <tr key={row.name} className="hover:bg-gray-50">
                  <td className="px-3 py-2 font-medium">{row.name}</td>
                  {row.roles.map((has, i) => (
                    <td key={i} className="px-3 py-2 text-center">
                      {has ? <span className="text-green-500">✓</span> : <span className="text-gray-300">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">ایجاد کاربر جدید</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">نام کاربری</label>
                  <input type="text" className="input-field" placeholder="username" />
                </div>
                <div>
                  <label className="label-field">نام کامل</label>
                  <input type="text" className="input-field" placeholder="نام و نام خانوادگی" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label-field">رمز عبور</label>
                  <input type="password" className="input-field" placeholder="رمز عبور" />
                </div>
                <div>
                  <label className="label-field">نقش</label>
                  <select className="input-field">
                    <option>کاربر EAF</option>
                    <option>کاربر LF</option>
                    <option>کاربر CCM</option>
                    <option>سرپرست شیفت</option>
                    <option>مدیر تولید</option>
                    <option>تحلیلگر</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label-field">دسترسی واحدها</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" defaultChecked />
                    <span>EAF</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>LF</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" className="rounded" />
                    <span>CCM</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowModal(false)} className="btn-primary flex-1">ایجاد کاربر</button>
              <button onClick={() => setShowModal(false)} className="btn-secondary flex-1">انصراف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
