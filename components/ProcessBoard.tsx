
import React, { useState, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import SimpleCombobox from './SimpleCombobox';
import { PatientCase, ServiceType, PatientStatus, TriageData, CalendarEvent } from '../types';
import PatientCard from './PatientCard';
import { 
    Plus, Filter, X, Activity, Save, Edit2, Trash2, ArrowRight, User, 
    Smartphone, AlertTriangle, FileText, Scale, Thermometer, Heart, Wind, 
    CheckCircle2, ChevronRight, Stethoscope 
} from 'lucide-react';

interface ProcessBoardProps {
  cases: PatientCase[];
  onUpdateCases: (updated: PatientCase[]) => void;
  activeServices: ServiceType[];
  globalFilter?: ServiceType | 'all';
  onNavigateToEMR?: (patientId: string) => void;
  onSelectCase?: (c: PatientCase) => void;
  selectedCaseId?: string | null;
  onAddEvent?: (event: CalendarEvent) => void;
}

const STAGES: { id: PatientStatus; title: string; badgeColor: string; stepIdx: number }[] = [
    { id: 'reception', title: '접수 및 대기', badgeColor: 'bg-blue-100 text-blue-600', stepIdx: 1 },
    { id: 'diagnosis', title: '상담 및 진단', badgeColor: 'bg-purple-100 text-purple-600', stepIdx: 2 },
    { id: 'treatment', title: '케어 및 처치', badgeColor: 'bg-rose-100 text-rose-600', stepIdx: 3 },
    { id: 'aftercare', title: '완료 및 퇴실', badgeColor: 'bg-emerald-100 text-emerald-600', stepIdx: 4 },
];

// Module-level constant: created once, never re-created on render
const DEFAULT_BREEDS = ['Golden Retriever', 'Maltese', 'Poodle', 'Pomeranian', 'Bichon Frise', 'Shih Tzu', 'Chihuahua', 'Bulldog', 'Husky', 'Beagle', 'Mix'];

const ProcessBoard: React.FC<ProcessBoardProps> = ({ cases, onUpdateCases, activeServices, globalFilter = 'all', onNavigateToEMR, onSelectCase, selectedCaseId, onAddEvent }) => {
  const [internalSelectedCase, setInternalSelectedCase] = useState<PatientCase | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<PatientCase>>({});
  const [ready, setReady] = useState(false);

  const selectedCase = onSelectCase ? null : internalSelectedCase;

  // Memoized: single pass over cases to extract unique breeds + owners
  const { uniqueBreeds, uniqueOwners } = useMemo(() => {
      const breeds = new Set<string>();
      const owners = new Set<string>();
      for (const c of cases) {
          if (c.breed) breeds.add(c.breed);
          if (c.ownerName) owners.add(c.ownerName);
      }
      return { uniqueBreeds: Array.from(breeds), uniqueOwners: Array.from(owners) };
  }, [cases]);

  const allBreeds = useMemo(
      () => Array.from(new Set([...DEFAULT_BREEDS, ...uniqueBreeds])),
      [uniqueBreeds]
  );

  useEffect(() => {
      setReady(true);
  }, []);

  const filteredCases = useMemo(() =>
      cases.filter(c =>
          globalFilter === 'all' ? activeServices.includes(c.serviceType!) : c.serviceType === globalFilter
      ),
      [cases, globalFilter, activeServices]
  );

  const onDragEnd = (result: DropResult) => {
      const { source, destination, draggableId } = result;
      if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) return;

      const newCases: PatientCase[] = Array.from(cases);
      const draggedCaseIndex = newCases.findIndex(c => c.id === draggableId);
      if (draggedCaseIndex !== -1) {
          newCases[draggedCaseIndex].status = destination.droppableId as PatientStatus;
          onUpdateCases(newCases);
      }
  };

  const handleOpenDetail = (c: PatientCase) => {
      if (onSelectCase) {
          onSelectCase(c);
      } else {
          setInternalSelectedCase(c);
          setEditForm(c);
          setIsEditing(false);
      }
  };

  const handleSave = () => {
      if (!selectedCase) return;
      onUpdateCases(cases.map(c => c.id === selectedCase.id ? (editForm as PatientCase) : c));
      setInternalSelectedCase(editForm as PatientCase);
      setIsEditing(false);
  };

  const handleDelete = () => {
      if (!selectedCase || !window.confirm('이 케이스를 삭제하시겠습니까?')) return;
      onUpdateCases(cases.filter(c => c.id !== selectedCase.id));
      setInternalSelectedCase(null);
  };

  const handleAddNew = () => {
      const newCase: PatientCase = {
          id: Date.now().toString(),
          patientName: '신규 환자',
          breed: '품종 미정',
          caseNumber: `#CASE-${Math.floor(100 + Math.random() * 900)}`,
          description: '',
          status: 'reception',
          avatarUrl: 'https://picsum.photos/id/237/100/100',
          serviceType: (globalFilter === 'all' ? 'hospital' : globalFilter) as ServiceType,
          triage: { weight: '', temperature: '', heartRate: '', respiratoryRate: '', bcs: '' }
      };
      onUpdateCases([...cases, newCase]);
      handleOpenDetail(newCase);
      setIsEditing(true);

      // Add to Schedule automatically
      if (onAddEvent) {
          const now = new Date();
          const newEvent: CalendarEvent = {
              id: `evt-${Date.now()}`,
              title: `${newCase.patientName} 접수 (Walk-in)`,
              type: 'checkup',
              time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
              duration: 30,
              patientName: newCase.patientName,
              color: 'bg-indigo-50 text-indigo-600 border-indigo-100',
              serviceType: newCase.serviceType || 'hospital',
              date: now.getDate(),
              fullDate: now.toISOString().split('T')[0],
              description: '현장 접수 자동 생성'
          };
          onAddEvent(newEvent);
      }
  };

  const moveStage = (direction: 'next' | 'prev') => {
      if (!selectedCase) return;
      const currentIdx = STAGES.findIndex(s => s.id === selectedCase.status);
      let nextIdx = currentIdx;
      if (direction === 'next' && currentIdx < STAGES.length - 1) nextIdx++;
      if (direction === 'prev' && currentIdx > 0) nextIdx--;
      
      const updated = { ...selectedCase, status: STAGES[nextIdx].id };
      onUpdateCases(cases.map(c => c.id === selectedCase.id ? updated : c));
      setInternalSelectedCase(updated);
  };

  // Helper to get current stage index
  const getCurrentStageIndex = () => {
      if (!selectedCase) return 0;
      return STAGES.findIndex(s => s.id === selectedCase.status);
  };

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between items-end mb-6 px-1">
        <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">실시간 케어 프로세스</h2>
            <p className="text-sm text-slate-500 font-medium">드래그하여 단계를 변경할 수 있습니다.</p>
        </div>
        <div className="flex gap-2">
            <button onClick={handleAddNew} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                <Plus size={18} /> 케이스 추가
            </button>
        </div>
      </div>

      {ready && (
        <DragDropContext onDragEnd={onDragEnd}>
            <div className="flex gap-6 overflow-x-auto pb-8 px-2 snap-x items-start">
                {STAGES.map((stage) => (
                    <div key={stage.id} className="flex flex-col min-w-[300px] snap-center shrink-0">
                        <div className="flex items-center justify-between mb-4 px-2">
                            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{stage.title}</span>
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stage.badgeColor}`}>
                                {filteredCases.filter(c => c.status === stage.id).length}
                            </span>
                        </div>
                        <Droppable droppableId={stage.id}>
                            {(provided, snapshot) => (
                                <div 
                                    ref={provided.innerRef} {...provided.droppableProps}
                                    className={`flex flex-col gap-4 min-h-[400px] p-2 rounded-[2rem] transition-colors ${snapshot.isDraggingOver ? 'bg-indigo-50/50' : ''}`}
                                >
                                    {filteredCases.filter(c => c.status === stage.id).map((c, index) => (
                                        <Draggable key={c.id} draggableId={c.id} index={index}>
                                            {(provided) => (
                                                <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                                                    <div className={`transition-all duration-300 ${selectedCaseId === c.id ? 'scale-105 ring-4 ring-indigo-500/20 rounded-3xl' : ''}`}>
                                                        <PatientCard data={c} onClick={() => handleOpenDetail(c)} />
                                                    </div>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                ))}
            </div>
        </DragDropContext>
      )}

      {selectedCase && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-300">
              <div className="relative bg-white rounded-[2.5rem] w-full max-w-5xl h-[85vh] shadow-2xl overflow-hidden flex flex-col">
                  
                  {/* Header */}
                  <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
                      <div className="flex items-center gap-6">
                          <div className="relative">
                              <img src={editForm.avatarUrl} className="w-16 h-16 rounded-2xl object-cover shadow-md border border-slate-100" alt="" />
                              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold ${selectedCase.serviceType === 'grooming' ? 'bg-pink-500' : selectedCase.serviceType === 'hotel' ? 'bg-orange-500' : 'bg-indigo-500'}`}>
                                  {selectedCase.serviceType === 'grooming' ? <img src="https://api.iconify.design/lucide:scissors.svg?color=white" className="w-3 h-3"/> : <img src="https://api.iconify.design/lucide:stethoscope.svg?color=white" className="w-3 h-3"/>}
                              </div>
                          </div>
                          <div>
                              <div className="flex items-center gap-3 mb-1">
                                  {isEditing ? (
                                      <input 
                                        className="text-2xl font-black text-slate-900 bg-slate-50 border border-indigo-200 rounded px-2 py-0.5 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all" 
                                        value={editForm.patientName} 
                                        onChange={e => setEditForm({...editForm, patientName: e.target.value})} 
                                        placeholder="환자 이름"
                                      />
                                  ) : (
                                      <h2 className="text-3xl font-black text-slate-900 tracking-tight">{selectedCase.patientName}</h2>
                                  )}
                                  <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded-lg border border-slate-200">{selectedCase.caseNumber}</span>
                              </div>

                              <div className="mt-2">
                                  {isEditing ? (
                                      <div className="flex flex-wrap items-center gap-3">
                                          <div className="w-48">
                                              <SimpleCombobox 
                                                  value={editForm.breed || ''}
                                                  onChange={(val) => setEditForm({...editForm, breed: val})}
                                                  options={allBreeds}
                                                  placeholder="품종 선택/입력"
                                                  icon={<img src="https://api.iconify.design/lucide:dog.svg?color=%2394a3b8" className="w-4 h-4" />}
                                              />
                                          </div>
                                          <div className="w-48">
                                              <SimpleCombobox 
                                                  value={editForm.ownerName || ''}
                                                  onChange={(val) => setEditForm({...editForm, ownerName: val})}
                                                  options={uniqueOwners}
                                                  placeholder="보호자 선택/입력"
                                                  icon={<User size={16} />}
                                              />
                                          </div>
                                          <div className="w-56 relative group">
                                              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors pointer-events-none">
                                                  <Smartphone size={16} />
                                              </div>
                                              <input 
                                                  className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2.5 pl-10 pr-4 text-sm font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:font-normal placeholder:text-slate-400"
                                                  value={editForm.phoneNumber || ''}
                                                  onChange={e => {
                                                      // Simple phone formatting
                                                      let val = e.target.value.replace(/[^0-9]/g, '');
                                                      if (val.length > 3 && val.length <= 7) {
                                                          val = val.slice(0, 3) + '-' + val.slice(3);
                                                      } else if (val.length > 7) {
                                                          val = val.slice(0, 3) + '-' + val.slice(3, 7) + '-' + val.slice(7, 11);
                                                      }
                                                      setEditForm({...editForm, phoneNumber: val});
                                                  }}
                                                  placeholder="010-0000-0000"
                                                  maxLength={13}
                                              />
                                          </div>
                                      </div>
                                  ) : (
                                      <div className="flex items-center gap-3 text-sm font-medium text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 inline-flex">
                                          <div className="flex items-center gap-1.5">
                                              <img src="https://api.iconify.design/lucide:dog.svg?color=%2364748b" className="w-3.5 h-3.5" />
                                              <span className="font-bold text-slate-700">{editForm.breed || '품종 미정'}</span>
                                          </div>
                                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                          <div className="flex items-center gap-1.5">
                                              <User size={14} className="text-slate-500" />
                                              <span>{editForm.ownerName || '보호자 미정'}</span>
                                          </div>
                                          <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                          <div className="flex items-center gap-1.5">
                                              <Smartphone size={14} className="text-slate-500" />
                                              <span className="text-slate-400 font-mono tracking-tight">{editForm.phoneNumber || '연락처 없음'}</span>
                                          </div>
                                      </div>
                                  )}
                              </div>
                          </div>
                      </div>
                      
                      <div className="flex gap-3">
                          {isEditing ? (
                              <button onClick={handleSave} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:scale-105 transition-all flex items-center gap-2">
                                  <Save size={18} /> 저장
                              </button>
                          ) : (
                              <button onClick={() => setIsEditing(true)} className="px-5 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2">
                                  <Edit2 size={18} /> 수정
                              </button>
                          )}
                          {!isEditing && (
                              <button onClick={handleDelete} className="p-2.5 bg-white border border-slate-200 text-rose-500 rounded-xl hover:bg-rose-50 hover:border-rose-200 transition-all">
                                  <Trash2 size={20} />
                              </button>
                          )}
                          <button onClick={() => setInternalSelectedCase(null)} className="p-2.5 bg-slate-100 text-slate-400 rounded-xl hover:bg-slate-200 hover:text-slate-600 transition-all">
                              <X size={20} />
                          </button>
                      </div>
                  </div>

                  {/* Progress Stepper */}
                  <div className="bg-slate-50/50 px-10 py-4 border-b border-slate-100 shrink-0">
                      <div className="flex justify-between items-center relative">
                          {/* Connecting Line */}
                          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -z-10"></div>
                          <div 
                            className="absolute top-1/2 left-0 h-0.5 bg-indigo-500 -z-10 transition-all duration-500" 
                            style={{ width: `${(getCurrentStageIndex() / (STAGES.length - 1)) * 100}%` }}
                          ></div>

                          {STAGES.map((stage, idx) => {
                              const isActive = idx <= getCurrentStageIndex();
                              const isCurrent = idx === getCurrentStageIndex();
                              return (
                                  <div key={stage.id} className="flex flex-col items-center gap-2 bg-white px-2">
                                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                                          isActive 
                                          ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' 
                                          : 'bg-white border-slate-300 text-slate-300'
                                      }`}>
                                          {isActive ? <CheckCircle2 size={16} strokeWidth={3} /> : <span className="text-xs font-bold">{idx + 1}</span>}
                                      </div>
                                      <span className={`text-[10px] font-bold uppercase tracking-wider ${isCurrent ? 'text-indigo-600' : 'text-slate-400'}`}>
                                          {stage.title}
                                      </span>
                                  </div>
                              );
                          })}
                      </div>
                  </div>

                  {/* Main Content (Grid Layout) */}
                  <div className="flex-1 overflow-y-auto p-8 bg-white grid grid-cols-1 lg:grid-cols-3 gap-8 custom-scrollbar">
                      
                      {/* Left: Clinical Note */}
                      <div className="lg:col-span-2 flex flex-col gap-4 h-full">
                          <div className="flex items-center gap-2 mb-1">
                              <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                  <FileText size={18} />
                              </div>
                              <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">Clinical Note (진료 기록)</h4>
                          </div>
                          <textarea 
                            disabled={!isEditing} 
                            className={`flex-1 w-full p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-sm font-medium leading-relaxed resize-none outline-none transition-all ${
                                isEditing ? 'focus:bg-white focus:border-indigo-300 focus:shadow-inner' : 'text-slate-600'
                            }`}
                            placeholder="증상, 진단 내용, 처치 계획 등을 자세히 기록하세요..."
                            value={editForm.description}
                            onChange={e => setEditForm({...editForm, description: e.target.value})}
                          />
                      </div>

                      {/* Right: Vitals / Triage */}
                      <div className="flex flex-col gap-6">
                          <div className="flex items-center gap-2 mb-1">
                              <div className="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500">
                                  <Activity size={18} />
                              </div>
                              <h4 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">Vitals (바이탈 사인)</h4>
                          </div>
                          
                          <div className="grid grid-cols-1 gap-4">
                              {/* Weight */}
                              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-indigo-100 transition-colors">
                                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                      <Scale size={24} />
                                  </div>
                                  <div className="flex-1">
                                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Weight (체중)</label>
                                      <div className="flex items-baseline gap-1">
                                          <input 
                                            disabled={!isEditing}
                                            className="text-2xl font-black text-slate-800 bg-transparent w-full outline-none placeholder:text-slate-200"
                                            value={(editForm.triage as any)?.weight || ''}
                                            onChange={e => setEditForm({...editForm, triage: { ...editForm.triage, weight: e.target.value } as TriageData})}
                                            placeholder="0.0"
                                          />
                                          <span className="text-xs font-bold text-slate-400">kg</span>
                                      </div>
                                  </div>
                              </div>

                              {/* Temperature */}
                              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-rose-100 transition-colors">
                                  <div className="w-12 h-12 rounded-xl bg-rose-50 flex items-center justify-center text-rose-500">
                                      <Thermometer size={24} />
                                  </div>
                                  <div className="flex-1">
                                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Temperature (체온)</label>
                                      <div className="flex items-baseline gap-1">
                                          <input 
                                            disabled={!isEditing}
                                            className="text-2xl font-black text-slate-800 bg-transparent w-full outline-none placeholder:text-slate-200"
                                            value={(editForm.triage as any)?.temperature || ''}
                                            onChange={e => setEditForm({...editForm, triage: { ...editForm.triage, temperature: e.target.value } as TriageData})}
                                            placeholder="0.0"
                                          />
                                          <span className="text-xs font-bold text-slate-400">°C</span>
                                      </div>
                                  </div>
                              </div>

                              {/* Heart Rate */}
                              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-emerald-100 transition-colors">
                                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                                      <Heart size={24} />
                                  </div>
                                  <div className="flex-1">
                                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Heart Rate (심박)</label>
                                      <div className="flex items-baseline gap-1">
                                          <input 
                                            disabled={!isEditing}
                                            className="text-2xl font-black text-slate-800 bg-transparent w-full outline-none placeholder:text-slate-200"
                                            value={(editForm.triage as any)?.heartRate || ''}
                                            onChange={e => setEditForm({...editForm, triage: { ...editForm.triage, heartRate: e.target.value } as TriageData})}
                                            placeholder="0"
                                          />
                                          <span className="text-xs font-bold text-slate-400">bpm</span>
                                      </div>
                                  </div>
                              </div>

                              {/* Resp Rate */}
                              <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 hover:border-blue-100 transition-colors">
                                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500">
                                      <Wind size={24} />
                                  </div>
                                  <div className="flex-1">
                                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Resp. Rate (호흡)</label>
                                      <div className="flex items-baseline gap-1">
                                          <input 
                                            disabled={!isEditing}
                                            className="text-2xl font-black text-slate-800 bg-transparent w-full outline-none placeholder:text-slate-200"
                                            value={(editForm.triage as any)?.respiratoryRate || ''}
                                            onChange={e => setEditForm({...editForm, triage: { ...editForm.triage, respiratoryRate: e.target.value } as TriageData})}
                                            placeholder="0"
                                          />
                                          <span className="text-xs font-bold text-slate-400">rpm</span>
                                      </div>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>

                  {/* Footer */}
                  <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-between items-center">
                      <div className="flex gap-3">
                        <button 
                            onClick={() => moveStage('prev')} 
                            disabled={selectedCase.status === 'reception'} 
                            className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-all shadow-sm"
                        >
                            이전 단계
                        </button>
                        <button 
                            onClick={() => moveStage('next')} 
                            disabled={selectedCase.status === 'aftercare'} 
                            className="px-6 py-3 bg-slate-900 text-white rounded-xl text-sm font-bold disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-slate-300 hover:bg-slate-800 transition-all hover:scale-105 active:scale-95"
                        >
                            다음 단계로 이동 <ArrowRight size={16}/>
                        </button>
                      </div>
                      <button onClick={() => onNavigateToEMR?.(selectedCase.id)} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 transition-colors">
                          상세 의료 기록 (EMR) 열기 <ChevronRight size={14} />
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default ProcessBoard;
