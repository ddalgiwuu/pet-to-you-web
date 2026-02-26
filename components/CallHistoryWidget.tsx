
import React from 'react';
import { Phone, PhoneIncoming, PhoneOutgoing, PhoneMissed, ArrowRight, RefreshCcw } from 'lucide-react';
import { CallLog } from '../types';

interface CallHistoryWidgetProps {
    logs: CallLog[];
    onViewAll?: () => void;
    onItemClick?: (log: CallLog) => void;
}

const CallHistoryWidget: React.FC<CallHistoryWidgetProps> = ({ logs, onViewAll, onItemClick }) => {
    const getIcon = (type: CallLog['type']) => {
        switch(type) {
            case 'incoming': return <PhoneIncoming size={14} className="text-emerald-500" />;
            case 'outgoing': return <PhoneOutgoing size={14} className="text-indigo-500" />;
            case 'missed': return <PhoneMissed size={14} className="text-rose-500" />;
        }
    };

    return (
        <div className="glass-panel rounded-[2.5rem] p-6 w-full bg-white shadow-xl shadow-slate-200/20 mb-6 border-l-4 border-indigo-500 relative flex flex-col min-h-[350px]">
            <div className="flex justify-between items-center mb-5 px-1">
                <div>
                    <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                        <Phone size={18} className="text-slate-400" /> 최근 통화 내역
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">실시간 통화 데이터 연동 중</p>
                </div>
                <button className="w-8 h-8 rounded-full bg-slate-50 text-slate-400 hover:text-indigo-600 flex items-center justify-center hover:rotate-180 transition-all duration-500">
                    <RefreshCcw size={14} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-3">
                {logs.slice(0, 5).map(log => (
                    <div 
                        key={log.id} 
                        onClick={() => onItemClick?.(log)}
                        className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-lg hover:border-indigo-100 transition-all cursor-pointer group"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                                log.type === 'missed' ? 'bg-rose-50 border border-rose-100' : 'bg-white border border-slate-200'
                            }`}>
                                {getIcon(log.type)}
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                    <h4 className={`text-sm font-black truncate ${log.type === 'missed' ? 'text-rose-600' : 'text-slate-800'}`}>
                                        {log.callerName}
                                    </h4>
                                    {log.isNew && <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></div>}
                                </div>
                                <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                                    <span>{log.time}</span>
                                    <span>•</span>
                                    <span>{log.duration || 'Missed'}</span>
                                </div>
                            </div>
                        </div>
                        <ArrowRight size={14} className="text-slate-300 group-hover:text-indigo-500 transition-colors opacity-0 group-hover:opacity-100" />
                    </div>
                ))}
            </div>
            
            <button onClick={onViewAll} className="mt-4 pt-4 border-t border-slate-100 text-xs font-black text-indigo-500 hover:underline w-full text-center">
                모든 내역 보기
            </button>
        </div>
    );
};

export default CallHistoryWidget;
