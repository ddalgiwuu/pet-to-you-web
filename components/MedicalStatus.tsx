
import React, { useState } from 'react';
import ProcessBoard from './ProcessBoard';
import CenterStatus from './CenterStatus';
import CustomerJourney from './CustomerJourney';
import { PATIENT_CASES } from '../constants';
import { Layers, LayoutTemplate, Map, ChevronLeft } from 'lucide-react';
import { ServiceType, Room, PatientCase, Staff } from '../types';

interface MedicalStatusProps {
    activeServices: ServiceType[];
    globalFilter?: ServiceType | 'all';
    rooms?: Room[]; // Accept rooms prop
    cases?: PatientCase[];
    onUpdateCases?: (cases: PatientCase[]) => void;
    onAddCase?: (newCase: PatientCase) => void;
    onUpdateRoom?: (room: Room) => void;
    staffList?: Staff[];
}

const MedicalStatus: React.FC<MedicalStatusProps> = ({ activeServices, globalFilter = 'all', rooms = [], cases, onUpdateCases, onAddCase, onUpdateRoom, staffList = [] }) => {
    const [view, setView] = useState<'operations' | 'facilities'>('operations');
    const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

    const selectedCase = cases?.find(c => c.id === selectedCaseId);

    // Dynamic Labels
    const getTabLabel = (type: 'operations' | 'facilities') => {
        if (type === 'operations') {
            return '실시간 통합 현황 (Live Hub)';
        }
        return '시설 및 공간 (Facilities)';
    };

    return (
        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Unified Toggle Header */}
            <div className="flex justify-between items-center bg-white p-2 rounded-2xl shadow-sm border border-slate-100 w-fit">
                <button 
                    onClick={() => setView('operations')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                        view === 'operations' 
                        ? 'bg-slate-900 text-white shadow-lg' 
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                >
                    <Layers size={16} /> {getTabLabel('operations')}
                </button>
                <button 
                    onClick={() => setView('facilities')}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                        view === 'facilities' 
                        ? 'bg-slate-900 text-white shadow-lg' 
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                >
                    <LayoutTemplate size={16} /> {getTabLabel('facilities')}
                </button>
            </div>

            <div className="min-h-[600px] relative">
                {view === 'operations' && (
                    <div className="flex flex-col gap-6">
                        <div className={`transition-all duration-500 ${selectedCaseId ? 'opacity-40 pointer-events-none blur-[2px] scale-[0.98]' : 'opacity-100'}`}>
                            <ProcessBoard 
                                cases={cases || []} 
                                onUpdateCases={onUpdateCases || (() => {})} 
                                activeServices={activeServices} 
                                globalFilter={globalFilter}
                                onSelectCase={(c) => setSelectedCaseId(c.id)}
                                selectedCaseId={selectedCaseId}
                            />
                        </div>

                        {/* Journey Modal Overlay */}
                        {selectedCaseId && (
                            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 md:p-10 animate-in fade-in duration-300">
                                <div 
                                    className="w-full max-w-[1400px] bg-[#f8fafc] h-full max-h-[92vh] rounded-[3.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-y-auto animate-in zoom-in-95 duration-500 p-10 md:p-14 relative custom-scrollbar"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <button 
                                        onClick={() => setSelectedCaseId(null)}
                                        className="absolute top-10 left-10 z-50 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm text-slate-400 hover:text-slate-900 transition-all flex items-center gap-2 font-bold text-[11px] border border-slate-100 uppercase tracking-wider"
                                    >
                                        <ChevronLeft size={14} /> 보드로 돌아가기
                                    </button>
                                    
                                    <div className="mt-6">
                                        <CustomerJourney 
                                            onAddCase={onAddCase} 
                                            staffList={staffList} 
                                            cases={cases || []} 
                                            onUpdateCases={onUpdateCases}
                                            initialSelectedId={selectedCaseId}
                                            hideSidebar={true}
                                        />
                                    </div>
                                </div>
                                <div className="absolute inset-0 -z-10" onClick={() => setSelectedCaseId(null)}></div>
                            </div>
                        )}
                    </div>
                )}

                {view === 'facilities' && (
                    <div className="animate-in fade-in zoom-in-95 duration-300">
                        <CenterStatus activeServices={activeServices} rooms={rooms} onAddCase={onAddCase} onUpdateRoom={onUpdateRoom} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MedicalStatus;
