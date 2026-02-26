
import React, { useState } from 'react';
import { Check, X, FileText, RefreshCw } from 'lucide-react';
import { Reservation, ServiceType } from '../types';
import { useBookings } from '../hooks/useBookings';

interface ReservationWidgetProps {
    onRegisterClick?: () => void;
    activeServices: ServiceType[];
    globalFilter?: ServiceType | 'all';
}

const ReservationWidget: React.FC<ReservationWidgetProps> = ({ onRegisterClick, activeServices, globalFilter = 'all' }) => {
  const [activeTab, setActiveTab] = useState<'requests' | 'confirmed' | 'history'>('requests');
  const [selectedRes, setSelectedRes] = useState<Reservation | null>(null);
  const [rejectModal, setRejectModal] = useState<{ open: boolean; id: string | null }>({ open: false, id: null });
  const [rejectReason, setRejectReason] = useState('');

  const { appointments, isLoading, isError, confirmBooking, rejectBooking } = useBookings();

  const filtered = appointments.filter(r =>
      (globalFilter === 'all' ? activeServices.includes(r.serviceType) : r.serviceType === globalFilter)
  );

  const requests = filtered.filter(r => r.status === 'pending');
  const confirmed = filtered.filter(r => r.status === 'confirmed');
  const history = filtered.filter(r => ['cancelled', 'completed'].includes(r.status));

  const handleConfirm = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      confirmBooking.mutate(id);
  };

  const handleRejectClick = (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      setRejectModal({ open: true, id });
  };

  if (isLoading) {
      return (
          <div className="glass-panel rounded-[2.5rem] p-8 bg-white border border-slate-100 shadow-xl min-h-[600px] flex flex-col items-center justify-center gap-4">
              <div className="w-8 h-8 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="text-sm font-medium text-slate-400">예약 정보를 불러오는 중...</p>
          </div>
      );
  }

  if (isError) {
      return (
          <div className="glass-panel rounded-[2.5rem] p-8 bg-white border border-slate-100 shadow-xl min-h-[600px] flex flex-col items-center justify-center gap-4">
              <p className="text-sm font-bold text-slate-600">데이터를 불러올 수 없습니다. 다시 시도해 주세요.</p>
              <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-indigo-700 transition-all"
              >
                  <RefreshCw size={14} />
                  다시 시도
              </button>
          </div>
      );
  }

  return (
    <div className="glass-panel rounded-[2.5rem] p-8 bg-white border border-slate-100 shadow-xl min-h-[600px] flex flex-col">
        <div className="flex justify-between items-center mb-8">
            <div>
                <h3 className="text-xl font-black text-slate-800 tracking-tight">예약 관리 센터</h3>
                <p className="text-sm text-slate-500 font-medium">신규 접수 및 대기 예약 현황</p>
            </div>
            <button onClick={onRegisterClick} className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-slate-800 transition-all active:scale-95">
                + 신규 예약
            </button>
        </div>

        <div className="flex gap-6 border-b border-slate-100 mb-6">
            {[
                { id: 'requests', label: '신규 요청', count: requests.length, color: 'text-indigo-600 border-indigo-600' },
                { id: 'confirmed', label: '확정됨', count: confirmed.length, color: 'text-emerald-600 border-emerald-600' },
                { id: 'history', label: '전체 이력', count: history.length, color: 'text-slate-600 border-slate-600' }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-4 px-2 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${activeTab === tab.id ? tab.color : 'text-slate-400 border-transparent hover:text-slate-600'}`}
                >
                    {tab.label} <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded-full">{tab.count}</span>
                </button>
            ))}
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
            {(activeTab === 'requests' ? requests : activeTab === 'confirmed' ? confirmed : history).map(res => (
                <div key={res.id} onClick={() => setSelectedRes(res)} className="group flex items-center gap-4 p-4 rounded-3xl bg-slate-50 hover:bg-white hover:shadow-lg transition-all cursor-pointer border border-transparent hover:border-indigo-100">
                    <img src={res.avatarUrl} className="w-14 h-14 rounded-2xl object-cover shadow-sm" alt="" />
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-black text-slate-800">{res.patientName}</span>
                            <span className="text-[10px] font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">{res.breed}</span>
                        </div>
                        <p className="text-xs font-bold text-slate-500 truncate group-hover:text-indigo-600 transition-colors">{res.requestType}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <div className="text-xs font-black text-slate-800">{res.time}</div>
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{res.date}</div>
                        </div>
                        {res.status === 'pending' && (
                            <div className="flex gap-2">
                                <button onClick={(e) => handleConfirm(e, res.id)} className="w-10 h-10 rounded-full bg-indigo-600 text-white flex items-center justify-center hover:bg-indigo-700 shadow-lg shadow-indigo-100"><Check size={18} strokeWidth={3}/></button>
                                <button onClick={(e) => handleRejectClick(e, res.id)} className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-400 flex items-center justify-center hover:text-rose-500 hover:border-rose-200 transition-all"><X size={18}/></button>
                            </div>
                        )}
                        {res.status !== 'pending' && (
                             <span className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase ${res.status === 'confirmed' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-400'}`}>
                                {res.status}
                             </span>
                        )}
                    </div>
                </div>
            ))}
        </div>

        {selectedRes && (
            <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in zoom-in-95 duration-200">
                <div className="bg-white rounded-[3rem] p-10 max-w-lg w-full shadow-2xl relative">
                    <button onClick={() => setSelectedRes(null)} className="absolute top-6 right-6 p-2 rounded-full bg-slate-50 text-slate-400 hover:bg-slate-100"><X size={20}/></button>
                    <div className="flex items-center gap-6 mb-8">
                        <img src={selectedRes.avatarUrl} className="w-24 h-24 rounded-3xl object-cover shadow-xl" alt="" />
                        <div>
                            <h2 className="text-3xl font-black text-slate-800">{selectedRes.patientName}</h2>
                            <p className="text-sm font-bold text-slate-500">{selectedRes.breed} · {selectedRes.ownerName} 보호자</p>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                            <h4 className="text-xs font-black text-indigo-400 uppercase tracking-widest mb-2 flex items-center gap-2"><FileText size={14}/> 요청 상세</h4>
                            <p className="text-sm font-bold text-indigo-900 leading-relaxed">"{selectedRes.symptoms || '특이사항 없음'}"</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Time</span>
                                <span className="text-base font-black text-slate-800">{selectedRes.time}</span>
                            </div>
                            <div className="flex-1 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                <span className="text-[10px] font-black text-slate-400 uppercase block mb-1">Source</span>
                                <span className="text-base font-black text-slate-800 capitalize">{selectedRes.source}</span>
                            </div>
                        </div>
                    </div>
                    {selectedRes.status === 'pending' && (
                        <div className="grid grid-cols-2 gap-4 mt-10">
                            <button
                                onClick={() => { setRejectModal({ open: true, id: selectedRes.id }); setSelectedRes(null); }}
                                className="py-4 bg-slate-100 text-slate-500 rounded-2xl font-black text-sm hover:bg-slate-200"
                            >
                                거절 처리
                            </button>
                            <button
                                onClick={() => { confirmBooking.mutate(selectedRes.id); setSelectedRes(null); }}
                                className="py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-indigo-200 hover:bg-indigo-700"
                            >
                                예약 승인
                            </button>
                        </div>
                    )}
                </div>
            </div>
        )}

        {rejectModal.open && (
            <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/20">
                <div className="bg-white rounded-3xl p-8 shadow-xl w-full max-w-md mx-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">예약 거절 사유</h3>
                    <textarea
                        className="w-full border border-gray-200 rounded-2xl p-4 text-sm resize-none h-32 focus:outline-none focus:ring-2 focus:ring-orange-200"
                        placeholder="거절 사유를 입력해주세요..."
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <div className="flex gap-3 mt-4">
                        <button
                            className="flex-1 py-3 rounded-2xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors"
                            onClick={() => { setRejectModal({ open: false, id: null }); setRejectReason(''); }}
                        >
                            취소
                        </button>
                        <button
                            className="flex-1 py-3 rounded-2xl bg-red-500 text-white font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
                            disabled={!rejectReason.trim() || rejectBooking.isPending}
                            onClick={() => {
                                if (rejectModal.id && rejectReason.trim()) {
                                    rejectBooking.mutate({ id: rejectModal.id, reason: rejectReason.trim() });
                                    setRejectModal({ open: false, id: null });
                                    setRejectReason('');
                                }
                            }}
                        >
                            {rejectBooking.isPending ? '처리 중...' : '거절 확인'}
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};

export default ReservationWidget;
