import React, { useState, useEffect } from 'react';
import { X, Clock, Calendar as CalendarIcon, User, FileText, Check, Layers, Stethoscope, Scissors, Home } from 'lucide-react';
import { ServiceType } from '../types';

interface ScheduleAddModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (event: any) => void;
    selectedDate?: Date;
}

const ScheduleAddModal: React.FC<ScheduleAddModalProps> = ({ isOpen, onClose, onAdd, selectedDate }) => {
    const [title, setTitle] = useState('');
    const [serviceType, setServiceType] = useState<ServiceType>('hospital');
    const [type, setType] = useState('checkup');
    const [date, setDate] = useState('');
    const [time, setTime] = useState('09:00');
    const [duration, setDuration] = useState(30);
    const [patientName, setPatientName] = useState('');
    const [memo, setMemo] = useState('');

    useEffect(() => {
        if (isOpen) {
            // Reset form or set default date
            const d = selectedDate || new Date();
            setDate(d.toISOString().split('T')[0]);
            setTitle('');
            setPatientName('');
            setMemo('');
            setTime('09:00');
            setDuration(30);
        }
    }, [isOpen, selectedDate]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Determine color based on service type
        let color = 'bg-indigo-100 text-indigo-700 border-indigo-200';
        if (serviceType === 'grooming') color = 'bg-pink-100 text-pink-700 border-pink-200';
        if (serviceType === 'hotel') color = 'bg-orange-100 text-orange-700 border-orange-200';

        const newEvent = {
            id: Date.now().toString(),
            title,
            type,
            time,
            duration,
            color,
            serviceType,
            date: new Date(date).getDate(), // Simple day mapping for the current mock view
            fullDate: date, // Store full date for future use
            patientName,
            description: memo
        };

        onAdd(newEvent);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
                <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
                    <h2 className="text-xl font-black text-slate-900">새 일정 추가</h2>
                    <button onClick={onClose} className="p-2 bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-200 hover:text-slate-600 transition-all">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6 overflow-y-auto max-h-[70vh] custom-scrollbar">
                    
                    {/* Service Type Selection */}
                    <div className="flex gap-2 p-1 bg-slate-50 rounded-xl border border-slate-100">
                        <button
                            type="button"
                            onClick={() => setServiceType('hospital')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                serviceType === 'hospital' ? 'bg-white text-indigo-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            <Stethoscope size={16} /> 병원
                        </button>
                        <button
                            type="button"
                            onClick={() => setServiceType('grooming')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                serviceType === 'grooming' ? 'bg-white text-pink-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            <Scissors size={16} /> 미용
                        </button>
                        <button
                            type="button"
                            onClick={() => setServiceType('hotel')}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-bold transition-all ${
                                serviceType === 'hotel' ? 'bg-white text-orange-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'
                            }`}
                        >
                            <Home size={16} /> 호텔
                        </button>
                    </div>

                    {/* Title */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">일정 제목</label>
                        <input 
                            required
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                            placeholder="예: 초코 중성화 수술"
                        />
                    </div>

                    {/* Type & Patient */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">일정 유형</label>
                            <select 
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none"
                            >
                                <option value="checkup">일반 진료</option>
                                <option value="surgery">수술</option>
                                <option value="consult">상담</option>
                                <option value="grooming">미용</option>
                                <option value="checkin">호텔 입실</option>
                                <option value="checkout">호텔 퇴실</option>
                            </select>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">환자 이름</label>
                            <div className="relative">
                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    value={patientName}
                                    onChange={(e) => setPatientName(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                    placeholder="환자명 입력"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">날짜</label>
                            <div className="relative">
                                <CalendarIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="date"
                                    required
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">시간</label>
                            <div className="relative">
                                <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="time"
                                    required
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Memo */}
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">메모</label>
                        <textarea 
                            value={memo}
                            onChange={(e) => setMemo(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none h-24"
                            placeholder="추가적인 메모 사항을 입력하세요..."
                        />
                    </div>

                    <button type="submit" className="mt-4 w-full bg-slate-900 text-white py-4 rounded-xl text-sm font-bold shadow-lg shadow-slate-300 hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                        <Check size={18} /> 일정 등록하기
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ScheduleAddModal;
