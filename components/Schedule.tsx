
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Filter, Stethoscope, Scissors, Home, Layers } from 'lucide-react';
import { ServiceType, CalendarEvent } from '../types';
import ScheduleAddModal from './ScheduleAddModal';

interface ScheduleProps {
    activeServices?: ServiceType[];
    globalFilter?: ServiceType | 'all';
    events: CalendarEvent[];
    onAddEvent: (event: CalendarEvent) => void;
}

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Schedule: React.FC<ScheduleProps> = ({ activeServices = ['hospital', 'grooming', 'hotel'], globalFilter = 'all', events, onAddEvent }) => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [currentService, setCurrentService] = useState<ServiceType | 'all'>('all');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Sync with Global Master Switch
    useEffect(() => {
        setCurrentService(globalFilter);
    }, [globalFilter]);

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    
    // Generate calendar grid
    const calendarDays = [];
    for (let i = 0; i < firstDay; i++) {
        calendarDays.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        calendarDays.push(i);
    }

    const handleAddEvent = (newEvent: any) => {
        onAddEvent(newEvent);
    };

    // Filter events
    const filteredEvents = events.filter(event => 
        currentService === 'all' 
        ? activeServices.includes(event.serviceType as ServiceType) 
        : event.serviceType === currentService
    );

    const getServiceIcon = (type: ServiceType | 'all') => {
        switch(type) {
            case 'all': return <Layers size={14} />;
            case 'hospital': return <Stethoscope size={14} />;
            case 'grooming': return <Scissors size={14} />;
            case 'hotel': return <Home size={14} />;
            default: return null;
        }
    };

    const getServiceLabel = (type: ServiceType | 'all') => {
        switch(type) {
            case 'all': return '전체 일정';
            case 'hospital': return '진료 일정';
            case 'grooming': return '미용 예약';
            case 'hotel': return '호텔/케어';
            default: return '';
        }
    }

    return (
        <div className="h-full flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-6">
                <div className="flex flex-col gap-4 w-full xl:w-auto">
                    {/* Service Tabs - LOCAL override */}
                     {activeServices.length > 1 && (
                        <div className="flex bg-white p-1 rounded-xl w-fit shadow-sm border border-slate-100">
                             <button
                                onClick={() => setCurrentService('all')}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                                    currentService === 'all' 
                                    ? 'bg-slate-800 text-white shadow-md' 
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                }`}
                            >
                                <Layers size={14} /> 전체
                            </button>
                            {activeServices.includes('hospital') && (
                                <button
                                    onClick={() => setCurrentService('hospital')}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                                        currentService === 'hospital' 
                                        ? 'bg-indigo-500 text-white shadow-md' 
                                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    <Stethoscope size={14} /> 병원
                                </button>
                            )}
                            {activeServices.includes('grooming') && (
                                <button
                                    onClick={() => setCurrentService('grooming')}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                                        currentService === 'grooming' 
                                        ? 'bg-pink-500 text-white shadow-md' 
                                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    <Scissors size={14} /> 미용
                                </button>
                            )}
                            {activeServices.includes('hotel') && (
                                <button
                                    onClick={() => setCurrentService('hotel')}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                                        currentService === 'hotel' 
                                        ? 'bg-orange-500 text-white shadow-md' 
                                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'
                                    }`}
                                >
                                    <Home size={14} /> 호텔
                                </button>
                            )}
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-white p-1 rounded-2xl shadow-sm border border-slate-100">
                            <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
                                <ChevronLeft size={20} />
                            </button>
                            <span className="text-lg font-extrabold text-slate-800 min-w-[140px] text-center">
                                {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                            </span>
                            <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-400">
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 w-full xl:w-auto">
                    <button className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
                        <Filter size={16} /> 필터
                    </button>
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex-1 xl:flex-none flex items-center justify-center gap-2 px-5 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-300 hover:bg-slate-800 transition-colors"
                    >
                        <Plus size={18} /> 일정 추가
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="glass-panel rounded-3xl p-6 flex-1 min-h-[600px] flex flex-col bg-white">
                <div className="grid grid-cols-7 mb-4 border-b border-slate-100 pb-4">
                    {DAYS.map(day => (
                        <div key={day} className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
                            {day}
                        </div>
                    ))}
                </div>
                
                <div className="grid grid-cols-7 flex-1 auto-rows-fr gap-2 lg:gap-4">
                    {calendarDays.map((day, idx) => {
                        const dayEvents = day ? filteredEvents.filter(e => {
                            // Match by date property if exists, otherwise fallback to mock logic (for initial events without date)
                            if (e.date) return e.date === day;
                            // Fallback logic for legacy mock data if any
                            return (parseInt(e.id) + day) % 5 === 0; 
                        }) : [];

                        return (
                            <div 
                                key={idx} 
                                className={`min-h-[100px] p-2 lg:p-3 rounded-2xl border transition-all duration-200 group relative flex flex-col gap-1 ${
                                    day 
                                    ? 'bg-slate-50/30 border-slate-50 hover:bg-white hover:shadow-lg hover:border-slate-100 cursor-pointer' 
                                    : 'bg-transparent border-transparent pointer-events-none'
                                }`}
                            >
                                {day && (
                                    <>
                                        <div className="flex justify-between items-start mb-1">
                                            <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full ${
                                                day === new Date().getDate() ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500'
                                            }`}>
                                                {day}
                                            </span>
                                        </div>
                                        
                                        <div className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar max-h-[100px]">
                                            {dayEvents.map(event => (
                                                <div key={event.id} className={`text-[10px] p-1.5 rounded-lg border font-bold truncate ${event.color} flex items-center gap-1.5 shadow-sm`}>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60 flex-shrink-0"></div>
                                                    <span className="truncate">{event.title}</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Add Button on Hover */}
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setIsAddModalOpen(true);
                                            }}
                                            className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-slate-900 text-white items-center justify-center hidden group-hover:flex hover:scale-110 transition-all shadow-lg z-10"
                                        >
                                            <Plus size={14} />
                                        </button>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            <ScheduleAddModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onAdd={handleAddEvent}
            />
        </div>
    );
};

export default Schedule;
