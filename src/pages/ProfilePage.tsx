import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

export default function ProfilePage() {
  const { user, changePassword } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!user) return;
    if (newPassword.length < 4) { setError('رمز عبور جدید باید حداقل ۴ کاراکتر باشد'); return; }
    if (newPassword !== confirmPassword) { setError('رمز عبور جدید و تکرار آن مطابقت ندارند'); return; }

    const success = await changePassword(currentPassword, newPassword);
    if (success) {
      setMessage('رمز عبور با موفقیت تغییر کرد');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setError('رمز عبور فعلی اشتباه است یا خطا در تغییر رمز');
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="card">
        <h2 className="text-xl font-bold text-gray-800 mb-4">👤 پروفایل کاربری</h2>
        <div className="grid grid-cols-2 gap-4">
          <div><p className="text-sm text-gray-500">نام کاربری</p><p className="font-bold text-gray-800">{user.username}</p></div>
          <div><p className="text-sm text-gray-500">نام کامل</p><p className="font-bold text-gray-800">{user.fullName}</p></div>
          <div><p className="text-sm text-gray-500">نقش</p><p className="font-bold text-gray-800">{user.role === 'admin' ? 'مدیر سایت' : user.role === 'eaf_user' ? 'کاربر EAF' : user.role === 'lf_user' ? 'کاربر LF' : user.role === 'ccm_user' ? 'کاربر CCM' : 'تحلیلگر'}</p></div>
          <div><p className="text-sm text-gray-500">دسترسی</p><p className="font-bold text-gray-800">{user.unitAccess.join(', ')}</p></div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold text-gray-800 mb-4">🔒 تغییر رمز عبور</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="label-field">رمز عبور فعلی</label><input type="password" className="input-field" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required /></div>
          <div><label className="label-field">رمز عبور جدید</label><input type="password" className="input-field" value={newPassword} onChange={e => setNewPassword(e.target.value)} required /></div>
          <div><label className="label-field">تکرار رمز عبور جدید</label><input type="password" className="input-field" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required /></div>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">{error}</div>}
          {message && <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">{message}</div>}
          <button type="submit" className="btn-primary">تغییر رمز عبور</button>
        </form>
      </div>
    </div>
  );
}
