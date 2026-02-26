import React from 'react';
import { MoreHorizontal, CalendarDays, Clock, MapPin } from 'lucide-react';
import { ServiceType, CalendarEvent } from '../types';

interface ScheduleWidgetProps {
    activeServices?: ServiceType[];
    globalFilter?: ServiceType | 'all';
    events: CalendarEvent[];
}

const ScheduleWidget: React.FC<ScheduleWidgetProps> = ({ activeServices = ['hospital'], globalFilter = 'all', events }) => {
    // Determine status based on current time
    const getCurrentStatus = (start: string, duration: number) => {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        const currentTime = currentHour * 60 + currentMinute;

        const [startHour, startMinute] = start.split(':').map(Number);
        const startTime = startHour * 60 + startMinute;
        const endTime = startTime + duration;

        if (currentTime >= startTime && currentTime < endTime) return 'current';
        if (currentTime > endTime) return 'past';
        return 'future';
    };

    // Filter events
    const filteredSchedule = events.filter(item => {
        // First check if service is active generally
        if (!activeServices.includes(item.serviceType as ServiceType)) return false;
        
        // Then apply global filter
        if (globalFilter === 'all') return true;
        return item.serviceType === globalFilter;
    });

    // Sort by time
    const sortedSchedule = [...filteredSchedule].sort((a, b) => a.time.localeCompare(b.time));

    return (
        <div className="glass-panel rounded-3xl p-6 w-full bg-white shadow-xl shadow-slate-200/20 flex flex-col h-full min-h-[500px]">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h3 className="text-lg font-extrabold text-slate-900">오늘의 일정</h3>
                    <p className="text-xs text-slate-500 font-medium mt-0.5">{new Date().toLocaleDateString()}</p>
                </div>
                <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-colors flex items-center justify-center">
                    <CalendarDays size={18} />
                </button>
            </div>

            <div className="relative pl-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                {/* Vertical Timeline Line */}
                <div className="absolute left-[19px] top-2 bottom-2 w-[2px] bg-slate-100"></div>

                <div className="space-y-6 relative z-10">
                    {sortedSchedule.length > 0 ? sortedSchedule.map((item) => {
                        const status = getCurrentStatus(item.time, item.duration);
                        
                        return (
                            <div key={item.id} className={`flex gap-4 group ${status === 'past' ? 'opacity-50 grayscale-[0.5]' : ''}`}>
                                {/* Timeline Node */}
                                <div className="flex flex-col items-center">
                                    <div className={`w-2.5 h-2.5 rounded-full border-2 border-white ring-2 ${
                                        status === 'current' ? 'bg-indigo-600 ring-indigo-200 animate-pulse' : 
                                        status === 'past' ? 'bg-slate-300 ring-slate-100' : 'bg-slate-300 ring-slate-100'
                                    }`}></div>
                                </div>

                                {/* Content Card */}
                                <div className={`flex-1 rounded-2xl p-4 border transition-all duration-300 ${
                                    status === 'current' 
                                    ? 'bg-indigo-50/50 border-indigo-100 shadow-sm' 
                                    : 'bg-white border-slate-100 hover:border-slate-200 hover:shadow-md'
                                }`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-1.5 h-6 rounded-full ${item.color.split(' ')[0]}`}></span>
                                            <div>
                                                <h4 className={`font-bold text-sm ${status === 'current' ? 'text-indigo-900' : 'text-slate-800'}`}>
                                                    {item.title}
                                                </h4>
                                                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                                                    <span className="flex items-center gap-1">
                                                        <Clock size={10} /> {item.time} ({item.duration}분)
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="text-slate-300 hover:text-slate-600">
                                            <MoreHorizontal size={16} />
                                        </button>
                                    </div>
                                    
                                    <div className="flex items-center gap-3 pl-3.5 mt-3">
                                        <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-slate-100 shadow-sm">
                                            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                {(item.doctorName || 'Staff').charAt(0)}
                                            </div>
                                            <span className="text-[10px] font-bold text-slate-600">{item.doctorName || '담당자 미정'}</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold bg-slate-50 px-2 py-1 rounded-lg">
                                            <MapPin size={10} /> {item.serviceType === 'hospital' ? '진료실' : item.serviceType === 'grooming' ? '미용실' : '호텔'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }) : (
                        <div className="flex flex-col items-center justify-center py-10 text-slate-400">
                            <p className="text-sm font-bold">일정이 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Footer Summary */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs font-bold text-slate-400">남은 일정 <span className="text-indigo-600">{sortedSchedule.filter(i => getCurrentStatus(i.time, i.duration) !== 'past').length}건</span></span>
                <button className="text-xs font-bold text-indigo-600 hover:underline">전체 보기</button>
            </div>
        </div>
    );
};

export default ScheduleWidget;
