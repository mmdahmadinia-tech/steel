import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User } from '../data/mockData';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function UsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [error, setError] = useState('');

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/users`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (err) {
        console.error('Fetch users error:', err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  const getRoleName = (role: string) => {
    const r: Record<string, string> = { admin: 'مدیر سایت', eaf_user: 'کاربر EAF', lf_user: 'کاربر LF', ccm_user: 'کاربر CCM', analyst: 'تحلیلگر' };
    return r[role] || role;
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا مطمئن هستید؟')) return;
    
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      
      if (response.ok) {
        setUsers(users.filter(u => u.id !== id));
      }
    } catch (err) {
      console.error('Delete user error:', err);
    }
  };

  const handleToggleActive = async (user: User) => {
    try {
      const response = await fetch(`${API_URL}/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !user.isActive }),
      });
      
      if (response.ok) {
        const updated = await response.json();
        setUsers(users.map(u => u.id === user.id ? updated : u));
      }
    } catch (err) {
      console.error('Toggle active error:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="text-xl font-bold text-gray-800">مدیریت کاربران</h2><p className="text-sm text-gray-500">ایجاد و مدیریت حساب‌های کاربری</p></div>
        <button onClick={() => { setEditUser(null); setShowModal(true); }} className="btn-primary">+ کاربر جدید</button>
      </div>

      {loading ? (
        <div className="card text-center py-12">در حال بارگذاری...</div>
      ) : (
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
                {users.map((u: User) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-sm">{u.username}</td>
                    <td className="px-4 py-3 font-medium">{u.fullName}</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">{getRoleName(u.role)}</span></td>
                    <td className="px-4 py-3"><div className="flex gap-1">{u.unitAccess.map((a: string) => <span key={a} className="px-2 py-0.5 rounded text-xs bg-gray-100">{a}</span>)}</div></td>
                    <td className="px-4 py-3">{u.isActive ? <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">فعال</span> : <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-700">غیرفعال</span>}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button onClick={() => handleToggleActive(u)} className="text-amber-600 text-sm">{u.isActive ? 'غیرفعال' : 'فعال'}</button>
                        {u.id !== '1' && <button onClick={() => handleDelete(u.id)} className="text-red-600 text-sm">حذف</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
