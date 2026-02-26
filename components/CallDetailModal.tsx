
import React from 'react';
import { X, Phone, User, Calendar, FileText, Activity, Clock, ChevronRight, Stethoscope, Scissors, Home, AlertTriangle, MessageSquare, CreditCard } from 'lucide-react';
import { ServiceType } from '../types';

interface CallerInfo {
    name: string;
    phone: string;
    isExisting: boolean;
    tags: string[];
    memo?: string;
    pets: {
        name: string;
        breed: string;
        age: string;
        image: string;
        lastService?: string;
        lastDate?: string;
    }[];
    history: {
        date: string;
        type: ServiceType;
        description: string;
        doctor: string;
    }[];
}

interface CallDetailModalProps {
    caller: CallerInfo;
    onClose: () => void;
    onNavigateToChart: (petName: string) => void;
    onOpenReservation: () => void;
}

const CallDetailModal: React.FC<CallDetailModalProps> = ({ caller, onClose, onNavigateToChart, onOpenReservation }) => {
    
    const getServiceIcon = (type: ServiceType) => {
        switch(type) {
            case 'hospital': return <Stethoscope size={14} />;
            case 'grooming': return <Scissors size={14} />;
            case 'hotel': return <Home size={14} />;
        }
    };

    const getServiceColor = (type: ServiceType) => {
        switch(type) {
            case 'hospital': return 'bg-indigo-100 text-indigo-600';
            case 'grooming': return 'bg-pink-100 text-pink-600';
            case 'hotel': return 'bg-orange-100 text-orange-600';
        }
    };

    return (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity" onClick={onClose} />
            <div className="relative bg-white rounded-[2.5rem] w-full max-w-5xl h-[85vh] shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col overflow-hidden border border-white/20">
                
                {/* Header */}
                <div className="bg-slate-900 text-white p-6 flex justify-between items-start shrink-0 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                    
                    <div className="relative z-10 flex gap-6 items-center">
                        <div className="w-20 h-20 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 relative">
                            <User size={40} className="text-slate-300" />
                            <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-2 border-4 border-slate-900 animate-pulse">
                                <Phone size={16} fill="currentColor" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h2 className="text-3xl font-extrabold">{caller.name}</h2>
                                {caller.isExisting ? (
                                    <span className="px-2 py-0.5 rounded bg-emerald-500 text-emerald-950 text-xs font-bold">기존 고객</span>
                                ) : (
                                    <span className="px-2 py-0.5 rounded bg-amber-500 text-amber-950 text-xs font-bold animate-pulse">신규 고객</span>
                                )}
                            </div>
                            <div className="flex items-center gap-4 text-slate-400 text-sm font-medium mb-3">
                                <span className="flex items-center gap-1.5"><Phone size={14} /> {caller.phone}</span>
                                <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                                <span>최초 등록일: 2022.05.10</span>
                            </div>
                            <div className="flex gap-2">
                                {caller.tags.map(tag => (
                                    <span key={tag} className="px-2 py-1 rounded-lg bg-white/10 border border-white/10 text-xs text-indigo-200 font-bold">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="text-right mr-4 hidden md:block">
                            <div className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">통화 시간</div>
                            <div className="text-2xl font-mono font-black text-emerald-400">00:42</div>
                        </div>
                        <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-hidden flex flex-col md:flex-row bg-slate-50">
                    
                    {/* Left: Pets & Memo */}
                    <div className="w-full md:w-1/3 p-6 overflow-y-auto border-r border-slate-200 flex flex-col gap-6 custom-scrollbar">
                        
                        {/* Admin Memo */}
                        <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 shadow-sm">
                            <h4 className="text-xs font-extrabold text-amber-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                                <AlertTriangle size={14} /> 관리자 핵심 메모 (Admin)
                            </h4>
                            <p className="text-sm font-bold text-amber-900 leading-relaxed">
                                {caller.memo || "특이사항 없음."}
                            </p>
                        </div>

                        {/* Pets List */}
                        <div>
                            <h4 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center gap-2">
                                <Activity size={16} className="text-slate-400" /> 등록된 반려동물 ({caller.pets.length})
                            </h4>
                            <div className="space-y-4">
                                {caller.pets.map((pet, idx) => (
                                    <div key={idx} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                                        <div className="flex items-center gap-4 mb-3">
                                            <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shadow-inner">
                                                <img src={pet.image} alt={pet.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start">
                                                    <h5 className="text-lg font-extrabold text-slate-800">{pet.name}</h5>
                                                    <button 
                                                        onClick={() => onNavigateToChart(pet.name)}
                                                        className="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-2 py-1 rounded hover:bg-indigo-100 transition-colors"
                                                    >
                                                        차트 열기
                                                    </button>
                                                </div>
                                                <p className="text-xs text-slate-500 font-medium">{pet.breed} · {pet.age}</p>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-slate-50 rounded-xl p-3 flex justify-between items-center text-xs border border-slate-100">
                                            <div className="text-slate-500">
                                                <span className="block font-bold text-slate-400 text-[10px] uppercase">Last Visit</span>
                                                {pet.lastDate || '-'}
                                            </div>
                                            <div className="text-right">
                                                <span className="block font-bold text-slate-400 text-[10px] uppercase">Service</span>
                                                <span className="font-bold text-slate-700">{pet.lastService || '기록 없음'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right: History & Actions */}
                    <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-6 custom-scrollbar bg-white">
                        
                        {/* Recent History Timeline */}
                        <div>
                            <div className="flex justify-between items-end mb-6">
                                <h4 className="text-lg font-extrabold text-slate-800 flex items-center gap-2">
                                    <Clock size={20} className="text-indigo-500" /> 최근 방문 이력 (History)
                                </h4>
                                <button className="text-xs font-bold text-slate-400 hover:text-indigo-600 flex items-center gap-1">
                                    전체 보기 <ChevronRight size={14} />
                                </button>
                            </div>

                            <div className="relative pl-4 space-y-8 before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100">
                                {caller.history.map((record, i) => (
                                    <div key={i} className="relative flex gap-4 group">
                                        <div className={`relative z-10 w-10 h-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center shrink-0 ${getServiceColor(record.type)}`}>
                                            {getServiceIcon(record.type)}
                                        </div>
                                        <div className="flex-1 bg-slate-50 rounded-2xl p-4 border border-slate-100 group-hover:bg-white group-hover:shadow-md transition-all">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getServiceColor(record.type).replace('text-', 'bg-opacity-20 text-')}`}>
                                                    {record.type.toUpperCase()}
                                                </span>
                                                <span className="text-xs font-bold text-slate-400">{record.date}</span>
                                            </div>
                                            <h5 className="font-bold text-slate-800 text-sm mb-1">{record.description}</h5>
                                            <p className="text-xs text-slate-500">담당: {record.doctor}</p>
                                        </div>
                                    </div>
                                ))}
                                {caller.history.length === 0 && (
                                    <div className="text-center py-10 text-slate-400 text-sm">최근 방문 이력이 없습니다.</div>
                                )}
                            </div>
                        </div>

                        {/* Quick Actions (Sticky Bottom on mobile/small view if needed, but relative here) */}
                        <div className="mt-auto pt-6 border-t border-slate-100">
                            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest mb-4">Quick Actions</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <button 
                                    onClick={onOpenReservation}
                                    className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50 hover:border-indigo-200 border border-slate-200 transition-all group"
                                >
                                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-indigo-600 group-hover:scale-110 transition-all">
                                        <Calendar size={18} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-700">예약 잡기</span>
                                </button>

                                <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200 transition-all group">
                                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-emerald-600 group-hover:scale-110 transition-all">
                                        <MessageSquare size={18} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600 group-hover:text-emerald-700">문자 발송</span>
                                </button>

                                <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-amber-50 hover:border-amber-200 border border-slate-200 transition-all group">
                                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-amber-600 group-hover:scale-110 transition-all">
                                        <FileText size={18} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600 group-hover:text-amber-700">메모 남기기</span>
                                </button>

                                <button className="flex flex-col items-center justify-center gap-2 p-4 rounded-2xl bg-slate-50 hover:bg-rose-50 hover:border-rose-200 border border-slate-200 transition-all group">
                                    <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-400 group-hover:text-rose-600 group-hover:scale-110 transition-all">
                                        <CreditCard size={18} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-600 group-hover:text-rose-700">미결제 확인</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default CallDetailModal;
