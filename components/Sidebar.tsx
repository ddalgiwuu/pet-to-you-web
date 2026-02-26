
import React, { memo } from 'react';
import { LayoutGrid, Calendar, Folder, MessageSquare, Settings, Moon, Activity, BarChart2, Sun, Scissors, Home, Stethoscope, Layers, Phone, LogOut } from 'lucide-react';
import { PageId, ServiceType } from '../types';

// Hoisted: static icon elements created once, not on every Sidebar render
const ICONS = {
  dashboard:     <LayoutGrid size={20} />,
  schedule:      <Calendar size={20} />,
  calls:         <Phone size={20} />,
  messages:      <MessageSquare size={20} />,
  reports:       <BarChart2 size={20} />,
  settings:      <Settings size={20} />,
  patients:      <Folder size={20} />,
  hospital:      <Stethoscope size={20} />,
  grooming:      <Scissors size={20} />,
  hotel:         <Home size={20} />,
  layers:        <Layers size={20} />,
  activity:      <Activity size={20} />,
};

interface SidebarProps {
  isOpen: boolean;
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  activeServices: ServiceType[];
  globalFilter?: ServiceType | 'all'; // New prop for filtering context
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, activePage, setActivePage, onMouseEnter, onMouseLeave, darkMode, toggleDarkMode, activeServices, globalFilter = 'all', onLogout }) => {
  
  // Dynamic Label & Icon Logic
  const getServiceStatusLabel = () => {
      if (globalFilter === 'grooming') return { label: '미용 현황', icon: ICONS.grooming };
      if (globalFilter === 'hotel')    return { label: '객실 현황', icon: ICONS.hotel };
      if (globalFilter === 'hospital') return { label: '진료 현황', icon: ICONS.hospital };
      if (activeServices.length > 1)  return { label: '서비스 현황', icon: ICONS.layers };
      const type = activeServices[0];
      switch(type) {
          case 'grooming': return { label: '미용 현황', icon: ICONS.grooming };
          case 'hotel':    return { label: '객실 현황', icon: ICONS.hotel };
          case 'hospital': return { label: '진료 현황', icon: ICONS.hospital };
          default:         return { label: '서비스 현황', icon: ICONS.activity };
      }
  };

  const getPatientLabel = () => {
      if (globalFilter === 'grooming') return '미용 고객';
      if (globalFilter === 'hotel') return '투숙객 명부';
      if (globalFilter === 'hospital') return '환자 차트';
      
      if (activeServices.length === 1 && activeServices[0] === 'hotel') return '투숙객 기록';
      return '고객 기록';
  }

  const statusItem = getServiceStatusLabel();

  return (
    <aside 
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`fixed left-4 top-4 bottom-4 rounded-3xl glass-panel z-50 flex flex-col items-center py-6 transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] shadow-2xl ${
        isOpen ? 'w-64' : 'w-20'
      } ${darkMode ? 'bg-slate-900/90 border-slate-700' : 'bg-white/40'}`}
    >
      <div className="mb-8 w-full px-4 flex items-center justify-center relative min-h-[40px]">
        <div className="flex items-center gap-3 overflow-hidden whitespace-nowrap z-10 cursor-pointer" onClick={() => setActivePage('dashboard')}>
           <div className="w-10 h-10 min-w-[2.5rem] bg-slate-900 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-slate-500/30 transform transition-transform hover:rotate-3 hover:scale-110 duration-300">
             P
           </div>
           <span className={`font-extrabold text-lg tracking-tight transition-all duration-500 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10 hidden'} ${darkMode ? 'text-white' : 'text-slate-800'}`}>
             Pet to You
           </span>
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-2 w-full px-3">
        <NavItem icon={ICONS.dashboard} label="대시보드" id="dashboard" isActive={activePage === 'dashboard'} onClick={setActivePage} isOpen={isOpen} darkMode={darkMode} />
        <NavItem icon={statusItem.icon} label={statusItem.label} id="medical-status" isActive={activePage === 'medical-status'} onClick={setActivePage} isOpen={isOpen} darkMode={darkMode} />
        <NavItem icon={ICONS.schedule} label="일정 관리" id="schedule" isActive={activePage === 'schedule'} onClick={setActivePage} isOpen={isOpen} darkMode={darkMode} />
        <NavItem icon={ICONS.patients} label={getPatientLabel()} id="patients" isActive={activePage === 'patients'} onClick={setActivePage} isOpen={isOpen} darkMode={darkMode} />
        <NavItem icon={ICONS.calls} label="통화 기록" id="calls" isActive={activePage === 'calls'} onClick={setActivePage} isOpen={isOpen} darkMode={darkMode} />
        <NavItem icon={ICONS.messages} label="메시지" id="messages" isActive={activePage === 'messages'} onClick={setActivePage} isOpen={isOpen} darkMode={darkMode} />
        <NavItem icon={ICONS.reports} label="리포트" id="reports" isActive={activePage === 'reports'} onClick={setActivePage} isOpen={isOpen} darkMode={darkMode} />
      </nav>

      <div className="flex flex-col gap-2 w-full px-3 mb-2">
        <NavItem icon={ICONS.settings} label="설정" id="settings" isActive={activePage === 'settings'} onClick={setActivePage} isOpen={isOpen} darkMode={darkMode} />
        <button
            onClick={toggleDarkMode}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 group ${!isOpen && 'justify-center'} ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-white/40'}`}
        >
            <div className={`w-10 h-10 min-w-[2.5rem] rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-300 ${
                darkMode ? 'bg-yellow-400 text-slate-900' : 'bg-slate-800 text-white'
            }`}>
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </div>
            {isOpen && <span className={`text-sm font-medium group-hover:font-bold ${darkMode ? 'text-slate-300 group-hover:text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>{darkMode ? '라이트 모드' : '다크 모드'}</span>}
        </button>
        <button
            onClick={onLogout}
            className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-300 group ${!isOpen && 'justify-center'} ${darkMode ? 'hover:bg-slate-800' : 'hover:bg-rose-50'}`}
        >
            <div className={`w-10 h-10 min-w-[2.5rem] rounded-full flex items-center justify-center shadow-sm group-hover:scale-105 transition-all duration-300 ${
                darkMode ? 'bg-slate-700 text-slate-400' : 'bg-white text-slate-400 group-hover:text-rose-500'
            }`}>
                <LogOut size={18} />
            </div>
            {isOpen && <span className={`text-sm font-medium group-hover:font-bold ${darkMode ? 'text-slate-400' : 'text-slate-500 group-hover:text-rose-600'}`}>로그아웃</span>}
        </button>
      </div>
    </aside>
  );
};

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    id: PageId;
    isActive: boolean;
    onClick: (id: PageId) => void;
    isOpen: boolean;
    darkMode: boolean;
}

const NavItem: React.FC<NavItemProps> = memo(({ icon, label, id, isActive, onClick, isOpen, darkMode }) => {
  return (
    <button
        onClick={() => onClick(id)}
        className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all duration-300 group relative overflow-hidden ${
        isActive
            ? (darkMode ? 'bg-slate-800 shadow-lg border border-slate-700 text-white' : 'bg-white/60 shadow-lg shadow-indigo-100/50 border border-white/80 text-slate-900')
            : (darkMode ? 'text-slate-400 hover:bg-slate-800/50 hover:text-white' : 'text-slate-400 hover:bg-white/30 border border-transparent hover:border-white/40 hover:text-slate-800')
        } ${!isOpen && 'justify-center'}`}
    >
        {isActive && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]"></div>}
        <div className="relative z-10 transition-colors duration-300">{icon}</div>
        {isOpen && (
            <span className={`relative z-10 text-sm font-medium whitespace-nowrap overflow-hidden transition-colors duration-300 ${isActive ? 'font-bold' : ''}`}>
                {label}
            </span>
        )}
    </button>
  );
});

export default Sidebar;
