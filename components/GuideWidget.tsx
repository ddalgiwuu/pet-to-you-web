
import React from 'react';
import { Plus, Upload, Star } from 'lucide-react';
import { GuideItem } from '../types';

const GuideWidget: React.FC<{ items: GuideItem[] }> = ({ items }) => {
  return (
    <div className="glass-panel rounded-3xl p-8 shadow-xl shadow-slate-200/20 w-full h-full flex flex-col hover:shadow-2xl transition-shadow duration-500 bg-white">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-bold text-slate-900">추천 진료 가이드</h3>
        <div className="flex gap-2">
            <button className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors">
                <Plus size={16} />
            </button>
            <button className="w-8 h-8 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-400 hover:text-slate-800 transition-colors">
                <Upload size={14} />
            </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left">
              <th className="pb-6 text-xs font-medium text-slate-400 w-1/2 pl-2">항목</th>
              <th className="pb-6 text-xs font-medium text-slate-400 text-center">상태</th>
              <th className="pb-6 text-xs font-medium text-slate-400 text-center">시작일</th>
              <th className="pb-6 text-xs font-medium text-slate-400 text-right pr-2">담당자</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {items.map((item) => (
              <tr key={item.id} className="group hover:bg-slate-50/50 transition-colors border-b border-dashed border-slate-100 last:border-0">
                <td className="py-5 pl-2 flex items-center gap-3">
                    <Star size={12} className="text-slate-300 group-hover:text-yellow-400 transition-colors" />
                    <span className="font-bold text-slate-700 text-sm">{item.title}</span>
                </td>
                <td className="py-5 text-center">
                  <span
                    className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                      item.status === '적용됨'
                        ? 'bg-blue-100 text-blue-600'
                        : item.status === '검토중'
                        ? 'bg-orange-100 text-orange-600'
                        : 'bg-emerald-100 text-emerald-600'
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="py-5 text-slate-500 text-xs font-medium text-center">{item.startDate}</td>
                <td className="py-5 text-slate-500 text-xs font-medium text-right pr-2">{item.inCharge}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GuideWidget;
