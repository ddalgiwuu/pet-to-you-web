
import React, { useState, useEffect } from 'react';
import { Phone, X, User, FileText, PhoneOff, Maximize2, Minimize2, History, ShieldCheck, UserPlus, ChevronUp, ExternalLink } from 'lucide-react';

interface IncomingCallProps {
    callerName: string;
    phoneNumber: string;
    patientName: string;
    isExistingCustomer?: boolean;
    lastVisitDate?: string;
    adminMemo?: string;
    onAccept: () => void;
    onDecline: () => void;
    onViewDetails: () => void; // New prop for opening the detailed modal
}

const IncomingCall: React.FC<IncomingCallProps> = ({ 
    callerName, 
    phoneNumber, 
    patientName, 
    isExistingCustomer = true, 
    lastVisitDate,
    adminMemo, 
    onAccept, 
    onDecline,
    onViewDetails
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    // Minimized View (Compact Pill)
    if (isMinimized) {
        return (
            <div className={`fixed bottom-6 right-6 z-[100] transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                {/* Clicking anywhere on the container expands it */}
                <div 
                    onClick={() => setIsMinimized(false)}
                    className="bg-slate-900/95 backdrop-blur-md rounded-full p-2 pl-3 pr-2 shadow-2xl border border-slate-700 flex items-center gap-4 min-w-[300px] justify-between group hover:border-slate-600 transition-colors cursor-pointer"
                    title="클릭하여 확대"
                >
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center animate-pulse shadow-lg shadow-emerald-500/30">
                                <Phone size={18} className="text-white" fill="currentColor" />
                            </div>
                            <span className="absolute top-0 right-0 flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                            </span>
                        </div>
                        
                        <div className="flex flex-col">
                            <h3 className="text-sm font-bold text-white leading-tight">{callerName}</h3>
                            <span className="text-[10px] text-emerald-400 font-medium">수신 중... (탭하여 확대)</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                         <button 
                            onClick={(e) => { e.stopPropagation(); onDecline(); }} 
                            className="w-9 h-9 rounded-full bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-all flex items-center justify-center border border-transparent hover:border-rose-400/50"
                            title="거절"
                        >
                            <PhoneOff size={16} />
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onAccept(); }} 
                            className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center border border-transparent hover:border-emerald-400/50"
                            title="통화 연결"
                        >
                            <Phone size={16} fill="currentColor" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Expanded View (Standard Toast)
    return (
        <div className={`fixed bottom-6 right-6 z-[100] transition-all duration-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
            <div 
                onClick={onViewDetails}
                className="bg-slate-900/95 backdrop-blur-md rounded-[2rem] p-6 shadow-2xl border border-slate-700 w-[400px] text-white relative overflow-hidden cursor-pointer group"
                title="클릭하여 상세 정보 보기"
            >
                {/* Pulse Effect Background */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-32 h-32 bg-rose-500 rounded-full blur-3xl opacity-20 animate-pulse animation-delay-2000"></div>

                <div className="relative z-10">
                    {/* Header Row */}
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-full bg-emerald-500 flex items-center justify-center animate-bounce shadow-lg shadow-emerald-500/30 ring-4 ring-emerald-500/20">
                                <Phone size={28} className="text-white" fill="currentColor" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-0.5">Incoming Call</p>
                                <h3 className="text-2xl font-black tracking-tight">{callerName}</h3>
                            </div>
                        </div>
                        
                        {/* Unified Control Capsule - Only Minimize now */}
                        <div className="flex items-center bg-white/10 rounded-full p-1 border border-white/10 backdrop-blur-sm shadow-inner">
                            <button 
                                onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }} 
                                className="w-8 h-8 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-all flex items-center justify-center" 
                                title="축소 (Minimize)"
                            >
                                <Minimize2 size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Badge Row - Moved below name for better spacing */}
                    <div className="mb-6 pl-[4.5rem]">
                         {isExistingCustomer ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/20 border border-indigo-500/40 text-[11px] text-indigo-200 font-bold shadow-sm">
                                <ShieldCheck size={12} /> 기존 고객 (VIP 등급)
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-[11px] text-amber-200 font-bold shadow-sm animate-pulse">
                                <UserPlus size={12} /> 신규 고객 상담
                            </span>
                        )}
                    </div>

                    {/* Info Card */}
                    <div className="space-y-3 bg-white/5 rounded-2xl p-5 mb-6 backdrop-blur-sm border border-white/5 group-hover:bg-white/10 transition-colors">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 text-sm text-slate-200">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                                    <Phone size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Phone Number</p>
                                    <span className="font-mono font-bold tracking-wide text-base">{phoneNumber}</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="w-full h-px bg-white/5 my-2"></div>

                        <div className="flex items-center justify-between">
                             <div className="flex items-center gap-3 text-sm text-slate-200">
                                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
                                    <User size={16} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Patient</p>
                                    <span><strong>{patientName}</strong> (대표)</span>
                                </div>
                            </div>
                            
                            {isExistingCustomer && lastVisitDate && (
                                <div className="text-right">
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Last Visit</p>
                                    <div className="text-xs text-indigo-300 font-bold flex items-center gap-1 justify-end">
                                        <History size={10} /> {lastVisitDate}
                                    </div>
                                </div>
                            )}
                        </div>

                        {adminMemo && (
                            <div className="mt-3 pt-3 border-t border-white/10">
                                <div className="flex gap-3 text-amber-300 text-xs font-bold items-start bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">
                                    <FileText size={14} className="mt-0.5 shrink-0 opacity-80" />
                                    <span className="line-clamp-2 leading-relaxed">{adminMemo}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <button 
                            onClick={(e) => { e.stopPropagation(); onDecline(); }}
                            className="flex-1 py-3.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2 hover:border-rose-500/40"
                        >
                            <PhoneOff size={18} /> 거절
                        </button>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onAccept(); }}
                            className="flex-[2] py-3.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-2xl font-bold text-sm shadow-lg shadow-emerald-900/50 transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95"
                        >
                            <Phone size={18} fill="currentColor" /> 통화 연결
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IncomingCall;
