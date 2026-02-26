
import React from 'react';
import { MoreHorizontal, Clock, CheckCircle2, FileText, Calendar, ArrowRight, Shirt } from 'lucide-react';
import { PatientCase } from '../types';

interface PatientCardProps {
  data: PatientCase;
  onClick?: () => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ data, onClick }) => {
  
  // 1. Action Card
  if (data.status === 'treatment' && !data.isSurgery && !data.doctor) {
      return (
          <div onClick={onClick} className="group w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative overflow-hidden z-10">
               <div className="flex items-center gap-4 mb-6">
                   <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                       <FileText size={20} />
                   </div>
                   <div>
                       <h3 className="font-bold text-slate-800 text-sm">처방전 작성 필요</h3>
                   </div>
               </div>
               
               <div className="space-y-4 mb-2">
                   {data.progressSteps?.map((step, idx) => (
                       <div key={idx} className="flex items-center gap-3">
                           <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${step.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-200'}`}>
                                {step.completed && <CheckCircle2 size={12} />}
                           </div>
                           <span className={`text-sm font-medium ${step.completed ? 'text-slate-400 line-through' : 'text-slate-500'}`}>{step.label}</span>
                       </div>
                   ))}
               </div>
               
               <div className="absolute right-4 bottom-4 w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity">
                   <ArrowRight size={16} />
               </div>
          </div>
      );
  }

  // 2. Surgery Card
  if (data.isSurgery) {
    return (
      <div onClick={onClick} className="group relative w-full p-6 rounded-3xl bg-slate-900 text-white shadow-xl shadow-slate-900/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden cursor-pointer z-10">
        <div className="relative z-10">
          <div className="mb-8">
            <h3 className="text-base font-bold text-white mb-1 flex items-center gap-2">
              {data.description.split('(')[0]}
              <span className="text-slate-400 font-normal text-xs">(진행중)</span>
            </h3>
            <p className="text-slate-400 text-xs mt-1">예상 소요 시간: 2h 30m</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center -space-x-2">
               <div className="w-9 h-9 rounded-full border-2 border-slate-800 bg-slate-700 overflow-hidden">
                 <img src={data.avatarUrl} alt="patient" className="w-full h-full object-cover" />
               </div>
               <div className="w-9 h-9 rounded-full border-2 border-slate-800 bg-slate-700 flex items-center justify-center overflow-hidden">
                 <img src="https://picsum.photos/id/1005/50/50" alt="doctor" className="w-full h-full object-cover" />
               </div>
            </div>
            <button className="px-4 py-1.5 rounded-xl bg-white/10 text-xs font-medium hover:bg-white/20 transition-colors border border-white/10">
              자세히
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Diagnosis Card
  if (data.status === 'diagnosis') {
      return (
        <div onClick={onClick} className="group w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative z-10">
            <div className="flex justify-between items-start mb-5">
                <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-slate-100 overflow-hidden">
                         <img src={data.avatarUrl} alt={data.patientName} className="w-full h-full object-cover" />
                    </div>
                    <div>
                         <h3 className="font-bold text-slate-900 text-sm">
                            {data.patientName} <span className="text-slate-400 font-normal">({data.breed})</span>
                         </h3>
                         <p className="text-xs text-slate-400 font-medium mt-0.5">{data.caseNumber}</p>
                    </div>
                </div>
                {data.tags && (
                    <span className="px-2 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold rounded-md uppercase">
                        {data.tags[0]}
                    </span>
                )}
            </div>
            
            <div className="space-y-3 mb-5">
                {data.progressSteps?.map((step, idx) => (
                    <div key={idx} className={`flex items-center justify-between p-3 rounded-xl ${step.completed ? 'bg-slate-50' : step.current ? 'bg-amber-50' : 'bg-white border border-slate-100'}`}>
                         <span className={`text-xs font-semibold ${step.completed ? 'text-slate-500' : step.current ? 'text-amber-600' : 'text-slate-700'}`}>{step.label}</span>
                         {step.completed ? (
                             <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-sm">
                                 <CheckCircle2 size={12} strokeWidth={3} />
                             </div>
                         ) : step.current ? (
                             <div className="w-5 h-5 rounded-full border-2 border-amber-400 flex items-center justify-center text-amber-500">
                                <Clock size={12} />
                             </div>
                         ) : null}
                    </div>
                ))}
            </div>

             <div className="flex items-center gap-2 pt-2">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-[10px] font-bold text-emerald-600">
                    Dr
                </div>
                <span className="text-xs font-bold text-slate-700">{data.doctor}</span>
                <span className="text-[10px] text-slate-400 ml-auto font-medium">진단 진행중</span>
            </div>
        </div>
      );
  }

  // 4. Standard Card
  return (
    <div onClick={onClick} className="group w-full bg-white rounded-3xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative z-10">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-slate-50 overflow-hidden shadow-sm">
            <img src={data.avatarUrl} alt={data.patientName} className="w-full h-full object-cover" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              {data.patientName} <span className="text-slate-400 font-normal">({data.breed})</span>
            </h3>
            <p className="text-xs text-slate-400 font-medium tracking-wide mt-0.5">{data.caseNumber}</p>
          </div>
        </div>
        <button className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-slate-100 text-slate-300 transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </div>

      <div className="mb-8 min-h-[3rem]">
        <p className="text-slate-600 text-xs leading-relaxed font-medium line-clamp-3">
          {data.description}
        </p>
      </div>

      <div className="flex items-center justify-between mt-auto">
          <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 opacity-60">
             <Shirt size={16} />
          </div>
          <div className="flex gap-2">
               <button className="w-9 h-9 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 hover:bg-slate-50 hover:text-slate-600 transition-colors">
                  <CheckCircle2 size={16} />
               </button>
               <button className="w-9 h-9 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 hover:bg-slate-50 hover:text-slate-600 transition-colors">
                  <Calendar size={16} />
               </button>
          </div>
      </div>
    </div>
  );
};

export default PatientCard;
