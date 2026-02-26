import React, { useState, useEffect } from 'react';
import { X, Save, Trash2, Check, User, Clock, Activity } from 'lucide-react';
import { Room, ServiceType } from '../types';

interface RoomDetailModalProps {
    room: Room;
    onClose: () => void;
    onUpdate: (updatedRoom: Room) => void;
}

const RoomDetailModal: React.FC<RoomDetailModalProps> = ({ room, onClose, onUpdate }) => {
    const [editedRoom, setEditedRoom] = useState<Room>(room);

    const handleStatusChange = (status: string) => {
        setEditedRoom({ ...editedRoom, status });
    };

    const handleSave = () => {
        onUpdate(editedRoom);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                        <Activity className="text-indigo-500" size={24} />
                        시설 상세 정보
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                        <X size={20} className="text-slate-500" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">시설명</label>
                        <input 
                            type="text" 
                            value={editedRoom.name} 
                            onChange={(e) => setEditedRoom({...editedRoom, name: e.target.value})}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-2">상태 설정</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button 
                                onClick={() => handleStatusChange('available')}
                                className={`p-3 rounded-xl border font-bold text-sm transition-all ${
                                    editedRoom.status === 'available' 
                                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600 ring-2 ring-emerald-500/20' 
                                    : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                                }`}
                            >
                                사용 가능
                            </button>
                            <button 
                                onClick={() => handleStatusChange('occupied')}
                                className={`p-3 rounded-xl border font-bold text-sm transition-all ${
                                    editedRoom.status === 'occupied' 
                                    ? 'bg-rose-50 border-rose-200 text-rose-600 ring-2 ring-rose-500/20' 
                                    : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                                }`}
                            >
                                사용 중
                            </button>
                            <button 
                                onClick={() => handleStatusChange('cleaning')}
                                className={`p-3 rounded-xl border font-bold text-sm transition-all ${
                                    editedRoom.status === 'cleaning' 
                                    ? 'bg-amber-50 border-amber-200 text-amber-600 ring-2 ring-amber-500/20' 
                                    : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                                }`}
                            >
                                청소 중
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <h3 className="text-sm font-bold text-slate-800">사용자 정보</h3>
                        
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <User size={18} />
                            </div>
                            <div className="flex-1">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase">이름 / 환자명</label>
                                <input 
                                    type="text" 
                                    value={editedRoom.occupantName || ''} 
                                    onChange={(e) => setEditedRoom({...editedRoom, occupantName: e.target.value})}
                                    placeholder="사용자 없음"
                                    className="w-full bg-transparent border-b border-slate-200 py-1 text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <Clock size={18} />
                            </div>
                            <div className="flex-1">
                                <label className="block text-[10px] font-bold text-slate-400 uppercase">사용 시간 / 입실 시간</label>
                                <input 
                                    type="text" 
                                    value={editedRoom.occupantTime || ''} 
                                    onChange={(e) => setEditedRoom({...editedRoom, occupantTime: e.target.value})}
                                    placeholder="시간 정보 없음"
                                    className="w-full bg-transparent border-b border-slate-200 py-1 text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 pt-0 flex gap-3">
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

export default RoomDetailModal;
