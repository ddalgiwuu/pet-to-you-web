
import React from 'react';
import { Search, Filter, MoreHorizontal, FileText, ChevronRight } from 'lucide-react';

const PATIENTS = Array.from({ length: 8 }).map((_, i) => ({
    id: i,
    name: ['초코', '망고', '보리', '루이', '코코', '두부', '별이', '사랑'][i],
    breed: ['푸들', '골든리트리버', '비숑', '시바견', '말티즈', '포메라니안', '치와와', '믹스'][i],
    age: `${Math.floor(Math.random() * 10) + 1}살`,
    gender: i % 2 === 0 ? '수컷' : '암컷',
    lastVisit: `2023.10.${10 + i}`,
    status: i % 3 === 0 ? '치료중' : i % 3 === 1 ? '건강함' : '예약됨',
    image: `https://picsum.photos/id/${200 + i}/100/100`
}));

const PatientList: React.FC = () => {
  return (
    <div className="glass-panel rounded-3xl p-8 min-h-[calc(100vh-140px)] animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
            <h2 className="text-2xl font-extrabold text-slate-800">환자 전체 목록</h2>
            <div className="flex gap-3 w-full md:w-auto">
                <div className="flex items-center glass-panel bg-white/50 rounded-xl px-4 py-2.5 flex-1 md:w-64">
                    <Search size={18} className="text-slate-400" />
                    <input 
                        type="text" 
                        placeholder="이름, 등록번호 검색" 
                        className="bg-transparent border-none outline-none text-sm ml-2 w-full text-slate-700"
                    />
                </div>
                <button className="px-4 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg shadow-slate-300 hover:bg-slate-700 transition-colors whitespace-nowrap">
                    + 환자 등록
                </button>
            </div>
        </div>

        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-slate-200">
                        <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase w-16">No.</th>
                        <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase">환자 정보</th>
                        <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase">품종/나이/성별</th>
                        <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase">최근 방문일</th>
                        <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase text-center">상태</th>
                        <th className="py-4 px-4 text-xs font-bold text-slate-400 uppercase text-right">관리</th>
                    </tr>
                </thead>
                <tbody className="text-sm">
                    {PATIENTS.map((p, idx) => (
                        <tr key={idx} className="group hover:bg-white/50 transition-colors border-b border-slate-100 last:border-0">
                            <td className="py-4 px-4 text-slate-400 font-medium">#{1000 + idx}</td>
                            <td className="py-4 px-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden">
                                        <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                    <span className="font-bold text-slate-800">{p.name}</span>
                                </div>
                            </td>
                            <td className="py-4 px-4 text-slate-500 font-medium">
                                {p.breed} <span className="text-slate-300 mx-2">|</span> {p.age} <span className="text-slate-300 mx-2">|</span> {p.gender}
                            </td>
                            <td className="py-4 px-4 text-slate-500">{p.lastVisit}</td>
                            <td className="py-4 px-4 text-center">
                                <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                                    p.status === '치료중' ? 'bg-rose-100 text-rose-600' :
                                    p.status === '건강함' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                                }`}>
                                    {p.status}
                                </span>
                            </td>
                            <td className="py-4 px-4 text-right">
                                <div className="flex items-center justify-end gap-2">
                                    <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:border-indigo-100 hover:bg-indigo-50 transition-colors">
                                        <FileText size={14} />
                                    </button>
                                    <button className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-colors">
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
  );
};

export default PatientList;
