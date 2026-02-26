
import React, { useState } from 'react';
import { Lock, User, ArrowRight, ShieldCheck, Mail, Eye, EyeOff, Check } from 'lucide-react';

interface LoginProps {
    onLogin: (email: string, password: string) => Promise<void>;
    error?: string;
    onEnterKiosk?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin, error, onEnterKiosk }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [keepLoggedIn, setKeepLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onLogin(email, password);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex w-full bg-white font-sans">
            {/* Left Side - Image & Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
                {/* Background Image - Scale animation for liveliness */}
                <img 
                    src="https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=1262" 
                    alt="Golden Retriever" 
                    className="absolute inset-0 w-full h-full object-cover opacity-95 transition-transform duration-[30s] hover:scale-110"
                />
                
                {/* Gradient Overlay: Darker at bottom for text readability, clear in center/top for image visibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Content Container - Spread content to Top and Bottom */}
                <div className="relative z-10 w-full h-full flex flex-col justify-between p-12 xl:p-16">
                    
                    {/* Top Left: Logo */}
                    <div className="flex items-center gap-3 animate-in fade-in slide-in-from-top-4 duration-1000">
                        <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/20 shadow-lg">
                            <span className="font-black text-xl">P</span>
                        </div>
                        <span className="text-2xl font-bold text-white tracking-tight drop-shadow-md">Pet to You</span>
                    </div>

                    {/* Bottom Left: Main Text */}
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                        <h1 className="text-5xl xl:text-6xl font-extrabold text-white leading-tight drop-shadow-xl">
                            모든 반려동물과<br/>
                            병원을 잇다
                        </h1>
                        <div className="h-1 w-20 bg-indigo-500 rounded-full"></div>
                        <p className="text-slate-200 text-lg font-medium max-w-md leading-relaxed drop-shadow-md">
                            스마트한 병원 관리와 반려동물 케어를 위한<br className="hidden xl:block"/> 
                            프리미엄 솔루션, 지금 시작하세요.
                        </p>
                        <div className="text-[10px] text-slate-400 font-medium pt-4">
                            © 2024 Pet to You Inc. All rights reserved.
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16 bg-white relative">
                <div className="w-full max-w-[440px] space-y-8 animate-in fade-in slide-in-from-right-8 duration-700">
                    
                    {/* Header */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 mb-2 lg:hidden">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-md">
                                <span className="font-bold">P</span>
                            </div>
                            <span className="text-lg font-bold text-indigo-900">Pet to You</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                            반가워요!<br/>
                            다시 로그인해주세요
                        </h2>
                        <p className="text-slate-500 text-sm font-medium">
                            계정 정보를 입력하여 대시보드에 접속하세요.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* ID Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 ml-1">이메일 (ID)</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                    <Mail size={18} />
                                </div>
                                <input
                                    type="email"
                                    name="email"
                                    autoComplete="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-4 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm font-medium shadow-sm"
                                    placeholder="user@example.com"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700 ml-1">비밀번호</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                    <Lock size={18} />
                                </div>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    name="password"
                                    autoComplete="current-password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 pl-11 pr-12 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 transition-all text-sm font-medium shadow-sm"
                                    placeholder="••••••••"
                                />
                                <button 
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        {/* Options */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${keepLoggedIn ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300 group-hover:border-indigo-400'}`}>
                                    {keepLoggedIn && <Check size={12} className="text-white" strokeWidth={4} />}
                                </div>
                                <input type="checkbox" className="hidden" checked={keepLoggedIn} onChange={() => setKeepLoggedIn(!keepLoggedIn)} />
                                <span className="text-xs font-medium text-slate-500 group-hover:text-slate-700 transition-colors">로그인 상태 유지</span>
                            </label>
                            <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:underline">
                                비밀번호를 잊으셨나요?
                            </button>
                        </div>

                        {error && (
                            <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-500 text-xs font-bold text-center animate-in fade-in slide-in-from-top-1 flex items-center justify-center gap-2">
                                <ShieldCheck size={14} /> {error}
                            </div>
                        )}

                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all transform active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            {isLoading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                "로그인"
                            )}
                        </button>
                    </form>

                    {/* Kiosk Mode Button */}
                    <button 
                        type="button"
                        onClick={onEnterKiosk}
                        className="w-full mt-4 py-4 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                    >
                        <span className="bg-white/20 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider">Reception</span>
                        키오스크 모드 (접수용)
                    </button>

                    {/* Social Login Divider */}
                    <div className="relative flex items-center py-2 mt-4">
                        <div className="flex-grow border-t border-slate-100"></div>
                        <span className="flex-shrink-0 mx-4 text-[10px] text-slate-400 font-bold uppercase tracking-wider">또는 소셜 계정으로 로그인</span>
                        <div className="flex-grow border-t border-slate-100"></div>
                    </div>

                    {/* Social Buttons */}
                    <div className="grid grid-cols-2 gap-3">
                        <button className="flex items-center justify-center gap-2 py-3 bg-[#FEE500] hover:bg-[#FDD835] text-[#3c1e1e] rounded-xl text-sm font-bold transition-colors shadow-sm hover:shadow-md">
                            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M12 3C5.9 3 1 6.9 1 11.8c0 3.2 2.1 6 5.3 7.6-.1.6-.4 2.1-.4 2.2 0 0-.1.2.1.3.2.1.4 0 .5-.1.4-.3 3.9-2.6 4.6-3 .3.1.6.1.9.1 6.1 0 11-3.9 11-8.8S19.1 3 12 3z"/></svg>
                            Kakao
                        </button>
                        <button className="flex items-center justify-center gap-2 py-3 bg-[#03C75A] hover:bg-[#02b351] text-white rounded-xl text-sm font-bold transition-colors shadow-sm hover:shadow-md">
                            <span className="font-black text-lg leading-none">N</span> Naver
                        </button>
                    </div>

                    {/* Sign Up Link */}
                    <div className="text-center mt-6 pt-4">
                        <p className="text-xs text-slate-500 font-medium">
                            아직 계정이 없으신가요? <button className="text-indigo-600 font-bold hover:underline">회원가입하기</button>
                        </p>
                    </div>

                    {/* Demo Hint */}
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 text-center mt-8">
                        <p className="text-[10px] text-slate-400 font-bold mb-1 uppercase tracking-wider">Demo Account</p>
                        <div className="text-xs text-slate-500 font-mono space-y-0.5">
                            <p>admin@pet-hospital.com / Admin1234!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
