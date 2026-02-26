
import React from 'react';
import { RefreshCcw } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

const StatsWidget: React.FC = () => {
  // Data for the semi-circle gauges
  // value is the colored part, rest completes the semi-circle
  const data1 = [
      { name: 'val', value: 5, color: '#1e293b' }, // Dark slate
      { name: 'rest', value: 15, color: '#f1f5f9' }
  ];
  
  const data2 = [
      { name: 'val', value: 7, color: '#f43f5e' }, // Rose
      { name: 'rest', value: 13, color: '#f1f5f9' }
  ];

  return (
    <div className="glass-panel rounded-3xl p-8 shadow-xl shadow-slate-200/20 w-full lg:w-[420px] flex flex-col hover:shadow-2xl transition-shadow duration-500 bg-white">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base font-bold text-slate-900">실시간 예약 현황</h3>
        <button className="w-8 h-8 rounded-full border border-slate-100 bg-white text-slate-400 hover:text-slate-800 flex items-center justify-center hover:rotate-180 transition-all duration-700">
          <RefreshCcw size={14} />
        </button>
      </div>

      <div className="flex-1 flex gap-4 items-end pb-2">
        {/* Gauge 1 */}
        <div className="flex-1 flex flex-col items-center">
            <div className="h-[100px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data1}
                            cx="50%"
                            cy="100%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={45}
                            outerRadius={60}
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none"
                        >
                            <Cell key="val" fill={data1[0].color} />
                            <Cell key="bg" fill={data1[1].color} />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Value */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[-5px] flex flex-col items-center">
                    <span className="text-3xl font-extrabold text-slate-900">5</span>
                </div>
            </div>
            <span className="text-xs font-bold text-slate-500 mt-2">진료 대기</span>
        </div>

        {/* Gauge 2 */}
         <div className="flex-1 flex flex-col items-center">
            <div className="h-[100px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data2}
                            cx="50%"
                            cy="100%"
                            startAngle={180}
                            endAngle={0}
                            innerRadius={45}
                            outerRadius={60}
                            paddingAngle={0}
                            dataKey="value"
                            stroke="none"
                        >
                            <Cell key="val" fill={data2[0].color} />
                            <Cell key="bg" fill={data2[1].color} />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                {/* Center Value */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[-5px] flex flex-col items-center">
                    <span className="text-3xl font-extrabold text-slate-900">7</span>
                </div>
            </div>
            <span className="text-xs font-bold text-slate-500 mt-2">수술/처치</span>
        </div>
      </div>
    </div>
  );
};

export default StatsWidget;
