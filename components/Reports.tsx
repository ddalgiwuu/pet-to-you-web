
import React, { useState, useEffect, useMemo } from 'react';
import { 
    ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, 
    PieChart, Pie, Cell, AreaChart, Area, LineChart, Line, ScatterChart, Scatter, ZAxis,
    Legend
} from 'recharts';
import { 
    Filter, Download, Share2, TrendingUp, Users, Target, 
    PieChart as PieIcon, BarChart2, LineChart as LineIcon, 
    ArrowUpRight, ArrowDownRight, Sparkles, Plus, Settings,
    Wallet, UserX, CreditCard, Activity, Layers, Stethoscope, Scissors, Home, ChevronLeft, ChevronRight, Calendar,
    UploadCloud, FileText, Table as TableIcon, Layout, Grid, Database, X, Hash, ChevronDown, RefreshCw
} from 'lucide-react';
import { ServiceType } from '../types';

// --- ROBUST MOCK DATA (Sample Superstore Style) ---
const SAMPLE_DATASET = [
    { Date: '2023-10-01', Region: 'Seoul', Category: 'Hospital', Service: 'Surgery', Revenue: 1500, Profit: 400, Visitors: 12 },
    { Date: '2023-10-01', Region: 'Busan', Category: 'Grooming', Service: 'Cut', Revenue: 500, Profit: 150, Visitors: 8 },
    { Date: '2023-10-02', Region: 'Seoul', Category: 'Hotel', Service: 'Daycare', Revenue: 800, Profit: 300, Visitors: 20 },
    { Date: '2023-10-02', Region: 'Incheon', Category: 'Hospital', Service: 'Checkup', Revenue: 1200, Profit: 500, Visitors: 15 },
    { Date: '2023-10-03', Region: 'Seoul', Category: 'Grooming', Service: 'Spa', Revenue: 600, Profit: 200, Visitors: 10 },
    { Date: '2023-10-03', Region: 'Busan', Category: 'Hospital', Service: 'Surgery', Revenue: 2000, Profit: 800, Visitors: 5 },
    { Date: '2023-10-04', Region: 'Seoul', Category: 'Hospital', Service: 'Checkup', Revenue: 1800, Profit: 600, Visitors: 25 },
    { Date: '2023-10-04', Region: 'Incheon', Category: 'Hotel', Service: 'Stay', Revenue: 1500, Profit: 700, Visitors: 12 },
    { Date: '2023-10-05', Region: 'Seoul', Category: 'Grooming', Service: 'Cut', Revenue: 700, Profit: 250, Visitors: 14 },
    { Date: '2023-10-05', Region: 'Busan', Category: 'Hotel', Service: 'Daycare', Revenue: 900, Profit: 400, Visitors: 18 },
    { Date: '2023-10-06', Region: 'Seoul', Category: 'Hospital', Service: 'Vaccine', Revenue: 1100, Profit: 400, Visitors: 30 },
    { Date: '2023-10-06', Region: 'Incheon', Category: 'Grooming', Service: 'Spa', Revenue: 400, Profit: 100, Visitors: 6 },
    { Date: '2023-10-07', Region: 'Seoul', Category: 'Hotel', Service: 'Stay', Revenue: 2200, Profit: 1000, Visitors: 15 },
    { Date: '2023-10-07', Region: 'Busan', Category: 'Hospital', Service: 'Checkup', Revenue: 1300, Profit: 500, Visitors: 16 },
];

// --- HELPER: ROBUST CSV PARSER ---
const parseCSV = (text: string) => {
    // Normalize line endings and split
    const rows = text.trim().split(/\r?\n/);
    if (rows.length < 2) return [];
    
    // Helper to handle quotes and commas inside values
    const splitCSVLine = (line: string) => {
        const res = [];
        let current = '';
        let inQuote = false;
        for (let i = 0; i < line.length; i++) {
            const c = line[i];
            if (c === '"') {
                inQuote = !inQuote;
            } else if (c === ',' && !inQuote) {
                res.push(current.trim());
                current = '';
            } else {
                current += c;
            }
        }
        res.push(current.trim());
        return res.map(val => val.replace(/^"|"$/g, '').trim());
    };

    const headers = splitCSVLine(rows[0]);
    
    return rows.slice(1).map(line => {
        if (!line.trim()) return null; // Skip empty lines
        const values = splitCSVLine(line);
        const obj: any = {};
        
        headers.forEach((header, i) => {
            let val = values[i];
            if (val === undefined) {
                obj[header] = null;
                return;
            }
            
            // Robust number parsing: remove commas, currency symbols
            // Check if looks like a number first
            const cleanVal = val.replace(/,/g, '').replace(/^[₩$]/, '');
            if (cleanVal !== '' && !isNaN(Number(cleanVal))) {
                obj[header] = Number(cleanVal);
            } else {
                obj[header] = val;
            }
        });
        return obj;
    }).filter(Boolean); // Remove nulls
};

// --- HELPER: AGGREGATOR ---
const aggregateData = (data: any[], groupBy: string | null, metrics: string[]) => {
    if (!groupBy || metrics.length === 0) return data;

    const groups: {[key: string]: any} = {};

    data.forEach(item => {
        const key = item[groupBy];
        if (!groups[key]) {
            groups[key] = { [groupBy]: key };
            metrics.forEach(m => groups[key][m] = 0);
        }
        metrics.forEach(m => {
            const val = item[m];
            if (typeof val === 'number') {
                groups[key][m] += val;
            }
        });
    });

    return Object.values(groups);
};

// --- STANDARD KPIS & CHARTS ---
const GET_KPI_DATA = (service: ServiceType | 'all') => {
    switch(service) {
        case 'hospital':
            return {
                revenue: { value: '₩8,200k', trend: '+15.2%', isGood: true, label: '진료비 매출 상승' },
                noshow: { value: '2.1%', trend: '-0.5%', isGood: true, label: '예약 이행률 우수' },
                arpu: { value: '₩120,000', trend: '+5.0%', isGood: true, label: '수술 건수 증가' }
            };
        case 'grooming':
            return {
                revenue: { value: '₩3,100k', trend: '+8.4%', isGood: true, label: '미용 예약 증가' },
                noshow: { value: '5.5%', trend: '+1.2%', isGood: false, label: '노쇼 관리 필요' },
                arpu: { value: '₩55,000', trend: '-2.1%', isGood: false, label: '프로모션 영향' }
            };
        case 'hotel':
            return {
                revenue: { value: '₩1,150k', trend: '+3.1%', isGood: true, label: '연휴 시즌 대비' },
                noshow: { value: '1.2%', trend: '-0.1%', isGood: true, label: '매우 안정적' },
                arpu: { value: '₩60,000', trend: '0.0%', isGood: true, label: '변동 없음' }
            };
        default: // all
            return {
                revenue: { value: '₩12,450k', trend: '+12.5%', isGood: true, label: '통합 매출 상승' },
                noshow: { value: '4.2%', trend: '-1.1%', isGood: true, label: '예약 관리 효율 개선' },
                arpu: { value: '₩85,000', trend: '-0.5%', isGood: false, label: '평균 유지 중' }
            };
    }
};

const REVENUE_DATA: Record<string, any[]> = {
    all: [
        { name: '월', current: 400, previous: 240 }, { name: '화', current: 300, previous: 139 },
        { name: '수', current: 200, previous: 980 }, { name: '목', current: 278, previous: 390 },
        { name: '금', current: 189, previous: 480 }, { name: '토', current: 239, previous: 380 },
        { name: '일', current: 349, previous: 430 },
    ],
    hospital: [
        { name: '월', current: 250, previous: 200 }, { name: '화', current: 180, previous: 100 },
        { name: '수', current: 150, previous: 160 }, { name: '목', current: 200, previous: 180 },
        { name: '금', current: 120, previous: 300 }, { name: '토', current: 150, previous: 250 },
        { name: '일', current: 100, previous: 120 },
    ],
    grooming: [
        { name: '월', current: 100, previous: 30 }, { name: '화', current: 80, previous: 20 },
        { name: '수', current: 40, previous: 60 }, { name: '목', current: 60, previous: 100 },
        { name: '금', current: 50, previous: 120 }, { name: '토', current: 70, previous: 100 },
        { name: '일', current: 150, previous: 200 },
    ],
    hotel: [
        { name: '월', current: 50, previous: 10 }, { name: '화', current: 40, previous: 19 },
        { name: '수', current: 10, previous: 760 }, { name: '목', current: 18, previous: 110 },
        { name: '금', current: 19, previous: 60 }, { name: '토', current: 19, previous: 30 },
        { name: '일', current: 99, previous: 110 },
    ]
};

const ACQUISITION_DATA = [
    { name: '인스타그램', value: 45, color: '#E1306C' },
    { name: '네이버 블로그', value: 25, color: '#00C73C' },
    { name: '지인 추천', value: 20, color: '#6366F1' },
    { name: '워크인(간판)', value: 10, color: '#94A3B8' },
];

const RETENTION_DATA = [
    { month: '1월', rate: 65, new: 40 }, { month: '2월', rate: 58, new: 30 },
    { month: '3월', rate: 72, new: 55 }, { month: '4월', rate: 68, new: 45 },
    { month: '5월', rate: 75, new: 60 }, { month: '6월', rate: 82, new: 70 },
];

const ALL_PERFORMANCE = [
    { name: '기본 미용', profit: 400, time: 60, count: 120, type: 'grooming' },
    { name: '건강 검진', profit: 900, time: 40, count: 50, type: 'hospital' },
    { name: '호텔링', profit: 300, time: 90, count: 30, type: 'hotel' },
    { name: '발톱 관리', profit: 50, time: 10, count: 200, type: 'grooming' },
    { name: '중성화 수술', profit: 1200, time: 120, count: 15, type: 'hospital' },
    { name: '스파 케어', profit: 150, time: 30, count: 40, type: 'grooming' },
    { name: '데이 케어', profit: 100, time: 60, count: 80, type: 'hotel' },
    { name: '백신 접종', profit: 50, time: 10, count: 150, type: 'hospital' },
    { name: '슬개골 수술', profit: 2500, time: 180, count: 5, type: 'hospital' },
    { name: 'VIP 스위트', profit: 500, time: 1440, count: 10, type: 'hotel' },
];

interface KPICardProps {
    title: string;
    value: string;
    trend: string;
    trendLabel: string;
    isGoodTrend: boolean;
    color: 'indigo' | 'rose' | 'amber' | 'emerald';
    icon: React.ElementType;
    onClick?: () => void;
}

const KPICard: React.FC<KPICardProps> = ({ title, value, trend, trendLabel, isGoodTrend, color, icon: Icon, onClick }) => {
    const colorMap = {
        indigo: '#6366f1',
        rose: '#f43f5e',
        amber: '#f59e0b',
        emerald: '#10b981'
    };
    const mainColor = colorMap[color];
    const hoverShadow = {
        indigo: 'hover:shadow-indigo-100',
        rose: 'hover:shadow-rose-100',
        amber: 'hover:shadow-amber-100',
        emerald: 'hover:shadow-emerald-100'
    }[color];

    return (
        <div 
            onClick={onClick}
            className={`relative overflow-hidden bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 group cursor-pointer flex flex-col justify-between h-[220px] ${hoverShadow}`}
        >
            <div className={`absolute -top-12 -right-12 w-48 h-48 bg-${color}-500/5 rounded-full blur-3xl transition-transform duration-500 group-hover:scale-125`}></div>

            <div className="relative z-10 flex justify-between items-start">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-${color}-200 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110`} style={{backgroundColor: mainColor}}>
                    <Icon size={28} strokeWidth={2} />
                </div>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md ${isGoodTrend ? 'bg-emerald-50/80 border-emerald-100 text-emerald-600' : 'bg-rose-50/80 border-rose-100 text-rose-600'}`}>
                    {isGoodTrend ? <ArrowUpRight size={14} strokeWidth={3} /> : <ArrowDownRight size={14} strokeWidth={3} />}
                    {trend}
                </div>
            </div>
            
            <div className="relative z-10 mt-6">
                <h4 className="text-slate-400 text-[11px] font-extrabold tracking-wider uppercase mb-2">{title}</h4>
                <div className="flex items-center justify-between">
                    <div>
                        <div className="text-[2.5rem] leading-none font-black text-slate-800 tracking-tight mb-2">{value}</div>
                        <p className="text-xs font-semibold text-slate-400">{trendLabel}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300">
                        <ChevronRight size={20} />
                    </div>
                </div>
            </div>
        </div>
    );
};

interface ReportsProps {
    activeServices?: ServiceType[];
    globalFilter?: ServiceType | 'all';
}

const Reports: React.FC<ReportsProps> = ({ activeServices = ['hospital', 'grooming', 'hotel'], globalFilter = 'all' }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'marketing' | 'performance' | 'custom'>('overview');
    const [currentService, setCurrentService] = useState<ServiceType | 'all'>('all');
    const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'noshow' | 'arpu' | null>(null);

    // --- CUSTOM BUILDER STATE ---
    const [dataset, setDataset] = useState<any[]>([]); // The raw data
    const [dimensions, setDimensions] = useState<string[]>([]); // Text columns
    const [measures, setMeasures] = useState<string[]>([]); // Numeric columns
    const [selectedDims, setSelectedDims] = useState<string[]>(['Date']); // X-axis (Columns)
    const [selectedMeasures, setSelectedMeasures] = useState<string[]>(['Revenue']); // Y-axis (Rows)
    const [customChartType, setCustomChartType] = useState<'bar' | 'line' | 'area' | 'pie'>('bar');
    const [isDragOver, setIsDragOver] = useState(false);
    const [isDataView, setIsDataView] = useState(false);
    const [fileName, setFileName] = useState<string>('');

    // Pre-load sample data if no file is uploaded
    useEffect(() => {
        if (dataset.length === 0) {
            setFileName('Sample_Superstore_KR.csv');
            processRawData(SAMPLE_DATASET);
        }
    }, []);

    useEffect(() => {
        setCurrentService(globalFilter);
    }, [globalFilter]);

    // Data Processing Function
    const processRawData = (data: any[]) => {
        if (!data || data.length === 0) return;
        
        // Analyze columns
        const firstRow = data[0];
        const dimKeys: string[] = [];
        const measureKeys: string[] = [];

        Object.keys(firstRow).forEach(key => {
            if (typeof firstRow[key] === 'number') {
                measureKeys.push(key);
            } else {
                dimKeys.push(key);
            }
        });

        setDataset(data);
        setDimensions(dimKeys);
        setMeasures(measureKeys);
        
        // Defaults - if currently selected dimensions don't exist in new file, reset
        if (dimKeys.length > 0 && (!selectedDims[0] || !dimKeys.includes(selectedDims[0]))) {
            setSelectedDims([dimKeys[0]]);
        }
        if (measureKeys.length > 0 && (!selectedMeasures[0] || !measureKeys.includes(selectedMeasures[0]))) {
            setSelectedMeasures([measureKeys[0]]);
        }
    };

    const handleFileDrop = async (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file) await readFile(file);
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) await readFile(file);
    };

    const readFile = (file: File) => {
        setFileName(file.name);
        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            const parsedData = parseCSV(text);
            
            // Reset logic
            if(parsedData.length > 0) {
                // Clear existing selections before processing new structure
                setSelectedDims([]);
                setSelectedMeasures([]);
                processRawData(parsedData);
            } else {
                alert("Failed to parse CSV or file is empty.");
            }
        };
        reader.readAsText(file);
    };

    // Calculate Aggregated Data for Chart
    const chartData = useMemo(() => {
        return aggregateData(dataset, selectedDims[0] || null, selectedMeasures);
    }, [dataset, selectedDims, selectedMeasures]);

    // --- OTHER RENDERERS (Overview, Marketing, etc.) ---
    const KPI = GET_KPI_DATA(currentService);
    const TrendData = REVENUE_DATA[currentService] || REVENUE_DATA['all'];
    const PerformanceData = useMemo(() => {
        if (currentService === 'all') {
            return ALL_PERFORMANCE.filter(p => activeServices.includes(p.type as ServiceType));
        }
        return ALL_PERFORMANCE.filter(p => p.type === currentService);
    }, [currentService, activeServices]);

    const renderMetricDetail = () => {
        return (
            <div className="p-4">
                 <button onClick={() => setSelectedMetric(null)} className="mb-4 text-sm font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1">
                    <ChevronLeft size={16} /> Back to Overview
                 </button>
                 <div className="glass-panel p-10 flex items-center justify-center text-slate-400 bg-white rounded-3xl border border-slate-100">
                     Detailed view for {selectedMetric} coming soon.
                 </div>
            </div>
        );
    };

    const renderOverview = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             {/* KPI Cards */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <KPICard title="총 매출 (Revenue)" value={KPI.revenue.value} trend={KPI.revenue.trend} trendLabel={KPI.revenue.label} isGoodTrend={KPI.revenue.isGood} color="indigo" icon={Wallet} onClick={() => setSelectedMetric('revenue')} />
                <KPICard title="예약 취소율 (No-Show)" value={KPI.noshow.value} trend={KPI.noshow.trend} trendLabel={KPI.noshow.label} isGoodTrend={KPI.noshow.isGood} color="rose" icon={UserX} onClick={() => setSelectedMetric('noshow')} />
                <KPICard title="평균 객단가 (ARPU)" value={KPI.arpu.value} trend={KPI.arpu.trend} trendLabel={KPI.arpu.label} isGoodTrend={KPI.arpu.isGood} color="amber" icon={CreditCard} onClick={() => setSelectedMetric('arpu')} />
             </div>

             {/* Charts Row */}
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                 {/* Revenue Trend */}
                 <div className="lg:col-span-2 glass-panel bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20">
                     <h3 className="text-lg font-extrabold text-slate-800 mb-6 flex items-center gap-2"><Activity size={20} className="text-indigo-500" /> 주간 매출 추이</h3>
                     <div className="h-[300px] w-full">
                         <ResponsiveContainer width="100%" height="100%">
                             <AreaChart data={TrendData}>
                                 <defs>
                                     <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                         <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                                         <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                     </linearGradient>
                                 </defs>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                 <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                                 <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                                 <Tooltip contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'}} />
                                 <Area type="monotone" dataKey="current" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorCurrent)" name="이번 주" />
                                 <Area type="monotone" dataKey="previous" stroke="#e2e8f0" strokeWidth={2} strokeDasharray="5 5" fill="none" name="지난 주" />
                             </AreaChart>
                         </ResponsiveContainer>
                     </div>
                 </div>

                 {/* Acquisition Source */}
                 <div className="glass-panel bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20">
                     <h3 className="text-lg font-extrabold text-slate-800 mb-6 flex items-center gap-2"><Users size={20} className="text-emerald-500" /> 유입 경로</h3>
                     <div className="h-[300px] w-full relative">
                         <ResponsiveContainer width="100%" height="100%">
                             <PieChart>
                                 <Pie data={ACQUISITION_DATA} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                     {ACQUISITION_DATA.map((entry, index) => (
                                         <Cell key={`cell-${index}`} fill={entry.color} />
                                     ))}
                                 </Pie>
                                 <Tooltip />
                                 <Legend verticalAlign="bottom" height={36} iconType="circle" />
                             </PieChart>
                         </ResponsiveContainer>
                         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] text-center">
                             <div className="text-3xl font-black text-slate-800">Total</div>
                             <div className="text-xs font-bold text-slate-400">Channels</div>
                         </div>
                     </div>
                 </div>
             </div>
        </div>
    );

    const renderMarketing = () => (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Retention Chart */}
                <div className="glass-panel bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20">
                     <h3 className="text-lg font-extrabold text-slate-800 mb-6">월별 재방문율 (Retention)</h3>
                     <div className="h-[300px] w-full">
                         <ResponsiveContainer width="100%" height="100%">
                             <LineChart data={RETENTION_DATA}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                 <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                                 <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} unit="%" />
                                 <Tooltip contentStyle={{borderRadius: '12px', border: 'none'}} />
                                 <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={4} dot={{r: 6, strokeWidth: 2, fill: 'white'}} activeDot={{r: 8}} />
                             </LineChart>
                         </ResponsiveContainer>
                     </div>
                </div>

                {/* New Customers */}
                <div className="glass-panel bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20">
                     <h3 className="text-lg font-extrabold text-slate-800 mb-6">신규 고객 유치 (New Acquisition)</h3>
                     <div className="h-[300px] w-full">
                         <ResponsiveContainer width="100%" height="100%">
                             <BarChart data={RETENTION_DATA}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                 <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                                 <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                                 <Tooltip contentStyle={{borderRadius: '12px', border: 'none'}} cursor={{fill: 'rgba(0,0,0,0.02)'}} />
                                 <Bar dataKey="new" fill="#f59e0b" radius={[6, 6, 0, 0]} barSize={40} />
                             </BarChart>
                         </ResponsiveContainer>
                     </div>
                </div>
            </div>
        </div>
    );

    const renderPerformance = () => (
         <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="glass-panel bg-white p-6 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20">
                 <h3 className="text-lg font-extrabold text-slate-800 mb-6">서비스별 수익성 분석 (Profit vs Volume)</h3>
                 <div className="h-[400px] w-full">
                     <ResponsiveContainer width="100%" height="100%">
                         <ScatterChart>
                             <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                             <XAxis type="number" dataKey="count" name="시술 횟수" unit="회" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                             <YAxis type="number" dataKey="profit" name="수익" unit="원" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                             <ZAxis type="number" dataKey="time" range={[100, 1000]} name="소요 시간" unit="분" />
                             <Tooltip cursor={{strokeDasharray: '3 3'}} contentStyle={{borderRadius: '12px', border: 'none'}} />
                             <Legend />
                             <Scatter name="Services" data={PerformanceData} fill="#8884d8">
                                 {PerformanceData.map((entry, index) => (
                                     <Cell key={`cell-${index}`} fill={entry.type === 'hospital' ? '#6366f1' : entry.type === 'grooming' ? '#ec4899' : '#f59e0b'} />
                                 ))}
                             </Scatter>
                         </ScatterChart>
                     </ResponsiveContainer>
                 </div>
                 <div className="flex justify-center gap-6 mt-4">
                     <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><span className="w-3 h-3 rounded-full bg-indigo-500"></span> 병원</div>
                     <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><span className="w-3 h-3 rounded-full bg-pink-500"></span> 미용</div>
                     <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><span className="w-3 h-3 rounded-full bg-orange-500"></span> 호텔</div>
                 </div>
             </div>
        </div>
    );

    // --- CUSTOM BUILDER RENDERER ---
    const renderCustom = () => {
        // Distinct Colors for Multiple Measures
        const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="glass-panel bg-white p-6 rounded-[2.5rem] border border-indigo-100 shadow-xl shadow-indigo-100/20 min-h-[700px] flex flex-col">
                    
                    {/* Header */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-slate-100 pb-6">
                        <div>
                            <h3 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
                                <Settings size={24} className="text-indigo-500" /> 커스텀 리포트 빌더 (Custom Lab)
                            </h3>
                            <p className="text-sm text-slate-500 mt-1 font-medium">Tableau 스타일의 데이터 분석 도구</p>
                        </div>
                        <div className="flex gap-3">
                            <label className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 border border-slate-200 transition-all cursor-pointer flex items-center gap-2">
                                <UploadCloud size={14} />
                                {fileName || "파일 업로드 (CSV)"}
                                <input type="file" accept=".csv" className="hidden" onChange={handleFileSelect} />
                            </label>
                            <button className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-300 active:scale-95">
                                <Download size={16} /> 추출
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col lg:flex-row gap-6 h-[600px]">
                        
                        {/* 1. DATA PANE (Sidebar) */}
                        <div className="w-full lg:w-60 flex flex-col gap-4 bg-slate-50/80 rounded-3xl p-4 border border-slate-200 h-full overflow-hidden">
                            <div className="flex items-center gap-2 px-2 pb-2 border-b border-slate-200/60">
                                <Database size={14} className="text-slate-400" />
                                <span className="text-xs font-bold text-slate-500 truncate" title={fileName}>{fileName}</span>
                            </div>

                            <div className="flex-1 overflow-y-auto space-y-6 custom-scrollbar pr-1">
                                {/* Dimensions Section */}
                                <div>
                                    <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 px-2">Dimensions (차원)</h5>
                                    <div className="space-y-1">
                                        {dimensions.map(dim => (
                                            <button 
                                                key={dim}
                                                onClick={() => setSelectedDims([dim])}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                                                    selectedDims.includes(dim) 
                                                    ? 'bg-blue-100 text-blue-700 shadow-sm' 
                                                    : 'text-slate-600 hover:bg-blue-50 hover:text-blue-600'
                                                }`}
                                            >
                                                <Layout size={12} className={`opacity-50 ${selectedDims.includes(dim) ? 'text-blue-600' : ''}`} /> {dim}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Measures Section */}
                                <div>
                                    <h5 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2 px-2">Measures (측정값)</h5>
                                    <div className="space-y-1">
                                        {measures.map(measure => (
                                            <button 
                                                key={measure}
                                                onClick={() => {
                                                    // Toggle logic for multi-select
                                                    if (selectedMeasures.includes(measure)) {
                                                        if (selectedMeasures.length > 1) {
                                                            setSelectedMeasures(prev => prev.filter(m => m !== measure));
                                                        }
                                                    } else {
                                                        setSelectedMeasures(prev => [...prev, measure]);
                                                    }
                                                }}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                                                    selectedMeasures.includes(measure) 
                                                    ? 'bg-emerald-100 text-emerald-700 shadow-sm' 
                                                    : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-600'
                                                }`}
                                            >
                                                <Hash size={12} className={`opacity-50 ${selectedMeasures.includes(measure) ? 'text-emerald-600' : ''}`} /> {measure}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 2. MAIN STAGE */}
                        <div className="flex-1 flex flex-col gap-4 h-full min-w-0">
                            
                            {/* Shelves */}
                            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-1">
                                {/* Columns Shelf (Dimensions) */}
                                <div className="flex items-center border-b border-slate-100 p-3 gap-6">
                                    <span className="text-[10px] font-extrabold text-slate-400 w-16 text-right uppercase tracking-wider">Columns</span>
                                    <div className="flex-1 flex flex-wrap gap-2 min-h-[28px] items-center">
                                        {selectedDims.map(dim => (
                                            <div key={dim} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-full text-xs font-bold shadow-sm animate-in zoom-in-95 duration-200 cursor-pointer hover:bg-blue-600 transition-colors">
                                                <span>{dim}</span>
                                                <ChevronDown size={12} className="opacity-50" />
                                            </div>
                                        ))}
                                        {selectedDims.length === 0 && <span className="text-xs text-slate-300 italic px-2">Drag dimensions here</span>}
                                    </div>
                                </div>
                                {/* Rows Shelf (Measures) */}
                                <div className="flex items-center p-3 gap-6">
                                    <span className="text-[10px] font-extrabold text-slate-400 w-16 text-right uppercase tracking-wider">Rows</span>
                                    <div className="flex-1 flex flex-wrap gap-2 min-h-[28px] items-center">
                                        {selectedMeasures.map(measure => (
                                            <div key={measure} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-full text-xs font-bold shadow-sm animate-in zoom-in-95 duration-200 cursor-pointer hover:bg-emerald-600 transition-colors group">
                                                <span className="opacity-70 text-[10px] uppercase font-mono">SUM</span>
                                                <span>{measure}</span>
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedMeasures(prev => prev.filter(m => m !== measure));
                                                    }} 
                                                    className="ml-1 hover:text-emerald-200 rounded-full"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}
                                        {selectedMeasures.length === 0 && <span className="text-xs text-slate-300 italic px-2">Drag measures here</span>}
                                    </div>
                                </div>
                            </div>

                            {/* Visualization Toolbar */}
                            <div className="flex justify-between items-center px-1">
                                <div className="flex bg-slate-100 p-1 rounded-xl">
                                    <button onClick={() => setCustomChartType('bar')} className={`p-2 rounded-lg transition-all ${customChartType === 'bar' ? 'bg-white shadow text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`} title="Bar Chart"><BarChart2 size={16} /></button>
                                    <button onClick={() => setCustomChartType('line')} className={`p-2 rounded-lg transition-all ${customChartType === 'line' ? 'bg-white shadow text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`} title="Line Chart"><LineIcon size={16} /></button>
                                    <button onClick={() => setCustomChartType('area')} className={`p-2 rounded-lg transition-all ${customChartType === 'area' ? 'bg-white shadow text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`} title="Area Chart"><Activity size={16} /></button>
                                    <button onClick={() => setCustomChartType('pie')} className={`p-2 rounded-lg transition-all ${customChartType === 'pie' ? 'bg-white shadow text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`} title="Pie Chart"><PieIcon size={16} /></button>
                                </div>
                                <button 
                                    onClick={() => setIsDataView(!isDataView)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${isDataView ? 'bg-slate-800 text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                                >
                                    {isDataView ? <Grid size={14} /> : <TableIcon size={14} />} {isDataView ? '차트' : '데이터 시트'}
                                </button>
                            </div>

                            {/* Canvas Area */}
                            <div className="flex-1 bg-white rounded-3xl border border-slate-100 p-6 shadow-inner relative overflow-hidden flex flex-col">
                                {isDataView ? (
                                    <div className="overflow-auto h-full w-full custom-scrollbar">
                                        <table className="w-full text-left text-xs border-collapse">
                                            <thead className="bg-slate-50 sticky top-0 z-10">
                                                <tr>
                                                    {dimensions.concat(measures).map(h => (
                                                        <th key={h} className="p-3 border-b border-slate-200 font-bold text-slate-500 whitespace-nowrap">{h}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="text-slate-700">
                                                {dataset.map((row, i) => (
                                                    <tr key={i} className="border-b border-slate-50 hover:bg-slate-50">
                                                        {dimensions.concat(measures).map(col => (
                                                            <td key={`${i}-${col}`} className="p-3 whitespace-nowrap">{row[col]}</td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <ResponsiveContainer width="100%" height="100%">
                                        {customChartType === 'bar' ? (
                                            <BarChart data={chartData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                                <XAxis dataKey={selectedDims[0]} axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#64748b'}} />
                                                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 11, fill: '#64748b'}} />
                                                <Tooltip cursor={{fill: 'rgba(0,0,0,0.02)'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)'}} />
                                                <Legend iconType="circle" />
                                                {selectedMeasures.map((measure, idx) => (
                                                    <Bar key={measure} dataKey={measure} fill={COLORS[idx % COLORS.length]} radius={[4, 4, 0, 0]} barSize={40} />
                                                ))}
                                            </BarChart>
                                        ) : customChartType === 'line' ? (
                                            <LineChart data={chartData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                                <XAxis dataKey={selectedDims[0]} axisLine={false} tickLine={false} />
                                                <YAxis axisLine={false} tickLine={false} />
                                                <Tooltip contentStyle={{borderRadius: '12px', border: 'none'}} />
                                                <Legend iconType="circle" />
                                                {selectedMeasures.map((measure, idx) => (
                                                    <Line key={measure} type="monotone" dataKey={measure} stroke={COLORS[idx % COLORS.length]} strokeWidth={3} dot={{r: 4}} />
                                                ))}
                                            </LineChart>
                                        ) : customChartType === 'area' ? (
                                            <AreaChart data={chartData}>
                                                <defs>
                                                    {selectedMeasures.map((measure, idx) => (
                                                        <linearGradient key={`grad-${measure}`} id={`color-${measure}`} x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="5%" stopColor={COLORS[idx % COLORS.length]} stopOpacity={0.3}/>
                                                            <stop offset="95%" stopColor={COLORS[idx % COLORS.length]} stopOpacity={0}/>
                                                        </linearGradient>
                                                    ))}
                                                </defs>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                                <XAxis dataKey={selectedDims[0]} axisLine={false} tickLine={false} />
                                                <YAxis axisLine={false} tickLine={false} />
                                                <Tooltip contentStyle={{borderRadius: '12px', border: 'none'}} />
                                                <Legend iconType="circle" />
                                                {selectedMeasures.map((measure, idx) => (
                                                    <Area key={measure} type="monotone" dataKey={measure} stroke={COLORS[idx % COLORS.length]} fill={`url(#color-${measure})`} fillOpacity={1} />
                                                ))}
                                            </AreaChart>
                                        ) : (
                                            <PieChart>
                                                <Pie data={chartData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} dataKey={selectedMeasures[0]} nameKey={selectedDims[0]} paddingAngle={2} cornerRadius={4}>
                                                    {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                                </Pie>
                                                <Tooltip contentStyle={{borderRadius: '12px', border: 'none'}} />
                                                <Legend />
                                            </PieChart>
                                        )}
                                    </ResponsiveContainer>
                                )}
                                {!isDataView && (
                                    <div className="absolute bottom-4 right-4 text-[10px] text-slate-400 font-medium flex gap-4">
                                        <span>{dataset.length} Rows</span>
                                        <span>Sum aggregation applied</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700 pb-24">
             {/* Header with Service Filter (If applicable) */}
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-2">
                
                {/* View Tabs - Hide when in detail view */}
                {!selectedMetric ? (
                    <div className="flex bg-white p-1.5 rounded-[1.2rem] w-fit shadow-sm border border-slate-100 overflow-x-auto">
                        <button onClick={() => setActiveTab('overview')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === 'overview' ? 'bg-slate-900 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
                            <TrendingUp size={18} /> 종합 인사이트
                        </button>
                        <button onClick={() => setActiveTab('marketing')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === 'marketing' ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-200' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
                            <Users size={18} /> 마케팅 & 고객
                        </button>
                        <button onClick={() => setActiveTab('performance')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === 'performance' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
                            <Target size={18} /> 서비스 성과
                        </button>
                        <button onClick={() => setActiveTab('custom')} className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-bold transition-all duration-300 whitespace-nowrap ${activeTab === 'custom' ? 'bg-amber-500 text-white shadow-lg shadow-amber-200' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}>
                            <Settings size={18} /> 커스텀 빌더
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        {/* Placeholder to keep layout consistent if needed, or empty */}
                    </div>
                )}

                {/* Local Service Filter (Visible if Global Filter is All & Multiple Services Active & NOT detail view) */}
                {activeServices.length > 1 && !selectedMetric && (
                    <div className="flex bg-slate-100/80 p-1.5 rounded-[1.2rem] overflow-x-auto">
                        <button onClick={() => setCurrentService('all')} className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 ${currentService === 'all' ? 'bg-slate-800 text-white shadow-md' : 'text-slate-400 hover:bg-white'}`}>
                            <Layers size={14} /> 전체
                        </button>
                        {activeServices.includes('hospital') && (
                            <button onClick={() => setCurrentService('hospital')} className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 ${currentService === 'hospital' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:bg-white'}`}>
                                <Stethoscope size={14} /> 병원
                            </button>
                        )}
                        {activeServices.includes('grooming') && (
                            <button onClick={() => setCurrentService('grooming')} className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 ${currentService === 'grooming' ? 'bg-pink-500 text-white shadow-md' : 'text-slate-400 hover:bg-white'}`}>
                                <Scissors size={14} /> 미용
                            </button>
                        )}
                        {activeServices.includes('hotel') && (
                            <button onClick={() => setCurrentService('hotel')} className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all duration-300 ${currentService === 'hotel' ? 'bg-orange-500 text-white shadow-md' : 'text-slate-400 hover:bg-white'}`}>
                                <Home size={14} /> 호텔
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Content Area */}
            <div className="min-h-[500px]">
                {selectedMetric ? renderMetricDetail() : (
                    <>
                        {activeTab === 'overview' && renderOverview()}
                        {activeTab === 'marketing' && renderMarketing()}
                        {activeTab === 'performance' && renderPerformance()}
                        {activeTab === 'custom' && renderCustom()}
                    </>
                )}
            </div>
        </div>
    );
};

export default Reports;
