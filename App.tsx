import React, { useState, useRef, useEffect, lazy, Suspense, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import Login from './components/Login';

// Dashboard widgets — always on first view, load eagerly
import ProcessBoard from './components/ProcessBoard';
import ReservationWidget from './components/ReservationWidget';
import ScheduleWidget from './components/ScheduleWidget';
import ClinicStatusWidget from './components/ClinicStatusWidget';
import CallHistoryWidget from './components/CallHistoryWidget';

// Page components — lazy loaded (only one page shown at a time)
const Schedule      = lazy(() => import('./components/Schedule'));
const MedicalStatus = lazy(() => import('./components/MedicalStatus'));
const PatientRecords = lazy(() => import('./components/PatientRecords'));
const CallHistoryPage = lazy(() => import('./components/CallHistoryPage'));
const Messages      = lazy(() => import('./components/Messages'));
const Reports       = lazy(() => import('./components/Reports'));
const Settings      = lazy(() => import('./components/Settings'));
const Kiosk         = lazy(() => import('./components/Kiosk'));

// Modals — lazy loaded (conditionally rendered)
const QuickAddModal   = lazy(() => import('./components/QuickAddModal'));
const CallDetailModal = lazy(() => import('./components/CallDetailModal'));
import { PATIENT_CASES, INITIAL_STAFF, INITIAL_ROOMS, INITIAL_PATIENTS, INITIAL_NOTIFICATIONS, INITIAL_CALL_LOGS, INITIAL_EVENTS } from './constants';
import { PageId, Staff, Patient, ServiceType, Reservation, NotificationItem, Room, CallLog, Account, PatientCase, CalendarEvent } from './types';
import { useAuth } from './context/AuthContext';

const App: React.FC = () => {
  const [activePage, setActivePage] = useState<PageId>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isKioskMode, setIsKioskMode] = useState(false);

  // Auth State (from context)
  const { user: currentUser, login, logout, error: loginError, isLoading: authLoading } = useAuth();

  // Global Data States (Managed here for CRUD)
  const [cases, setCases] = useState<PatientCase[]>(PATIENT_CASES);
  const [events, setEvents] = useState<CalendarEvent[]>(INITIAL_EVENTS);
  const [staffList, setStaffList] = useState<Staff[]>(INITIAL_STAFF);
  const [roomList, setRoomList] = useState<Room[]>(INITIAL_ROOMS);
  const [patientList, setPatientList] = useState<Patient[]>(INITIAL_PATIENTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [callLogs, setCallLogs] = useState<CallLog[]>(INITIAL_CALL_LOGS);

  // Call Simulator State
  const [incomingCall, setIncomingCall] = useState<any | null>(null);
  const [isCallDetailOpen, setIsCallDetailOpen] = useState(false);
  const [activeCallInfo, setActiveCallInfo] = useState<any>(null);

  // Service Configuration
  const [activeServices] = useState<ServiceType[]>(['hospital', 'grooming', 'hotel']);
  const [globalServiceFilter, setGlobalServiceFilter] = useState<ServiceType | 'all'>('all');

  // Categories
  const [roles, setRoles] = useState<string[]>(['수의사', '미용사', '호텔 매니저', '테크니션', '데스크 매니저']);
  const [staffStatuses, setStaffStatuses] = useState<string[]>(['online', 'busy', 'offline', 'break']);
  const [roomTypes, setRoomTypes] = useState<string[]>(['exam', 'surgery', 'kennel', 'xray', 'grooming', 'playroom']);
  const [roomStatuses, setRoomStatuses] = useState<string[]>(['available', 'occupied', 'cleaning', 'maintenance']);

  // --- CRUD HANDLERS ---

  // Cases (Kanban)
  const handleUpdateCases = useCallback((updatedCases: PatientCase[]) => setCases(updatedCases), []);
  const handleAddCase = useCallback((newCase: PatientCase) => setCases(prev => [...prev, newCase]), []);

  // Schedule
  const handleScheduleEventAdd = useCallback((event: CalendarEvent) => {
      setEvents(prev => [...prev, event]);
  }, []);

  // Staff & Rooms
  const handleAddStaff = (s: Staff) => setStaffList([...staffList, s]);
  const handleUpdateStaff = (s: Staff) => setStaffList(staffList.map(item => item.id === s.id ? s : item));
  const handleDeleteStaff = (id: string) => setStaffList(staffList.filter(s => s.id !== id));

  const handleAddRoom = (r: Room) => setRoomList([...roomList, r]);
  const handleUpdateRoom = (r: Room) => setRoomList(roomList.map(item => item.id === r.id ? r : item));
  const handleDeleteRoom = (id: string) => setRoomList(roomList.filter(r => r.id !== id));

  const handleAddPatient = useCallback((p: Patient) => setPatientList(prev => [p, ...prev]), []);

  // --- CALL HANDLERS ---
  const openCallDetail = (log: CallLog) => {
      const mockCaller = {
          name: log.callerName,
          phone: log.phoneNumber,
          isExisting: true,
          tags: log.tags || ['VIP'],
          memo: '※ 보호자분 상담 이력 확인 필요.',
          pets: [{ name: '두부', breed: 'Maltese', age: '3살', image: 'https://picsum.photos/id/1025/100/100' }],
          history: []
      };
      setActiveCallInfo(mockCaller);
      setIsCallDetailOpen(true);
  };

  const handleLogout = () => {
    logout();
    setActivePage('dashboard');
  };

  const handleQuickAddSubmit = (data: any) => {
      const newReservations: Reservation[] = data.serviceTypes.map((type: ServiceType, index: number) => ({
          id: Date.now().toString() + index,
          patientName: data.petName,
          ownerName: data.ownerName,
          phoneNumber: data.phoneNumber,
          symptoms: data.symptoms,
          serviceType: type,
          requestType: '빠른 접수',
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: 'pending',
          source: data.source,
          breed: 'Unknown',
          age: '?',
          gender: '?',
          isNewPatient: true,
          visitCount: 1,
          avatarUrl: `https://picsum.photos/id/${Math.floor(Math.random() * 500)}/100/100`
      }));
      // Quick-add reservations are local only (optimistic); they are not persisted via API
  };

  const renderContent = () => {
      switch(activePage) {
          case 'dashboard':
              return (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-700 flex flex-col gap-10 pb-20">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        <div className="xl:col-span-2 space-y-8">
                            <ProcessBoard
                                cases={cases}
                                onUpdateCases={handleUpdateCases}
                                activeServices={activeServices}
                                globalFilter={globalServiceFilter}
                                onNavigateToEMR={(id) => setActivePage('patients')}
                                onAddEvent={handleScheduleEventAdd}
                            />
                            <ReservationWidget
                                onRegisterClick={() => setIsQuickAddOpen(true)}
                                activeServices={activeServices}
                                globalFilter={globalServiceFilter}
                            />
                        </div>
                        <div className="space-y-8">
                            <div className="w-full sticky top-32 flex flex-col gap-6">
                                <CallHistoryWidget logs={callLogs} onViewAll={() => setActivePage('calls')} onItemClick={openCallDetail} />
                                <ClinicStatusWidget staff={staffList} activeServices={activeServices} globalFilter={globalServiceFilter} onManageClick={() => setActivePage('settings')} />
                                <ScheduleWidget activeServices={activeServices} globalFilter={globalServiceFilter} events={events} />
                            </div>
                        </div>
                    </div>
                </div>
              );
          case 'schedule': return <Schedule activeServices={activeServices} globalFilter={globalServiceFilter} events={events} onAddEvent={handleScheduleEventAdd} />;
          case 'medical-status': return <MedicalStatus activeServices={activeServices} globalFilter={globalServiceFilter} rooms={roomList} cases={cases} onUpdateCases={handleUpdateCases} onAddCase={handleAddCase} onUpdateRoom={handleUpdateRoom} staffList={staffList} />;
          case 'patients': return <PatientRecords patients={patientList} onAddPatient={handleAddPatient} onUpdatePatient={p => setPatientList(patientList.map(item => item.id === p.id ? p : item))} onDeletePatient={id => setPatientList(patientList.filter(p => p.id !== id))} activeServices={activeServices} globalFilter={globalServiceFilter} />;
          case 'calls': return <CallHistoryPage logs={callLogs} onLogClick={openCallDetail} />;
          case 'messages': return <Messages activeServices={activeServices} globalFilter={globalServiceFilter} />;
          case 'reports': return <Reports activeServices={activeServices} globalFilter={globalServiceFilter} />;
          case 'settings': return <Settings staffList={staffList} onAddStaff={handleAddStaff} onUpdateStaff={handleUpdateStaff} onDeleteStaff={handleDeleteStaff} roomList={roomList} onAddRoom={handleAddRoom} onUpdateRoom={handleUpdateRoom} onDeleteRoom={handleDeleteRoom} activeServices={activeServices} toggleService={t => {}} roles={roles} staffStatuses={staffStatuses} roomTypes={roomTypes} roomStatuses={roomStatuses} onAddCategory={(t, v) => {}} onDeleteCategory={(t, v) => {}} accounts={[]} currentUser={null} onAddAccount={a => {}} onUpdateAccount={a => {}} onDeleteAccount={id => {}} />;
          default: return null;
      }
  }

  if (isKioskMode) {
      return (
          <Kiosk
              onExit={() => setIsKioskMode(false)}
              reservations={[]}
              patients={patientList}
              onAddReservation={() => {}}
              onAddPatient={handleAddPatient}
              onAddCase={handleAddCase}
          />
      );
  }

  if (authLoading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-[#F0F4F8]">
              <div className="w-8 h-8 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
      );
  }

  if (!currentUser) return <Login onLogin={login} error={loginError ?? undefined} onEnterKiosk={() => setIsKioskMode(true)} />;

  return (
    <div className={`min-h-screen font-sans text-slate-900 transition-colors duration-500 ${darkMode ? 'bg-slate-900' : 'bg-[#F0F4F8]'}`}>
      <Sidebar isOpen={sidebarOpen} activePage={activePage} setActivePage={setActivePage} onMouseEnter={() => setSidebarOpen(true)} onMouseLeave={() => setSidebarOpen(false)} darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} activeServices={activeServices} globalFilter={globalServiceFilter} onLogout={handleLogout} />
      <div className={`transition-all duration-500 ${sidebarOpen ? 'pl-64' : 'pl-20'}`}>
        <TopNav activePage={activePage} sidebarOpen={sidebarOpen} activeServices={activeServices} notifications={notifications} setNotifications={setNotifications} globalServiceFilter={globalServiceFilter} setGlobalServiceFilter={setGlobalServiceFilter} darkMode={darkMode} user={currentUser ?? undefined} onLogout={handleLogout} />
        <Suspense fallback={<div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-indigo-600/30 border-t-indigo-600 rounded-full animate-spin" /></div>}>
          <main className="p-4 md:p-8 max-w-[1920px] mx-auto">{renderContent()}</main>
        </Suspense>
      </div>
      <Suspense fallback={null}>
        {isQuickAddOpen && <QuickAddModal activeServices={activeServices} onClose={() => setIsQuickAddOpen(false)} onSubmit={handleQuickAddSubmit} />}
        {isCallDetailOpen && activeCallInfo && <CallDetailModal caller={activeCallInfo} onClose={() => setIsCallDetailOpen(false)} onNavigateToChart={() => setActivePage('patients')} onOpenReservation={() => setIsQuickAddOpen(true)} />}
      </Suspense>
    </div>
  );
};

export default App;
