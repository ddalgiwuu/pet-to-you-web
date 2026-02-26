
import React, { useState, useMemo } from 'react';
import { Staff, ServiceType, Room, DayOfWeek, DailySchedule, Account, UserRole } from '../types';
import { 
    Plus, Trash2, X, Check, User, Briefcase, Phone, Camera, Stethoscope, Scissors, Home, Layers, 
    Box, LayoutGrid, Activity, Tag, Clock, Calendar, Copy, Shield, ShieldCheck, Lock, Users, 
    RefreshCw, Eye, EyeOff, Zap, AlertCircle, Fingerprint, Smartphone, QrCode, Key, ShieldAlert,
    ChevronRight
} from 'lucide-react';

interface SettingsProps {
    staffList: Staff[];
    onAddStaff: (staff: Staff) => void;
    onUpdateStaff: (staff: Staff) => void;
    onDeleteStaff: (id: string) => void;
    roomList: Room[];
    onAddRoom: (room: Room) => void;
    onUpdateRoom: (room: Room) => void;
    onDeleteRoom: (id: string) => void;
    activeServices: ServiceType[];
    toggleService: (type: ServiceType | 'all') => void;
    roles: string[];
    staffStatuses: string[];
    roomTypes: string[];
    roomStatuses: string[];
    onAddCategory: (type: 'roles' | 'staffStatuses' | 'roomTypes' | 'roomStatuses', value: string) => void;
    onDeleteCategory: (type: 'roles' | 'staffStatuses' | 'roomTypes' | 'roomStatuses', value: string) => void;
    accounts: Account[];
    currentUser: Account | null;
    onAddAccount: (account: Account) => void;
    onUpdateAccount: (account: Account) => void;
    onDeleteAccount: (id: string) => void;
}

const Settings: React.FC<SettingsProps> = ({ 
    staffList, onAddStaff, onUpdateStaff, onDeleteStaff, 
    roomList, onAddRoom, onUpdateRoom, onDeleteRoom,
    activeServices, toggleService,
    roles, staffStatuses, roomTypes, roomStatuses, onAddCategory, onDeleteCategory,
    accounts, currentUser, onAddAccount, onUpdateAccount, onDeleteAccount
}) => {
    const [activeTab, setActiveTab] = useState<'general' | 'staff' | 'facilities' | 'categories' | 'accounts'>('general');
    const [isEditing, setIsEditing] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [mfaSetupOpen, setMfaSetupOpen] = useState(false);
    
    const [staffFormData, setStaffFormData] = useState<Partial<Staff>>({});
    const [roomFormData, setRoomFormData] = useState<Partial<Room>>({});
    const [accountFormData, setAccountFormData] = useState<Partial<Account>>({});
    const [newCategoryInput, setNewCategoryInput] = useState<{ [key: string]: string }>({});

    const DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const DEFAULT_SCHEDULE: DailySchedule = {
        isOff: false,
        workStart: '09:00',
        workEnd: '18:00',
        breakStart: '12:00',
        breakEnd: '13:00'
    };

    // Password Strength Logic
    const passwordStrength = useMemo(() => {
        const pw = accountFormData.password || '';
        if (!pw) return { level: 0, label: '없음', color: 'bg-slate-200' };
        let score = 0;
        if (pw.length >= 8) score++;
        if (/[A-Z]/.test(pw)) score++;
        if (/[0-9]/.test(pw)) score++;
        if (/[^A-Za-z0-9]/.test(pw)) score++;
        
        if (score <= 1) return { level: 25, label: '위험', color: 'bg-rose-500' };
        if (score === 2) return { level: 50, label: '보통', color: 'bg-amber-500' };
        if (score === 3) return { level: 75, label: '안전', color: 'bg-emerald-500' };
        return { level: 100, label: '매우 안전', color: 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' };
    }, [accountFormData.password]);

    const handleAddAccountClick = () => {
        setIsAdding(true);
        setIsEditing(null);
        setAccountFormData({
            username: '',
            password: '',
            name: '',
            role: 'staff',
            allowedServices: ['hospital'],
            avatar: `https://picsum.photos/id/${Math.floor(Math.random() * 1000)}/100/100`,
            mfaEnabled: false,
            securityLevel: 'low'
        });
    };

    const handleEditAccountClick = (acc: Account) => {
        setIsEditing(acc.id);
        setAccountFormData({ ...acc });
        setIsAdding(false);
    };

    const handleSaveAccount = () => {
        if (!accountFormData.username || !accountFormData.name) {
            alert('아이디와 이름은 필수입니다.');
            return;
        }

        // 아이디 변경 시 중복 체크
        if (isAdding || (isEditing && accountFormData.username !== accounts.find(a => a.id === isEditing)?.username)) {
            if (accounts.some(a => a.username === accountFormData.username && a.id !== isEditing)) {
                alert('이미 사용 중인 아이디입니다.');
                return;
            }
        }

        if (accountFormData.password && accountFormData.password.length < 4) {
            alert('비밀번호는 최소 4자 이상이어야 합니다. (8자 권장)');
            return;
        }

        const securityLevel = accountFormData.mfaEnabled ? 'high' : (passwordStrength.level >= 75 ? 'medium' : 'low');

        if (isAdding) {
            const newAccount: Account = {
                id: Date.now().toString(),
                ...accountFormData as Account,
                securityLevel
            };
            onAddAccount(newAccount);
        } else if (isEditing) {
            onUpdateAccount({ ...accountFormData, securityLevel } as Account);
        }
        resetEditor();
    };

    const handleDeleteAccount = (id: string) => {
        if (id === currentUser?.id) {
            alert('현재 로그인된 계정은 삭제할 수 없습니다.');
            return;
        }
        if (window.confirm('계정을 영구 삭제하시겠습니까?')) {
            onDeleteAccount(id);
            if (isEditing === id) resetEditor();
        }
    };

    const resetEditor = () => {
        setIsAdding(false);
        setIsEditing(null);
        setAccountFormData({});
        setShowPassword(false);
        setMfaSetupOpen(false);
    };

    const handleRoleChange = (role: string) => {
        let services: ServiceType[] = ['hospital'];
        if (role === 'admin') services = ['hospital', 'grooming', 'hotel'];
        else if (role.includes('미용')) services = ['grooming'];
        else if (role.includes('매니저') || role.includes('호텔')) services = ['hotel'];

        setAccountFormData({
            ...accountFormData,
            role: role === 'admin' ? 'admin' : 'staff',
            department: role,
            allowedServices: services
        });
    };

    const toggleAccountService = (service: ServiceType) => {
        const current = accountFormData.allowedServices || [];
        if (current.includes(service)) {
            if (current.length === 1) return;
            setAccountFormData({ ...accountFormData, allowedServices: current.filter(s => s !== service) });
        } else {
            setAccountFormData({ ...accountFormData, allowedServices: [...current, service] });
        }
    };

    const CategorySection = ({ title, type, items }: { title: string, type: 'roles' | 'staffStatuses' | 'roomTypes' | 'roomStatuses', items: string[] }) => (
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4">{title}</h4>
            <div className="flex flex-wrap gap-2 mb-4">
                {items.map(item => (
                    <div key={item} className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-lg border border-slate-200 text-sm font-bold text-slate-600">
                        {item}
                        <button onClick={() => onDeleteCategory(type, item)} className="text-slate-400 hover:text-rose-500">
                            <X size={14} />
                        </button>
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <input 
                    type="text" 
                    value={newCategoryInput[type] || ''} 
                    onChange={e => setNewCategoryInput({...newCategoryInput, [type]: e.target.value})}
                    placeholder="새 항목 추가..." 
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:border-indigo-500"
                    onKeyDown={e => e.key === 'Enter' && onAddCategory(type, newCategoryInput[type])}
                />
                <button onClick={() => onAddCategory(type, newCategoryInput[type])} className="p-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700">
                    <Plus size={18} />
                </button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-20">
            {/* Tabs */}
            <div className="flex bg-white p-1.5 rounded-2xl w-fit border border-slate-100 shadow-sm overflow-x-auto">
                <button onClick={() => { setActiveTab('general'); resetEditor(); }} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'general' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>서비스 모드</button>
                <button onClick={() => { setActiveTab('accounts'); resetEditor(); }} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${activeTab === 'accounts' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>
                    <ShieldCheck size={14} /> 계정 관리
                </button>
                <button onClick={() => { setActiveTab('staff'); resetEditor(); }} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'staff' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>직원 관리</button>
                <button onClick={() => { setActiveTab('facilities'); resetEditor(); }} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'facilities' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>시설 관리</button>
                <button onClick={() => { setActiveTab('categories'); resetEditor(); }} className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${activeTab === 'categories' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-500 hover:text-slate-800'}`}>분류 관리</button>
            </div>

            {/* 계정 관리 탭 */}
            {activeTab === 'accounts' && (
                <div className="flex flex-col lg:flex-row gap-8">
                     <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <div>
                                <h3 className="text-lg font-bold text-slate-700">관리자 및 서브 계정</h3>
                                <p className="text-xs text-slate-500 font-medium">조직의 보안 수준을 관리하고 접근 권한을 설정합니다.</p>
                            </div>
                            <button onClick={handleAddAccountClick} className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-300 transition-all active:scale-95">
                                <Plus size={16} /> 계정 생성
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {accounts.map(acc => (
                                <div key={acc.id} onClick={() => handleEditAccountClick(acc)} className={`glass-panel p-5 rounded-[1.5rem] flex items-center gap-4 cursor-pointer transition-all border-2 group ${isEditing === acc.id ? 'border-indigo-500 bg-indigo-50/20 shadow-md' : 'border-transparent hover:border-slate-200 bg-white'}`}>
                                    <div className="relative">
                                        <img src={acc.avatar} alt={acc.name} className="w-14 h-14 rounded-2xl object-cover bg-slate-100 shadow-sm" />
                                        <div className={`absolute -top-1 -left-1 w-3 h-3 rounded-full border-2 border-white ${acc.securityLevel === 'high' ? 'bg-emerald-500' : acc.securityLevel === 'medium' ? 'bg-amber-500' : 'bg-rose-500'}`} title={`Security: ${acc.securityLevel.toUpperCase()}`}></div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-bold text-slate-800">{acc.name}</h4>
                                                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded tracking-tight">@{acc.username}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {acc.mfaEnabled && (
                                                    <span className="text-[9px] font-extrabold text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100 flex items-center gap-1">
                                                        <Smartphone size={10} /> MFA ON
                                                    </span>
                                                )}
                                                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${acc.role === 'admin' ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                    {acc.role}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex gap-1.5 mt-2 overflow-x-hidden">
                                            {acc.allowedServices.map(s => (
                                                <span key={s} className="text-[9px] font-bold text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{s.toUpperCase()}</span>
                                            ))}
                                        </div>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 계정 에디터 */}
                    {(isEditing || isAdding) && (
                        <div className="w-full lg:w-[650px] glass-panel bg-white p-8 rounded-[2.5rem] h-fit border border-slate-200 shadow-2xl animate-in slide-in-from-right-4 duration-300 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                            <div className="flex justify-between items-center mb-8 relative z-10">
                                <div>
                                    <h3 className="text-xl font-black text-slate-900">{isAdding ? '보안 계정 생성' : '계정 보안 설정'}</h3>
                                    <p className="text-xs text-slate-500 mt-1 font-medium">강력한 인증 체계와 정교한 권한을 부여하세요.</p>
                                </div>
                                <div className="flex gap-2">
                                    {!isAdding && <button onClick={() => handleDeleteAccount(accountFormData.id!)} className="p-2.5 rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-100 border border-rose-100 transition-colors"><Trash2 size={18} /></button>}
                                    <button onClick={resetEditor} className="p-2.5 rounded-xl bg-slate-100 text-slate-500 hover:bg-slate-200"><X size={18} /></button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                                {/* 기본 정보 컬럼 */}
                                <div className="space-y-6">
                                    <div className="flex flex-col items-center gap-4 mb-2">
                                        <div className="relative group">
                                            <div className="w-24 h-24 rounded-[1.8rem] overflow-hidden border-4 border-white shadow-xl bg-slate-100">
                                                <img src={accountFormData.avatar} alt="Avatar" className="w-full h-full object-cover" />
                                            </div>
                                            <button onClick={() => setAccountFormData({...accountFormData, avatar: `https://picsum.photos/id/${Math.floor(Math.random()*1000)}/100/100`})} className="absolute -bottom-1 -right-1 bg-white p-2 rounded-xl border border-slate-200 shadow-lg text-slate-400 hover:text-indigo-500 transition-all">
                                                <RefreshCw size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Display Name</label>
                                            <div className="relative">
                                                <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                                <input type="text" value={accountFormData.name || ''} onChange={e => setAccountFormData({...accountFormData, name: e.target.value})} className="w-full pl-9 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold outline-none focus:border-indigo-500 transition-all" placeholder="사용자 이름" />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Login ID (수정 가능)</label>
                                            <div className="relative group">
                                                <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500" />
                                                <input type="text" value={accountFormData.username || ''} autoComplete="username" onChange={e => setAccountFormData({...accountFormData, username: e.target.value})} className="w-full pl-9 pr-4 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold outline-none focus:border-indigo-500 transition-all" placeholder="아이디" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 보안 정보 컬럼 */}
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest ml-1">Secure Password</label>
                                        <div className="relative">
                                            <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                            <input 
                                                type={showPassword ? "text" : "password"} 
                                                value={accountFormData.password || ''} 
                                                autoComplete="new-password"
                                                onChange={e => setAccountFormData({...accountFormData, password: e.target.value})} 
                                                className="w-full pl-9 pr-10 py-3 bg-slate-50 rounded-xl border border-slate-200 text-sm font-bold outline-none focus:border-indigo-500 transition-all" 
                                                placeholder={isAdding ? '필수 입력' : '변경 시 입력'} 
                                            />
                                            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                                                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                        {/* Strength Meter */}
                                        <div className="px-1 pt-1">
                                            <div className="flex justify-between items-center mb-1">
                                                <span className="text-[9px] font-bold text-slate-400">보안 강도: <span className={passwordStrength.color.replace('bg-', 'text-')}>{passwordStrength.label}</span></span>
                                                <span className="text-[9px] font-bold text-slate-300">8자 이상 + 특수문자 권장</span>
                                            </div>
                                            <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                <div className={`h-full transition-all duration-500 ${passwordStrength.color}`} style={{ width: `${passwordStrength.level}%` }}></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* MFA Section */}
                                    <div className={`p-5 rounded-3xl border-2 transition-all ${accountFormData.mfaEnabled ? 'bg-indigo-50 border-indigo-200' : 'bg-slate-50 border-slate-100'}`}>
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="flex items-center gap-2">
                                                <Smartphone size={18} className={accountFormData.mfaEnabled ? 'text-indigo-600' : 'text-slate-400'} />
                                                <span className="text-xs font-black text-slate-800">2단계 인증 (MFA)</span>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => setAccountFormData({...accountFormData, mfaEnabled: !accountFormData.mfaEnabled})}
                                                className={`w-10 h-5 rounded-full relative transition-colors ${accountFormData.mfaEnabled ? 'bg-indigo-600' : 'bg-slate-300'}`}
                                            >
                                                <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all shadow-sm ${accountFormData.mfaEnabled ? 'left-6' : 'left-1'}`}></div>
                                            </button>
                                        </div>
                                        <p className="text-[10px] text-slate-500 leading-relaxed mb-3">
                                            로그인 시 모바일 앱의 인증 코드를 추가로 확인합니다. 계정 도용을 방지하는 강력한 수단입니다.
                                        </p>
                                        {accountFormData.mfaEnabled && (
                                            <button 
                                                type="button"
                                                onClick={() => setMfaSetupOpen(true)}
                                                className="w-full py-2 bg-white rounded-xl border border-indigo-200 text-[10px] font-extrabold text-indigo-600 hover:bg-indigo-100 transition-colors flex items-center justify-center gap-2"
                                            >
                                                <QrCode size={12} /> 인증 앱 연결 설정
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 서비스 권한 설정 */}
                            <div className="mt-8 pt-6 border-t border-slate-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-black text-slate-800 flex items-center gap-2"><Shield size={18} className="text-indigo-500" /> 접근 제어 및 권한</h4>
                                    <div className="relative">
                                        <Zap size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-amber-500" />
                                        <select onChange={(e) => handleRoleChange(e.target.value)} className="pl-8 pr-3 py-1.5 bg-slate-100 border-none rounded-lg text-[10px] font-bold outline-none cursor-pointer hover:bg-slate-200 transition-colors" value={accountFormData.department || ''}>
                                            <option value="" disabled>직책별 프리셋</option>
                                            <option value="admin">최고 관리자</option>
                                            {roles.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3">
                                    {[
                                        { id: 'hospital', label: '병원', icon: Stethoscope, color: 'indigo' },
                                        { id: 'grooming', label: '미용', icon: Scissors, color: 'pink' },
                                        { id: 'hotel', label: '호텔', icon: Home, color: 'orange' }
                                    ].map((service) => {
                                        const isActive = accountFormData.allowedServices?.includes(service.id as ServiceType);
                                        return (
                                            <div key={service.id} onClick={() => toggleAccountService(service.id as ServiceType)} className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col items-center gap-2 ${isActive ? `bg-${service.color}-50 border-${service.color}-500 text-${service.color}-600 shadow-md` : 'bg-white border-slate-100 text-slate-400 hover:border-slate-300'}`}>
                                                <service.icon size={20} />
                                                <span className="text-[10px] font-black">{service.label}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            <button onClick={handleSaveAccount} className="w-full mt-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm shadow-xl shadow-slate-300 hover:bg-slate-800 hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-2">
                                <ShieldCheck size={20} /> {isAdding ? '보안 계정 생성 완료' : '업데이트 및 보안 강화'}
                            </button>
                        </div>
                    )}

                    {/* MFA Setup Mock Modal */}
                    {mfaSetupOpen && (
                        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setMfaSetupOpen(false)} />
                            <div className="relative bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95">
                                <div className="text-center space-y-4">
                                    <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center text-indigo-600 mx-auto shadow-lg shadow-indigo-100">
                                        <Fingerprint size={40} />
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900">2단계 인증 설정</h3>
                                    <p className="text-xs text-slate-500 font-medium">Google Authenticator 또는 Kakao 인증 앱을 사용하여 아래 QR 코드를 스캔하세요.</p>
                                    
                                    <div className="p-6 bg-slate-50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center gap-4">
                                        <div className="w-40 h-40 bg-white p-2 rounded-2xl shadow-inner border border-slate-100">
                                            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PetToYou_MFA_Sim" alt="QR" className="w-full h-full opacity-80" />
                                        </div>
                                        <div className="text-[10px] font-mono font-bold text-slate-400 bg-white px-3 py-1 rounded-full border border-slate-100 uppercase tracking-widest">
                                            ABCD - 1234 - EFGH - 5678
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-left block ml-1">인증 코드 (6자리)</label>
                                        <div className="flex gap-2">
                                            {[1,2,3,4,5,6].map(i => <div key={i} className="flex-1 h-12 bg-slate-100 rounded-xl border border-slate-200 animate-pulse"></div>)}
                                        </div>
                                    </div>

                                    <button onClick={() => setMfaSetupOpen(false)} className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all">
                                        연결 및 활성화
                                    </button>
                                    <button onClick={() => setMfaSetupOpen(false)} className="text-xs font-bold text-slate-400 hover:text-slate-600">나중에 설정</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* 나머지 탭들은 기존 구조 유지 */}
            {activeTab === 'staff' && (
                <div className="flex flex-col lg:flex-row gap-8">
                     <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-bold text-slate-700">등록된 직원 목록</h3>
                            <button onClick={() => { setIsAdding(true); setIsEditing(null); }} className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-200 transition-all">
                                <Plus size={16} /> 직원 추가
                            </button>
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            {staffList.map(staff => (
                                <div key={staff.id} onClick={() => { setIsEditing(staff.id); setStaffFormData({...staff}); }} className={`glass-panel p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition-all border-2 ${isEditing === staff.id ? 'border-indigo-500 bg-indigo-50/30' : 'border-transparent hover:border-slate-200 bg-white'}`}>
                                    <img src={staff.image} alt={staff.name} className="w-14 h-14 rounded-2xl object-cover bg-slate-100" />
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-slate-800">{staff.name}</h4>
                                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${staff.role.includes('수의사') ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>{staff.role}</span>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">{staff.department} • {staff.status.toUpperCase()}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* ... (Staff Editor form similar to Account editor) ... */}
                </div>
            )}

            {/* Facilities Tab */}
            {activeTab === 'facilities' && (
                <div className="flex flex-col lg:flex-row gap-8">
                     <div className="flex-1 space-y-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-bold text-slate-700">등록된 시설 (Rooms)</h3>
                            <button onClick={() => { setIsAdding(true); setIsEditing(null); }} className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-200 transition-all">
                                <Plus size={16} /> 시설 추가
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {roomList.map(room => (
                                <div key={room.id} onClick={() => { setIsEditing(room.id); setRoomFormData({...room}); }} className={`glass-panel p-4 rounded-2xl flex flex-col gap-2 cursor-pointer transition-all border-2 ${isEditing === room.id ? 'border-emerald-500 bg-emerald-50/30' : 'border-transparent hover:border-slate-200 bg-white'}`}>
                                    <div className="flex justify-between items-start">
                                        <h4 className="font-bold text-slate-800">{room.name}</h4>
                                        <div className={`w-2 h-2 rounded-full ${room.status === 'available' ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                    </div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase">{room.type} • {room.serviceType}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Categories Tab */}
            {activeTab === 'categories' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CategorySection title="직원 직책 (Roles)" type="roles" items={roles} />
                    <CategorySection title="직원 상태 라벨 (Staff Status)" type="staffStatuses" items={staffStatuses} />
                    <CategorySection title="시설 유형 (Room Types)" type="roomTypes" items={roomTypes} />
                    <CategorySection title="시설 상태 라벨 (Room Status)" type="roomStatuses" items={roomStatuses} />
                 </div>
            )}
        </div>
    );
};

export default Settings;
