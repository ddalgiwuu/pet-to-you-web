
import React, { useState, useEffect } from 'react';
import { 
    ChevronLeft, Plus, Share, Calendar, Coffee, Check, Bell, 
    Scissors, Stethoscope, AlertTriangle, Clock, ChevronDown, MoreHorizontal,
    ArrowRight, Activity, User, FileText, CheckCircle2, Circle, Send,
    MessageSquare, Smartphone, Phone, Heart, Zap, Info
} from 'lucide-react';
import { PatientCase, Staff, PatientStatus } from '../types';

interface CustomerJourneyProps {
    onAddCase?: (newCase: PatientCase) => void;
    staffList?: Staff[];
    cases: PatientCase[];
    onUpdateCases?: (cases: PatientCase[]) => void;
    initialSelectedId?: string | null;
    hideSidebar?: boolean;
}

interface ActivityLog {
    id: string;
    type: 'status' | 'step' | 'notif';
    message: string;
    time: string;
    patientId: string;
    prevStatus?: PatientStatus;
}

const CustomerJourney: React.FC<CustomerJourneyProps> = ({ onAddCase, staffList = [], cases, onUpdateCases, initialSelectedId, hideSidebar }) => {
    const [selectedCaseId, setSelectedCaseId] = useState<string | null>(initialSelectedId || (cases.length > 0 ? cases[0].id : null));
    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
    
    const selectedCase = cases.find(c => c.id === selectedCaseId);

    // Sync with initialSelectedId when it changes
    useEffect(() => {
        if (initialSelectedId) {
            setSelectedCaseId(initialSelectedId);
        }
    }, [initialSelectedId]);

    const addLog = (log: Omit<ActivityLog, 'id' | 'time'>) => {
        const newLog: ActivityLog = {
            ...log,
            id: Date.now().toString(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setActivityLogs(prev => [newLog, ...prev].slice(0, 10));
    };

    const updatePatient = (updatedCase: PatientCase) => {
        if (onUpdateCases) {
            onUpdateCases(cases.map(c => c.id === updatedCase.id ? updatedCase : c));
        }
    };

    const handleStatusChange = (newStatus: PatientStatus) => {
        if (!selectedCase) return;
        const prevStatus = selectedCase.status;
        if (prevStatus === newStatus) return;

        const updated = { ...selectedCase, status: newStatus };
        updatePatient(updated);
        
        const statusLabels: Record<PatientStatus, string> = {
            reception: '접수 및 대기',
            diagnosis: '상담 및 진단',
            treatment: '케어 및 처치',
            aftercare: '완료 및 퇴실'
        };

        addLog({
            type: 'status',
            message: `단계 변경: ${statusLabels[newStatus]}`,
            patientId: selectedCase.id,
            prevStatus
        });
    };

    const handleToggleSubStep = (stepLabel: string) => {
        if (!selectedCase) return;
        
        const currentSteps = selectedCase.progressSteps || [
            { label: '바이탈 체크', completed: false },
            { label: '응급도 평가', completed: false },
            { label: '보호자 문진', completed: false },
            { label: '진료 기록 작성', completed: false },
        ];

        const updatedSteps = currentSteps.map(s => 
            s.label === stepLabel ? { ...s, completed: !s.completed } : s
        );

        const targetStep = updatedSteps.find(s => s.label === stepLabel);
        
        updatePatient({ ...selectedCase, progressSteps: updatedSteps });
        
        addLog({
            type: 'step',
            message: `${stepLabel} ${targetStep?.completed ? '완료' : '취소'}`,
            patientId: selectedCase.id
        });
    };

    const handleUndo = (log: ActivityLog) => {
        const patient = cases.find(c => c.id === log.patientId);
        if (!patient) return;

        if (log.type === 'status' && log.prevStatus) {
            updatePatient({ ...patient, status: log.prevStatus });
            setActivityLogs(prev => prev.filter(l => l.id !== log.id));
        }
    };

    const getStatusSteps = (status: PatientStatus) => {
        const steps = [
            { id: 'reception' as PatientStatus, label: '접수 및 대기', icon: <User size={16} /> },
            { id: 'diagnosis' as PatientStatus, label: '상담 및 진단', icon: <Stethoscope size={16} /> },
            { id: 'treatment' as PatientStatus, label: '케어 및 처치', icon: <Activity size={16} /> },
            { id: 'aftercare' as PatientStatus, label: '완료 및 퇴실', icon: <CheckCircle2 size={16} /> },
        ];
        
        const currentIdx = steps.findIndex(s => s.id === status);
        return steps.map((s, idx) => ({
            ...s,
            isCompleted: idx < currentIdx,
            isCurrent: idx === currentIdx,
            isPending: idx > currentIdx
        }));
    };

    const handleSendNotification = (type: string) => {
        if (!selectedCase) return;
        addLog({
            type: 'notif',
            message: `알림 발송: ${type}`,
            patientId: selectedCase.id
        });
        alert(`[보호자 알림] ${selectedCase.patientName} 보호자님께 "${type}" 메시지가 발송되었습니다.`);
    };

    const subSteps = selectedCase?.progressSteps || [
        { label: '바이탈 체크', completed: false, desc: '정상 범위 내 확인됨', icon: <Heart size={18} /> },
        { label: '응급도 평가', completed: false, desc: '일반 (Normal)', icon: <Zap size={18} /> },
        { label: '보호자 문진', completed: false, desc: '현재 진행 중...', icon: <MessageSquare size={18} /> },
        { label: '진료 기록 작성', completed: false, desc: '상담 완료 후 활성화', icon: <FileText size={18} /> },
    ];

    if (cases.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[600px] bg-white rounded-[3rem] border border-dashed border-slate-200">
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                    <Activity size={40} className="text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">활성화된 케이스가 없습니다</h3>
                <p className="text-slate-400 mt-2">칸반 보드에서 케이스를 추가해주세요.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            
            {/* Left Sidebar: Active Patients List */}
            {!hideSidebar && (
                <div className="lg:w-80 flex flex-col gap-4 shrink-0">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">Active Patients</h3>
                        <span className="text-[10px] font-bold bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">{cases.length}</span>
                    </div>
                    
                    <div className="flex flex-col gap-3 overflow-y-auto max-h-[700px] pr-2 custom-scrollbar">
                        {cases.map((c) => (
                            <div 
                                key={c.id}
                                onClick={() => setSelectedCaseId(c.id)}
                                className={`p-4 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group ${
                                    selectedCaseId === c.id 
                                    ? 'bg-white border-indigo-500 shadow-xl shadow-indigo-100/50' 
                                    : 'bg-white/50 border-slate-100 hover:border-indigo-200 hover:bg-white'
                                }`}
                            >
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="relative">
                                        <img src={c.avatarUrl} className="w-12 h-12 rounded-2xl object-cover shadow-sm" alt="" />
                                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                            c.status === 'reception' ? 'bg-blue-500' : 
                                            c.status === 'diagnosis' ? 'bg-purple-500' : 
                                            c.status === 'treatment' ? 'bg-rose-500' : 'bg-emerald-500'
                                        }`}></div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className={`font-bold text-sm truncate ${selectedCaseId === c.id ? 'text-indigo-600' : 'text-slate-800'}`}>{c.patientName}</h4>
                                        <p className="text-[10px] font-medium text-slate-400 truncate">{c.breed} • {c.ownerName || '보호자'}</p>
                                    </div>
                                </div>
                                {selectedCaseId === c.id && (
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Right: Detailed Journey & Communication */}
            {selectedCase && (
                <div className="flex-1 flex flex-col gap-8">
                    
                    {/* Selected Patient Header */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-50"></div>
                        
                        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <img src={selectedCase.avatarUrl} className="w-20 h-20 rounded-[2rem] object-cover shadow-lg border-4 border-white" alt="" />
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedCase.patientName}</h2>
                                        <span className="px-2 py-1 rounded-lg bg-slate-100 text-[10px] font-bold text-slate-400 border border-slate-200">{selectedCase.caseNumber}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
                                        <span className="font-bold text-slate-700">{selectedCase.breed}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                        <span>{selectedCase.ownerName}</span>
                                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                        <span className="text-indigo-600 font-bold">{selectedCase.serviceType === 'hospital' ? '진료' : selectedCase.serviceType === 'grooming' ? '미용' : '호텔'}</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex gap-3">
                                <button className="p-4 rounded-2xl bg-slate-50 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-all">
                                    <Info size={20} />
                                </button>
                                <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm shadow-lg shadow-slate-200 hover:bg-slate-800 transition-all flex items-center gap-2">
                                    <Phone size={18} /> 보호자 통화
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
                        
                        {/* Journey Timeline & Details (Left Column) */}
                        <div className="xl:col-span-8 flex flex-col gap-8">
                            {/* Timeline Card */}
                            <div className="bg-white rounded-[3rem] p-10 shadow-sm border border-slate-100">
                                <div className="flex items-center justify-between mb-12">
                                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                            <Activity size={22} />
                                        </div>
                                        실시간 진행 현황
                                    </h3>
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 bg-slate-50 px-4 py-2 rounded-full">
                                        <Clock size={14} /> 체류 시간: <span className="text-slate-900 ml-1">45분</span>
                                    </div>
                                </div>

                                <div className="relative px-6">
                                    {/* Horizontal Line */}
                                    <div className="absolute top-7 left-14 right-14 h-1.5 bg-slate-100 -z-0 rounded-full"></div>
                                    
                                    <div className="flex justify-between relative z-10">
                                        {getStatusSteps(selectedCase.status).map((step, idx) => (
                                            <div 
                                                key={step.id} 
                                                className="flex flex-col items-center gap-5 w-28 group cursor-pointer"
                                                onClick={() => handleStatusChange(step.id)}
                                            >
                                                <div className={`w-14 h-14 rounded-[1.25rem] flex items-center justify-center border-4 border-white shadow-lg transition-all duration-500 ${
                                                    step.isCompleted ? 'bg-emerald-500 text-white' :
                                                    step.isCurrent ? 'bg-indigo-600 text-white scale-110 ring-8 ring-indigo-50' :
                                                    'bg-slate-100 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-400'
                                                }`}>
                                                    {step.isCompleted ? <Check size={24} strokeWidth={3} /> : step.icon}
                                                </div>
                                                <div className="text-center">
                                                    <span className={`block text-[12px] font-black uppercase tracking-wider mb-1.5 ${
                                                        step.isCurrent ? 'text-indigo-600' : 'text-slate-400'
                                                    }`}>
                                                        {step.label}
                                                    </span>
                                                    {step.isCurrent && (
                                                        <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-3 py-1 rounded-full">진행 중</span>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Detailed Sub-steps Grid */}
                                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {subSteps.map((step) => {
                                        const isCompleted = selectedCase.progressSteps?.find(s => s.label === step.label)?.completed;
                                        return (
                                            <div 
                                                key={step.label}
                                                onClick={() => handleToggleSubStep(step.label)}
                                                className={`p-7 rounded-[2.5rem] border transition-all cursor-pointer flex items-center justify-between group ${
                                                    isCompleted 
                                                    ? 'bg-emerald-50/40 border-emerald-100' 
                                                    : 'bg-slate-50 border-slate-100 hover:bg-white hover:border-indigo-100 hover:shadow-xl hover:-translate-y-1'
                                                }`}
                                            >
                                                <div className="flex items-center gap-5">
                                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-all ${
                                                        isCompleted ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 group-hover:text-indigo-500 group-hover:scale-110'
                                                    }`}>
                                                        {step.icon}
                                                    </div>
                                                    <div>
                                                        <span className={`block text-base font-black ${isCompleted ? 'text-emerald-900' : 'text-slate-800'}`}>{step.label}</span>
                                                        <span className="text-xs font-bold text-slate-400">{step.desc}</span>
                                                    </div>
                                                </div>
                                                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                                                    isCompleted ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'border-2 border-slate-200 group-hover:border-indigo-300'
                                                }`}>
                                                    {isCompleted && <Check size={16} strokeWidth={3} />}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Experience Monitoring Stats */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-500 shadow-sm shadow-blue-100">
                                            <Clock size={24} />
                                        </div>
                                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">대기 시간 분석</h4>
                                    </div>
                                    <div className="flex items-end gap-2 mb-4">
                                        <span className="text-4xl font-black text-slate-900">12</span>
                                        <span className="text-lg font-bold text-slate-400 mb-1">분 경과</span>
                                    </div>
                                    <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden mb-3">
                                        <div className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: '60%' }}></div>
                                    </div>
                                    <p className="text-xs font-bold text-slate-400">평균 대기 시간(15분)보다 <span className="text-blue-600">짧음</span></p>
                                </div>

                                <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 shadow-sm shadow-emerald-100">
                                            <CheckCircle2 size={24} />
                                        </div>
                                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest">서비스 만족도 지표</h4>
                                    </div>
                                    <div className="flex items-end gap-2 mb-4">
                                        <span className="text-4xl font-black text-slate-900">98</span>
                                        <span className="text-lg font-bold text-slate-400 mb-1">%</span>
                                    </div>
                                    <p className="text-xs font-bold text-slate-400">최근 3회 방문 시 <span className="text-emerald-600">매우 만족</span> 응답</p>
                                </div>
                            </div>
                        </div>

                        {/* Communication Hub & Activity (Right Column) */}
                        <div className="xl:col-span-4 flex flex-col gap-8">
                            <div className="bg-[#0f172a] rounded-[3rem] p-10 shadow-2xl text-white flex flex-col gap-8 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                                
                                <div className="flex items-center justify-between relative z-10">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-[1.25rem] bg-white/10 flex items-center justify-center text-indigo-400 shadow-inner">
                                            <Bell size={24} />
                                        </div>
                                        <h3 className="text-xl font-black tracking-tight">보호자 알림 허브</h3>
                                    </div>
                                    <button className="p-2.5 rounded-xl bg-white/5 text-slate-500 hover:text-white transition-colors">
                                        <Info size={18} />
                                    </button>
                                </div>
                                
                                <p className="text-sm text-slate-400 font-bold leading-relaxed relative z-10">
                                    현재 단계에 맞춰 최적화된 알림 메시지를 원클릭으로 발송할 수 있습니다.
                                </p>

                                <div className="flex flex-col gap-4 relative z-10">
                                    {[
                                        { label: '접수 완료 알림', type: 'reception' },
                                        { label: '진료 시작 알림', type: 'diagnosis' },
                                        { label: '처치 진행 중 알림', type: 'treatment' },
                                        { label: '수납 및 퇴실 안내', type: 'aftercare', primary: true },
                                    ].map((btn) => (
                                        <button 
                                            key={btn.label}
                                            onClick={() => handleSendNotification(btn.label)}
                                            className={`w-full p-5 rounded-[1.5rem] border transition-all flex items-center justify-between group ${
                                                btn.primary 
                                                ? 'bg-indigo-600 border-indigo-500 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30' 
                                                : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                                            }`}
                                        >
                                            <span className="text-base font-black">{btn.label}</span>
                                            <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${btn.primary ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/20'}`}>
                                                <Send size={18} className={`${btn.primary ? 'text-white' : 'text-slate-500 group-hover:text-white'} transition-colors`} />
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-4 p-6 rounded-[1.5rem] bg-white/5 border border-dashed border-white/10 group focus-within:border-indigo-500/50 transition-colors">
                                    <div className="flex items-center gap-2 mb-3">
                                        <MessageSquare size={16} className="text-indigo-400" />
                                        <span className="text-[11px] font-black uppercase tracking-widest text-slate-500">커스텀 메시지</span>
                                    </div>
                                    <textarea 
                                        className="w-full bg-transparent border-none text-sm font-bold text-slate-300 resize-none focus:outline-none placeholder:text-slate-700"
                                        placeholder="보호자에게 전달할 내용을 입력하세요..."
                                        rows={3}
                                    />
                                </div>
                            </div>

                            {/* Recent Activity Log */}
                            <div className="bg-white rounded-[3rem] p-8 shadow-sm border border-slate-100">
                                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6 px-2">Recent Activity</h4>
                                <div className="flex flex-col gap-5">
                                    {activityLogs.length === 0 ? (
                                        <div className="flex flex-col items-center justify-center py-10">
                                            <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
                                                <Activity size={20} className="text-slate-200" />
                                            </div>
                                            <p className="text-xs text-slate-400 font-bold italic">최근 활동이 없습니다.</p>
                                        </div>
                                    ) : (
                                        activityLogs.map((log) => (
                                            <div key={log.id} className="flex gap-4 group">
                                                <div className={`w-1.5 h-10 rounded-full shrink-0 ${
                                                    log.type === 'status' ? 'bg-indigo-500' : 
                                                    log.type === 'step' ? 'bg-emerald-500' : 'bg-amber-500'
                                                }`}></div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <p className="text-sm font-black text-slate-800 truncate leading-tight">{log.message}</p>
                                                        {log.type === 'status' && (
                                                            <button 
                                                                onClick={() => handleUndo(log)}
                                                                className="text-[10px] font-black text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity hover:underline whitespace-nowrap ml-2"
                                                            >
                                                                Undo
                                                            </button>
                                                        )}
                                                    </div>
                                                    <p className="text-[11px] font-bold text-slate-400">{log.time} • {log.type === 'notif' ? '자동 발송' : '간호사'}</p>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CustomerJourney;


