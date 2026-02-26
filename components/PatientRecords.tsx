
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, ChevronRight, X, Activity, File, Plus, Edit2, Trash2, Save, User, Phone, Stethoscope, Scissors, Home, Layers, Filter, Receipt, Calendar, CreditCard, Image as ImageIcon, Cake, AlertTriangle, Info } from 'lucide-react';
import { Patient, ServiceType, PatientReceipt } from '../types';

interface PatientRecordsProps {
    patients: Patient[];
    onAddPatient: (patient: Patient) => void;
    onUpdatePatient: (patient: Patient) => void;
    onDeletePatient: (id: string) => void;
    activeServices: ServiceType[];
    globalFilter?: ServiceType | 'all'; // New Prop
}

const PatientRecords: React.FC<PatientRecordsProps> = ({ patients, onAddPatient, onUpdatePatient, onDeletePatient, activeServices, globalFilter = 'all' }) => {
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentService, setCurrentService] = useState<ServiceType | 'all'>('all');
    
    // Edit/Add Mode State
    const [isEditing, setIsEditing] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [editForm, setEditForm] = useState<Partial<Patient>>({});

    // Receipt Add State
    const [isAddingReceipt, setIsAddingReceipt] = useState(false);
    const [receiptForm, setReceiptForm] = useState({ description: '', amount: 0, date: new Date().toISOString().split('T')[0] });

    const searchInputRef = useRef<HTMLInputElement>(null);

    // Sync with Global Master Switch
    useEffect(() => {
        setCurrentService(globalFilter);
    }, [globalFilter]);

    // '/' 단축키로 검색창 포커스
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
            if (e.key === 'Escape') {
                searchInputRef.current?.blur();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // 검색 필터 (useMemo로 메모이제이션 — 의존 값 변경 시에만 재계산)
    const filteredPatients = useMemo(() => {
        const trimmed = searchTerm.trim().toLowerCase();

        return patients.filter(p => {
            // 1. 서비스 필터
            const matchesService = currentService === 'all'
                ? activeServices.includes(p.serviceType)
                : p.serviceType === currentService;
            if (!matchesService) return false;

            // 2. 검색어 없으면 전부 표시
            if (!trimmed) return true;

            // 3. 공백으로 분리된 모든 키워드를 AND 조건으로 매칭
            const terms = trimmed.split(/\s+/).filter(Boolean);
            return terms.every(term => {
                // 전화번호·생년월일용: 해당 term에서만 구분자 제거
                const cleanTerm = term.replace(/[-.\s]/g, '');
                const isNumericTerm = /^\d+$/.test(cleanTerm);

                return (
                    // 이름 (null-safe)
                    (p.name?.toLowerCase().includes(term)) ||
                    // 차트번호
                    (p.chartNumber?.toLowerCase().includes(term)) ||
                    // 보호자명
                    (p.ownerName?.toLowerCase().includes(term)) ||
                    // 전화번호 — 숫자 term일 때만 비교 (성능 최적화)
                    (isNumericTerm && p.phoneNumber?.replace(/[-.\s]/g, '').includes(cleanTerm)) ||
                    // 생년월일 — 숫자 term일 때만 비교
                    (isNumericTerm && p.birthDate?.replace(/-/g, '').includes(cleanTerm))
                );
            });
        });
    }, [patients, currentService, activeServices, searchTerm]);

    // 동명이인 감지 — 필터 결과 내에서 이름이 중복된 경우 추가 정보 표시용
    const duplicateNames = useMemo(() => {
        const counts: Record<string, number> = {};
        filteredPatients.forEach(p => {
            const key = p.name?.toLowerCase() ?? '';
            counts[key] = (counts[key] || 0) + 1;
        });
        return new Set(
            Object.entries(counts).filter(([, n]) => n > 1).map(([name]) => name)
        );
    }, [filteredPatients]);

    const handlePatientClick = (p: Patient) => {
        if (isAdding) return;
        setSelectedPatient(p);
        setIsEditing(false);
        setIsAddingReceipt(false);
        setEditForm({});
    };

    const startAdd = () => {
        setIsAdding(true);
        setSelectedPatient(null);
        setEditForm({
            name: '',
            breed: '',
            age: '',
            birthDate: '',
            gender: '수컷',
            status: '건강함',
            chartNumber: `P-2023-${Math.floor(Math.random() * 9000) + 1000}`,
            image: `https://picsum.photos/id/${Math.floor(Math.random() * 200)}/100/100`,
            lastVisit: new Date().toLocaleDateString(),
            ownerName: '',
            phoneNumber: '',
            memo: '',
            adminMemo: '',
            serviceType: currentService === 'all' ? 'hospital' : currentService
        });
    };

    const startEdit = () => {
        if (!selectedPatient) return;
        setIsEditing(true);
        setEditForm({ ...selectedPatient });
    };

    const handleSave = () => {
        if (isAdding) {
            const newPatient = {
                ...editForm,
                id: Date.now().toString(),
            } as Patient;
            onAddPatient(newPatient);
            setIsAdding(false);
            setSelectedPatient(newPatient);
        } else {
            if (editForm.id) {
                onUpdatePatient(editForm as Patient);
                setIsEditing(false);
                setSelectedPatient(editForm as Patient);
            }
        }
    };

    const handleDelete = () => {
        if (selectedPatient && window.confirm('환자 정보를 삭제하시겠습니까?')) {
            onDeletePatient(selectedPatient.id);
            setSelectedPatient(null);
            setIsEditing(false);
        }
    };

    const handleAddReceipt = () => {
        if (!selectedPatient) return;
        if (!receiptForm.description || receiptForm.amount <= 0) {
            alert("내역과 금액을 올바르게 입력해주세요.");
            return;
        }

        const newReceipt: PatientReceipt = {
            id: Date.now().toString(),
            description: receiptForm.description,
            amount: receiptForm.amount,
            date: receiptForm.date.replace(/-/g, '.'),
            imageUrl: ''
        };

        const updatedPatient = {
            ...selectedPatient,
            receipts: [newReceipt, ...(selectedPatient.receipts || [])]
        };

        setSelectedPatient(updatedPatient);
        onUpdatePatient(updatedPatient);
        setIsAddingReceipt(false);
        setReceiptForm({ description: '', amount: 0, date: new Date().toISOString().split('T')[0] });
    };

    const cancelAction = () => {
        setIsAdding(false);
        setIsEditing(false);
        setIsAddingReceipt(false);
        if (isAdding) setSelectedPatient(null);
    };

    const getServiceBadge = (type: ServiceType) => {
        switch(type) {
            case 'hospital': return <span className="p-1 rounded bg-indigo-50 text-indigo-500"><Stethoscope size={12} /></span>;
            case 'grooming': return <span className="p-1 rounded bg-pink-50 text-pink-500"><Scissors size={12} /></span>;
            case 'hotel': return <span className="p-1 rounded bg-orange-50 text-orange-500"><Home size={12} /></span>;
            default: return null;
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-140px)] animate-in fade-in slide-in-from-bottom-4 duration-500">
             
             {/* Unified Toolbar */}
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                
                {/* Left: Filters */}
                <div className="flex gap-4 items-center">
                    {/* Service Tabs */}
                    {activeServices.length > 1 && (
                         <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-100">
                            <button onClick={() => setCurrentService('all')} className={`p-2.5 rounded-lg transition-all ${currentService === 'all' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`} title="전체"><Layers size={16} /></button>
                            {activeServices.includes('hospital') && (
                                <button onClick={() => setCurrentService('hospital')} className={`p-2.5 rounded-lg transition-all ${currentService === 'hospital' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`} title="병원"><Stethoscope size={16} /></button>
                            )}
                            {activeServices.includes('grooming') && (
                                <button onClick={() => setCurrentService('grooming')} className={`p-2.5 rounded-lg transition-all ${currentService === 'grooming' ? 'bg-pink-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`} title="미용"><Scissors size={16} /></button>
                            )}
                             {activeServices.includes('hotel') && (
                                <button onClick={() => setCurrentService('hotel')} className={`p-2.5 rounded-lg transition-all ${currentService === 'hotel' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`} title="호텔"><Home size={16} /></button>
                            )}
                         </div>
                    )}
                    <span className="text-xs font-bold text-slate-400 hidden md:block">
                        Total {filteredPatients.length}
                    </span>
                </div>

                {/* Right: Search & Action */}
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="flex items-center glass-panel bg-white/80 rounded-xl px-4 py-2 flex-1 md:w-96 border focus-within:border-indigo-300 transition-colors gap-2">
                        <Search size={16} className={`flex-shrink-0 transition-colors ${searchTerm ? 'text-indigo-400' : 'text-slate-400'}`} />
                        <input
                            ref={searchInputRef}
                            type="text"
                            placeholder="이름 · 생년월일 · 차트번호 · 연락처  ( / )"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm w-full text-slate-700 placeholder:text-slate-300 min-w-0"
                        />
                        {searchTerm && (
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${filteredPatients.length > 0 ? 'bg-indigo-50 text-indigo-500' : 'bg-rose-50 text-rose-400'}`}>
                                    {filteredPatients.length}
                                </span>
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="text-slate-300 hover:text-slate-500 transition-colors"
                                    title="검색어 지우기"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={startAdd}
                        className="flex items-center gap-2 px-5 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-200 hover:bg-slate-800 transition-colors whitespace-nowrap"
                    >
                        <Plus size={16} /> 등록
                    </button>
                </div>
             </div>

            <div className="flex gap-6 flex-1 min-h-0">
                {/* List Section */}
                <div className={`glass-panel rounded-3xl p-6 flex flex-col transition-all duration-500 min-h-0 bg-white ${selectedPatient || isAdding ? 'w-2/3' : 'w-full'}`}>
                    <div className="overflow-y-auto flex-1 pr-2 custom-scrollbar">
                        <table className="w-full text-left border-collapse">
                            <thead className="sticky top-0 bg-white z-10">
                                <tr className="border-b border-slate-100">
                                    <th className="pb-4 px-4 text-xs font-bold text-slate-400 uppercase">차트 번호</th>
                                    <th className="pb-4 px-4 text-xs font-bold text-slate-400 uppercase">환자 정보 (보호자)</th>
                                    <th className="pb-4 px-4 text-xs font-bold text-slate-400 uppercase">최근 방문 / 서비스</th>
                                    <th className="pb-4 px-4 text-xs font-bold text-slate-400 uppercase text-center">상태</th>
                                    <th className="pb-4 px-4 text-xs font-bold text-slate-400 uppercase text-right">상세</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {filteredPatients.map((p) => (
                                    <tr 
                                        key={p.id} 
                                        onClick={() => handlePatientClick(p)}
                                        className={`group hover:bg-slate-50 transition-all cursor-pointer border-b border-slate-50 last:border-0 ${selectedPatient?.id === p.id ? 'bg-indigo-50/60 border-indigo-100' : ''}`}
                                    >
                                        <td className="py-4 px-4 text-slate-400 font-bold text-xs">{p.chartNumber}</td>
                                        <td className="py-4 px-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-11 h-11 rounded-2xl bg-slate-100 overflow-hidden border-2 border-white group-hover:border-indigo-200 shadow-sm transition-all flex-shrink-0">
                                                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex flex-col min-w-0">
                                                    <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                                                        <span className="font-bold text-slate-800 truncate">{p.name}</span>
                                                        {getServiceBadge(p.serviceType)}
                                                        {duplicateNames.has(p.name?.toLowerCase() ?? '') && (
                                                            <span className="text-[10px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-full">
                                                                {p.chartNumber}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-slate-400 flex items-center gap-1 flex-wrap">
                                                        {p.breed && <span className="font-medium text-slate-500">{p.breed}</span>}
                                                        {p.breed && p.ownerName && <span className="text-slate-200">·</span>}
                                                        {p.ownerName && (
                                                            <span className="flex items-center gap-0.5">
                                                                <User size={10} className="text-slate-300" />
                                                                {p.ownerName}
                                                            </span>
                                                        )}
                                                    </div>
                                                    {p.birthDate && (
                                                        <div className="text-[10px] text-indigo-400 font-medium flex items-center gap-1 mt-0.5">
                                                            <Cake size={9} /> {p.birthDate}
                                                            <span className="text-slate-300">·</span>
                                                            <span>{p.age}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-4">
                                            <div className="font-bold text-slate-700">{p.lastVisit}</div>
                                            {p.lastService && <div className="text-xs text-slate-400 mt-0.5">{p.lastService}</div>}
                                        </td>
                                        <td className="py-4 px-4 text-center">
                                            <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                                                p.status === '치료중' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                                                p.status === '건강함' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                                            }`}>
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="py-4 px-4 text-right">
                                            <ChevronRight size={16} className={`ml-auto text-slate-300 group-hover:text-indigo-500 transition-colors ${selectedPatient?.id === p.id ? 'text-indigo-600' : ''}`} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {filteredPatients.length === 0 && (
                            <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                                <Filter size={32} className="mb-2 opacity-50" />
                                <p className="text-sm font-medium">검색 결과가 없습니다.</p>
                                <p className="text-xs mt-1 text-slate-300">이름 + 생년월일로 검색해보세요 (예: 홍길동 900101)</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Detail / Edit / Add Panel */}
                {(selectedPatient || isAdding) && (
                    <div className="w-1/3 glass-panel rounded-3xl p-6 bg-white animate-in slide-in-from-right-10 duration-500 flex flex-col border-l-4 border-indigo-500 overflow-hidden min-h-0 shadow-2xl">
                        
                        {/* Header Actions */}
                        <div className="flex justify-between items-start mb-6">
                            {isAdding ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
                                        <Plus size={18} className="text-indigo-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-extrabold text-slate-800">새 환자 등록</h3>
                                        <p className="text-xs text-slate-400 font-medium">아래 정보를 입력해주세요</p>
                                    </div>
                                </div>
                            ) : isEditing ? (
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shadow-md relative">
                                        <img src={editForm.image} alt="profile" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-indigo-600/20 flex items-center justify-center">
                                            <Edit2 size={14} className="text-white drop-shadow" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">편집 중</span>
                                        </div>
                                        <h2 className="text-lg font-extrabold text-slate-800">{selectedPatient!.name}</h2>
                                        <p className="text-xs text-slate-400 font-medium">{selectedPatient!.chartNumber}</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shadow-md">
                                        <img src={selectedPatient!.image} alt="profile" className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                                            {selectedPatient!.name}
                                            {getServiceBadge(selectedPatient!.serviceType)}
                                        </h2>
                                        <p className="text-sm text-slate-500 font-medium">{selectedPatient!.breed} · {selectedPatient!.gender} · {selectedPatient!.age}</p>
                                        {selectedPatient!.birthDate && (
                                            <p className="text-xs text-indigo-500 font-bold mt-1 flex items-center gap-1">
                                                <Cake size={12} /> {selectedPatient!.birthDate}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                            <button onClick={() => { setSelectedPatient(null); setIsAdding(false); setIsEditing(false); }} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                                <X size={20} />
                            </button>
                        </div>
                        
                        {/* Form / View Content */}
                        <div className="space-y-6 overflow-y-auto pr-2 flex-1 custom-scrollbar">
                            
                            {(isEditing || isAdding) ? (
                                // EDIT FORM
                                <div className="space-y-5">
                                    {/* Section: 환자 기본 정보 */}
                                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">환자 정보</p>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500">이름 *</label>
                                            <input
                                                className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all"
                                                value={editForm.name || ''}
                                                onChange={e => setEditForm({...editForm, name: e.target.value})}
                                                placeholder="환자(반려동물) 이름"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500">주 이용 서비스</label>
                                            <select
                                                className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all"
                                                value={editForm.serviceType}
                                                onChange={e => setEditForm({...editForm, serviceType: e.target.value as ServiceType})}
                                            >
                                                <option value="hospital">🏥 동물병원</option>
                                                <option value="grooming">✂️ 미용</option>
                                                <option value="hotel">🏨 호텔</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500">품종</label>
                                                <input className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all" value={editForm.breed || ''} onChange={e => setEditForm({...editForm, breed: e.target.value})} placeholder="예: 말티즈" />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold text-slate-500">나이</label>
                                                <input className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all" value={editForm.age || ''} onChange={e => setEditForm({...editForm, age: e.target.value})} placeholder="예: 3살" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500">생년월일</label>
                                            <input type="date" className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 text-sm text-slate-700 focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all" value={editForm.birthDate || ''} onChange={e => setEditForm({...editForm, birthDate: e.target.value})} />
                                        </div>
                                    </div>

                                    {/* Section: 보호자 정보 */}
                                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">보호자 정보</p>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500">보호자명</label>
                                            <input className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all" value={editForm.ownerName || ''} onChange={e => setEditForm({...editForm, ownerName: e.target.value})} placeholder="보호자 성함" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500">연락처</label>
                                            <input className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all" value={editForm.phoneNumber || ''} onChange={e => setEditForm({...editForm, phoneNumber: e.target.value})} placeholder="010-0000-0000" />
                                        </div>
                                    </div>

                                    {/* Section: 메모 */}
                                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 space-y-3">
                                        <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">메모</p>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-slate-500">특이사항</label>
                                            <textarea className="w-full px-3 py-2 bg-white rounded-lg border border-slate-200 text-sm h-20 resize-none focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 transition-all" value={editForm.memo || ''} onChange={e => setEditForm({...editForm, memo: e.target.value})} placeholder="진료 기록, 알러지, 주의사항 등" />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-bold text-rose-400 flex items-center gap-1"><AlertTriangle size={11}/> 관리자 메모 (Staff Only)</label>
                                            <textarea className="w-full px-3 py-2 bg-rose-50 rounded-lg border border-rose-200 text-sm h-14 resize-none focus:outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-100 transition-all" value={editForm.adminMemo || ''} onChange={e => setEditForm({...editForm, adminMemo: e.target.value})} placeholder="내부 공유용 메모" />
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                // READ ONLY VIEW
                                <>
                                    <div className="flex gap-2">
                                        <button onClick={startEdit} className="flex-1 py-2 bg-white text-slate-600 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 flex items-center justify-center gap-2">
                                            <Edit2 size={14} /> 정보 수정
                                        </button>
                                        <button onClick={handleDelete} className="p-2 bg-white text-slate-400 rounded-xl border border-slate-200 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    {/* Admin Memo Display */}
                                    <div className={`p-4 rounded-2xl border ${selectedPatient!.adminMemo ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-100'}`}>
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-1">
                                            <Info size={12} className={selectedPatient!.adminMemo ? 'text-amber-500' : 'text-slate-400'} /> 관리자 메모 (Staff Only)
                                        </div>
                                        <div className={`text-sm font-medium ${selectedPatient!.adminMemo ? 'text-amber-900' : 'text-slate-400 italic'}`}>
                                            {selectedPatient!.adminMemo || '등록된 관리자 메모가 없습니다.'}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                        <div>
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-1"><User size={12}/> 보호자</div>
                                            <div className="text-sm font-bold text-slate-800">{selectedPatient!.ownerName || '미등록'}</div>
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 mb-1"><Phone size={12}/> 연락처</div>
                                            <div className="text-sm font-bold text-slate-800">{selectedPatient!.phoneNumber || '미등록'}</div>
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                                            <Activity size={14} /> 최근 방문 내역
                                        </h3>
                                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                                            <div className="flex justify-between items-center mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                                    <span className="text-sm font-bold text-slate-800">
                                                        {selectedPatient?.lastService || (selectedPatient?.serviceType === 'hospital' ? '정기 검진' : selectedPatient?.serviceType === 'grooming' ? '미용 관리' : '호텔링')}
                                                    </span>
                                                </div>
                                                <span className="text-xs text-slate-500 font-medium bg-white px-2 py-1 rounded border border-slate-100">{selectedPatient!.lastVisit}</span>
                                            </div>
                                            <p className="text-xs text-slate-600 leading-relaxed mt-2 pl-3.5 border-l-2 border-slate-200">
                                                {selectedPatient!.memo || '특이사항 없음.'}
                                            </p>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between items-center mb-3">
                                            <h3 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2">
                                                <Receipt size={14} /> 결제 및 영수증 (Receipts)
                                            </h3>
                                            {!isAddingReceipt && (
                                                <button 
                                                    onClick={() => setIsAddingReceipt(true)}
                                                    className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-1 rounded hover:bg-slate-200 flex items-center gap-1 transition-colors"
                                                >
                                                    <Plus size={10} /> 추가
                                                </button>
                                            )}
                                        </div>

                                        {isAddingReceipt && (
                                            <div className="bg-slate-50 p-3 rounded-xl border border-indigo-100 mb-3 animate-in fade-in slide-in-from-top-2">
                                                <div className="space-y-2">
                                                    <input 
                                                        type="text" 
                                                        placeholder="내역 (예: 진료비)" 
                                                        className="w-full p-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-300"
                                                        value={receiptForm.description}
                                                        onChange={e => setReceiptForm({...receiptForm, description: e.target.value})}
                                                    />
                                                    <div className="flex gap-2">
                                                        <input 
                                                            type="number" 
                                                            placeholder="금액" 
                                                            className="flex-1 p-2 text-xs border border-slate-200 rounded-lg outline-none focus:border-indigo-300"
                                                            value={receiptForm.amount || ''}
                                                            onChange={e => setReceiptForm({...receiptForm, amount: parseInt(e.target.value) || 0})}
                                                        />
                                                        <input 
                                                            type="date" 
                                                            className="flex-1 p-2 text-xs border border-slate-200 rounded-lg text-slate-500 outline-none focus:border-indigo-300"
                                                            value={receiptForm.date}
                                                            onChange={e => setReceiptForm({...receiptForm, date: e.target.value})}
                                                        />
                                                    </div>
                                                    <div className="flex gap-2 mt-2">
                                                        <button onClick={() => setIsAddingReceipt(false)} className="flex-1 py-1.5 bg-white border border-slate-200 text-xs font-bold text-slate-500 rounded-lg hover:bg-slate-50">취소</button>
                                                        <button onClick={handleAddReceipt} className="flex-1 py-1.5 bg-indigo-500 text-white text-xs font-bold rounded-lg hover:bg-indigo-600">저장</button>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        
                                        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
                                            {selectedPatient?.receipts && selectedPatient.receipts.length > 0 ? (
                                                selectedPatient.receipts.map((receipt) => (
                                                    <div key={receipt.id} className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 hover:border-indigo-300 transition-colors cursor-pointer group">
                                                        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center">
                                                            <CreditCard size={18} />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex justify-between items-center mb-0.5">
                                                                <span className="text-xs font-bold text-slate-800 truncate">{receipt.description}</span>
                                                                <span className="text-xs font-extrabold text-slate-900">₩{receipt.amount.toLocaleString()}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                                                <Calendar size={10} /> {receipt.date}
                                                            </div>
                                                        </div>
                                                        {receipt.imageUrl && (
                                                            <button className="text-slate-300 hover:text-indigo-600 transition-colors" title="영수증 이미지 보기">
                                                                <ImageIcon size={16} />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="text-center py-6 border-2 border-dashed border-slate-100 rounded-xl text-slate-400 text-xs">
                                                    결제 내역이 없습니다.
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h3 className="text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                                            <File size={14} /> 기타 첨부 파일
                                        </h3>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="bg-white border border-slate-200 rounded-xl p-3 flex items-center gap-3 hover:border-indigo-300 transition-colors cursor-pointer">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-500 flex items-center justify-center font-bold text-[10px]">JPG</div>
                                                <div className="overflow-hidden">
                                                    <div className="text-xs font-bold text-slate-700 truncate">Chart_Scan_01</div>
                                                    <div className="text-[10px] text-slate-400">2.4 MB</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Footer Actions (Edit/Add Mode) */}
                        {(isEditing || isAdding) && (
                            <div className="flex gap-2 pt-4 mt-2 border-t border-slate-100">
                                 <button onClick={cancelAction} className="flex-1 py-3 bg-slate-100 text-slate-500 rounded-xl text-sm font-bold hover:bg-slate-200">
                                    취소
                                 </button>
                                 <button onClick={handleSave} className="flex-[2] py-3 bg-indigo-500 text-white rounded-xl text-sm font-bold hover:bg-indigo-600 flex items-center justify-center gap-2">
                                    <Save size={16} /> {isAdding ? '등록 완료' : '변경사항 저장'}
                                 </button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientRecords;
