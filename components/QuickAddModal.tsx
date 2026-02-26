
import React, { useState } from 'react';
import { X, Smartphone, Footprints, Phone, User, Dog, Calendar, Clock, FileText, Check, Stethoscope, Scissors, Home, Layers } from 'lucide-react';
import { ServiceType } from '../types';

interface QuickAddModalProps {
  onClose: () => void;
  onSubmit: (data: any) => void;
  activeServices: ServiceType[];
}

const QuickAddModal: React.FC<QuickAddModalProps> = ({ onClose, onSubmit, activeServices }) => {
  const [source, setSource] = useState<'walk-in' | 'phone'>('walk-in');
  // Changed to array for multi-select
  const [selectedServices, setSelectedServices] = useState<ServiceType[]>([activeServices[0]]);
  
  const [formData, setFormData] = useState({
      ownerName: '',
      petName: '',
      phoneNumber: '',
      symptoms: '',
  });

  const toggleService = (type: ServiceType) => {
      setSelectedServices(prev => {
          if (prev.includes(type)) {
              // Don't allow deselecting the last one
              if (prev.length === 1) return prev;
              return prev.filter(s => s !== type);
          } else {
              return [...prev, type];
          }
      });
  };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Submit array of services
      onSubmit({ 
          ...formData, 
          source, 
          serviceTypes: selectedServices, 
          timestamp: new Date() 
      });
      onClose();
  };

  const ServiceOption = ({ type, icon, label, colorClass, bgClass }: { type: ServiceType, icon: React.ReactNode, label: string, colorClass: string, bgClass: string }) => {
      const isSelected = selectedServices.includes(type);
      return (
        <button
            type="button"
            onClick={() => toggleService(type)}
            className={`flex-1 flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border-2 transition-all relative overflow-hidden ${
                isSelected
                ? `${colorClass} ${bgClass} bg-opacity-10 border-current shadow-lg`
                : 'border-slate-100 text-slate-400 hover:bg-slate-50'
            }`}
        >
            {isSelected && (
                <div className={`absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center text-white text-[10px] ${bgClass}`}>
                    <Check size={10} strokeWidth={4} />
                </div>
            )}
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isSelected ? 'bg-white' : 'bg-slate-100'}`}>
                {icon}
            </div>
            <span className={`text-xs font-bold ${isSelected ? 'text-slate-800' : 'text-slate-500'}`}>{label}</span>
        </button>
      );
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-[2rem] w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden border border-white/20">
        
        {/* Header */}
        <div className="bg-slate-50 px-6 py-5 border-b border-slate-100 flex justify-between items-center">
            <div>
                <h3 className="text-lg font-extrabold text-slate-900">빠른 예약 등록</h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">서비스 유형 (다중 선택 가능)</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors">
                <X size={20} />
            </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Service Type Selector (Multi-select) */}
            {activeServices.length > 1 && (
                <div className="flex gap-3 pb-2">
                    {activeServices.includes('hospital') && (
                        <ServiceOption type="hospital" icon={<Stethoscope size={20} />} label="진료" colorClass="border-indigo-500 text-indigo-600" bgClass="bg-indigo-500" />
                    )}
                    {activeServices.includes('grooming') && (
                        <ServiceOption type="grooming" icon={<Scissors size={20} />} label="미용" colorClass="border-pink-500 text-pink-600" bgClass="bg-pink-500" />
                    )}
                    {activeServices.includes('hotel') && (
                        <ServiceOption type="hotel" icon={<Home size={20} />} label="호텔" colorClass="border-orange-500 text-orange-600" bgClass="bg-orange-500" />
                    )}
                </div>
            )}

            {/* Source Toggle */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                <button
                    type="button"
                    onClick={() => setSource('walk-in')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                        source === 'walk-in' 
                        ? 'bg-white text-emerald-600 shadow-md ring-1 ring-emerald-100' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                    <Footprints size={16} /> 현장 (Walk-in)
                </button>
                <button
                    type="button"
                    onClick={() => setSource('phone')}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
                        source === 'phone' 
                        ? 'bg-white text-orange-500 shadow-md ring-1 ring-orange-100' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                >
                    <Phone size={16} /> 전화 예약
                </button>
            </div>

            {/* Input Fields */}
            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 ml-1">보호자명</label>
                        <div className="relative">
                            <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                required
                                value={formData.ownerName}
                                onChange={e => setFormData({...formData, ownerName: e.target.value})}
                                placeholder="홍길동"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" 
                            />
                        </div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-500 ml-1">환자명</label>
                        <div className="relative">
                            <Dog size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                                type="text" 
                                required
                                value={formData.petName}
                                onChange={e => setFormData({...formData, petName: e.target.value})}
                                placeholder="뽀삐"
                                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" 
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 ml-1">연락처</label>
                    <div className="relative">
                        <Smartphone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="tel" 
                            value={formData.phoneNumber}
                            onChange={e => setFormData({...formData, phoneNumber: e.target.value})}
                            placeholder="010-0000-0000"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all" 
                        />
                    </div>
                </div>

                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 ml-1">방문 목적 / 증상</label>
                    <div className="relative">
                        <FileText size={16} className="absolute left-3.5 top-4 text-slate-400" />
                        <textarea 
                            rows={3}
                            value={formData.symptoms}
                            onChange={e => setFormData({...formData, symptoms: e.target.value})}
                            placeholder="예: 구토 증상, 예방 접종 등"
                            className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all resize-none" 
                        />
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <button 
                type="submit"
                className={`w-full py-4 rounded-xl text-white font-bold text-base shadow-xl flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-95 ${
                    source === 'walk-in' ? 'bg-emerald-500 shadow-emerald-200 hover:bg-emerald-600' : 'bg-orange-500 shadow-orange-200 hover:bg-orange-600'
                }`}
            >
                <Check size={20} strokeWidth={3} />
                {source === 'walk-in' ? '현장 접수 완료' : '전화 예약 등록'} ({selectedServices.length}건)
            </button>

        </form>
      </div>
    </div>
  );
};

export default QuickAddModal;
