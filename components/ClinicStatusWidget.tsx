
import React from 'react';
import { User, Stethoscope, Clock, CheckCircle2, XCircle, AlertCircle, Settings } from 'lucide-react';
import { Staff, ServiceType, DayOfWeek } from '../types';

interface ClinicStatusWidgetProps {
    staff: Staff[];
    activeServices: ServiceType[];
    globalFilter?: ServiceType | 'all'; // New Prop
    onManageClick?: () => void;
}

const ClinicStatusWidget: React.FC<ClinicStatusWidgetProps> = ({ staff, activeServices, globalFilter = 'all', onManageClick }) => {
    // Determine terminology based on filter
    const getTerminology = () => {
        if (globalFilter === 'all' && activeServices.length > 1) return { staff: '통합 스탭', room: '시설', action: '서비스' };
        
        const type = globalFilter === 'all' ? activeServices[0] : globalFilter;
        if (type === 'grooming') return { staff: '디자이너', room: '미용실', action: '미용' };
        if (type === 'hotel') return { staff: '매니저', room: '객실', action: '케어' };
        return { staff: '의료진', room: '진료실', action: '진료' };
    };

    const terminology = getTerminology();
    
    // Get Current Day
    const days: DayOfWeek[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDay = days[new Date().getDay()];

    // Dynamically generate rooms based on active services and filter
    const getMajorRooms = () => {
        const rooms = [];
        const typesToShow = globalFilter === 'all' ? activeServices : [globalFilter];

        if (typesToShow.includes('hospital')) {
            rooms.push({ id: 'h1', name: '제1진료실', status: 'occupied' });
            rooms.push({ id: 'h2', name: '수술실', status: 'occupied' });
        }
        if (typesToShow.includes('grooming')) {
            rooms.push({ id: 'g1', name: '미용실 A', status: 'available' });
            if (globalFilter === 'grooming') rooms.push({ id: 'g2', name: '미용실 B', status: 'occupied' });
        }
        if (typesToShow.includes('hotel')) {
            rooms.push({ id: 't1', name: '놀이터', status: 'available' });
            if (globalFilter === 'hotel') rooms.push({ id: 't2', name: 'VIP룸 1', status: 'occupied' });
        }
        
        // Fill if empty or too few (fallback)
        if (rooms.length === 0) {
            rooms.push({ id: '1', name: '제1진료실', status: 'occupied' });
            rooms.push({ id: '2', name: '수술실', status: 'available' });
        }
        return rooms.slice(0, 6); // Limit displayed rooms
    };

    const majorRooms = getMajorRooms();

    // Sort: Online first, then Busy, then Offline, then unknown
    const sortedStaff = [...staff].sort((a, b) => {
        const getScore = (status: string) => {
            if (status === 'online') return 1;
            if (status === 'busy') return 2;
            if (status === 'break') return 3;
            if (status === 'offline') return 4;
            return 5;
        }
        return getScore(a.status) - getScore(b.status);
    });

    const getStatusIcon = (status: string) => {
        switch(status) {
            case 'online': return <CheckCircle2 size={8} className="text-white" strokeWidth={4} />;
            case 'busy': return <Stethoscope size={8} className="text-white" strokeWidth={3} />;
            case 'break': return <Clock size={8} className="text-white" strokeWidth={3} />;
            default: return <XCircle size={8} className="text-white" strokeWidth={3} />;
        }
    }

    const getStatusColor = (status: string) => {
         switch(status) {
            case 'online': return 'bg-emerald-500';
            case 'busy': return 'bg-rose-500';
            case 'break': return 'bg-amber-500';
            case 'offline': return 'bg-slate-400';
            default: return 'bg-indigo-500';
        }
    }
    
    // Helper to get today's info
    const getTodayInfo = (staff: Staff) => {
        if (!staff.schedules) return { isOff: false, breakTime: '' };
        const schedule = staff.schedules[currentDay];
        if (schedule.isOff) return { isOff: true, label: '오늘 휴무' };
        return { isOff: false, label: `${schedule.workStart}~${schedule.workEnd}`, breakTime: `${schedule.breakStart}~${schedule.breakEnd}` };
    };

    return (
        <div className="glass-panel rounded-3xl p-6 w-full bg-white shadow-xl shadow-slate-200/20 mb-6 border-l-4 border-indigo-500 relative group/widget">
            {onManageClick && (
                <button 
                    onClick={onManageClick}
                    className="absolute top-6 right-6 p-2 rounded-full bg-slate-50 text-slate-400 opacity-0 group-hover/widget:opacity-100 hover:bg-slate-100 hover:text-slate-600 transition-all duration-300"
                    title="설정 바로가기"
                >
                    <Settings size={16} />
                </button>
            )}

            <div className="flex justify-between items-start mb-5">
                <div>
                    <h3 className="text-lg font-extrabold text-slate-900">실시간 자원 현황</h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">워크인/신규 예약 배정 가이드</p>
                </div>
                <div className="px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-600">접수 가능</span>
                </div>
            </div>

            {/* 1. Staff Availability */}
            <div className="space-y-3 mb-6">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <span>{terminology.staff} 상태</span>
                    <span>다음 예약 가능</span>
                </div>
                {sortedStaff.length > 0 ? sortedStaff.map(doc => {
                    const todayInfo = getTodayInfo(doc);
                    return (
                        <div key={doc.id} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <img src={doc.image} alt={doc.name} className="w-10 h-10 rounded-full object-cover border border-slate-100" />
                                    <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center ${getStatusColor(todayInfo.isOff ? 'offline' : doc.status)}`}>
                                        {getStatusIcon(todayInfo.isOff ? 'offline' : doc.status)}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-slate-800">{doc.name}</h4>
                                    <div className="flex items-center gap-2">
                                        <p className={`text-[11px] font-medium ${
                                            doc.status === 'online' && !todayInfo.isOff ? 'text-emerald-600' : 'text-slate-500'
                                        }`}>
                                            {todayInfo.isOff ? 'OFF' : doc.currentTask || doc.status}
                                        </p>
                                        {!todayInfo.isOff && todayInfo.breakTime && (
                                             <span className="text-[9px] bg-slate-100 px-1 rounded text-slate-400" title="휴게 시간">
                                                {todayInfo.breakTime}
                                             </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className={`text-xs font-bold px-2 py-1 rounded-lg ${
                                doc.status === 'online' && !todayInfo.isOff
                                ? 'bg-emerald-100 text-emerald-700' 
                                : 'bg-slate-100 text-slate-500'
                            }`}>
                                {todayInfo.isOff ? '휴무일' : (doc.status === 'online' ? '지금 바로' : '확인 필요')}
                            </div>
                        </div>
                    );
                }) : (
                    <div className="text-center text-xs text-slate-400 py-4">등록된 {terminology.staff}이 없습니다.</div>
                )}
            </div>

            {/* 2. Room Quick Status */}
            <div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">주요 시설 현황</div>
                <div className="grid grid-cols-2 gap-2">
                    {majorRooms.map(room => (
                        <div key={room.id} className={`flex items-center justify-between px-3 py-2 rounded-xl border ${
                            room.status === 'available' 
                            ? 'bg-white border-emerald-100 text-emerald-700 shadow-sm' 
                            : 'bg-slate-50 border-slate-100 text-slate-400'
                        }`}>
                            <span className="text-xs font-bold">{room.name}</span>
                            {room.status === 'available' ? (
                                <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.4)]"></div>
                            ) : (
                                <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Quick Action Hint */}
            <div className="mt-5 pt-4 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-500 font-medium flex items-center justify-center gap-1">
                    <Clock size={12} className="text-indigo-500" />
                    가장 빠른 예약: <span className="font-bold text-slate-800">
                         {majorRooms.find(r => r.status === 'available')?.name || '대기 필요'} - 지금
                    </span>
                </p>
            </div>
        </div>
    );
};

export default ClinicStatusWidget;
