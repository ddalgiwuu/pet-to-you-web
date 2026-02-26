
import React, { useState, useEffect } from 'react';
import { Search, Send, Paperclip, MoreVertical, Phone, Video, Layers, Stethoscope, Scissors, Home } from 'lucide-react';
import { ChatThread, Message, ServiceType } from '../types';

interface MessagesProps {
    activeServices?: ServiceType[];
    globalFilter?: ServiceType | 'all'; // New Prop
}

const THREADS: ChatThread[] = [
    { id: '1', user: '김민지 (두부 보호자)', lastMessage: '네, 알겠습니다. 내일 방문할게요!', time: '방금 전', unread: 2, avatar: 'https://picsum.photos/id/1025/100/100', status: 'online', serviceType: 'hospital' },
    { id: '2', user: '이서준 (루비 보호자)', lastMessage: '혹시 사료 변경 관련해서 문의드려도 될까요?', time: '10분 전', unread: 0, avatar: 'https://picsum.photos/id/1062/100/100', status: 'offline', serviceType: 'hospital' },
    { id: '3', user: '박지영 (코코 보호자)', lastMessage: '약은 식후에 먹이면 되나요?', time: '1시간 전', unread: 0, avatar: 'https://picsum.photos/id/237/100/100', status: 'online', serviceType: 'hospital' },
    { id: '4', user: '최현우 (몽이 보호자)', lastMessage: '미용 스타일 사진 보냈습니다.', time: '어제', unread: 1, avatar: 'https://picsum.photos/id/1003/100/100', status: 'offline', serviceType: 'grooming' },
    { id: '5', user: '정우성 (맥스 보호자)', lastMessage: '호텔링 중 특이사항 없나요?', time: '어제', unread: 0, avatar: 'https://picsum.photos/id/1022/100/100', status: 'online', serviceType: 'hotel' },
];

const MOCK_MESSAGES: Message[] = [
    { id: '1', sender: '김민지 (두부 보호자)', content: '안녕하세요! 두부 수술 부위가 조금 부은 것 같아서요.', time: '오전 10:30', isMe: false, avatar: 'https://picsum.photos/id/1025/100/100' },
    { id: '2', sender: 'Me', content: '안녕하세요 보호자님. 사진을 찍어서 보내주실 수 있나요?', time: '오전 10:32', isMe: true },
    { id: '3', sender: '김민지 (두부 보호자)', content: '네 잠시만요!', time: '오전 10:33', isMe: false, avatar: 'https://picsum.photos/id/1025/100/100' },
    { id: '4', sender: '김민지 (두부 보호자)', content: '(사진 전송됨)', time: '오전 10:34', isMe: false, avatar: 'https://picsum.photos/id/1025/100/100' },
    { id: '5', sender: 'Me', content: '확인했습니다. 크게 걱정하실 정도는 아니네요. 내일 내원하셔서 소독 한번 받으시면 좋겠습니다.', time: '오전 10:35', isMe: true },
    { id: '6', sender: '김민지 (두부 보호자)', content: '네, 알겠습니다. 내일 방문할게요!', time: '오전 10:36', isMe: false, avatar: 'https://picsum.photos/id/1025/100/100' },
];

const Messages: React.FC<MessagesProps> = ({ activeServices = ['hospital', 'grooming', 'hotel'], globalFilter = 'all' }) => {
    const [selectedThread, setSelectedThread] = useState<string | null>(null);
    const [currentService, setCurrentService] = useState<ServiceType | 'all'>('all');

    // Sync with Global Master Switch
    useEffect(() => {
        setCurrentService(globalFilter);
    }, [globalFilter]);

    // Filter threads
    const filteredThreads = THREADS.filter(thread => 
        currentService === 'all' 
        ? activeServices.includes(thread.serviceType) 
        : thread.serviceType === currentService
    );

    // Auto-select first thread if selection is invalid after filter
    useEffect(() => {
        if (!selectedThread && filteredThreads.length > 0) {
            setSelectedThread(filteredThreads[0].id);
        } else if (selectedThread && !filteredThreads.find(t => t.id === selectedThread)) {
            setSelectedThread(filteredThreads.length > 0 ? filteredThreads[0].id : null);
        }
    }, [filteredThreads, selectedThread]);

    const activeThread = THREADS.find(t => t.id === selectedThread);

    return (
        <div className="flex h-[calc(100vh-140px)] gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Thread List */}
            <div className="w-80 glass-panel rounded-3xl p-4 flex flex-col bg-white border border-slate-100/60">
                <div className="p-2 mb-2">
                    {/* Service Tabs (Mini) - LOCAL override */}
                    {activeServices.length > 1 && (
                        <div className="flex gap-1 mb-3 overflow-x-auto pb-1 scrollbar-hide">
                            <button onClick={() => setCurrentService('all')} className={`p-2 rounded-lg transition-all ${currentService === 'all' ? 'bg-slate-100 text-slate-800 font-bold' : 'text-slate-400 hover:bg-slate-50'}`} title="전체"><Layers size={14} /></button>
                            {activeServices.includes('hospital') && (
                                <button onClick={() => setCurrentService('hospital')} className={`p-2 rounded-lg transition-all ${currentService === 'hospital' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-400 hover:bg-slate-50'}`} title="병원"><Stethoscope size={14} /></button>
                            )}
                            {activeServices.includes('grooming') && (
                                <button onClick={() => setCurrentService('grooming')} className={`p-2 rounded-lg transition-all ${currentService === 'grooming' ? 'bg-pink-50 text-pink-600 font-bold' : 'text-slate-400 hover:bg-slate-50'}`} title="미용"><Scissors size={14} /></button>
                            )}
                             {activeServices.includes('hotel') && (
                                <button onClick={() => setCurrentService('hotel')} className={`p-2 rounded-lg transition-all ${currentService === 'hotel' ? 'bg-orange-50 text-orange-600 font-bold' : 'text-slate-400 hover:bg-slate-50'}`} title="호텔"><Home size={14} /></button>
                            )}
                        </div>
                    )}

                    <div className="bg-slate-50 rounded-xl px-4 py-2.5 flex items-center gap-2 border border-slate-100 focus-within:border-indigo-200 transition-colors">
                        <Search size={16} className="text-slate-400" />
                        <input type="text" placeholder="검색..." className="bg-transparent border-none outline-none text-xs w-full text-slate-700" />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                    {filteredThreads.map(thread => (
                        <div 
                            key={thread.id} 
                            onClick={() => setSelectedThread(thread.id)}
                            className={`p-3 rounded-2xl cursor-pointer transition-all duration-200 flex gap-3 border ${
                                selectedThread === thread.id 
                                ? 'bg-slate-900 text-white shadow-lg shadow-slate-200 border-slate-900' 
                                : 'hover:bg-slate-50 text-slate-800 bg-white border-transparent'
                            }`}
                        >
                            <div className="relative">
                                <img src={thread.avatar} alt="" className="w-10 h-10 rounded-full object-cover" />
                                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                                    thread.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'
                                }`}></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-baseline mb-0.5">
                                    <span className="text-xs font-bold truncate">{thread.user}</span>
                                    <span className={`text-[10px] ${selectedThread === thread.id ? 'text-slate-400' : 'text-slate-400'}`}>{thread.time}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <p className={`text-[11px] truncate ${selectedThread === thread.id ? 'text-slate-300' : 'text-slate-500'}`}>
                                        {thread.lastMessage}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        {thread.serviceType === 'grooming' && <div className="w-1.5 h-1.5 rounded-full bg-pink-400"></div>}
                                        {thread.serviceType === 'hotel' && <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>}
                                        {thread.unread > 0 && (
                                            <span className="min-w-[16px] h-4 bg-rose-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1">
                                                {thread.unread}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredThreads.length === 0 && (
                        <div className="text-center py-10 text-slate-400 text-xs">
                            메시지가 없습니다.
                        </div>
                    )}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 glass-panel rounded-3xl flex flex-col bg-white overflow-hidden shadow-xl shadow-slate-200/20">
                {activeThread ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-20 border-b border-slate-100 flex items-center justify-between px-6 bg-white/50 backdrop-blur-md sticky top-0">
                            <div className="flex items-center gap-3">
                                <img src={activeThread.avatar} className="w-10 h-10 rounded-full object-cover shadow-sm" alt="" />
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                                        {activeThread.user}
                                        {activeThread.serviceType === 'hospital' && <span className="bg-indigo-50 text-indigo-600 text-[10px] px-1.5 py-0.5 rounded font-bold">병원</span>}
                                        {activeThread.serviceType === 'grooming' && <span className="bg-pink-50 text-pink-600 text-[10px] px-1.5 py-0.5 rounded font-bold">미용</span>}
                                        {activeThread.serviceType === 'hotel' && <span className="bg-orange-50 text-orange-600 text-[10px] px-1.5 py-0.5 rounded font-bold">호텔</span>}
                                    </h3>
                                    <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
                                        <span className={`w-1.5 h-1.5 rounded-full ${activeThread.status === 'online' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span> 
                                        {activeThread.status === 'online' ? 'Online' : 'Offline'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><Phone size={18} /></button>
                                <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><Video size={18} /></button>
                                <button className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"><MoreVertical size={18} /></button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/30">
                            {/* Mocking generic message content for demo, in real app filtered by thread ID */}
                            {MOCK_MESSAGES.map(msg => (
                                <div key={msg.id} className={`flex gap-3 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                                    {!msg.isMe && (
                                        <img src={msg.avatar} className="w-8 h-8 rounded-full object-cover self-end mb-1" alt="" />
                                    )}
                                    <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                                        <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                                            msg.isMe 
                                            ? 'bg-slate-900 text-white rounded-br-none' 
                                            : 'bg-white text-slate-700 border border-slate-100 rounded-bl-none'
                                        }`}>
                                            {msg.content}
                                        </div>
                                        <span className="text-[10px] text-slate-400 mt-1 font-medium px-1">{msg.time}</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-slate-100">
                            <div className="bg-slate-50 rounded-2xl px-2 py-2 flex items-center gap-2 border border-slate-200 focus-within:border-indigo-300 transition-all">
                                <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-colors">
                                    <Paperclip size={18} />
                                </button>
                                <input 
                                    type="text" 
                                    placeholder="메시지를 입력하세요..." 
                                    className="flex-1 bg-transparent border-none outline-none text-sm text-slate-800 placeholder:text-slate-400" 
                                />
                                <button className="p-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-200 transition-all active:scale-95">
                                    <Send size={16} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center h-full text-slate-300">
                        <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                            <Layers size={32} />
                        </div>
                        <p className="text-sm font-medium">대화 상대를 선택해주세요.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Messages;
