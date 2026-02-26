import React, { useState } from 'react';
import { X, User, Lock, Save, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfileModalProps {
  onClose: () => void;
}

type Tab = 'profile' | 'password';

const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const { user, updateProfile, changePassword } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  // Profile form
  const [name, setName] = useState(user?.name || '');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Password form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const getInitials = (n: string) => n.slice(0, 2) || '관리';

  const handleProfileSave = async () => {
    if (!name.trim()) { setProfileError('이름을 입력해주세요.'); return; }
    if (name.trim() === user?.name) { setProfileError('변경된 내용이 없습니다.'); return; }
    setProfileError(null);
    setProfileLoading(true);
    try {
      await updateProfile({ name: name.trim() });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setProfileError(msg || '프로필 업데이트에 실패했습니다.');
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordChange = async () => {
    setPasswordError(null);
    if (!currentPassword) { setPasswordError('현재 비밀번호를 입력해주세요.'); return; }
    if (newPassword.length < 8) { setPasswordError('새 비밀번호는 8자 이상이어야 합니다.'); return; }
    if (newPassword !== confirmPassword) { setPasswordError('새 비밀번호가 일치하지 않습니다.'); return; }
    setPasswordLoading(true);
    try {
      await changePassword(currentPassword, newPassword);
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3000);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setPasswordError(msg || '비밀번호 변경에 실패했습니다.');
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-b border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-extrabold text-slate-900">내 계정</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/60 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <span className="text-white text-xl font-bold">{getInitials(user?.name || '관리자')}</span>
            </div>
            <div>
              <p className="font-extrabold text-slate-900 text-lg">{user?.name || '관리자'}</p>
              <p className="text-sm text-slate-500">{user?.email}</p>
              <span className="inline-block mt-1 text-[10px] font-bold bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold transition-colors ${
              activeTab === 'profile'
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <User size={15} />
            기본 정보
          </button>
          <button
            onClick={() => setActiveTab('password')}
            className={`flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-bold transition-colors ${
              activeTab === 'password'
                ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Lock size={15} />
            비밀번호
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* --- 기본 정보 탭 --- */}
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">이름</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => { setName(e.target.value); setProfileError(null); setProfileSuccess(false); }}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                  placeholder="이름 입력"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 mb-1.5">이메일</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-sm text-slate-400 cursor-not-allowed"
                />
                <p className="text-[11px] text-slate-400 mt-1.5">이메일은 변경할 수 없습니다.</p>
              </div>

              {profileError && (
                <p className="text-xs font-medium text-rose-500 bg-rose-50 px-3 py-2 rounded-lg">{profileError}</p>
              )}
              {profileSuccess && (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                  <CheckCircle size={14} /> 프로필이 업데이트되었습니다.
                </div>
              )}

              <button
                onClick={handleProfileSave}
                disabled={profileLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {profileLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Save size={15} />
                )}
                저장
              </button>
            </div>
          )}

          {/* --- 비밀번호 탭 --- */}
          {activeTab === 'password' && (
            <div className="space-y-4">
              {[
                { label: '현재 비밀번호', value: currentPassword, setter: setCurrentPassword, show: showCurrent, toggleShow: () => setShowCurrent(p => !p) },
                { label: '새 비밀번호', value: newPassword, setter: setNewPassword, show: showNew, toggleShow: () => setShowNew(p => !p) },
                { label: '새 비밀번호 확인', value: confirmPassword, setter: setConfirmPassword, show: showConfirm, toggleShow: () => setShowConfirm(p => !p) },
              ].map(({ label, value, setter, show, toggleShow }) => (
                <div key={label}>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5">{label}</label>
                  <div className="relative">
                    <input
                      type={show ? 'text' : 'password'}
                      value={value}
                      onChange={e => { setter(e.target.value); setPasswordError(null); setPasswordSuccess(false); }}
                      className="w-full px-4 py-3 pr-10 rounded-xl border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition-all"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={toggleShow}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {show ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              ))}

              {newPassword && newPassword.length < 8 && (
                <p className="text-[11px] text-amber-500">비밀번호는 8자 이상이어야 합니다.</p>
              )}
              {newPassword && confirmPassword && newPassword !== confirmPassword && (
                <p className="text-[11px] text-rose-500">비밀번호가 일치하지 않습니다.</p>
              )}

              {passwordError && (
                <p className="text-xs font-medium text-rose-500 bg-rose-50 px-3 py-2 rounded-lg">{passwordError}</p>
              )}
              {passwordSuccess && (
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-2 rounded-lg">
                  <CheckCircle size={14} /> 비밀번호가 변경되었습니다.
                </div>
              )}

              <button
                onClick={handlePasswordChange}
                disabled={passwordLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {passwordLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Lock size={15} />
                )}
                비밀번호 변경
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
