
import { GuideItem, PatientCase, StatData, Account, Staff, Room, Patient, Reservation, NotificationItem, CallLog, DayOfWeek, DailySchedule, CalendarEvent } from './types';

// Helper to create default schedule
const createDefaultSchedule = (dayOff: DayOfWeek): Record<DayOfWeek, DailySchedule> => {
    const days: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const schedule: any = {};
    days.forEach(day => {
        schedule[day] = {
            isOff: day === dayOff,
            workStart: '09:00',
            workEnd: '18:00',
            breakStart: '12:00',
            breakEnd: '13:00'
        };
    });
    return schedule;
};

export const INITIAL_EVENTS: CalendarEvent[] = [
    { id: '1', title: '초코 중성화 수술', type: 'surgery', time: '09:00', duration: 120, color: 'bg-indigo-100 text-indigo-700 border-indigo-200', serviceType: 'hospital', date: 5, patientName: '초코' },
    { id: '2', title: '나비 예방접종', type: 'checkup', time: '11:00', duration: 30, color: 'bg-indigo-50 text-indigo-600 border-indigo-100', serviceType: 'hospital', date: 12, patientName: '나비' },
    { id: '3', title: '두부 피부진료', type: 'consult', time: '14:30', duration: 45, color: 'bg-indigo-100 text-indigo-700 border-indigo-200', serviceType: 'hospital', date: 18, patientName: '두부' },
    { id: '4', title: '몽이 전체 미용', type: 'grooming', time: '10:00', duration: 90, color: 'bg-pink-100 text-pink-700 border-pink-200', serviceType: 'grooming', date: 8, patientName: '몽이' },
    { id: '5', title: '루비 스파/목욕', type: 'grooming', time: '14:00', duration: 60, color: 'bg-pink-50 text-pink-600 border-pink-100', serviceType: 'grooming', date: 22, patientName: '루비' },
    { id: '6', title: '맥스 호텔 입실', type: 'checkin', time: '09:00', duration: 30, color: 'bg-orange-100 text-orange-700 border-orange-200', serviceType: 'hotel', date: 15, patientName: '맥스' },
    { id: '7', title: '레오 픽업', type: 'checkout', time: '18:00', duration: 30, color: 'bg-orange-50 text-orange-600 border-orange-100', serviceType: 'hotel', date: 16, patientName: '레오' },
];

export const INITIAL_ACCOUNTS: Account[] = [
    { id: '1', username: 'admin', password: '1234', name: '김수의 원장', role: 'admin', allowedServices: ['hospital', 'grooming', 'hotel'], avatar: 'https://picsum.photos/id/1005/100/100', mfaEnabled: true, securityLevel: 'high' },
    { id: '2', username: 'staff', password: '1234', name: '이진료 과장', role: 'staff', allowedServices: ['hospital'], avatar: 'https://picsum.photos/id/1011/100/100', mfaEnabled: false, securityLevel: 'medium' },
];

export const INITIAL_STAFF: Staff[] = [
    { id: '1', name: '김수의 원장', role: '수의사', status: 'busy', currentTask: '수술 집도 중', image: 'https://picsum.photos/id/1005/100/100', department: '제1진료실', schedules: createDefaultSchedule('Sun') },
    { id: '2', name: '이진료 과장', role: '수의사', status: 'online', currentTask: '진료 대기', image: 'https://picsum.photos/id/1011/100/100', department: '제2진료실', schedules: createDefaultSchedule('Mon') },
];

export const INITIAL_ROOMS: Room[] = [
    { id: '1', name: '제1진료실', type: 'exam', status: 'occupied', occupantName: '초코 (푸들)', occupantTime: '14:00~14:30', serviceType: 'hospital' },
    { id: '2', name: '제2진료실', type: 'exam', status: 'available', serviceType: 'hospital' },
];

export const INITIAL_PATIENTS: Patient[] = Array.from({ length: 12 }).map((_, i) => ({
    id: i.toString(), name: `환자 ${i+1}`, breed: 'Dog', age: '3살', gender: 'M', lastVisit: '2023.10.10', status: 'healthy', image: `https://picsum.photos/id/${100+i}/100/100`, chartNumber: `P-${1000+i}`, serviceType: 'hospital'
}));

export const INITIAL_RESERVATIONS: Reservation[] = [
    { id: '1', patientName: '두부', breed: 'Maltese', age: '3살', gender: '수컷', ownerName: '김민지', phoneNumber: '010-1234-5678', requestType: '기본 건강검진', symptoms: '식욕 부진, 기력 저하', time: '14:30', date: '2023-10-26', status: 'pending', source: 'app', serviceType: 'hospital', avatarUrl: 'https://picsum.photos/id/1025/100/100', isNewPatient: true, visitCount: 1 },
    { id: '2', patientName: '루비', breed: 'Pomeranian', age: '5살', gender: '암컷', ownerName: '이서준', phoneNumber: '010-9876-5432', requestType: '전체 미용', symptoms: '곰돌이컷 요청', time: '15:00', date: '2023-10-26', status: 'pending', source: 'app', serviceType: 'grooming', avatarUrl: 'https://picsum.photos/id/1062/100/100', isNewPatient: false, visitCount: 4 },
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
    { id: '1', type: 'reservation', title: '신규 예약 요청', message: '두부(말티즈)님의 건강검진 예약', time: '5분 전', isRead: false, serviceType: 'hospital' },
];

export const INITIAL_CALL_LOGS: CallLog[] = [
    { id: 'c1', callerName: '김민지 (두부)', phoneNumber: '010-1234-5678', type: 'missed', time: '방금 전', isNew: true, tags: ['VIP', '클레임'] },
    { id: 'c2', callerName: '이서준 (루비)', phoneNumber: '010-9876-5432', type: 'incoming', time: '15분 전', duration: '3분 42초' },
];

export const PATIENT_CASES: PatientCase[] = [
  { id: '1', patientName: '초코', breed: 'Poodle', caseNumber: '#CASE-001', description: '구토 증상으로 내원', status: 'reception', avatarUrl: 'https://picsum.photos/id/1025/100/100', serviceType: 'hospital', ownerName: '김민지', phoneNumber: '010-1234-5678', triage: { weight: '4.2', temperature: '38.5', heartRate: '120', respiratoryRate: '24', bcs: '4' }, weightHistory: [{ date: '23.10', weight: 4.2 }] },
  { id: '3', patientName: '뭉치', breed: 'Golden', caseNumber: '#CASE-002', description: '혈액 검사 완료. 초음파 대기 중.', status: 'diagnosis', doctor: 'Dr. Kim', avatarUrl: 'https://picsum.photos/id/1062/100/100', serviceType: 'hospital', progressSteps: [{ label: '혈액 검사 완료', completed: true }, { label: '초음파 검사 대기', completed: false, current: true }] },
];

export const GUIDE_ITEMS: GuideItem[] = [
  { id: '1', title: '심장사상충 예방 프로토콜', status: '적용됨', startDate: '2023-10-25', inCharge: 'Dr. Lee' },
];

export const STATS_DATA: StatData[] = [
  { name: '대기 중', value: 5, total: 20, color: '#94A3B8' }, 
];
