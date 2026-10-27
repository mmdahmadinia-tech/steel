import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../data/mockData';

export default function UsersPage() {
  const { users, addUser, updateUser, removeUser } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);

  const getRoleName = (role: string) => {
    const r: Record<string, string> = { admin: 'مدیر سایت', eaf_user: 'کاربر EAF', lf_user: 'کاربر LF', ccm_user: 'کاربر CCM', analyst: 'تحلیلگر' };
    return r[role] || role;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-gray-800">مدیریت کاربران</h2><p className="text-sm text-gray-500">ایجاد و مدیریت حساب‌های کاربری</p></div>
        <button onClick={() => { setEditUser(null); setShowModal(true); }} className="btn-primary">+ کاربر جدید</button>
      </div>

      <div className="card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">نام کاربری</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">نام کامل</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">نقش</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">دسترسی</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">وضعیت</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map(u => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-sm">{u.username}</td>
                  <td className="px-4 py-3 font-medium">{u.fullName}</td>
                  <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{getRoleName(u.role)}</span></td>
                  <td className="px-4 py-3"><div className="flex gap-1">{u.unitAccess.map(a => <span key={a} className="px-2 py-0.5 rounded text-xs bg-gray-100">{a}</span>)}</div></td>
                  <td className="px-4 py-3">{u.isActive ? <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">فعال</span> : <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">غیرفعال</span>}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => { setEditUser(u); setShowModal(true); }} className="text-blue-600 text-sm">ویرایش</button>
                      <button onClick={() => updateUser(u.id, { isActive: !u.isActive })} className="text-amber-600 text-sm">{u.isActive ? 'غیرفعال' : 'فعال'}</button>
                      {u.id !== '1' && <button onClick={() => removeUser(u.id)} className="text-red-600 text-sm">حذف</button>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && <UserModal user={editUser} onClose={() => setShowModal(false)} onSave={(data) => {
        if (editUser) { updateUser(editUser.id, data); } else { addUser({ ...data, id: Date.now().toString(), isActive: true } as User); }
        setShowModal(false);
      }} />}
    </div>
  );
}

function UserModal({ user, onClose, onSave }: { user: User | null; onClose: () => void; onSave: (data: any) => void }) {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    password: user?.password || '',
    fullName: user?.fullName || '',
    role: user?.role || 'eaf_user',
    unitAccess: user?.unitAccess || ['EAF'],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">{user ? 'ویرایش کاربر' : 'ایجاد کاربر جدید'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div><label className="label-field">نام کاربری</label><input type="text" className="input-field" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} required /></div>
            <div><label className="label-field">رمز عبور</label><input type="text" className="input-field" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required /></div>
          </div>
          <div><label className="label-field">نام کامل</label><input type="text" className="input-field" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} required /></div>
          <div>
            <label className="label-field">نقش</label>
            <select className="input-field" value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as any})}>
              <option value="admin">مدیر سایت</option>
              <option value="eaf_user">کاربر EAF</option>
              <option value="lf_user">کاربر LF</option>
              <option value="ccm_user">کاربر CCM</option>
              <option value="analyst">تحلیلگر</option>
            </select>
          </div>
          <div>
            <label className="label-field">دسترسی واحدها</label>
            <div className="flex gap-4">
              {['EAF', 'LF', 'CCM'].map(unit => (
                <label key={unit} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={formData.unitAccess.includes(unit as any)} onChange={e => {
                    const newAccess = e.target.checked ? [...formData.unitAccess, unit as any] : formData.unitAccess.filter(u => u !== unit);
                    setFormData({...formData, unitAccess: newAccess});
                  }} />
                  <span>{unit}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button type="submit" className="btn-primary flex-1">ذخیره</button>
            <button type="button" onClick={onClose} className="btn-secondary flex-1">انصراف</button>
          </div>
        </form>
      </div>
    </div>
  );
}
