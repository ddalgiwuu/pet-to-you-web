import React, { useState, useEffect } from 'react';
import { CalendarCheck, UserCheck, UserPlus, ChevronLeft, Search, CheckCircle2, PawPrint, Smartphone, X, Lock, ArrowLeft, User } from 'lucide-react';
import { Reservation, Patient, PatientCase, ServiceType } from '../types';

interface KioskProps {
    onExit: () => void;
    reservations: Reservation[];
    patients: Patient[];
    onAddReservation: (res: Reservation) => void;
    onAddPatient: (patient: Patient) => void;
    onAddCase: (patientCase: PatientCase) => void;
}

type KioskView = 'home' | 'checkin-reserved' | 'checkin-walkin' | 'register' | 'success' | 'admin-auth';
type SearchMethod = 'phone' | 'info';

const Kiosk: React.FC<KioskProps> = ({ onExit, reservations, patients, onAddReservation, onAddPatient, onAddCase }) => {
    const [view, setView] = useState<KioskView>('home');
    const [searchMethod, setSearchMethod] = useState<SearchMethod>('phone');
    
    // Search Inputs
    const [phoneNumber, setPhoneNumber] = useState('');
    const [searchName, setSearchName] = useState('');
    const [searchBirthdate, setSearchBirthdate] = useState('');

    const [searchResult, setSearchResult] = useState<any[]>([]);
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const [successMessage, setSuccessMessage] = useState('');
    const [adminTapCount, setAdminTapCount] = useState(0);

    // Admin Auth State
    const [adminPassword, setAdminPassword] = useState('1234');
    const [passwordInput, setPasswordInput] = useState('');
    const [authMode, setAuthMode] = useState<'unlock' | 'change-verify' | 'change-new'>('unlock');
    const [authError, setAuthError] = useState(false);

    // Registration Form State
    const [regForm, setRegForm] = useState({
        ownerName: '',
        phone: '',
        petName: '',
        breed: '',
        gender: 'male',
        birthYear: '',
        serviceType: 'hospital' as ServiceType
    });

    // Reset admin tap count after delay
    useEffect(() => {
        if (adminTapCount > 0) {
            const timer = setTimeout(() => setAdminTapCount(0), 1000);
            return () => clearTimeout(timer);
        }
    }, [adminTapCount]);

    const handleAdminTap = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (adminTapCount + 1 >= 5) {
            setView('admin-auth');
            setAdminTapCount(0);
            setPasswordInput('');
            setAuthMode('unlock');
            setAuthError(false);
        } else {
            setAdminTapCount(prev => prev + 1);
        }
    };

    const handleNumberClick = (num: string) => {
        if (view === 'admin-auth') {
            if (passwordInput.length < 4) {
                setPasswordInput(prev => prev + num);
                setAuthError(false);
            }
        } else {
            if (searchMethod === 'phone') {
                if (phoneNumber.length < 11) setPhoneNumber(prev => prev + num);
            } else {
                if (searchBirthdate.length < 6) setSearchBirthdate(prev => prev + num);
            }
        }
    };

    const handleBackspace = () => {
        if (view === 'admin-auth') {
            setPasswordInput(prev => prev.slice(0, -1));
        } else {
            if (searchMethod === 'phone') {
                setPhoneNumber(prev => prev.slice(0, -1));
            } else {
                setSearchBirthdate(prev => prev.slice(0, -1));
            }
        }
    };

    const handleAuthSubmit = () => {
        if (authMode === 'unlock') {
            if (passwordInput === adminPassword) {
                onExit();
            } else {
                setAuthError(true);
                setPasswordInput('');
            }
        } else if (authMode === 'change-verify') {
            if (passwordInput === adminPassword) {
                setAuthMode('change-new');
                setPasswordInput('');
                setAuthError(false);
            } else {
                setAuthError(true);
                setPasswordInput('');
            }
        } else if (authMode === 'change-new') {
            setAdminPassword(passwordInput);
            setAuthMode('unlock');
            setPasswordInput('');
            setSuccessMessage('비밀번호가 변경되었습니다');
            setView('success');
        }
    };

    const handleSearch = () => {
        let results: any[] = [];
        
        if (view === 'checkin-reserved') {
            results = reservations.filter(r => {
                if (searchMethod === 'phone') {
                    return (r.phoneNumber?.includes(phoneNumber) || r.phoneNumber?.endsWith(phoneNumber));
                } else {
                    return r.patientName === searchName || r.ownerName === searchName;
                }
            }).filter(r => r.status !== 'cancelled');
        } else {
            results = patients.filter(p => {
                if (searchMethod === 'phone') {
                    return (p.phoneNumber && (p.phoneNumber.includes(phoneNumber) || p.phoneNumber.endsWith(phoneNumber)));
                } else {
                    return p.name === searchName || p.ownerName === searchName;
                }
            });
        }
        setSearchResult(results);
    };

    const handleConfirmCheckin = (item: any) => {
        if (view === 'checkin-reserved') {
            setSuccessMessage(`${item.patientName} 보호자님,\n예약 확인되었습니다.`);
            setView('success');
        } else if (view === 'checkin-walkin') {
            const newRes: Reservation = {
                id: `res-${Date.now()}`,
                patientName: item.name,
                ownerName: item.ownerName,
                phoneNumber: item.phoneNumber,
                serviceType: 'hospital',
                requestType: '현장 접수',
                date: new Date().toLocaleDateString(),
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: 'pending',
                source: 'walk-in',
                breed: item.breed,
                age: item.age,
                gender: item.gender,
                isNewPatient: false,
                visitCount: (item.visitCount || 0) + 1,
                avatarUrl: item.image
            };
            onAddReservation(newRes);
            setSuccessMessage(`${item.name} 접수 완료!\n진료실 앞에서 대기해주세요.`);
            setView('success');
        }
    };

    const handleRegisterSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const newPatient: Patient = {
            id: `p-${Date.now()}`,
            name: regForm.petName,
            breed: regForm.breed,
            age: `${new Date().getFullYear() - parseInt(regForm.birthYear || '2020')}살`,
            gender: regForm.gender as 'male' | 'female',
            image: `https://picsum.photos/seed/${regForm.petName}/100/100`,
            ownerName: regForm.ownerName,
            phoneNumber: regForm.phone,
            lastVisit: new Date().toLocaleDateString(),
            status: 'active',
            chartNumber: `P-${Math.floor(1000 + Math.random() * 9000)}`,
            serviceType: 'hospital',
            memo: '키오스크 신규 등록'
        };
        onAddPatient(newPatient);

        const newRes: Reservation = {
            id: `res-${Date.now()}`,
            patientName: regForm.petName,
            ownerName: regForm.ownerName,
            phoneNumber: regForm.phone,
            serviceType: regForm.serviceType,
            requestType: '신규 접수',
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'pending',
            source: 'walk-in',
            breed: regForm.breed,
            age: newPatient.age,
            gender: newPatient.gender,
            isNewPatient: true,
            visitCount: 1,
            avatarUrl: newPatient.image
        };
        onAddReservation(newRes);

        setSuccessMessage(`${regForm.petName} 등록 완료!\n환영합니다.`);
        setView('success');
    };

    const reset = () => {
        setPhoneNumber('');
        setSearchName('');
        setSearchBirthdate('');
        setSearchResult([]);
        setSelectedItem(null);
        setSearchMethod('phone');
        setRegForm({
            ownerName: '',
            phone: '',
            petName: '',
            breed: '',
            gender: 'male',
            birthYear: '',
            serviceType: 'hospital'
        });
    };

    // --- RENDER HELPERS ---

    const renderAdminAuth = () => (
        <div className="w-full max-w-md mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-slate-200">
                    <Lock size={32} strokeWidth={2} />
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-1">
                    {authMode === 'unlock' ? '관리자 모드' : 
                     authMode === 'change-verify' ? '현재 비밀번호 확인' : '새 비밀번호 입력'}
                </h2>
                <p className={`font-medium text-sm transition-colors ${authError ? 'text-rose-500 animate-pulse' : 'text-slate-500'}`}>
                    {authError ? '비밀번호가 일치하지 않습니다' : 
                     authMode === 'change-new' ? '새로운 비밀번호 4자리를 입력하세요' : '비밀번호 4자리를 입력해주세요'}
                </p>
            </div>

            <div className="bg-white rounded-[2rem] shadow-xl shadow-indigo-50 p-6 border border-slate-100">
                <div className="mb-6 h-16 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100 gap-3">
                    {[1, 2, 3, 4].map((_, i) => (
                        <div 
                            key={i} 
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${
                                i < passwordInput.length 
                                    ? 'bg-slate-800 scale-125' 
                                    : 'bg-slate-200'
                            }`}
                        />
                    ))}
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                        <button 
                            key={num}
                            onClick={() => handleNumberClick(num.toString())}
                            className="h-16 rounded-xl bg-white border border-slate-100 shadow-sm text-2xl font-black text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
                        >
                            {num}
                        </button>
                    ))}
                    <button 
                        onClick={() => setPasswordInput('')}
                        className="h-16 rounded-xl bg-rose-50 border border-rose-100 shadow-sm text-rose-500 font-bold hover:bg-rose-100 active:scale-95 transition-all"
                    >
                        C
                    </button>
                    <button 
                        onClick={() => handleNumberClick('0')}
                        className="h-16 rounded-xl bg-white border border-slate-100 shadow-sm text-2xl font-black text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
                    >
                        0
                    </button>
                    <button 
                        onClick={handleBackspace}
                        className="h-16 rounded-xl bg-slate-100 border border-slate-200 shadow-sm text-slate-500 font-bold hover:bg-slate-200 active:scale-95 transition-all flex items-center justify-center"
                    >
                        <ChevronLeft size={24} strokeWidth={3} />
                    </button>
                </div>

                <button 
                    onClick={handleAuthSubmit}
                    disabled={passwordInput.length < 4}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl text-lg font-bold shadow-lg shadow-slate-200 disabled:opacity-50 disabled:shadow-none hover:bg-slate-800 hover:scale-[1.01] active:scale-[0.99] transition-all mb-3"
                >
                    {authMode === 'unlock' ? '잠금 해제' : 
                     authMode === 'change-verify' ? '확인' : '변경하기'}
                </button>

                {authMode === 'unlock' && (
                    <button 
                        onClick={() => {
                            setAuthMode('change-verify');
                            setPasswordInput('');
                            setAuthError(false);
                        }}
                        className="w-full py-2 text-slate-400 font-bold text-xs hover:text-slate-600 transition-colors"
                    >
                        비밀번호 변경
                    </button>
                )}
                
                {authMode !== 'unlock' && (
                    <button 
                        onClick={() => {
                            setAuthMode('unlock');
                            setPasswordInput('');
                            setAuthError(false);
                        }}
                        className="w-full py-2 text-slate-400 font-bold text-xs hover:text-slate-600 transition-colors"
                    >
                        취소
                    </button>
                )}
            </div>
        </div>
    );

    const renderCheckInSearch = () => (
        <div className="w-full max-w-lg mx-auto animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="bg-white rounded-[2rem] shadow-xl shadow-indigo-50 p-6 border border-slate-100">
                {/* Tabs */}
                <div className="flex p-1.5 bg-slate-100 rounded-xl mb-6">
                    <button 
                        onClick={() => { setSearchMethod('phone'); setSearchResult([]); }}
                        className={`flex-1 py-3 rounded-lg font-bold text-base transition-all flex items-center justify-center gap-2 ${searchMethod === 'phone' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <Smartphone size={18} /> 휴대폰 번호
                    </button>
                    <button 
                        onClick={() => { setSearchMethod('info'); setSearchResult([]); }}
                        className={`flex-1 py-3 rounded-lg font-bold text-base transition-all flex items-center justify-center gap-2 ${searchMethod === 'info' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                        <User size={18} /> 이름 / 생년월일
                    </button>
                </div>

                {searchMethod === 'phone' ? (
                    <>
                        <div className="mb-6 h-16 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-100">
                            <span className={`text-3xl font-black tracking-[0.2em] ${phoneNumber ? 'text-slate-800' : 'text-slate-300'}`}>
                                {phoneNumber || '0000'}
                            </span>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                                <button 
                                    key={num}
                                    onClick={() => handleNumberClick(num.toString())}
                                    className="h-14 rounded-xl bg-white border border-slate-100 shadow-sm text-2xl font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
                                >
                                    {num}
                                </button>
                            ))}
                            <button 
                                onClick={() => setPhoneNumber('')}
                                className="h-14 rounded-xl bg-rose-50 border border-rose-100 shadow-sm text-rose-500 font-bold hover:bg-rose-100 active:scale-95 transition-all"
                            >
                                C
                            </button>
                            <button 
                                onClick={() => handleNumberClick('0')}
                                className="h-14 rounded-xl bg-white border border-slate-100 shadow-sm text-2xl font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
                            >
                                0
                            </button>
                            <button 
                                onClick={handleBackspace}
                                className="h-14 rounded-xl bg-slate-100 border border-slate-200 shadow-sm text-slate-500 font-bold hover:bg-slate-200 active:scale-95 transition-all flex items-center justify-center"
                            >
                                <ChevronLeft size={24} strokeWidth={3} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="space-y-5 mb-6">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 ml-1">이름</label>
                            <input 
                                type="text" 
                                className="w-full h-14 px-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none font-bold text-xl text-center transition-all placeholder:text-slate-300"
                                placeholder="홍길동"
                                value={searchName}
                                onChange={e => setSearchName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-400 ml-1">생년월일 (6자리)</label>
                            <input 
                                type="text" 
                                readOnly
                                className="w-full h-14 px-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none font-bold text-xl text-center transition-all tracking-[0.2em] placeholder:tracking-normal placeholder:text-slate-300"
                                placeholder="YYMMDD"
                                value={searchBirthdate}
                            />
                            
                            {/* 5x2 Keypad for Birthdate */}
                            <div className="grid grid-cols-5 gap-2 mt-3">
                                {[1, 2, 3, 4, 5].map(num => (
                                    <button 
                                        key={num}
                                        onClick={() => { if(searchBirthdate.length < 6) setSearchBirthdate(prev => prev + num) }}
                                        className="h-12 rounded-lg bg-white border border-slate-100 shadow-sm text-lg font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
                                    >
                                        {num}
                                    </button>
                                ))}
                                {[6, 7, 8, 9, 0].map(num => (
                                    <button 
                                        key={num}
                                        onClick={() => { if(searchBirthdate.length < 6) setSearchBirthdate(prev => prev + num) }}
                                        className="h-12 rounded-lg bg-white border border-slate-100 shadow-sm text-lg font-bold text-slate-700 hover:bg-slate-50 active:scale-95 transition-all"
                                    >
                                        {num}
                                    </button>
                                ))}
                            </div>
                            <div className="mt-2">
                                <button 
                                    onClick={() => setSearchBirthdate(prev => prev.slice(0, -1))}
                                    className="w-full h-12 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 font-bold hover:bg-slate-200 active:scale-95 transition-all flex items-center justify-center"
                                >
                                    <ChevronLeft size={20} strokeWidth={2.5} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <button 
                    onClick={handleSearch}
                    disabled={searchMethod === 'phone' ? phoneNumber.length < 4 : (searchName.length < 2)}
                    className="w-full h-14 bg-indigo-600 text-white rounded-xl text-lg font-bold shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none hover:bg-indigo-700 hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                    조회하기
                </button>
            </div>
        </div>
    );

    const renderSearchResults = () => (
        <div className="max-w-2xl mx-auto w-full animate-in fade-in slide-in-from-bottom-8 duration-500 flex flex-col h-full max-h-[80vh]">
            <h2 className="text-2xl font-black text-center text-slate-800 mb-6">
                {searchResult.length > 0 ? '고객님을 찾았습니다' : '검색 결과가 없습니다'}
            </h2>
            
            <div className="grid gap-3 overflow-y-auto p-2 custom-scrollbar">
                {searchResult.map((item: any) => (
                    <button
                        key={item.id}
                        onClick={() => handleConfirmCheckin(item)}
                        className="bg-white p-4 rounded-2xl shadow-md border border-slate-100 flex items-center gap-4 hover:scale-[1.01] hover:border-indigo-500 hover:shadow-indigo-100 transition-all text-left group"
                    >
                        <img 
                            src={item.avatarUrl || item.image || 'https://picsum.photos/100/100'} 
                            alt={item.patientName || item.name} 
                            className="w-16 h-16 rounded-xl object-cover bg-slate-100 shadow-sm"
                        />
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xl font-black text-slate-900">{item.patientName || item.name}</span>
                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded-lg font-bold">{item.breed}</span>
                            </div>
                            <p className="text-sm text-slate-500 font-medium">{item.ownerName || item.owner} 보호자님 ({item.phoneNumber || item.ownerPhone})</p>
                            {view === 'checkin-reserved' && (
                                <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold">
                                    <CalendarCheck size={14} />
                                    {item.time} {item.requestType}
                                </div>
                            )}
                        </div>
                        <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                            <CheckCircle2 size={24} strokeWidth={3} />
                        </div>
                    </button>
                ))}
            </div>

            {searchResult.length === 0 && (
                <div className="text-center mt-6">
                    <button 
                        onClick={() => {
                            setSearchResult([]);
                            setPhoneNumber('');
                        }}
                        className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-md text-sm"
                    >
                        다시 검색하기
                    </button>
                </div>
            )}
        </div>
    );

    const renderRegisterForm = () => (
        <div className="max-w-3xl mx-auto w-full bg-white rounded-[2.5rem] shadow-xl shadow-indigo-50 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-500 border border-slate-100">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-2xl font-black text-slate-900 text-center">신규 고객 등록</h2>
                <p className="text-slate-500 text-center mt-1 font-medium text-sm">간편하게 등록하고 바로 접수하세요</p>
            </div>
            <form onSubmit={handleRegisterSubmit} className="p-8 space-y-5">
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider ml-1">보호자 성함</label>
                        <input 
                            required
                            type="text" 
                            className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-lg transition-all"
                            placeholder="홍길동"
                            value={regForm.ownerName}
                            onChange={e => setRegForm({...regForm, ownerName: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider ml-1">연락처</label>
                        <input 
                            required
                            type="tel" 
                            className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-lg transition-all"
                            placeholder="010-0000-0000"
                            value={regForm.phone}
                            onChange={e => setRegForm({...regForm, phone: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider ml-1">반려동물 이름</label>
                        <input 
                            required
                            type="text" 
                            className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-lg transition-all"
                            placeholder="멍멍이"
                            value={regForm.petName}
                            onChange={e => setRegForm({...regForm, petName: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider ml-1">품종</label>
                        <input 
                            type="text" 
                            className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-lg transition-all"
                            placeholder="말티즈, 푸들 등"
                            value={regForm.breed}
                            onChange={e => setRegForm({...regForm, breed: e.target.value})}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                     <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider ml-1">성별</label>
                        <div className="flex gap-3">
                            <button 
                                type="button"
                                onClick={() => setRegForm({...regForm, gender: 'male'})}
                                className={`flex-1 py-4 rounded-xl font-bold border-2 transition-all ${regForm.gender === 'male' ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'}`}
                            >
                                남아
                            </button>
                            <button 
                                type="button"
                                onClick={() => setRegForm({...regForm, gender: 'female'})}
                                className={`flex-1 py-4 rounded-xl font-bold border-2 transition-all ${regForm.gender === 'female' ? 'bg-pink-500 text-white border-pink-500 shadow-lg shadow-pink-200' : 'bg-white text-slate-400 border-slate-200 hover:bg-slate-50'}`}
                            >
                                여아
                            </button>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-extrabold text-slate-400 uppercase tracking-wider ml-1">방문 목적</label>
                        <div className="relative">
                            <select 
                                className="w-full p-4 bg-slate-50 rounded-xl border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 outline-none font-bold text-lg appearance-none transition-all"
                                value={regForm.serviceType}
                                onChange={e => setRegForm({...regForm, serviceType: e.target.value as ServiceType})}
                            >
                                <option value="hospital">진료/상담</option>
                                <option value="grooming">미용/스파</option>
                                <option value="hotel">호텔/유치원</option>
                            </select>
                            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <ChevronLeft size={20} className="-rotate-90" />
                            </div>
                        </div>
                    </div>
                </div>

                <button 
                    type="submit"
                    className="w-full py-5 bg-slate-900 text-white rounded-xl text-xl font-bold shadow-xl hover:bg-slate-800 hover:scale-[1.01] active:scale-[0.99] transition-all mt-2"
                >
                    등록 및 접수하기
                </button>
            </form>
        </div>
    );

    const renderSuccess = () => (
        <div className="text-center animate-in zoom-in duration-500 flex flex-col items-center justify-center h-full">
            <div className="w-40 h-40 bg-emerald-500 rounded-full flex items-center justify-center text-white mb-10 shadow-2xl shadow-emerald-200 animate-bounce">
                <CheckCircle2 size={80} strokeWidth={3} />
            </div>
            <h2 className="text-5xl font-black text-slate-900 mb-6 leading-tight whitespace-pre-line">
                {successMessage}
            </h2>
            <p className="text-slate-400 text-xl font-bold mb-12 bg-slate-100 px-6 py-2 rounded-full">
                3초 후 홈으로 돌아갑니다...
            </p>
        </div>
    );

    // Auto-redirect from success
    useEffect(() => {
        if (view === 'success') {
            const timer = setTimeout(() => {
                setView('home');
                reset();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [view]);

    return (
        <div className="fixed inset-0 bg-[#F8FAFC] z-50 flex flex-col font-sans select-none">
            {/* Floating Back Button (Only visible when not home) */}
            {view !== 'home' && view !== 'success' && view !== 'admin-auth' && (
                <div className="absolute top-8 left-8 z-50">
                    <button 
                        onClick={() => { setView('home'); reset(); }}
                        className="w-16 h-16 bg-white rounded-full shadow-xl flex items-center justify-center text-slate-600 hover:bg-slate-50 hover:scale-105 transition-all border border-slate-100"
                    >
                        <ArrowLeft size={32} strokeWidth={3} />
                    </button>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-200/30 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-purple-200/30 rounded-full blur-[120px]"></div>
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto h-full flex flex-col justify-center">
                    {view === 'home' && (
                        <div className="flex flex-col items-center justify-center h-full animate-in fade-in zoom-in duration-700">
                            {/* Logo / Admin Trigger */}
                            <button 
                                onClick={handleAdminTap}
                                className="mb-8 flex flex-col items-center gap-3 group"
                            >
                                <div className="w-20 h-20 bg-indigo-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-indigo-300 group-active:scale-95 transition-all">
                                    <span className="font-black text-4xl">P</span>
                                </div>
                                <h1 className="text-3xl font-black text-slate-900 tracking-tight">Pet to You</h1>
                                <p className="text-lg text-slate-500 font-medium">반려동물과 함께하는 행복한 시간</p>
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                                <button 
                                    onClick={() => { setView('checkin-reserved'); reset(); }}
                                    className="group relative bg-white rounded-[2.5rem] p-8 h-[320px] shadow-xl hover:shadow-indigo-200/50 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center gap-6 text-center border border-slate-100 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="w-32 h-32 bg-indigo-50 rounded-[2rem] flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform duration-500 shadow-inner relative z-10">
                                        <CalendarCheck size={60} strokeWidth={1.5} />
                                    </div>
                                    <div className="relative z-10">
                                        <h2 className="text-2xl font-black text-slate-900 mb-2">예약 고객</h2>
                                        <p className="text-slate-500 text-base font-medium">예약 확인 및 접수</p>
                                    </div>
                                </button>

                                <button 
                                    onClick={() => { setView('checkin-walkin'); reset(); }}
                                    className="group relative bg-white rounded-[2.5rem] p-8 h-[320px] shadow-xl hover:shadow-emerald-200/50 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center gap-6 text-center border border-slate-100 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="w-32 h-32 bg-emerald-50 rounded-[2rem] flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform duration-500 shadow-inner relative z-10">
                                        <UserCheck size={60} strokeWidth={1.5} />
                                    </div>
                                    <div className="relative z-10">
                                        <h2 className="text-2xl font-black text-slate-900 mb-2">방문 접수</h2>
                                        <p className="text-slate-500 text-base font-medium">현장 대기 접수</p>
                                    </div>
                                </button>

                                <button 
                                    onClick={() => { setView('register'); reset(); }}
                                    className="group relative bg-white rounded-[2.5rem] p-8 h-[320px] shadow-xl hover:shadow-rose-200/50 hover:-translate-y-2 transition-all duration-300 flex flex-col items-center justify-center gap-6 text-center border border-slate-100 overflow-hidden"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-b from-rose-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    <div className="w-32 h-32 bg-rose-50 rounded-[2rem] flex items-center justify-center text-rose-600 group-hover:scale-110 transition-transform duration-500 shadow-inner relative z-10">
                                        <UserPlus size={60} strokeWidth={1.5} />
                                    </div>
                                    <div className="relative z-10">
                                        <h2 className="text-2xl font-black text-slate-900 mb-2">신규 등록</h2>
                                        <p className="text-slate-500 text-base font-medium">첫 방문 고객 등록</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}

                    {(view === 'checkin-reserved' || view === 'checkin-walkin') && (
                        <div className="flex flex-col items-center justify-center h-full">
                            {searchResult.length === 0 ? renderCheckInSearch() : renderSearchResults()}
                        </div>
                    )}

                    {view === 'register' && (
                        <div className="flex flex-col items-center justify-center h-full">
                            {renderRegisterForm()}
                        </div>
                    )}

                    {view === 'admin-auth' && (
                        <div className="flex flex-col items-center justify-center h-full">
                            {renderAdminAuth()}
                        </div>
                    )}

                    {view === 'success' && renderSuccess()}
                </div>
            </div>
        </div>
    );
};

export default Kiosk;
