
import React, { useState } from 'react';
import { Search, Bell, Stethoscope, Scissors, Home, Check, Layers, LogOut, UserCog } from 'lucide-react';
import { PageId, ServiceType, NotificationItem } from '../types';
import ProfileModal from './ProfileModal';

interface TopNavProps {
    activePage: PageId;
    sidebarOpen: boolean;
    activeServices: ServiceType[];
    notifications?: NotificationItem[];
    setNotifications?: (items: NotificationItem[]) => void;
    globalServiceFilter?: ServiceType | 'all';
    setGlobalServiceFilter?: (filter: ServiceType | 'all') => void;
    darkMode?: boolean;
    user?: { id: string; email: string; name: string; role: string; hospitalId?: string };
    onLogout?: () => void;
}

const TopNav: React.FC<TopNavProps> = ({
    activePage,
    sidebarOpen,
    activeServices,
    notifications = [],
    setNotifications,
    globalServiceFilter = 'all',
    setGlobalServiceFilter,
    darkMode,
    user,
    onLogout
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getPageTitle = (id: PageId) => {
      switch(id) {
          case 'dashboard': return '대시보드';
          case 'schedule': return '일정 관리';
          case 'medical-status': 
            if (globalServiceFilter === 'all') return '통합 서비스 현황';
            if (globalServiceFilter === 'grooming') return '미용 서비스 현황';
            if (globalServiceFilter === 'hotel') return '객실 및 케어 현황';
            return '진료 현황';
          case 'patients': 
            if (globalServiceFilter === 'hotel') return '투숙객 기록';
            if (globalServiceFilter === 'grooming') return '미용 고객 기록';
            return '환자/고객 기록';
          case 'calls': return '통화 기록';
          case 'messages': return '메시지';
          case 'settings': return '설정';
          default: return '통합 관리';
      }
  };

  const getRoleLabel = () => {
    if (activeServices.length > 1) return '통합 매니저';
    const type = activeServices[0];
    if (type === 'hospital') return '진료과 1';
    if (type === 'grooming') return '수석 디자이너';
    return '매니저';
  }

  const getInitials = (name: string) => {
    return name.slice(0, 2) || '관리';
  };

  const markAllAsRead = () => {
      if (setNotifications) {
          setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      }
  }

  const getServiceIcon = (type?: ServiceType | 'all', isActive?: boolean) => {
      const colorClass = isActive ? "text-white" : "text-slate-500 group-hover:text-slate-700";
      switch(type) {
          case 'hospital': return <Stethoscope size={14} className={colorClass} />;
          case 'grooming': return <Scissors size={14} className={colorClass} />;
          case 'hotel': return <Home size={14} className={colorClass} />;
          case 'all': return <Layers size={14} className={colorClass} />;
          default: return <Bell size={14} className={colorClass} />;
      }
  }

  return (
    <>
    <header
        className={`h-20 px-8 flex items-center justify-between sticky top-0 z-40 transition-all duration-300 ease-in-out backdrop-blur-xl border-b ${
            darkMode 
            ? 'bg-slate-900/80 border-slate-800 text-white' 
            : 'bg-white/70 border-white/50 text-slate-800 shadow-sm'
        }`}
    >
      <div className="flex items-center gap-8 relative z-10">
        <h2 className={`font-extrabold text-3xl tracking-tight animate-in fade-in slide-in-from-left-4 duration-700 min-w-[140px] ${darkMode ? 'text-white' : 'text-slate-800'}`}>
            {getPageTitle(activePage)}
        </h2>
      </div>

      {/* --- MASTER SWITCH UI (Centered) --- */}
      {activeServices.length > 1 && setGlobalServiceFilter && (
          <div className={`absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center backdrop-blur-md p-1.5 rounded-full shadow-sm border animate-in fade-in slide-in-from-top-2 duration-500 gap-1 z-20 ${
              darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white/80 border-slate-100'
          }`}>
              <button
                  onClick={() => setGlobalServiceFilter('all')}
                  className={`group flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                      globalServiceFilter === 'all' 
                      ? (darkMode ? 'bg-slate-600 text-white' : 'bg-slate-900 text-white shadow-md transform scale-105')
                      : (darkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-100')
                  }`}
              >
                  {getServiceIcon('all', globalServiceFilter === 'all')}
                  전체
              </button>
              {activeServices.includes('hospital') && (
                  <button
                      onClick={() => setGlobalServiceFilter('hospital')}
                      className={`group flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                          globalServiceFilter === 'hospital' 
                          ? (darkMode ? 'bg-slate-600 text-white' : 'bg-slate-900 text-white shadow-md transform scale-105')
                          : (darkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-100')
                      }`}
                  >
                      {getServiceIcon('hospital', globalServiceFilter === 'hospital')}
                      병원
                  </button>
              )}
              {activeServices.includes('grooming') && (
                  <button
                      onClick={() => setGlobalServiceFilter('grooming')}
                      className={`group flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                          globalServiceFilter === 'grooming' 
                          ? (darkMode ? 'bg-slate-600 text-white' : 'bg-slate-900 text-white shadow-md transform scale-105')
                          : (darkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-100')
                      }`}
                  >
                      {getServiceIcon('grooming', globalServiceFilter === 'grooming')}
                      미용
                  </button>
              )}
              {activeServices.includes('hotel') && (
                  <button
                      onClick={() => setGlobalServiceFilter('hotel')}
                      className={`group flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                          globalServiceFilter === 'hotel' 
                          ? (darkMode ? 'bg-slate-600 text-white' : 'bg-slate-900 text-white shadow-md transform scale-105')
                          : (darkMode ? 'text-slate-400 hover:bg-slate-700' : 'text-slate-500 hover:bg-slate-100')
                      }`}
                  >
                      {getServiceIcon('hotel', globalServiceFilter === 'hotel')}
                      호텔
                  </button>
              )}
          </div>
      )}

      <div className="flex items-center gap-4 relative z-10">
        <div className={`hidden xl:flex items-center rounded-full px-4 py-2.5 mr-2 focus-within:ring-2 focus-within:ring-indigo-100 transition-all duration-300 ${darkMode ? 'bg-slate-800/50 hover:bg-slate-800' : 'glass-panel hover:bg-white/40'}`}>
            <Search size={18} className="text-slate-400" />
            <input 
                type="text" 
                name="search"
                autoComplete="off"
                placeholder="통합 검색..." 
                className={`bg-transparent border-none outline-none text-sm ml-2 w-32 focus:w-48 transition-all duration-500 placeholder:text-slate-400 ${darkMode ? 'text-white' : 'text-slate-700'}`}
            />
        </div>

        {/* Notification Bell with Dropdown */}
        <div className="relative">
            <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className={`p-3 rounded-full text-slate-500 hover:text-indigo-600 transition-all duration-300 relative shadow-sm group ${
                    showNotifications 
                    ? 'bg-white text-indigo-600 shadow-md' 
                    : (darkMode ? 'bg-slate-800/50 hover:bg-slate-800' : 'glass-panel hover:bg-white')
                }`}
            >
                <Bell size={20} className="group-hover:animate-swing origin-top" />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[9px] font-bold text-white items-center justify-center">
                            {unreadCount}
                        </span>
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {showNotifications && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                    <div className="absolute right-0 top-full mt-4 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                            <h3 className="font-bold text-slate-800">알림 ({unreadCount})</h3>
                            <button onClick={markAllAsRead} className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                                <Check size={12} /> 모두 읽음
                            </button>
                        </div>
                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length > 0 ? (
                                notifications.map(notif => (
                                    <div key={notif.id} className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${!notif.isRead ? 'bg-indigo-50/30' : ''}`}>
                                        <div className="flex gap-3">
                                            <div className={`mt-1 w-8 h-8 rounded-full flex items-center justify-center shadow-sm border border-white ${
                                                notif.serviceType === 'hospital' ? 'bg-indigo-100' :
                                                notif.serviceType === 'grooming' ? 'bg-pink-100' : 'bg-orange-100'
                                            }`}>
                                                {getServiceIcon(notif.serviceType, false)}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className={`text-sm font-bold ${!notif.isRead ? 'text-slate-900' : 'text-slate-600'}`}>{notif.title}</h4>
                                                <p className="text-xs text-slate-500 mt-0.5 leading-snug">{notif.message}</p>
                                                <span className="text-[10px] text-slate-400 mt-2 block font-medium">{notif.time}</span>
                                            </div>
                                            {!notif.isRead && <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2"></div>}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-slate-400 text-sm">새로운 알림이 없습니다.</div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className={`flex items-center gap-3 pl-4 border-l hover:opacity-80 transition-opacity ${darkMode ? 'border-slate-700' : 'border-slate-200/40'}`}
          >
            <div className="text-right hidden xl:block animate-in fade-in duration-1000">
              <p className={`text-sm font-bold ${darkMode ? 'text-white' : 'text-slate-800'}`}>{user?.name || '관리자'}</p>
              <p className="text-xs text-slate-500 font-medium">{getRoleLabel()}</p>
            </div>
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg hover:shadow-indigo-200 hover:scale-105 transition-all duration-300 cursor-pointer">
              <span className="text-white text-sm font-bold tracking-tight">
                {getInitials(user?.name || '관리자')}
              </span>
            </div>
          </button>

          {/* 프로필 드롭다운 */}
          {showProfile && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
              <div className="absolute right-0 top-full mt-4 w-72 bg-white rounded-2xl shadow-2xl border border-slate-100 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* 유저 정보 헤더 */}
                <div className="p-5 bg-gradient-to-br from-indigo-50 to-purple-50 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-md flex-shrink-0">
                      <span className="text-white text-sm font-bold">{getInitials(user?.name || '관리자')}</span>
                    </div>
                    <div className="min-w-0">
                      <p className="font-extrabold text-slate-900 truncate">{user?.name || '관리자'}</p>
                      <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                        {getRoleLabel()}
                      </span>
                    </div>
                  </div>
                </div>
                {/* 메뉴 */}
                <div className="p-2 space-y-0.5">
                  <button
                    onClick={() => { setShowProfile(false); setShowProfileModal(true); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <UserCog size={16} className="text-slate-400" />
                    내 계정 설정
                  </button>
                  <div className="mx-4 border-t border-slate-100" />
                  <button
                    onClick={() => { setShowProfile(false); onLogout?.(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut size={16} />
                    로그아웃
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>

    {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} />}
  </>
  );
};

export default TopNav;
