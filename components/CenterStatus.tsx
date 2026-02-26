
import React, { useState } from 'react';
import { Room, ServiceType, PatientCase } from '../types';
import { Clock, User } from 'lucide-react';
import RoomDetailModal from './RoomDetailModal';

interface CenterStatusProps {
    activeServices?: ServiceType[];
    rooms?: Room[]; // Now accepts dynamic rooms
    onAddCase?: (newCase: PatientCase) => void;
    onUpdateRoom?: (room: Room) => void;
}

const CenterStatus: React.FC<CenterStatusProps> = ({ activeServices = ['hospital'], rooms = [], onAddCase, onUpdateRoom }) => {
    // Filter rooms based on active services
    const filteredRooms = rooms.filter(room => activeServices.includes(room.serviceType));
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

    const handleRoomClick = (room: Room) => {
        setSelectedRoom(room);
    };

    const handleUpdateRoom = (updatedRoom: Room) => {
        if (onUpdateRoom) {
            onUpdateRoom(updatedRoom);
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div>
                {/* Title removed */}
                <div className="flex gap-4 mb-4">
                     <StatusLegend color="bg-emerald-500" label="사용 가능" />
                     <StatusLegend color="bg-rose-500" label="사용 중" />
                     <StatusLegend color="bg-amber-500" label="청소/준비 중" />
                </div>
            </div>

            {/* Grid Layout simulating floor plan roughly */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredRooms.length > 0 ? filteredRooms.map((room) => (
                    <div key={room.id} 
                         onClick={() => handleRoomClick(room)}
                         className={`relative overflow-hidden rounded-3xl p-6 h-48 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer ${
                        room.status === 'occupied' 
                        ? 'bg-white shadow-lg border-l-4 border-rose-500' 
                        : room.status === 'cleaning'
                        ? 'bg-slate-50 border border-slate-200 border-l-4 border-l-amber-500 opacity-80'
                        : 'bg-white border border-slate-100 border-l-4 border-l-emerald-500'
                    }`}>
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{room.type.toUpperCase()}</span>
                            <div className={`w-2 h-2 rounded-full ${
                                room.status === 'occupied' ? 'bg-rose-500 animate-pulse' : room.status === 'cleaning' ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}></div>
                        </div>
                        
                        <div>
                            <h3 className="text-xl font-extrabold text-slate-800 mb-1">{room.name}</h3>
                            <p className={`text-sm font-medium ${
                                room.status === 'occupied' ? 'text-rose-600' : room.status === 'cleaning' ? 'text-amber-600' : 'text-emerald-600'
                            }`}>
                                {room.status === 'occupied' ? '사용 중' : room.status === 'cleaning' ? '청소 중' : '사용 가능'}
                            </p>
                        </div>

                        {room.occupantName && (
                            <div className="mt-4 pt-4 border-t border-slate-100">
                                <div className="flex items-center gap-2 mb-1">
                                    <User size={14} className="text-slate-400" />
                                    <span className="text-sm font-bold text-slate-700">{room.occupantName}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={14} className="text-slate-400" />
                                    <span className="text-xs text-slate-500">{room.occupantTime}</span>
                                </div>
                            </div>
                        )}
                    </div>
                )) : (
                    <div className="col-span-full flex items-center justify-center p-12 text-slate-400 font-medium bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                        선택된 서비스에 해당하는 시설이 없습니다. 설정에서 시설을 추가해주세요.
                    </div>
                )}
            </div>

            {selectedRoom && (
                <RoomDetailModal 
                    room={selectedRoom} 
                    onClose={() => setSelectedRoom(null)} 
                    onUpdate={handleUpdateRoom} 
                />
            )}
        </div>
    );
};

const StatusLegend = ({ color, label }: { color: string, label: string }) => (
    <div className="flex items-center gap-2">
        <div className={`w-3 h-3 rounded-full ${color}`}></div>
        <span className="text-sm text-slate-600 font-medium">{label}</span>
    </div>
)

export default CenterStatus;
