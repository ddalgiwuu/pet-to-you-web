
export type PatientStatus = 'reception' | 'diagnosis' | 'treatment' | 'aftercare';

export type PageId = 'dashboard' | 'schedule' | 'medical-status' | 'patients' | 'messages' | 'reports' | 'settings' | 'calls';

export type ServiceType = 'hospital' | 'grooming' | 'hotel';

export type UserRole = 'admin' | 'staff';

export interface Account {
    id: string;
    username: string; // Login ID (Now Modifiable)
    password: string; 
    name: string;     
    role: UserRole;
    department?: string;
    allowedServices: ServiceType[]; 
    avatar?: string;
    // Security Fields
    mfaEnabled: boolean;
    lastPasswordChange?: string;
    securityLevel: 'low' | 'medium' | 'high';
}

export interface TriageData {
  weight: string;
  temperature: string;
  heartRate: string;
  respiratoryRate: string;
  bcs: string;
}

export interface VaccinationStatus {
  name: string;
  status: 'completed' | 'pending' | 'overdue';
  date?: string;
}

export interface PatientCase {
  id: string;
  patientName: string;
  breed: string;
  caseNumber: string;
  description: string;
  tags?: string[];
  ownerName?: string;
  phoneNumber?: string; 
  adminMemo?: string; 
  doctor?: string;
  status: PatientStatus;
  isUrgent?: boolean;
  isSurgery?: boolean;
  progressSteps?: {
    label: string;
    completed: boolean;
    current?: boolean;
  }[];
  avatarUrl: string;
  serviceType?: ServiceType;
  triage?: TriageData;
  vaccinations?: VaccinationStatus[];
  weightHistory?: { date: string; weight: number }[];
}

export interface PatientReceipt {
    id: string;
    date: string;
    amount: number;
    description: string;
    imageUrl?: string;
}

export interface Patient {
    id: string;
    name: string;
    breed: string;
    age: string;
    birthDate?: string; 
    gender: string;
    lastVisit: string;
    lastService?: string; 
    status: string;
    image: string;
    chartNumber: string;
    ownerName?: string;
    phoneNumber?: string;
    memo?: string;
    adminMemo?: string; 
    serviceType: ServiceType; 
    receipts?: PatientReceipt[]; 
}

export interface GuideItem {
  id: string;
  title: string;
  status: '적용됨' | '검토중' | '완료됨';
  startDate: string;
  inCharge: string;
}

export interface StatData {
  name: string;
  value: number;
  total: number;
  color: string;
}

export interface Reservation {
    id: string;
    patientName: string;
    breed: string;
    ownerName: string;
    phoneNumber?: string;
    requestType: string;
    date: string;
    time: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    source: 'app' | 'walk-in' | 'phone';
    serviceType: ServiceType;
    cancellationReason?: string;
    avatarUrl: string;
    isNewPatient?: boolean;
    visitCount?: number;
    symptoms?: string;
    age?: string;
    gender?: string;
}

export interface NotificationItem {
    id: string;
    type: 'reservation' | 'message' | 'system' | 'call';
    title: string;
    message: string;
    time: string;
    isRead: boolean;
    serviceType?: ServiceType;
    callerInfo?: {
        name: string;
        phone: string;
        memo: string;
        patientName: string;
    }
}

export interface CallLog {
    id: string;
    callerName: string;
    phoneNumber: string;
    type: 'incoming' | 'outgoing' | 'missed';
    time: string;
    duration?: string;
    tags?: string[];
    isNew?: boolean;
}

export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export interface DailySchedule {
    isOff: boolean;
    workStart: string; 
    workEnd: string;   
    breakStart: string; 
    breakEnd: string;   
}

export interface Staff {
    id: string;
    name: string;
    role: string;
    status: string;
    currentTask?: string;
    image: string;
    nextAvailable?: string;
    department?: string;
    phone?: string;
    schedules: Record<DayOfWeek, DailySchedule>;
}

export interface Room {
    id: string;
    name: string;
    type: string; 
    status: string; 
    occupantName?: string;
    occupantTime?: string;
    serviceType: ServiceType;
}

export interface Message {
    id: string;
    sender: string;
    content: string;
    time: string;
    isMe: boolean;
    avatar?: string;
}

export interface ChatThread {
    id: string;
    user: string;
    lastMessage: string;
    time: string;
    unread: number;
    avatar: string;
    status: 'online' | 'offline';
    serviceType: ServiceType; 
}

export interface CalendarEvent {
    id: string;
    title: string;
    type: string;
    time: string;
    duration: number;
    patientName?: string;
    doctorName?: string;
    color: string;
    serviceType: ServiceType; 
    date?: number;
    fullDate?: string;
    description?: string;
}
