
import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { TrendingUp, Users, DollarSign, Activity } from 'lucide-react';
import { Staff, DayOfWeek, DailySchedule } from '../types';

// Helper to create default schedule for mock data
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

const STAFF_DATA: Staff[] = [
    { 
        id: '1', name: '김수의 원장', role: '수의사', status: 'busy', currentTask: '수술 집도 중', image: 'https://picsum.photos/id/1005/50/50',
        schedules: createDefaultSchedule('Sun')
    },
    { 
        id: '2', name: '이진료 과장', role: '수의사', status: 'online', currentTask: '진료 대기', image: 'https://picsum.photos/id/1011/50/50',
        schedules: createDefaultSchedule('Mon')
    },
    { 
        id: '3', name: '박간호 팀장', role: '테크니션', status: 'online', currentTask: '입원 환자 관리', image: 'https://picsum.photos/id/1027/50/50',
        schedules: createDefaultSchedule('Tue')
    },
    { 
        id: '4', name: '최데스크', role: '매니저', status: 'busy', currentTask: '고객 응대', image: 'https://picsum.photos/id/1035/50/50',
        schedules: createDefaultSchedule('Wed')
    },
];

const CHART_DATA = [
  { name: '월', revenue: 4000 },
  { name: '화', revenue: 3000 },
  { name: '수', revenue: 2000 },
  { name: '목', revenue: 2780 },
  { name: '금', revenue: 1890 },
  { name: '토', revenue: 2390 },
  { name: '일', revenue: 3490 },
];

const Management: React.FC = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <KpiCard title="이번 달 매출" value="₩ 124,500,000" change="+12.5%" icon={<DollarSign size={24} />} color="indigo" />
            <KpiCard title="신규 환자" value="128명" change="+4.2%" icon={<Users size={24} />} color="emerald" />
            <KpiCard title="평균 객단가" value="₩ 85,000" change="-1.1%" icon={<TrendingUp size={24} />} color="amber" />
            <KpiCard title="가동률" value="92%" change="+5.4%" icon={<Activity size={24} />} color="rose" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 glass-panel rounded-3xl p-8 min-h-[400px]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-slate-800">주간 매출 추이</h3>
                    <select className="bg-slate-50 border border-slate-200 rounded-lg text-xs px-3 py-1.5 text-slate-600 outline-none">
                        <option>이번 주</option>
                        <option>지난 주</option>
                    </select>
                </div>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={CHART_DATA}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(value) => `₩${value/1000}k`} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}
                            />
                            <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Staff Status */}
            <div className="glass-panel rounded-3xl p-8">
                <h3 className="text-lg font-bold text-slate-800 mb-6">근무자 현황</h3>
                <div className="space-y-4">
                    {STAFF_DATA.map((staff) => (
                        <div key={staff.id} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-white/50 transition-colors cursor-pointer">
                            <div className="relative">
                                <img src={staff.image} alt={staff.name} className="w-12 h-12 rounded-full object-cover border border-slate-100" />
                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                    staff.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'
                                }`}></div>
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-0.5">
                                    <span className="font-bold text-slate-800 text-sm">{staff.name}</span>
                                    <span className="text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{staff.role}</span>
                                </div>
                                <div className="text-xs text-slate-500">{staff.currentTask}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};

const KpiCard = ({ title, value, change, icon, color }: any) => {
    const isPositive = change.startsWith('+');
    return (
        <div className="glass-panel rounded-3xl p-6 relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
            <div className={`w-12 h-12 rounded-2xl bg-${color}-50 text-${color}-500 flex items-center justify-center mb-4`}>
                {icon}
            </div>
            <h4 className="text-slate-500 text-sm font-medium mb-1">{title}</h4>
            <div className="text-2xl font-extrabold text-slate-800 mb-2">{value}</div>
            <div className={`text-xs font-bold flex items-center gap-1 ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
                {change} <span className="text-slate-400 font-medium">지난달 대비</span>
            </div>
        </div>
    )
}

export default Management;
