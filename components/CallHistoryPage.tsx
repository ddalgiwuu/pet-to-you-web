
import React, { useState } from 'react';
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, Search, Filter, Calendar, MoreHorizontal, User, FileText, ArrowRight } from 'lucide-react';
import { CallLog } from '../types';

interface CallHistoryPageProps {
    logs: CallLog[];
    onLogClick?: (log: CallLog) => void;
}

const CallHistoryPage: React.FC<CallHistoryPageProps> = ({ logs, onLogClick }) => {
    const [filterType, setFilterType] = useState<'all' | 'incoming' | 'outgoing' | 'missed'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLogs = logs.filter(log => {
        const matchesType = filterType === 'all' || log.type === filterType;
        const matchesSearch = log.callerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              log.phoneNumber.includes(searchTerm);
        return matchesType && matchesSearch;
    });

    const getIcon = (type: CallLog['type']) => {
        switch(type) {
            case 'incoming': return <PhoneIncoming size={16} className="text-emerald-500" />;
            case 'outgoing': return <PhoneOutgoing size={16} className="text-indigo-500" />;
            case 'missed': return <PhoneMissed size={16} className="text-rose-500" />;
        }
    };

    const getTypeLabel = (type: CallLog['type']) => {
        switch(type) {
            case 'incoming': return '수신';
            case 'outgoing': return '발신';
            case 'missed': return '부재중';
        }
    };

    return (
        <div className="glass-panel rounded-3xl p-8 min-h-[calc(100vh-140px)] animate-in fade-in slide-in-from-bottom-8 duration-700 bg-white border border-slate-100">
            {/* Header Toolbar */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 mb-8">
                <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                        통화 기록 센터
                    </h2>
                    <p className="text-sm text-slate-500 mt-1 font-medium">
                        모든 전화 수신, 발신 및 부재중 기록을 통합 관리합니다.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
                    {/* Filter Tabs */}
                    <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
                        {['all', 'incoming', 'outgoing', 'missed'].map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type as any)}
                                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                                    filterType === type 
                                    ? 'bg-white text-slate-800 shadow-sm' 
                                    : 'text-slate-400 hover:text-slate-600'
                                }`}
                            >
                                {type === 'all' ? '전체' : type === 'incoming' ? '수신' : type === 'outgoing' ? '발신' : '부재중'}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="flex items-center glass-panel bg-white/50 rounded-xl px-4 py-2.5 border focus-within:border-indigo-300 transition-colors w-full sm:w-64">
                        <Search size={16} className="text-slate-400" />
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="이름, 번호 검색" 
                            className="bg-transparent border-none outline-none text-sm ml-2 w-full text-slate-700 placeholder:text-slate-400"
                        />
                    </div>
                </div>
            </div>

            {/* List Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-slate-200 text-xs font-bold text-slate-400 uppercase tracking-wider">
                <div className="col-span-1 text-center">Type</div>
                <div className="col-span-3">Caller Info</div>
                <div className="col-span-2">Date/Time</div>
                <div className="col-span-2">Duration</div>
                <div className="col-span-2">Tags/Status</div>
                <div className="col-span-2 text-right">Actions</div>
            </div>

            {/* List Body */}
            <div className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh-300px)] custom-scrollbar pr-2 mt-2">
                {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                    <div 
                        key={log.id} 
                        onClick={() => onLogClick && onLogClick(log)}
                        className="group flex flex-col md:grid md:grid-cols-12 gap-4 p-4 rounded-2xl bg-white border border-slate-100 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-50/50 transition-all items-center cursor-pointer"
                    >
                        
                        {/* Type Icon */}
                        <div className="col-span-1 flex justify-center md:justify-center items-center">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                log.type === 'missed' ? 'bg-rose-50 text-rose-500' :
                                log.type === 'incoming' ? 'bg-emerald-50 text-emerald-500' : 'bg-indigo-50 text-indigo-500'
                            }`}>
                                {getIcon(log.type)}
                            </div>
                        </div>

                        {/* Caller Info */}
                        <div className="col-span-3 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className={`font-bold text-sm truncate ${log.type === 'missed' ? 'text-rose-600' : 'text-slate-800'}`}>
                                    {log.callerName}
                                </h4>
                                {log.isNew && <span className="bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold animate-pulse">NEW</span>}
                            </div>
                            <div className="text-xs text-slate-500 font-mono flex items-center gap-1">
                                <Phone size={10} /> {log.phoneNumber}
                            </div>
                        </div>

                        {/* Date/Time */}
                        <div className="col-span-2 text-xs text-slate-600 font-medium flex items-center gap-2">
                            <Calendar size={14} className="text-slate-400" />
                            {log.time}
                        </div>

                        {/* Duration */}
                        <div className="col-span-2 text-xs text-slate-500 font-medium">
                            {log.type === 'missed' ? (
                                <span className="text-rose-400 italic">응답 없음</span>
                            ) : (
                                <span className="bg-slate-50 px-2 py-1 rounded text-slate-600 border border-slate-100">
                                    {log.duration}
                                </span>
                            )}
                        </div>

                        {/* Tags */}
                        <div className="col-span-2 flex flex-wrap gap-1">
                            {log.tags && log.tags.length > 0 ? (
                                log.tags.map(tag => (
                                    <span key={tag} className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-500 border border-slate-200">
                                        #{tag}
                                    </span>
                                ))
                            ) : (
                                <span className="text-[10px] text-slate-300">-</span>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="col-span-2 flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                            {log.type === 'missed' && (
                                <button className="px-3 py-1.5 bg-rose-500 text-white rounded-lg text-xs font-bold hover:bg-rose-600 shadow-md shadow-rose-200 transition-colors flex items-center gap-1">
                                    <Phone size={12} fill="currentColor" /> 콜백
                                </button>
                            )}
                            <button className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors" title="메모">
                                <FileText size={16} />
                            </button>
                            <button className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors" title="상세보기">
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>
                )) : (
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                        <Phone size={32} className="mb-3 opacity-50" />
                        <p className="text-sm font-bold">기록이 없습니다.</p>
                        <p className="text-xs mt-1">검색 조건을 변경하거나 새로운 통화를 기다리세요.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CallHistoryPage;
