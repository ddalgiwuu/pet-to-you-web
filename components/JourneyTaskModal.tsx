import React, { useState, useEffect, useRef } from 'react';
import { X, Save, CheckCircle, AlertTriangle, Clock, Calendar, User, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { Staff } from '../types';

interface JourneyTask {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in-progress' | 'completed';
    assignee?: string;
    dueDate?: string;
    type: 'allocation' | 'identification' | 'resolution';
    icon?: string;
}

interface JourneyTaskModalProps {
    task: JourneyTask;
    onClose: () => void;
    onUpdate: (updatedTask: JourneyTask) => void;
    onDelete?: (taskId: string) => void;
    staffList?: Staff[];
}

const JourneyTaskModal: React.FC<JourneyTaskModalProps> = ({ task, onClose, onUpdate, onDelete, staffList = [] }) => {
    // Initialize task with default date if missing
    const [editedTask, setEditedTask] = useState<JourneyTask>(() => {
        if (!task.dueDate) {
            const today = new Date();
            const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
            return { ...task, dueDate: formattedDate };
        }
        return task;
    });

    // Assignee State
    const [assigneeSearch, setAssigneeSearch] = useState(task.assignee || '');
    const [showAssigneeList, setShowAssigneeList] = useState(false);
    const assigneeRef = useRef<HTMLDivElement>(null);

    // Calendar State
    const [showCalendar, setShowCalendar] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const calendarRef = useRef<HTMLDivElement>(null);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (assigneeRef.current && !assigneeRef.current.contains(event.target as Node)) {
                setShowAssigneeList(false);
            }
            if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
                setShowCalendar(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSave = () => {
        onUpdate(editedTask);
        onClose();
    };

    // Filter staff
    const filteredStaff = staffList.filter(s => 
        s.name.toLowerCase().includes(assigneeSearch.toLowerCase()) ||
        s.role.toLowerCase().includes(assigneeSearch.toLowerCase())
    );

    const handleAssigneeSelect = (name: string) => {
        setAssigneeSearch(name);
        setEditedTask({ ...editedTask, assignee: name });
        setShowAssigneeList(false);
    };

    // Calendar Logic
    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        return { daysInMonth, firstDayOfMonth };
    };

    const { daysInMonth, firstDayOfMonth } = getDaysInMonth(currentMonth);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);

    const handleDateClick = (day: number) => {
        const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const formattedDate = `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        setEditedTask({ ...editedTask, dueDate: formattedDate });
        setShowCalendar(false);
    };

    const changeMonth = (offset: number) => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1));
    };

    const isSelectedDate = (day: number) => {
        if (!editedTask.dueDate) return false;
        const targetDate = new Date(editedTask.dueDate);
        return targetDate.getDate() === day && 
               targetDate.getMonth() === currentMonth.getMonth() && 
               targetDate.getFullYear() === currentMonth.getFullYear();
    };

    const isToday = (day: number) => {
        const today = new Date();
        return today.getDate() === day && 
               today.getMonth() === currentMonth.getMonth() && 
               today.getFullYear() === currentMonth.getFullYear();
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-200 border border-slate-100 flex flex-col">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-3xl">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <FileText className="text-indigo-500" size={24} />
                        업무 상세 정보
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6 overflow-visible">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">제목</label>
                        <input 
                            type="text" 
                            value={editedTask.title} 
                            onChange={(e) => setEditedTask({...editedTask, title: e.target.value})}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">상세 내용</label>
                        <textarea 
                            value={editedTask.description} 
                            onChange={(e) => setEditedTask({...editedTask, description: e.target.value})}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-600 focus:outline-none focus:border-indigo-500 min-h-[100px] transition-colors resize-none"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">진행 상태</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button 
                                onClick={() => setEditedTask({...editedTask, status: 'pending'})}
                                className={`p-3 rounded-xl border font-bold text-sm transition-all flex flex-col items-center gap-1 ${
                                    editedTask.status === 'pending' 
                                    ? 'bg-slate-100 border-slate-300 text-slate-700 ring-2 ring-slate-500/20' 
                                    : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                                }`}
                            >
                                <Clock size={16} />
                                대기중
                            </button>
                            <button 
                                onClick={() => setEditedTask({...editedTask, status: 'in-progress'})}
                                className={`p-3 rounded-xl border font-bold text-sm transition-all flex flex-col items-center gap-1 ${
                                    editedTask.status === 'in-progress' 
                                    ? 'bg-amber-50 border-amber-200 text-amber-600 ring-2 ring-amber-500/20' 
                                    : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                                }`}
                            >
                                <AlertTriangle size={16} />
                                진행중
                            </button>
                            <button 
                                onClick={() => setEditedTask({...editedTask, status: 'completed'})}
                                className={`p-3 rounded-xl border font-bold text-sm transition-all flex flex-col items-center gap-1 ${
                                    editedTask.status === 'completed' 
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600 ring-2 ring-emerald-500/20' 
                                    : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                                }`}
                            >
                                <CheckCircle size={16} />
                                완료됨
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        {/* Assignee Input */}
                        <div ref={assigneeRef} className="relative z-20">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">담당자</label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input 
                                    type="text" 
                                    value={assigneeSearch} 
                                    onChange={(e) => {
                                        setAssigneeSearch(e.target.value);
                                        setEditedTask({...editedTask, assignee: e.target.value});
                                        setShowAssigneeList(true);
                                    }}
                                    onFocus={() => setShowAssigneeList(true)}
                                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-indigo-500 transition-colors"
                                    placeholder="담당자 지정"
                                />
                            </div>
                            
                            {/* Assignee Dropdown */}
                            {showAssigneeList && (
                                <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 max-h-60 overflow-y-auto z-50 animate-in fade-in zoom-in-95 duration-100 ring-1 ring-black/5">
                                    {filteredStaff.length > 0 ? (
                                        filteredStaff.map(staff => (
                                            <button 
                                                key={staff.id}
                                                onClick={() => handleAssigneeSelect(staff.name)}
                                                className="w-full text-left px-4 py-3 hover:bg-slate-50 flex items-center gap-3 transition-colors border-b border-slate-50 last:border-none"
                                            >
                                                <img src={staff.image} alt={staff.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm" />
                                                <div>
                                                    <p className="text-sm font-bold text-slate-800">{staff.name}</p>
                                                    <p className="text-xs text-slate-500">{staff.role}</p>
                                                </div>
                                            </button>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-xs text-slate-400">
                                            검색 결과가 없습니다.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Date Picker */}
                        <div ref={calendarRef} className="relative z-10">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">마감 기한</label>
                            <div className="relative cursor-pointer" onClick={() => setShowCalendar(!showCalendar)}>
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input 
                                    type="text" 
                                    readOnly
                                    value={editedTask.dueDate || ''} 
                                    className="w-full pl-10 p-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:outline-none focus:border-indigo-500 cursor-pointer transition-colors"
                                    placeholder="날짜 선택"
                                />
                            </div>

                            {/* Custom Calendar Popup */}
                            {showCalendar && (
                                <div className="absolute top-full right-0 w-80 mt-2 bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 z-50 animate-in fade-in zoom-in-95 duration-100 ring-1 ring-black/5">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className="font-extrabold text-lg text-slate-800">
                                            {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                                        </h3>
                                        <div className="flex gap-2">
                                            <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                                                <ChevronLeft size={18} />
                                            </button>
                                            <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors">
                                                <ChevronRight size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-7 gap-1 mb-2 text-center">
                                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                            <div key={i} className="text-xs font-extrabold text-slate-400 py-1">{d}</div>
                                        ))}
                                    </div>
                                    
                                    <div className="grid grid-cols-7 gap-2">
                                        {blanks.map(i => <div key={`blank-${i}`} />)}
                                        {days.map(day => (
                                            <button 
                                                key={day}
                                                onClick={() => handleDateClick(day)}
                                                className={`
                                                    h-9 w-9 rounded-full text-sm font-bold flex items-center justify-center transition-all
                                                    ${isSelectedDate(day) ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110' : 
                                                      isToday(day) ? 'text-indigo-600 bg-indigo-50 ring-1 ring-indigo-100' :
                                                      'text-slate-600 hover:bg-slate-100 hover:scale-105'}
                                                `}
                                            >
                                                {day}
                                            </button>
                                        ))}
                                    </div>
                                    
                                    <div className="flex justify-between mt-6 pt-4 border-t border-slate-100">
                                        <button 
                                            onClick={() => {
                                                setEditedTask({ ...editedTask, dueDate: '' });
                                                setShowCalendar(false);
                                            }}
                                            className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            Clear
                                        </button>
                                        <button 
                                            onClick={() => {
                                                const today = new Date();
                                                const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                                                setEditedTask({ ...editedTask, dueDate: formattedDate });
                                                setShowCalendar(false);
                                            }}
                                            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors"
                                        >
                                            Today
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-6 pt-0 flex gap-3">
                    {onDelete && (
                         <button 
                            onClick={() => { onDelete(task.id); onClose(); }}
                            className="px-6 py-3 bg-rose-50 text-rose-600 rounded-xl font-bold hover:bg-rose-100 transition-colors flex items-center justify-center gap-2"
                        >
                            삭제
                        </button>
                    )}
                    <button 
                        onClick={handleSave}
                        className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
                    >
                        <Save size={18} />
                        저장하기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default JourneyTaskModal;
