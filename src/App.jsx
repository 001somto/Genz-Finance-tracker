import './App.css'
import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import * as api from './api';

// --- GEN-Z COLORS ---
const GENZ_COLORS = {
    aqua: '#4AA8C6',
    purple: '#9A7DE6',
    pink: '#D77AA8',
    bgDark: '#0F1116',
    cardDark: '#20222A',
    borderDark: '#2F3138',
    textLight: '#E6E7EB',
    textDim: '#9AA0A8',
    shadow: '#4AA8C650',
    shadowHover: '#D77AA850', // Pink light shadow
};

const COLORS = [GENZ_COLORS.pink, GENZ_COLORS.purple, GENZ_COLORS.aqua, GENZ_COLORS.textDim, '#4ade80', '#ffffff'];

// --- STYLES & FONTS ---
const fontStyle = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700;900&display=swap');

/* --- Gen-Z Custom Colors --- */
.text-genz-aqua { color: ${GENZ_COLORS.aqua}; }
.bg-genz-aqua { background-color: ${GENZ_COLORS.aqua}; }
.border-genz-aqua { border-color: ${GENZ_COLORS.aqua}; }
.text-genz-purple { color: ${GENZ_COLORS.purple}; }
.bg-genz-purple { background-color: ${GENZ_COLORS.purple}; }
.border-genz-purple { border-color: ${GENZ_COLORS.purple}; }
.text-genz-pink { color: ${GENZ_COLORS.pink}; }
.bg-genz-pink { background-color: ${GENZ_COLORS.pink}; }
.border-genz-pink { border-color: ${GENZ_COLORS.pink}; }
.bg-genz-dark { background-color: ${GENZ_COLORS.bgDark}; }
.bg-genz-card { background-color: ${GENZ_COLORS.cardDark}; }
.border-genz-card { border-color: ${GENZ_COLORS.borderDark}; }
.shadow-genz-aqua { box-shadow: 0 0 40px ${GENZ_COLORS.shadow}; }
.shadow-genz-pink-brutalist { box-shadow: 8px 8px 0px 0px ${GENZ_COLORS.pink}; }
.shadow-genz-text { text-shadow: 0 0 5px ${GENZ_COLORS.aqua}; }
.shadow-genz-purple-brutalist { box-shadow: 4px 4px 0px 0px ${GENZ_COLORS.purple}; }


/* --- Base Styles and Scrollbar --- */
body {
    font-family: 'Inter', sans-serif;
    background-color: ${GENZ_COLORS.bgDark};
    color: ${GENZ_COLORS.textLight}; /* Default text color */
}

/* Custom Scrollbar */
::-webkit-scrollbar {
    width: 8px;
}
::-webkit-scrollbar-track {
    background: ${GENZ_COLORS.bgDark};
}
::-webkit-scrollbar-thumb {
    background: ${GENZ_COLORS.cardDark};
    border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
    background: ${GENZ_COLORS.pink};
}

/* Notification Animation */
@keyframes slide-down {
    from {
        transform: translate(-50%, -150%);
        opacity: 0;
    }
    to {
        transform: translate(-50%, 0);
        opacity: 1;
    }
}

.animate-slide-down {
    animation: slide-down 0.3s ease-out forwards;
}

/* Pop-in for centered notifications - Simplified to scale only */
@keyframes pop-in {
    from {
    transform: scale(0.9);
    opacity: 0;
}
    to {
    transform: scale(1);
    opacity: 1;
}
}

.animate-pop-in {
    animation: pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
}

/* NEW: Hero Specific Animations */
@keyframes hero-fade {
    from {
        transform: translateY(-20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.animate-hero-fade {
    animation: hero-fade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* FIX: Force Autofill background to match dark theme */
input:-webkit-autofill,
    input:-webkit-autofill:hover,
        input:-webkit-autofill:focus,
            input:-webkit-autofill:active{
    -webkit-box-shadow: 0 0 0 30px ${GENZ_COLORS.cardDark} inset!important;
    -webkit-text-fill-color: ${GENZ_COLORS.textLight} !important;
    caret-color: ${GENZ_COLORS.textLight} !important;
    transition: background-color 5000s ease-in-out 0s;
}
`;

// --- ICONS ---
const Icons = {
    Plus: () => <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>,
    Chart: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
    User: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
    Home: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
    Edit: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
    Trash: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    ArrowLeft: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
    Eye: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
    EyeOff: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L4.573 4.574m14.853 14.853l-2.356-2.356m2.356 2.356L22 22m-4.72-4.72A9.953 9.953 0 0021.542 12c-1.274-4.057-5.064-7-9.542-7-1.274 0-2.435.215-3.513.606m0 0l2.353 2.353" /></svg>,
    Spinner: () => <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>,
    ChevronLeft: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>,
    ChevronRight: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>,
    Lock: ({ size = 20, className = "" }) => (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    ),
};

// --- MINI CALENDAR COMPONENT ---
const MiniCalendar = ({ startDate, endDate, onSelectRange, accentColor = 'genz-aqua' }) => {
    const [viewDate, setViewDate] = useState(new Date(startDate || new Date()));

    // Shorter month names for mobile
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

    const prevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    const nextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

    const month = viewDate.getMonth();
    const year = viewDate.getFullYear();
    const totalDays = daysInMonth(month, year);
    const startDay = firstDayOfMonth(month, year);

    const days = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= totalDays; i++) days.push(i);

    const handleDayClick = (day) => {
        if (!day) return;
        const clickedDateStr = new Date(year, month, day).toISOString().split('T')[0];

        if (!startDate || clickedDateStr < startDate || (startDate && endDate)) {
            onSelectRange(clickedDateStr, null);
        } else if (clickedDateStr === startDate) {
            onSelectRange(null, null);
        } else {
            onSelectRange(startDate, clickedDateStr);
        }
    };

    const isStart = (day) => {
        if (!day) return false;
        const dStr = new Date(year, month, day).toISOString().split('T')[0];
        return dStr === startDate;
    };

    const isEnd = (day) => {
        if (!day) return false;
        const dStr = new Date(year, month, day).toISOString().split('T')[0];
        return dStr === endDate;
    };

    const isInRange = (day) => {
        if (!day || !startDate || !endDate) return false;
        const dStr = new Date(year, month, day).toISOString().split('T')[0];
        return dStr > startDate && dStr < endDate;
    };

    return (
        <div className="bg-genz-dark rounded-xl p-3 border border-genz-borderDark shadow-inner">
            <div className="flex justify-between items-center mb-3">
                <button type="button" onClick={prevMonth} className="p-1 hover:bg-genz-borderDark rounded-lg text-white transition-colors">
                    <Icons.ChevronLeft />
                </button>
                <span className="font-bold text-white text-[10px] uppercase tracking-widest">
                    {monthNames[month]} {year}
                </span>
                <button type="button" onClick={nextMonth} className="p-1 hover:bg-genz-borderDark rounded-lg text-white transition-colors">
                    <Icons.ChevronRight />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-1">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <span key={`${d}-${i}`} className="text-[9px] font-black text-genz-textDim">{d}</span>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-0.5">
                {days.map((day, idx) => {
                    const active = isStart(day) || isEnd(day);
                    const range = isInRange(day);

                    return (
                        <button
                            key={idx}
                            type="button"
                            disabled={!day}
                            onClick={() => handleDayClick(day)}
                            className={`
                                aspect-square text-[9px] font-bold rounded-lg transition-all flex items-center justify-center
                                ${!day ? 'invisible' : ''}
                                ${active ? `bg-${accentColor} text-white scale-105 shadow-md shadow-${accentColor}/40 z-10` :
                                    range ? `bg-${accentColor}/20 text-${accentColor}` : 'text-genz-textDim hover:bg-genz-borderDark hover:text-white'
                                }
                            `}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

// CATEGORIES
const EXPENSE_CATEGORIES = [
    { name: 'Snacks', emoji: '🍿' },
    { name: 'Food', emoji: '🍕' },
    { name: 'Groceries', emoji: '🛒' },
    { name: 'Travel', emoji: '✈️' },
    { name: 'Entertainment', emoji: '🎟️' },
    { name: 'Commute', emoji: '🚌' },
    { name: 'Subscription', emoji: '📱' },
    { name: 'Airtime', emoji: '📞' },
    { name: 'Shopping', emoji: '🛍️' },
    { name: 'Utilities', emoji: '💡' },
    { name: 'Healthcare', emoji: '🏥' },
    { name: 'Debt', emoji: '💳' },
    { name: 'Tax', emoji: '💸' },
    { name: 'Gift', emoji: '🎁' },
    { name: 'Cash Withdrawal', emoji: '🏧' },
    { name: 'Misc', emoji: '📦' },
];

const INCOME_CATEGORIES = [
    { name: 'Salary', emoji: '💰' },
    { name: 'Freelance', emoji: '💼' },
    { name: 'Investments', emoji: '📈' },
    { name: 'Assets', emoji: '💎' },
    { name: 'Gift', emoji: '🎁' },
    { name: 'Pension', emoji: '🏦' },
    { name: 'Other', emoji: '💰' },
];

// ACHIEVEMENTS
const ACHIEVEMENTS = [
    {
        id: 'starter',
        icon: '🌟',
        title: 'Starter',
        subtitle: 'First Step',
        bgGradient: 'from-yellow-500/20 to-orange-500/20',
        borderColor: 'border-yellow-500/30',
        badgeBg: 'bg-yellow-500/20',
        badgeText: 'text-yellow-300',
        description: 'Welcome to SpendSave! You took your first step towards financial freedom.',
        howToUnlock: 'Add your first transaction to unlock this achievement.',
    },
    {
        id: 'night_owl',
        icon: '🦉',
        title: 'Night Owl',
        subtitle: 'Late Spender',
        bgGradient: 'from-indigo-500/20 to-purple-500/20',
        borderColor: 'border-indigo-500/30',
        badgeBg: 'bg-indigo-500/20',
        badgeText: 'text-indigo-300',
        description: 'You logged a transaction after 10 PM. Burning the midnight oil?',
        howToUnlock: 'Log a transaction after 10:00 PM to unlock this achievement.',
    },
    {
        id: 'big_spender',
        icon: '💸',
        title: 'Whale',
        subtitle: 'Big Spender',
        bgGradient: 'from-pink-500/20 to-rose-500/20',
        borderColor: 'border-pink-500/30',
        badgeBg: 'bg-pink-500/20',
        badgeText: 'text-pink-300',
        description: 'You made a single expense of ₦50,000 or more. That\'s a big move!',
        howToUnlock: 'Log an expense of ₦50,000 or more in one transaction.',
    },
    {
        id: 'penny_pincher',
        icon: '🪙',
        title: 'Thrifty',
        subtitle: 'Penny Pincher',
        bgGradient: 'from-blue-500/20 to-cyan-500/20',
        borderColor: 'border-cyan-500/30',
        badgeBg: 'bg-cyan-500/20',
        badgeText: 'text-cyan-300',
        description: 'You logged an expense under ₦1,000. Every naira counts!',
        howToUnlock: 'Log an expense less than ₦1,000 to unlock this achievement.',
    },
    {
        id: 'goal_crusher',
        icon: '💎',
        title: 'Rich',
        subtitle: 'Goal Crusher',
        bgGradient: 'from-green-500/20 to-emerald-500/20',
        borderColor: 'border-green-500/30',
        badgeBg: 'bg-green-500/20',
        badgeText: 'text-green-300',
        description: 'You reached one of your savings goals. Keep crushing it!',
        howToUnlock: 'Set a savings goal and reach it by logging income transactions.',
    },
    {
        id: 'dedicated',
        icon: '🗓️',
        title: 'Dedicated',
        subtitle: '30 Days Active',
        bgGradient: 'from-purple-500/20 to-fuchsia-500/20',
        borderColor: 'border-purple-500/30',
        badgeBg: 'bg-purple-500/20',
        badgeText: 'text-purple-300',
        description: 'You\'ve been active for 30 unique days! Your consistency is impressive.',
        howToUnlock: 'Log transactions on 30 different days to unlock this achievement.',
    },
    {
        id: 'budget_master',
        icon: '🎯',
        title: 'Budget Master',
        subtitle: 'On Track',
        bgGradient: 'from-amber-500/20 to-yellow-500/20',
        borderColor: 'border-amber-500/30',
        badgeBg: 'bg-amber-500/20',
        badgeText: 'text-amber-300',
        description: 'You stayed within your budget target! Financial discipline at its finest.',
        howToUnlock: 'Set a budget target and keep your spending below it.',
    },
    {
        id: 'level_5',
        icon: '👑',
        title: 'Locked',
        subtitle: 'Level 5',
        bgGradient: 'from-black/20 to-black/20',
        borderColor: 'border-white/5',
        badgeBg: 'bg-white/10',
        badgeText: 'text-genz-textDim',
        description: 'Reach Level 5 to unlock this exclusive achievement!',
        howToUnlock: 'Earn enough XP to reach Level 5.',
    },
];

// --- CategoryLegend for Analytics (Compact 2-column for all devices) ---
const CategoryLegend = ({ data, highlightName }) => (
    <div className="mt-8 grid grid-cols-2 gap-x-2 gap-y-3 text-[11px] sm:text-sm">
        {data.map((entry, index) => (
            <div
                key={`legend - ${index} `}
                className={`flex items - center gap - 1.5 transition - all overflow - hidden ${entry.name === highlightName ? 'bg-genz-dark/50 p-1.5 rounded-xl border border-genz-pink/50 shadow-lg' : ''} `}
            >
                <div
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-genz-textDim flex-shrink-0">{entry.emoji}</span>
                <span className={`font - medium flex - 1 truncate ${entry.name === highlightName ? 'text-genz-pink' : 'text-genz-textLight'} `}>
                    {entry.name}
                </span>
                <span className="text-genz-textDim font-mono text-[10px] flex-shrink-0 ml-auto">
                    ₦{entry.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
            </div>
        ))}
    </div>
);


// --- CONFETTI COMPONENT ---
const Confetti = () => {
    const colors = ['#a855f7', '#ec4899', '#22d3ee', '#fbbf24', '#34d399'];
    return (
        <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden flex justify-center">
            {Array.from({ length: 50 }).map((_, i) => (
                <div
                    key={i}
                    className="absolute top-[-20px] animate-fall"
                    style={{
                        left: `${Math.random() * 100} vw`,
                        animationDuration: `${Math.random() * 3 + 2} s`,
                        animationDelay: `${Math.random() * 2} s`,
                        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                        width: `${Math.random() * 10 + 5} px`,
                        height: `${Math.random() * 10 + 5} px`,
                        transform: `rotate(${Math.random() * 360}deg)`,
                    }}
                />
            ))}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl animate-bounce duration-1000">
                🎉
            </div>
        </div>
    );
};

// --- CUSTOM NOTIFICATION COMPONENT ---
const Notification = ({ message, type = 'info', onClose }) => {
    const typeStyles = {
        success: 'bg-genz-card/90 border-emerald-500/50 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.1)]',
        error: 'bg-genz-card/90 border-rose-500/50 text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.1)]',
        warning: 'bg-genz-card/90 border-amber-500/50 text-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.1)]',
        info: 'bg-genz-card/90 border-indigo-500/50 text-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.1)]',
    };

    const icons = {
        success: '✨',
        error: '🚨',
        warning: '⚠️',
        info: '💡',
    };

    return (
        <div className="fixed inset-0 flex items-start justify-center p-6 z-[250] pointer-events-none">
            <div className={`${typeStyles[type]} pointer-events-auto rounded-2xl px-6 py-4 border-2 flex items-center gap-3 w-full max-w-[320px] backdrop-blur-sm animate-slide-down`}>
                <span className="text-2xl">{icons[type]}</span>
                <p className="font-bold text-sm flex-1 whitespace-pre-line drop-shadow-sm">{message}</p>
                <button
                    onClick={onClose}
                    className="opacity-80 hover:opacity-100 font-bold text-xl leading-none transition-colors"
                >
                    ×
                </button>
            </div>
        </div>
    );
};

// --- HOMEPAGE COMPONENT ---
const Homepage = ({ onStart }) => {
    const features = [
        {
            title: 'Smart Budgeting',
            desc: 'Set daily limits and stay on track. Never lose control of your money again.',
            emoji: '🎯',
            color: 'bg-genz-purple/20 border-genz-purple/40'
        },
        {
            title: 'Visual Analytics',
            desc: 'See exactly where your money goes with clean, easy-to-read charts.',
            emoji: '📊',
            color: 'bg-genz-aqua/20 border-genz-aqua/40'
        },
        {
            title: 'Fast Transaction',
            desc: 'Easily log transactions in seconds with our optimized flow.',
            emoji: '⚡',
            color: 'bg-genz-purple/20 border-genz-purple/40'
        },
        {
            title: 'Savings Goals',
            desc: 'Track your progress and reach your milestones faster with style.',
            emoji: '✨',
            color: 'bg-genz-pink/20 border-genz-pink/40'
        },
    ];

    return (
        <div className="min-h-screen bg-genz-dark overflow-x-hidden text-genz-textLight flex flex-col items-center relative font-sans">
            {/* Grid Background Overlay */}
            <div
                className="fixed inset-0 pointer-events-none opacity-10"
                style={{
                    backgroundImage: 'radial-gradient(rgba(255,255,255,0.2) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            ></div>

            {/* Color Glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-genz-aqua/10 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-genz-purple/10 rounded-full blur-[100px]"></div>
            </div>

            <main className="relative z-10 flex flex-col items-center text-center w-full max-w-5xl pt-10 lg:pt-24 px-6 pb-24">
                {/* 1. Branding - Increased Size */}
                <div className="text-5xl lg:text-7xl font-black tracking-tighter mb-4 lg:mb-6 animate-hero-fade uppercase shadow-genz-text">
                    SPEND<span className="text-genz-pink">SAVE</span>
                </div>

                {/* 2. Hero Headlines - Strictly aligned under branding */}
                <div className="animate-hero-fade mb-10 lg:mb-16" style={{ animationDelay: '0.2s' }}>
                    <h1 className="font-serif font-black leading-tight tracking-tight flex flex-col items-center">
                        {/* 2a. Track expenses - Reduced Size */}
                        <span className="text-xl sm:text-4xl lg:text-6xl text-white">
                            Track transactions.
                        </span>
                        {/* 2b. Second Headline - Refined spacing, size, and white color */}
                        <span className="text-base sm:text-2xl lg:text-4xl text-white mt-3 lg:mt-5 opacity-90">
                            Where every transaction tells a story.
                        </span>
                    </h1>
                    <p className="text-genz-textDim text-base lg:text-2xl max-w-2xl mx-auto font-medium px-4 mt-6 lg:mt-10 opacity-80 serif italic leading-relaxed">
                        The futuristic transaction tracker that helps Gen-Z take control of their finances with style.
                    </p>
                </div>

                {/* 3. Primary Action Section */}
                <div className="flex flex-col items-center w-full animate-hero-fade px-4 mb-20 lg:mb-32" style={{ animationDelay: '0.4s' }}>
                    <button
                        onClick={onStart}
                        className="w-full sm:w-auto px-12 py-5 lg:px-16 lg:py-6 bg-genz-purple text-black font-black uppercase tracking-widest rounded-3xl shadow-genz-purple-brutalist hover:translate-y-1 hover:shadow-none transition-all text-lg lg:text-xl"
                    >
                        LET'S GET STARTED 🚀
                    </button>
                </div>

                {/* 4. Features Section - Final Element */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 w-full animate-hero-fade" style={{ animationDelay: '0.6s' }}>
                    {features.map((f, i) => (
                        <div
                            key={i}
                            className={`${f.color} backdrop - blur - md border p - 8 lg: p - 10 rounded - [2rem] lg: rounded - [2.5rem] group hover: scale - [1.02] transition - all flex flex - col items - center`}
                        >
                            <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl flex items-center justify-center text-2xl lg:text-3xl mb-6 lg:mb-8 bg-black/40 group-hover:rotate-6 transition-transform shadow-lg">
                                {f.emoji}
                            </div>
                            <h3 className="text-xl lg:text-2xl font-black mb-3 lg:mb-4 group-hover:text-genz-aqua transition-colors">{f.title}</h3>
                            <p className="text-genz-textDim text-sm lg:text-base font-medium leading-relaxed">
                                {f.desc}
                            </p>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
};

const App = () => {
    const [currentPage, setCurrentPage] = useState('home');
    const [user, setUser] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [activeIncomeCategory, setActiveIncomeCategory] = useState(null); // NEW: Track hovered/clicked category
    const [activeExpenseCategory, setActiveExpenseCategory] = useState(null); // NEW: Track hovered/clicked category
    // NEW STATE: Period toggle for Line Chart
    const [timePeriod, setTimePeriod] = useState('weekly');

    // --- BUDGETS STATE ---
    const [budgets, setBudgets] = useState([]);
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [budgetCategory, setBudgetCategory] = useState('');
    const [budgetAmount, setBudgetAmount] = useState('');
    const [budgetPeriod, setBudgetPeriod] = useState('weekly'); // 'weekly' or 'monthly'
    const [budgetStartDate, setBudgetStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [budgetEndDate, setBudgetEndDate] = useState(() => {
        const d = new Date();
        d.setDate(d.getDate() + 7);
        return d.toISOString().split('T')[0];
    });
    const [showCalendar, setShowCalendar] = useState(false);

    // --- SAVINGS GOALS STATE ---
    const [savingsGoals, setSavingsGoals] = useState([]);
    const [showSavingsModal, setShowSavingsModal] = useState(false);
    const [savingsCategory, setSavingsCategory] = useState('');
    const [savingsAmount, setSavingsAmount] = useState('');
    const [savingsPeriod, setSavingsPeriod] = useState('monthly');
    const [savingsStartDate, setSavingsStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [savingsEndDate, setSavingsEndDate] = useState(() => {
        const d = new Date();
        return new Date(d.getFullYear(), d.getMonth() + 1, d.getDate()).toISOString().split('T')[0];
    });
    const [showSavingsCalendar, setShowSavingsCalendar] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);

    // --- ACHIEVEMENT MODAL STATE ---
    const [selectedAchievement, setSelectedAchievement] = useState(null);
    const [unlockedAchievements, setUnlockedAchievements] = useState([]);

    // --- NOTIFICATION STATE ---
    const [notification, setNotification] = useState(null);
    const notificationTimeoutRef = useRef(null);

    // Helper function to show notifications
    const showNotification = (message, type = 'info', duration = 3000) => {
        // Clear any existing timer to prevent flickering or early clearing
        if (notificationTimeoutRef.current) clearTimeout(notificationTimeoutRef.current);

        setNotification({ message, type });
        notificationTimeoutRef.current = setTimeout(() => {
            setNotification(null);
            notificationTimeoutRef.current = null;
        }, duration);
    };

    // Centralized API error handler
    // Centralized API error handler
    const handleApiError = (err, defaultMsg = 'Action failed') => {
        console.error('API Error:', err);
        showNotification(err.body?.message || err.message || defaultMsg, 'error', 4000);
    };

    // Auth state 
    const [authMode, setAuthMode] = useState('login');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Transaction form state
    const [transactionType, setTransactionType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [customCategory, setCustomCategory] = useState('');
    const [note, setNote] = useState('');
    const [isLoading, setIsLoading] = useState(false); // NEW: Loading state

    // GAMIFICATION STATE
    const [xp, setXp] = useState(0);
    const [showLevelUp, setShowLevelUp] = useState(false);
    const level = Math.floor(xp / 100) + 1;
    const xpForNextLevel = 100;
    const currentLevelProgress = xp % 100;

    const gainXp = (amount) => {
        const currentLevel = Math.floor(xp / 100) + 1;
        const newXp = xp + amount;
        const newLevel = Math.floor(newXp / 100) + 1;

        setXp(newXp);
        localStorage.setItem('spendsave_xp', newXp.toString());

        if (newLevel > currentLevel) {
            setShowLevelUp(true);
            setShowConfetti(true);
            setTimeout(() => {
                setShowLevelUp(false);
                setShowConfetti(false);
            }, 5000);
        }
    };

    // 1. Initial Session Load
    useEffect(() => {
        // Load XP
        const savedXp = localStorage.getItem('spendsave_xp');
        if (savedXp) setXp(parseInt(savedXp, 10));

        // Load Achievements
        const savedAchievements = localStorage.getItem('spendsave_achievements');
        if (savedAchievements) {
            try {
                setUnlockedAchievements(JSON.parse(savedAchievements));
            } catch (e) { console.error('Failed to parse achievements', e); }
        }

        const savedUser = sessionStorage.getItem('spendsave_user');
        const token = sessionStorage.getItem('spendsave_token');

        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
            setCurrentPage('dashboard');
        } else {
            // no token: clear any old local storage data
            localStorage.removeItem('spendsave_transactions');
        }
    }, []);

    // 2. Data Fetching (Whenever user state changes)
    useEffect(() => {
        if (!user) {
            setTransactions([]);
            setBudgets([]);
            setSavingsGoals([]);
            return;
        }

        const fetchData = async () => {
            try {
                // Fetch all in parallel for speed
                const [txs, fetchedBudgets, fetchedGoals] = await Promise.all([
                    api.getTransactions(),
                    api.getBudgets(),
                    api.getSavingsGoals()
                ]);

                // Normalize transactions
                const normalized = txs.map(t => ({
                    ...t,
                    id: t._id || t.id,
                }));

                setTransactions(normalized);
                setBudgets(fetchedBudgets);
                setSavingsGoals(fetchedGoals);
            } catch (err) {
                handleApiError(err, 'Failed to fetch data');
                // if token invalid, clear and force login
                if (err.status === 401) {
                    sessionStorage.removeItem('spendsave_token');
                    sessionStorage.removeItem('spendsave_user');
                    setUser(null);
                    setCurrentPage('login');
                }
            }
        };

        fetchData();
    }, [user]);

    // --- ACHIEVEMENT UNLOCK DETECTION ---
    useEffect(() => {
        // Check for newly unlocked achievements
        const currentlyUnlocked = ACHIEVEMENTS.filter(a => isAchievementUnlocked(a.id)).map(a => a.id);

        // Find newly unlocked achievements (not in previous list)
        const newlyUnlocked = currentlyUnlocked.filter(id => !unlockedAchievements.includes(id));

        if (newlyUnlocked.length > 0) {
            // Update the list of unlocked achievements and persist
            const nextUnlocked = [...unlockedAchievements, ...newlyUnlocked];
            setUnlockedAchievements(nextUnlocked);
            localStorage.setItem('spendsave_achievements', JSON.stringify(nextUnlocked));

            // Celebrate each newly unlocked achievement
            newlyUnlocked.forEach((achievementId, index) => {
                const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
                if (achievement) {
                    // Delay each celebration slightly if multiple unlocked at once
                    setTimeout(() => {
                        setShowConfetti(true);
                        setTimeout(() => setShowConfetti(false), 3000);

                        showNotification(
                            `🎉 Achievement Unlocked!\n\n${achievement.title} \n\n${achievement.description} `,
                            'success',
                            5000
                        );

                        // Award XP for unlocking achievement
                        gainXp(25);
                    }, index * 500);
                }
            });
        }
    }, [transactions, budgets, savingsGoals, level]); // Re-check when these change


    const handleAuth = async (e) => {
        e.preventDefault();
        // Login uses Email & Password
        if (authMode === 'login' && (!email || !password)) return;
        // Signup uses Email, Username, & Password
        if (authMode === 'signup') {
            if (!email || !username || !password) return;
            if (password.length < 8) {
                return showNotification('Password must be at least 8 characters long!', 'error');
            }
        }

        setIsLoading(true); // START LOADING
        try {
            let res;
            if (authMode === 'signup') {
                // SIGNUP uses email, username, and password
                res = await api.signup(email, username, password);
            } else {
                // LOGIN uses email and password
                res = await api.login(email, password);
            }

            console.log('Auth response:', res);
            if (!res || !res.token) {
                console.warn('No token returned from auth response', res);
            }

            // res: { token, user }
            if (res && res.token) {
                sessionStorage.setItem('spendsave_token', res.token);
            }
            // FIX: Ensure the user object being saved to storage/state contains username
            sessionStorage.setItem('spendsave_user', JSON.stringify(res.user));
            setUser(res.user);
            setCurrentPage('dashboard');

            if (authMode === 'signup') {
                showNotification(`Account Created ✨\nWelcome to SpendSave, ${res.user.username || 'User'} !`, 'success', 5000);
            } else {
                showNotification(`Welcome Back, ${res.user.username || 'User'} ! 👋`, 'success');
            }

            // Data will be fetched by the useEffect hook watching the 'user' state


        } catch (err) {
            handleApiError(err, 'Authentication failed');
        } finally {
            setIsLoading(false); // STOP LOADING
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('spendsave_token');
        sessionStorage.removeItem('spendsave_user');
        setUser(null);
        setCurrentPage('login');
    };

    // --- INACTIVITY TIMER ---
    useEffect(() => {
        const INACTIVITY_LIMIT = 15 * 60 * 1000; // 15 minutes
        let timeoutId;

        const resetTimer = () => {
            if (timeoutId) clearTimeout(timeoutId);
            if (user) { // Only run timer if user is logged in
                timeoutId = setTimeout(() => {
                    handleLogout();
                    showNotification("Logged out due to inactivity 💤", "info");
                }, INACTIVITY_LIMIT);
            }
        };

        // Listeners for user activity
        window.addEventListener('mousemove', resetTimer);
        window.addEventListener('keydown', resetTimer);
        window.addEventListener('click', resetTimer);
        window.addEventListener('scroll', resetTimer);

        // Init timer
        resetTimer();

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
            window.removeEventListener('mousemove', resetTimer);
            window.removeEventListener('keydown', resetTimer);
            window.removeEventListener('click', resetTimer);
            window.removeEventListener('scroll', resetTimer);
        };
    }, [user]); // Re-run when user logs in/out

    // --- BUDGET HANDLERS ---
    const handleAddBudget = async (e) => {
        e.preventDefault();
        if (!budgetCategory || !budgetAmount) return showNotification("Please select a category and amount!", 'warning');

        // CHECK FOR DUPLICATE TARGET
        if (budgets.some(b => b.category === budgetCategory)) {
            return showNotification(`⚠️ A target for "${budgetCategory}" already exists! Please delete the old one first.`, 'warning', 4000);
        }

        setIsLoading(true);
        try {
            const newBudget = await api.createBudget({
                category: budgetCategory,
                amount: parseFloat(budgetAmount),
                period: budgetPeriod,
                startDate: budgetStartDate,
                endDate: budgetEndDate
            });

            setBudgets([...budgets, newBudget]);
            setShowBudgetModal(false);
            setBudgetCategory('');
            setBudgetAmount('');
            setBudgetPeriod('weekly');
            setBudgetStartDate(new Date().toISOString().split('T')[0]);
            const nextWeek = new Date();
            nextWeek.setDate(nextWeek.getDate() + 7);
            setBudgetEndDate(nextWeek.toISOString().split('T')[0]);
            setShowCalendar(false);

            gainXp(50);
            const periodLabel = budgetPeriod.charAt(0).toUpperCase() + budgetPeriod.slice(1);
            showNotification(`${periodLabel} budget created! + 50 XP`, "success");
        } catch (err) {
            handleApiError(err, 'Failed to create budget');
        } finally {
            setIsLoading(false);
        }
    };

    const setBudgetRange = (start, end) => {
        setBudgetStartDate(start);
        setBudgetEndDate(end);
    };

    const setSavingsRange = (start, end) => {
        setSavingsStartDate(start);
        setSavingsEndDate(end);
    };

    const handleDeleteBudget = async (id) => {
        try {
            await api.deleteBudget(id);
            setBudgets(budgets.filter(b => (b._id || b.id) !== id));
            showNotification('Budget deleted', 'info');
        } catch (err) {
            handleApiError(err, 'Failed to delete budget');
        }
    };

    const calculateBudgetProgress = (category, budget) => {
        if (!budget) return 0;

        const now = new Date();
        const start = new Date(budget.startDate);
        let periodStart = start;
        let periodEnd = budget.endDate ? new Date(budget.endDate) : null;

        if (!periodEnd) {
            // Fallback to legacy recurring logic if no endDate
            if (budget.period === 'weekly') {
                const diffTime = Math.max(0, now - start);
                const weeksPassed = Math.floor(diffTime / (7 * 24 * 60 * 60 * 1000));
                periodStart = new Date(start.getTime() + (weeksPassed * 7 * 24 * 60 * 60 * 1000));
                periodEnd = new Date(periodStart.getTime() + (7 * 24 * 60 * 60 * 1000));
            } else {
                const startDay = start.getDate();
                periodStart = new Date(now.getFullYear(), now.getMonth(), startDay);
                if (now < periodStart) {
                    periodStart = new Date(now.getFullYear(), now.getMonth() - 1, startDay);
                }
                periodEnd = new Date(periodStart.getFullYear(), periodStart.getMonth() + 1, startDay);
            }
        }

        // Calculate total spent in this category within current period
        const spent = transactions
            .filter(t => {
                const txDate = new Date(t.createdAt);
                return t.type === 'expense' &&
                    t.category === category &&
                    txDate >= periodStart &&
                    txDate <= (periodEnd || now);
            })
            .reduce((sum, t) => sum + (t.amount || 0), 0);
        return spent;
    };

    // --- SAVINGS HANDLERS ---
    const handleAddSavingsGoal = async (e) => {
        e.preventDefault();
        if (!savingsCategory || !savingsAmount) return showNotification("Please select a category and amount!", 'warning');

        // CHECK FOR DUPLICATE GOAL
        if (savingsGoals.some(g => g.category === savingsCategory)) {
            return showNotification(`⚠️ A goal for "${savingsCategory}" already exists! Please delete the old one first.`, 'warning', 4000);
        }

        setIsLoading(true);
        try {
            const newGoal = {
                category: savingsCategory,
                amount: parseFloat(savingsAmount),
                period: savingsPeriod,
                startDate: savingsStartDate,
                endDate: savingsEndDate,
                emoji: INCOME_CATEGORIES.find(c => c.name === savingsCategory)?.emoji || '💰'
            };

            const savedGoal = await api.createSavingsGoal(newGoal);
            setSavingsGoals([...savingsGoals, savedGoal]);

            setShowSavingsModal(false);
            setSavingsCategory('');
            setSavingsAmount('');
            setSavingsPeriod('monthly');
            const now = new Date();
            const startStr = now.toISOString().split('T')[0];
            const endStr = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate()).toISOString().split('T')[0];
            setSavingsStartDate(startStr);
            setSavingsEndDate(endStr);
            setShowSavingsCalendar(false);

            gainXp(50); // +50 XP for creating a savings goal
            showNotification("Savings Goal created! +50 XP", "success");
        } catch (err) {
            console.error('Goal creation error:', err);
            showNotification("Failed to save goal. Try again!", "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteSavingsGoal = async (id) => {
        try {
            await api.deleteSavingsGoal(id);
            setSavingsGoals(savingsGoals.filter(g => (g._id || g.id) !== id));
            showNotification("Goal deleted!", "info");
        } catch (err) {
            console.error('Goal deletion error:', err);
            showNotification("Failed to delete goal.", "error");
        }
    };

    const calculateSavingsProgress = (category, goal) => {
        if (!goal) return 0;
        const start = goal.startDate ? new Date(goal.startDate) : new Date(0);
        const end = goal.endDate ? new Date(goal.endDate) : new Date();

        return transactions
            .filter(t => {
                const txDate = new Date(t.createdAt);
                return t.type === 'income' &&
                    t.category === category &&
                    txDate >= start &&
                    txDate <= end;
            })
            .reduce((sum, t) => sum + (t.amount || 0), 0);
    };


    const addTransaction = async (e) => {
        e.preventDefault();
        const finalCategory = category === 'Other' ? customCategory : category;
        const categoryList = transactionType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
        const categoryEmoji = categoryList.find(c => c.name === category)?.emoji
            || (transactionType === 'expense' ? '📦' : '💰');

        const payload = {
            amount: parseFloat(amount),
            type: transactionType,
            category: finalCategory,
            emoji: categoryEmoji,
            note,
            createdAt: new Date().toISOString()
        };

        setIsLoading(true); // Start Loading
        try {
            let updatedTxs;

            if (editingTransaction) {
                const id = editingTransaction._id || editingTransaction.id;
                const updated = await api.updateTransaction(id, payload);
                const normalizedUpdated = { ...updated, id: updated._id || updated.id };
                updatedTxs = transactions.map(t => ((t._id === id) || (t.id === id)) ? normalizedUpdated : t);
                setEditingTransaction(null);
            } else {
                const created = await api.createTransaction(payload);
                const normalizedCreated = { ...created, id: created._id || created.id };
                // prepend to state
                updatedTxs = [normalizedCreated, ...transactions];
            }

            // Update state and reset form
            setTransactions(updatedTxs);
            setCurrentPage('dashboard');
            setAmount('');
            setCategory('');
            setCustomCategory('');
            setNote('');
            setTransactionType('expense');

            // Show success notification with confetti for new transactions
            if (!editingTransaction) {
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 3000);
            }

            showNotification(
                editingTransaction
                    ? 'Transaction updated successfully!'
                    : 'Transaction added successfully!',
                'success'
            );

            // GAMIFICATION: Award XP
            if (!editingTransaction) {
                gainXp(10); // +10 XP for new transaction
            }

            // NEW: Check for budget overspending
            if (transactionType === 'expense') {
                const spendingBudget = budgets.find(b => b.category === finalCategory);
                if (spendingBudget) {
                    const budget = budgets.find(b => b.category === finalCategory);
                    const currentSpent = budget ? calculateBudgetProgress(finalCategory, budget) : 0;
                    // Note: calculateBudgetProgress is sync and based on 'transactions' state, 
                    // which we just updated. However, React state updates are async, 
                    // so 'transactions' might not reflect the new one yet depending on timing,
                    // BUT 'updatedTxs' DOES have it. Let's use updatedTxs for accuracy.

                    const newTotal = updatedTxs
                        .filter(t => t.type === 'expense' && t.category === finalCategory)
                        .reduce((sum, t) => sum + (t.amount || 0), 0);

                    if (newTotal > spendingBudget.amount) {
                        showNotification(`Alert: You have exceeded your ${finalCategory} target!\nTarget: ₦${spendingBudget.amount.toLocaleString()} \nSpent: ₦${newTotal.toLocaleString()} `, 'warning', 5000);
                    }
                }
            }

            // NEW: Check for Savings Goal Achievement
            if (transactionType === 'income') {
                const savingGoal = savingsGoals.find(g => g.category === finalCategory);
                if (savingGoal) {
                    const newTotal = updatedTxs
                        .filter(t => t.type === 'income' && t.category === finalCategory)
                        .reduce((sum, t) => sum + (t.amount || 0), 0);

                    const previousTotal = transactions
                        .filter(t => t.type === 'income' && t.category === finalCategory)
                        .reduce((sum, t) => sum + (t.amount || 0), 0);

                    // Check if we just crossed the line
                    if (previousTotal < savingGoal.amount && newTotal >= savingGoal.amount) {
                        setShowConfetti(true);
                        setTimeout(() => setShowConfetti(false), 5000); // Hide after 5s

                        setTimeout(() => {
                            showNotification(`Congratulations!\n\nYou've reached your savings goal for ${finalCategory}!\nGoal: ₦${savingGoal.amount.toLocaleString()}\nSaved: ₦${newTotal.toLocaleString()}`, 'success', 6000);
                            gainXp(100); // +100 XP for hitting a goal
                        }, 500);
                    }
                }
            }

        } catch (err) {
            if (err?.body?.message === "Insufficient balance. Cannot record this expense.") {
                showNotification("You do not have enough balance for this expense!", 'error', 4000);
            } else {
                handleApiError(err, "Transaction failed");
            }
        } finally {
            setIsLoading(false); // Stop Loading
        }
    };

    const deleteTransaction = async (id) => {
        try {
            await api.deleteTransaction(id);
            setTransactions(transactions.filter(t => (t._id || t.id) !== id));
            setCurrentPage('dashboard');
            showNotification('Transaction deleted successfully!', 'success');
        } catch (err) {
            handleApiError(err, 'Failed to delete transaction');
        }
    };

    const startEdit = (transaction) => {
        setEditingTransaction(transaction);
        setTransactionType(transaction.type);
        setAmount((transaction.amount || 0).toString());
        setCategory(transaction.category);
        setNote(transaction.note);
        setCurrentPage('add');
    };

    const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = totalIncome - totalExpense;

    const getStreak = () => {
        if (transactions.length === 0) return 0;
        // Check only for today's date entries
        const uniqueDays = new Set(transactions.map(t => new Date(t.createdAt).toDateString())).size;
        return uniqueDays;
    };

    // Check if an achievement is unlocked
    const isAchievementUnlocked = (achievementId) => {
        switch (achievementId) {
            case 'starter':
                return transactions.length > 0;
            case 'night_owl':
                return transactions.some(t => new Date(t.createdAt).getHours() >= 22);
            case 'big_spender':
                return transactions.some(t => t.type === 'expense' && t.amount >= 50000);
            case 'penny_pincher':
                return transactions.some(t => t.type === 'expense' && t.amount < 1000);
            case 'goal_crusher':
                return savingsGoals.some(g => calculateSavingsProgress(g.category, g) >= g.amount);
            case 'dedicated':
                return getStreak() >= 30;
            case 'budget_master':
                return budgets.some(b => {
                    const spent = calculateBudgetProgress(b.category, b);
                    return spent < b.amount;
                });
            case 'level_5':
                return level >= 5;
            default:
                return false;
        }
    };

    // 1. Expense Category Data (used for Expense Pie Chart)
    const getCategoryData = () => {
        const expenseCategoryTotals = {};
        transactions.filter(t => t.type === 'expense').forEach(t => {
            if (!expenseCategoryTotals[t.category]) {
                expenseCategoryTotals[t.category] = { name: t.category, value: 0, emoji: t.emoji };
            }
            expenseCategoryTotals[t.category].value += t.amount;
        });

        // Convert to array and sort by value (largest first)
        return Object.values(expenseCategoryTotals)
            .sort((a, b) => b.value - a.value);
    };

    // 2. Income Category Data (used for Income Pie Chart)
    const getIncomeCategoryData = () => {
        const incomeCategoryTotals = {};
        transactions.filter(t => t.type === 'income').forEach(t => {
            if (!incomeCategoryTotals[t.category]) {
                incomeCategoryTotals[t.category] = { name: t.category, value: 0, emoji: t.emoji };
            }
            incomeCategoryTotals[t.category].value += t.amount;
        });

        // Convert to array and sort by value (largest first)
        return Object.values(incomeCategoryTotals)
            .sort((a, b) => b.value - a.value);
    };

    // 3. Weekly Data (Line Chart)
    const getWeeklyData = () => {
        const weekData = {};
        const orderedDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        transactions.forEach(t => {
            const date = new Date(t.createdAt);
            const weekDay = date.toLocaleDateString('en-US', { weekday: 'short' });
            if (!weekData[weekDay]) {
                weekData[weekDay] = { day: weekDay, income: 0, expense: 0 };
            }
            if (t.type === 'income') {
                weekData[weekDay].income += t.amount;
            } else {
                weekData[weekDay].expense += t.amount;
            }
        });

        return orderedDays.map(day => weekData[day] || { day, income: 0, expense: 0 });
    };

    // 4. Monthly Data (Line Chart)
    const getMonthlyData = () => {
        const monthData = {};
        const dateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', year: '2-digit' });

        transactions.forEach(t => {
            const date = new Date(t.createdAt);
            const monthYear = dateFormatter.format(date);

            if (!monthData[monthYear]) {
                monthData[monthYear] = { month: monthYear, income: 0, expense: 0 };
            }
            if (t.type === 'income') {
                monthData[monthYear].income += t.amount;
            } else {
                monthData[monthYear].expense += t.amount;
            }
        });

        // Simple sorting by month name (not perfect for year breaks, but functional for trends)
        return Object.values(monthData);
    };


    const lineChartData = timePeriod === 'weekly' ? getWeeklyData() : getMonthlyData();
    const lineChartXAxisKey = timePeriod === 'weekly' ? 'day' : 'month';


    // --- COMPONENT RENDER ---

    return (
        <>
            <style>{fontStyle}</style>

            {/* Notification Component */}
            {notification && (
                <Notification
                    message={notification.message}
                    type={notification.type}
                    onClose={() => setNotification(null)}
                />
            )}

            {/* Confetti Component */}
            {showConfetti && <Confetti />}

            {/* Homepage Section */}
            {currentPage === 'home' && (
                <Homepage
                    onStart={() => {
                        setAuthMode('signup');
                        setCurrentPage('signup');
                    }}
                />
            )}

            {/* Login / Signup (Unchanged) */}
            {(currentPage === 'login' || currentPage === 'signup') && (
                <div className="min-h-screen bg-genz-dark flex items-center justify-center p-6 relative overflow-hidden">
                    <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-genz-pink rounded-full blur-[100px] opacity-30 animate-pulse"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-genz-purple rounded-full blur-[100px] opacity-30 animate-pulse"></div>

                    {/* Auth Container - Keeps button and box together */}
                    <div className="relative z-10 w-full max-w-md flex flex-col gap-6">
                        {/* Back Button - Positioned closer to the box */}
                        <button
                            onClick={() => setCurrentPage('home')}
                            className="self-start text-white/40 hover:text-white transition-all flex items-center gap-2 group px-2 py-2 rounded-xl hover:bg-white/5"
                        >
                            <Icons.ArrowLeft />
                            <span className="text-lg font-medium transition-all">Back to home</span>
                        </button>

                        <div className="bg-genz-card/80 backdrop-blur-md rounded-3xl p-8 w-full border border-genz-card shadow-[0_0_40px_rgba(192,132,252,0.1)]">
                            <div className="text-center mb-10 pt-4">
                                <h1 className="text-5xl font-black text-white mb-2 tracking-tighter shadow-genz-text">
                                    SPEND<span className="text-genz-pink">SAVE</span>
                                </h1>
                                <p className="text-genz-textDim text-sm tracking-widest">{authMode === 'login' ? 'Welcome back! 👋' : 'Join the money tracking revolution 🚀'}</p>
                            </div>

                            <div className="flex bg-black/50 p-1 rounded-2xl mb-8 border border-genz-card">
                                <button
                                    onClick={() => setAuthMode('login')}
                                    className={`flex-1 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 ${authMode === 'login'
                                        ? 'bg-genz-purple text-black shadow-genz-aqua'
                                        : 'text-genz-textDim hover:text-white'
                                        }`}
                                >
                                    Login
                                </button>
                                <button
                                    onClick={() => setAuthMode('signup')}
                                    className={`flex-1 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-300 ${authMode === 'signup'
                                        ? 'bg-genz-purple text-black shadow-genz-aqua'
                                        : 'text-genz-textDim hover:text-white'
                                        }`}
                                >
                                    Sign Up
                                </button>
                            </div>

                            <form onSubmit={handleAuth} className="space-y-4">
                                <input
                                    type="email"
                                    placeholder="EMAIL"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/50 text-white border-2 border-genz-card rounded-2xl px-5 py-4 focus:outline-none focus:border-genz-aqua focus:shadow-[0_0_15px_rgba(92,196,246,0.3)] transition-all placeholder:text-genz-textDim/50 font-medium"
                                    required
                                />
                                {authMode === 'signup' && (
                                    <input
                                        type="text"
                                        placeholder="USERNAME"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="w-full bg-black/50 text-white border-2 border-genz-card rounded-2xl px-5 py-4 focus:outline-none focus:border-genz-aqua focus:shadow-[0_0_15px_rgba(92,196,246,0.3)] transition-all placeholder:text-genz-textDim/50 font-medium"
                                        required
                                    />
                                )}
                                <div className="relative group bg-black/50 rounded-2xl border-2 border-genz-card focus-within:border-genz-aqua focus-within:shadow-[0_0_15px_rgba(92,196,246,0.3)] transition-all overflow-hidden">
                                    {/* Persistent Ghost Dots (Always visible for guidance) */}
                                    <div className="absolute left-5 right-5 top-0 bottom-0 pointer-events-none flex items-center font-mono text-lg tracking-widest select-none z-0">
                                        <span className="text-white/50">
                                            {"•".repeat(8)}
                                        </span>
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-transparent text-white rounded-2xl px-5 py-4 focus:outline-none font-mono text-lg tracking-widest relative z-10"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-genz-textDim hover:text-white transition-colors z-20"
                                    >
                                        {showPassword ? <Icons.EyeOff /> : <Icons.Eye />}
                                    </button>
                                </div>
                                {authMode === 'signup' && (
                                    <p className={`text-[10px] ml-2 font-bold uppercase tracking-widest ${password.length >= 8 ? 'text-genz-aqua' : 'text-genz-textDim'}`}>
                                        Min. 8 characters {password.length >= 8 ? '✨' : ''}
                                    </p>
                                )}
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full bg-genz-purple text-black py-4 rounded-2xl font-black uppercase tracking-wider hover:bg-genz-pink hover:scale-[1.02] transition-all duration-300 shadow-genz-purple-brutalist hover:shadow-genz-pink-brutalist active:translate-y-1 active:shadow-none ${isLoading ? 'opacity-70 cursor-wait flex items-center justify-center gap-2' : ''}`}
                                >
                                    {isLoading ? <><Icons.Spinner /> Loading...</> : (authMode === 'login' ? "Let's Go" : 'Create Account')}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Dashboard (Unchanged apart from username fallback) */}
            {currentPage === 'dashboard' && user && (
                <div className="min-h-screen bg-genz-dark pb-28 text-genz-textLight">
                    <div className="p-6">
                        <header className="flex justify-between items-end mb-8 mt-2">
                            <div>
                                <p className="text-genz-textDim text-xs font-bold uppercase tracking-widest mb-1">Welcome back!👋</p>
                                <h1 className="text-3xl font-bold tracking-tight"> yo, <span className="text-genz-aqua">{user.username || user.email}</span></h1>
                            </div>
                            <div className="bg-genz-card border border-genz-card px-3 py-1 rounded-full flex items-center gap-2">
                                <span className="text-lg">🔥</span>
                                <span className="font-bold text-sm">{getStreak()}</span>
                            </div>
                        </header>

                        <div className="bg-genz-purple rounded-[2rem] p-8 shadow-genz-pink-brutalist mb-8 relative overflow-hidden group">
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700"></div>
                            <p className="text-black/60 font-bold uppercase tracking-widest text-xs mb-2">Total Balance</p>
                            <p className="text-5xl font-black text-black tracking-tighter">₦{balance.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>

                            <div className="mt-8 grid grid-cols-3 gap-1.5 items-stretch">
                                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-2.5 flex flex-col justify-between overflow-hidden">
                                    <p className="text-black text-[10px] font-black uppercase min-h-[22px] flex items-center leading-tight break-words max-w-[42px]">Money In</p>
                                    <p className="text-genz-aqua font-bold text-[10px] sm:text-xs lg:text-lg whitespace-nowrap">+₦{totalIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                </div>
                                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-2.5 flex flex-col justify-between overflow-hidden">
                                    <p className="text-black text-[10px] font-black uppercase min-h-[22px] flex items-center leading-tight break-words max-w-[42px]">Money Out</p>
                                    <p className="text-genz-pink font-bold text-[10px] sm:text-xs lg:text-lg whitespace-nowrap">-₦{totalExpense.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                </div>
                                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-2.5 flex flex-col justify-between overflow-hidden">
                                    <p className="text-black text-[10px] font-black uppercase min-h-[22px] flex items-center leading-tight break-words max-w-[65px]">Total Transactions</p>
                                    <p className="text-white font-bold text-[10px] sm:text-xs lg:text-lg whitespace-nowrap">₦{(totalIncome + totalExpense).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                </div>
                            </div>
                        </div>

                        {/* Transactions */}
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-black uppercase tracking-wider text-genz-aqua">Recent Moves</h2>
                                <span className="text-x1 text-genz-textDim uppercase tracking-wider font-mono">LAST 10</span>
                            </div>

                            {transactions.length === 0 ? (
                                <div className="border-2 border-dashed border-genz-card rounded-3xl p-10 text-center">
                                    <p className="text-4xl mb-4">👻</p>
                                    <p className="text-genz-textDim font-medium">It's quiet in here. Add your first move!</p>
                                    <p className="text-sm font-medium">Tap the + button to add your first transaction</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {transactions.slice(0, 10).map((transaction, index) => (
                                        <div
                                            key={transaction.id || index}
                                            onClick={() => { setSelectedTransaction(transaction); setCurrentPage('details'); }}
                                            className="bg-genz-card hover:bg-black/50 rounded-2xl p-4 flex items-center justify-between cursor-pointer border border-genz-card hover:border-genz-purple transition-all group"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-genz-dark rounded-full flex items-center justify-center text-2xl border border-genz-card group-hover:scale-110 transition-transform">
                                                    {transaction.emoji}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-lg leading-tight">{transaction.category}</p>
                                                    <p className="text-genz-textDim text-xs font-mono mt-1">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <p className={`text-lg font-black font-mono tracking-tight ${transaction.type === 'income' ? 'text-genz-aqua' : 'text-genz-pink'}`}>
                                                {transaction.type === 'income' ? '+' : '-'}₦{(transaction.amount || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div >

                    {/* Floating Action Button */}
                    < button
                        onClick={() => {
                            setEditingTransaction(null);
                            setTransactionType('expense');
                            setAmount('');
                            setCategory('');
                            setCustomCategory('');
                            setNote('');
                            setCurrentPage('add');
                        }}
                        className="fixed bottom-28 right-6 bg-genz-pink text-black w-16 h-16 rounded-2xl shadow-genz-purple-brutalist flex items-center justify-center hover:translate-y-1 hover:shadow-none transition-all z-50 border-2 border-genz-purple"
                    >
                        <Icons.Plus />
                    </button >
                </div >
            )}

            {/* Add Transaction (Unchanged) */}
            {
                currentPage === 'add' && (
                    <div className="min-h-screen bg-genz-dark p-6 pb-24 text-white">
                        <div className="flex items-center gap-4 mb-8">
                            <button onClick={() => { setCurrentPage('dashboard'); setEditingTransaction(null); }} className="bg-genz-card p-3 rounded-full hover:bg-black/50 border border-genz-card">
                                <Icons.ArrowLeft />
                            </button>
                            <h1 className="text-2xl font-black uppercase tracking-wider text-genz-aqua">{editingTransaction ? 'Edit' : 'New'} Move</h1>
                        </div>

                        <form onSubmit={addTransaction} className="space-y-6">
                            <div className="grid grid-cols-2 gap-4 p-1 bg-genz-card rounded-2xl border border-genz-card">
                                <button
                                    type="button"
                                    onClick={() => !editingTransaction && setTransactionType('expense')}
                                    className={`py-4 rounded-xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${transactionType === 'expense'
                                        ? 'bg-genz-pink text-black shadow-lg'
                                        : 'text-genz-textDim hover:text-white'
                                        } ${editingTransaction ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    💸 Expense
                                </button>
                                <button
                                    type="button"
                                    onClick={() => !editingTransaction && setTransactionType('income')}
                                    className={`py-4 rounded-xl font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${transactionType === 'income'
                                        ? 'bg-genz-aqua text-black shadow-lg'
                                        : 'text-genz-textDim hover:text-white'
                                        } ${editingTransaction ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    💰 Income
                                </button>
                            </div>

                            <div>
                                <label className="text-genz-purple text-xs font-bold uppercase tracking-widest mb-2 block ml-2">Amount</label>
                                <div className="relative">
                                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-genz-textDim/50 text-2xl font-light">₦</span>
                                    <input
                                        type="number"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="0"
                                        disabled={!!editingTransaction}
                                        className={`w-full bg-genz-card text-white border-2 border-genz-card rounded-[2rem] pl-12 pr-6 py-6 text-4xl font-black focus:outline-none focus:border-genz-purple transition-all placeholder:text-genz-textDim/50 ${editingTransaction ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-genz-purple text-xs font-bold uppercase tracking-widest mb-2 block ml-2">Category</label>
                                <div className="flex flex-wrap gap-2">
                                    {(transactionType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map(cat => (
                                        <button
                                            key={cat.name}
                                            type="button"
                                            onClick={() => setCategory(cat.name)}
                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border flex items-center gap-2 ${category === cat.name
                                                ? (transactionType === 'expense'
                                                    ? 'bg-genz-pink text-black border-transparent shadow-lg shadow-genz-pink/20'
                                                    : 'bg-genz-aqua text-black border-transparent shadow-lg shadow-genz-aqua/20')
                                                : 'bg-genz-card/50 text-genz-textDim border-genz-borderDark hover:border-genz-aqua/30'
                                                }`}
                                        >
                                            <span className="text-sm">{cat.emoji}</span>
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {category === 'Other' && (
                                <input
                                    type="text"
                                    value={customCategory}
                                    onChange={(e) => setCustomCategory(e.target.value)}
                                    placeholder="Custom Category Name* e.g.,Birthday,Bonus, etc."
                                    className="w-full bg-genz-card/50 text-white border-b-2 border-genz-card px-4 py-4 focus:outline-none focus:border-genz-purple transition-all placeholder:text-genz-textDim/50"
                                    required
                                />
                            )}

                            <div>
                                <label className="text-genz-purple text-xs font-bold uppercase tracking-widest mb-2 block ml-2">Note (optional) </label>
                                <textarea
                                    value={note}
                                    onChange={(e) => setNote(e.target.value)}
                                    placeholder="Add a note about this description..."
                                    className="w-full bg-genz-card/50 text-white rounded-2xl px-6 py-4 border border-genz-card focus:outline-none focus:border-genz-purple resize-none placeholder:text-genz-textDim/50"
                                    rows="2"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full bg-genz-aqua text-black py-5 rounded-2xl font-black hover:bg-genz-purple transition-all shadow-genz-purple-brutalist active:translate-y-1 active:shadow-none flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
                            >
                                {isLoading ? <><Icons.Spinner /> {editingTransaction ? 'Saving...' : 'Adding...'}</> : (editingTransaction ? 'Save Changes' : 'Add Transaction')}
                            </button>
                        </form>
                    </div>
                )
            }

            {/* Details Page (Unchanged) */}
            {
                currentPage === 'details' && selectedTransaction && (
                    <div className="min-h-screen bg-genz-dark p-6 text-white flex flex-col justify-between pb-24">
                        <div>
                            <div className="flex items-center gap-4 mb-8">
                                <button onClick={() => setCurrentPage('dashboard')} className="bg-genz-card p-3 rounded-full hover:bg-black/50 border border-genz-card">
                                    <Icons.ArrowLeft />
                                </button>
                                <h1 className="text-xl font-black uppercase text-genz-aqua">Details</h1>
                            </div>

                            <div className="bg-genz-card border border-genz-card rounded-[2.5rem] p-10 text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-genz-purple via-genz-aqua to-genz-pink"></div>
                                <div className="text-7xl mb-6 filter drop-shadow-2xl animate-bounce">{selectedTransaction.emoji}</div>
                                <h2 className="text-3xl font-bold text-white mb-2">{selectedTransaction.category}</h2>
                                <p className="text-genz-textDim font-mono text-sm mb-6">{new Date(selectedTransaction.createdAt).toLocaleString()}</p>

                                <div className="inline-block bg-black/50 px-8 py-4 rounded-2xl border border-genz-card">
                                    <p className={`text-3xl font-black ${selectedTransaction.type === 'income' ? 'text-genz-aqua' : 'text-genz-pink'}`}>
                                        {selectedTransaction.type === 'income' ? '+' : '-'}₦{(selectedTransaction.amount || 0).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                    </p>
                                </div>

                                {selectedTransaction.note && (
                                    <div className="mt-8 bg-black/50 p-4 rounded-xl">
                                        <p className="text-genz-textDim/50 text-xs uppercase font-bold mb-1">Note</p>
                                        <p className="text-white">{selectedTransaction.note}</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button
                                onClick={() => startEdit(selectedTransaction)}
                                className="flex-1 bg-genz-card text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-black/50 transition-all flex items-center justify-center gap-2 border border-genz-card"
                            >
                                <Icons.Edit /> Edit
                            </button>
                            <button
                                onClick={() => deleteTransaction(selectedTransaction.id)}
                                className="flex-1 bg-red-900/20 text-red-400 py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-red-900/40 transition-all flex items-center justify-center gap-2 border border-red-600/30"
                            >
                                <Icons.Trash /> Delete
                            </button>
                        </div>
                    </div>
                )
            }

            {/* Analytics Page (Updated) */}
            {
                currentPage === 'analytics' && (
                    <div className="min-h-screen bg-genz-dark pb-28 p-6 text-white">
                        <h1 className="text-4xl font-black text-genz-aqua mb-8">Stats 📊</h1>

                        {/* Total Income vs Total Expense Comparison (Unchanged) */}
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-genz-card rounded-3xl p-5 border border-genz-card relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-genz-aqua blur-[50px] opacity-20"></div>
                                <p className="text-genz-textDim text-xs font-bold uppercase mb-2">In</p>
                                <p className="text-xl font-black text-genz-aqua">+₦{totalIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </div>
                            <div className="bg-genz-card rounded-3xl p-5 border border-genz-card relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-genz-pink blur-[50px] opacity-20"></div>
                                <p className="text-genz-textDim text-xs font-bold uppercase mb-2">Out</p>
                                <p className="text-xl font-black text-genz-pink">-₦{totalExpense.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                            </div>
                        </div>
                        <hr className="border-genz-borderDark/50 my-6" />

                        {/* Pie Charts for Expense & Income Breakdown */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* 1. Expense Pie Chart and Biggest Spending Highlight */}
                            <div className="bg-genz-card rounded-3xl p-6 border border-genz-card">
                                <h2 className="text-genz-textLight font-bold uppercase tracking-wider mb-6 text-sm">Expense Breakdown</h2>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={getCategoryData()}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {getCategoryData().map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                    stroke="none"
                                                    onClick={() => setActiveExpenseCategory(entry.name)}
                                                    onMouseEnter={() => setActiveExpenseCategory(entry.name)}
                                                    onMouseLeave={() => setActiveExpenseCategory(null)}
                                                    className="cursor-pointer transition-opacity hover:opacity-80"
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: GENZ_COLORS.bgDark, border: `1px solid ${GENZ_COLORS.borderDark}`, borderRadius: '12px', color: GENZ_COLORS.textLight }}
                                            itemStyle={{ color: GENZ_COLORS.textLight }}
                                            formatter={(value) => [`₦${value.toLocaleString(undefined, { maximumFractionDigits: 0 })} (${totalExpense > 0 ? (value / totalExpense * 100).toFixed(0) : 0}%)`, 'Amount']}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                {/* Highlight the biggest spending category */}
                                <CategoryLegend
                                    data={getCategoryData()}
                                    highlightName={activeExpenseCategory || (getCategoryData().length > 0 ? getCategoryData()[0].name : null)}
                                />
                            </div>

                            {/* 2. Income Pie Chart */}
                            <div className="bg-genz-card rounded-3xl p-6 border border-genz-card">
                                <h2 className="text-genz-textLight font-bold uppercase tracking-wider mb-6 text-sm">Income Breakdown</h2>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={getIncomeCategoryData()}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            stroke="none"
                                        >
                                            {getIncomeCategoryData().map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                    stroke="none"
                                                    onClick={() => setActiveIncomeCategory(entry.name)}
                                                    onMouseEnter={() => setActiveIncomeCategory(entry.name)}
                                                    onMouseLeave={() => setActiveIncomeCategory(null)}
                                                    className="cursor-pointer transition-opacity hover:opacity-80"
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: GENZ_COLORS.bgDark, border: `1px solid ${GENZ_COLORS.borderDark}`, borderRadius: '12px', color: GENZ_COLORS.textLight }}
                                            itemStyle={{ color: GENZ_COLORS.textLight }}
                                            formatter={(value) => [`₦${value.toLocaleString(undefined, { maximumFractionDigits: 0 })} (${totalIncome > 0 ? (value / totalIncome * 100).toFixed(0) : 0}%)`, 'Amount']}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <CategoryLegend
                                    data={getIncomeCategoryData()}
                                    highlightName={activeIncomeCategory || (getIncomeCategoryData().length > 0 ? getIncomeCategoryData()[0].name : null)}
                                />
                            </div>
                        </div>

                        <hr className="border-genz-borderDark/50 my-6" />

                        {/* Line Chart for Spending Trends */}
                        <div className="bg-genz-card rounded-3xl p-6 border border-genz-card">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-genz-textLight font-bold uppercase tracking-wider text-sm">Spending Trends</h2>
                                {/* Period Toggle */}
                                <div className="flex bg-black/50 p-1 rounded-full border border-genz-borderDark">
                                    <button
                                        onClick={() => setTimePeriod('weekly')}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${timePeriod === 'weekly' ? 'bg-genz-purple text-black' : 'text-genz-textDim hover:text-white'
                                            }`}
                                    >
                                        Weekly
                                    </button>
                                    <button
                                        onClick={() => setTimePeriod('monthly')}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${timePeriod === 'monthly' ? 'bg-genz-purple text-black' : 'text-genz-textDim hover:text-white'
                                            }`}
                                    >
                                        Monthly
                                    </button>
                                </div>
                            </div>

                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={lineChartData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke={GENZ_COLORS.borderDark} vertical={false} />
                                    {/* X-Axis Key is dynamically set */}
                                    <XAxis dataKey={lineChartXAxisKey} stroke={GENZ_COLORS.textDim} fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke={GENZ_COLORS.textDim} fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`} />
                                    <Tooltip contentStyle={{ backgroundColor: GENZ_COLORS.bgDark, border: `1px solid ${GENZ_COLORS.borderDark}`, borderRadius: '8px', color: GENZ_COLORS.textLight }} />
                                    <Line type="monotone" dataKey="income" stroke={GENZ_COLORS.aqua} strokeWidth={3} dot={false} />
                                    <Line type="monotone" dataKey="expense" stroke={GENZ_COLORS.pink} strokeWidth={3} dot={false} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )
            }

            {/* Profile Page (Unchanged) */}
            {
                currentPage === 'profile' && user && (
                    <div className="min-h-screen bg-genz-dark pb-28 p-6 text-white">
                        <h1 className="text-4xl font-black mb-8 text-genz-purple">Profile </h1>

                        <div className="bg-gradient-to-br from-genz-card to-black/50 rounded-[2rem] p-8 mb-6 border border-genz-card text-center relative overflow-hidden shadow-genz-purple-brutalist">
                            <div className="absolute -top-24 -left-24 w-48 h-48 bg-genz-pink blur-[80px] opacity-40"></div>
                            <div className="w-24 h-24 mx-auto bg-genz-aqua rounded-full flex items-center justify-center text-5xl font-black mb-4 border-4 border-genz-purple shadow-lg">
                                {user.username ? user.username[0].toUpperCase() : 'U'}
                            </div>
                            <h2 className="text-3xl font-black mb-1 text-genz-aqua">{user.username || 'User'}</h2>
                            <p className="text-genz-textDim font-mono text-sm sm:text-xl mb-4 break-all px-4">{user.email || 'No Email'}</p>

                            {/* LEVEL & XP */}
                            <div className="mt-6 mb-2 px-4">
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-genz-aqua font-black text-lg uppercase tracking-widest">Level {level}</span>
                                    <span className="text-xs text-genz-textDim font-bold">{currentLevelProgress} / {xpForNextLevel} XP</span>
                                </div>
                                <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-white/10 relative">
                                    <div
                                        className="h-full bg-gradient-to-r from-genz-purple to-genz-pink transition-all duration-1000 ease-out"
                                        style={{ width: `${currentLevelProgress}%` }}
                                    ></div>
                                </div>
                            </div>

                            <div className="mt-8 pt-4 border-t border-genz-borderDark/50">
                                {/* Monthly Targets Section */}
                                <div className="flex justify-between items-center mb-6">
                                    <span className="text-genz-textDim text-sm font-bold uppercase tracking-wider">Targets</span>
                                    <button
                                        onClick={() => setShowBudgetModal(true)}
                                        className="bg-genz-aqua/20 text-genz-aqua px-3 py-1 rounded-full text-xs font-bold hover:bg-genz-aqua hover:text-black  transition-all"
                                    >
                                        + New Target
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {budgets.length === 0 ? (
                                        <p className="text-center text-genz-textDim text-lg font-medium italic">✨ No targets set yet. Add one to track your spending!🎯</p>
                                    ) : (
                                        budgets.map(budget => {
                                            const spent = calculateBudgetProgress(budget.category, budget);
                                            const progress = Math.min((spent / budget.amount) * 100, 100);
                                            const isExceeded = spent > budget.amount;

                                            return (
                                                <div key={budget._id || budget.id} className="bg-black/30 rounded-xl p-3 relative group">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xl">{EXPENSE_CATEGORIES.find(c => c.name === budget.category)?.emoji || '💰'}</span>
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-sm leading-tight">{budget.category}</span>
                                                                <span className="text-[9px] text-genz-textDim uppercase tracking-tighter opacity-70">
                                                                    {budget.period === 'weekly' ? '📅 Weekly' : budget.period === 'monthly' ? '📆 Monthly' : '🗓️ Custom'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className={`text-xs font-bold ${isExceeded ? 'text-genz-pink' : 'text-white'}`}>
                                                                ₦{spent.toLocaleString()}
                                                            </span>
                                                            <span className="text-genz-textDim text-[10px]"> / ₦{budget.amount.toLocaleString()}</span>
                                                        </div>
                                                    </div>

                                                    {/* Progress Bar */}
                                                    <div className="w-full h-2 bg-genz-cardDark rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full transition-all duration-500 ${isExceeded ? 'bg-genz-pink' : 'bg-genz-aqua'}`}
                                                            style={{ width: `${progress}%` }}
                                                        ></div>
                                                    </div>

                                                    {/* Delete Button (visible on hover) */}
                                                    <button
                                                        onClick={() => handleDeleteBudget(budget._id || budget.id)}
                                                        className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <Icons.Trash />
                                                    </button>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Savings Goals Section */}
                                <div className="pt-6 border-t border-genz-borderDark/50 mt-6">
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="text-genz-textDim text-sm font-bold uppercase tracking-wider">Savings Goals 💸</span>
                                        <button
                                            onClick={() => setShowSavingsModal(true)}
                                            className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold hover:bg-green-500 hover:text-black transition-all"
                                        >
                                            + New Goal
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {savingsGoals.length === 0 ? (
                                            <p className="text-center text-genz-textDim text-xl font-medium italic">✨ Set a goal to save more! 🚀</p>
                                        ) : (
                                            savingsGoals.map(goal => {
                                                const goalId = goal._id || goal.id;
                                                const saved = calculateSavingsProgress(goal.category, goal);
                                                const progress = Math.min((saved / goal.amount) * 100, 100);
                                                const isCompleted = saved >= goal.amount;

                                                return (
                                                    <div key={goalId} className={`rounded-xl p-3 relative group ${isCompleted ? 'bg-green-900/20 border border-green-500/30' : 'bg-black/30'}`}>
                                                        <div className="flex justify-between items-start mb-2">
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-sm text-white">{goal.category}</span>
                                                                {goal.startDate && (
                                                                    <span className="text-[10px] text-genz-textDim font-bold uppercase tracking-tighter opacity-70">
                                                                        🗓️ {goal.period === 'custom'
                                                                            ? `${new Date(goal.startDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} — ${new Date(goal.endDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`
                                                                            : `${goal.period.charAt(0).toUpperCase() + goal.period.slice(1)} Goal`
                                                                        }
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="text-xs font-bold text-green-400">
                                                                    ₦{saved.toLocaleString()}
                                                                </span>
                                                                <span className="text-genz-textDim text-[10px]"> / ₦{goal.amount.toLocaleString()}</span>
                                                            </div>
                                                        </div>

                                                        {/* Progress Bar */}
                                                        <div className="w-full h-2 bg-genz-cardDark rounded-full overflow-hidden">
                                                            <div
                                                                className="h-full rounded-full transition-all duration-500 bg-green-500"
                                                                style={{ width: `${progress}%` }}
                                                            ></div>
                                                        </div>

                                                        {/* Delete Button (visible on hover) */}
                                                        <button
                                                            onClick={() => handleDeleteSavingsGoal(goalId)}
                                                            className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Icons.Trash />
                                                        </button>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div >

                                <div className="flex justify-between items-center mt-6 mb-2 pt-4 border-t border-genz-borderDark/50">
                                    <span className="text-genz-textDim text-sm font-bold uppercase tracking-wider">Current Streak</span>
                                    <span className="text-white font-bold">{getStreak()} 🔥</span>
                                </div>

                                {/* Badges Section */}
                                <div className="pt-6 border-t border-genz-borderDark/50 mt-6 text-left">
                                    <span className="text-genz-textDim text-sm font-bold uppercase tracking-wider mb-4 block">Achievements 🏆</span>
                                    <div className="space-y-4">
                                        {(() => {
                                            // Find the highest index unlocked achievement
                                            const unlockedIndices = ACHIEVEMENTS.map((a, i) => isAchievementUnlocked(a.id) ? i : -1).filter(idx => idx !== -1);
                                            const currentIdx = unlockedIndices.length > 0 ? Math.max(...unlockedIndices) : -1;
                                            const currentAchievement = currentIdx !== -1 ? ACHIEVEMENTS[currentIdx] : null;

                                            // Find the first locked achievement after the current one, or just the first locked one
                                            const nextIdx = ACHIEVEMENTS.findIndex((a, i) => !isAchievementUnlocked(a.id));
                                            const nextAchievement = nextIdx !== -1 ? ACHIEVEMENTS[nextIdx] : null;

                                            return (
                                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                    {/* Current Milestone */}
                                                    <div
                                                        onClick={() => currentAchievement && setSelectedAchievement(currentAchievement)}
                                                        className={`bg-gradient-to-br from-genz-purple/10 to-transparent border border-genz-purple/30 p-4 rounded-2xl flex flex-col gap-3 group hover:scale-[1.02] transition-all cursor-pointer relative overflow-hidden ${!currentAchievement ? 'opacity-50 grayscale border-dashed' : ''}`}
                                                    >
                                                        <span className="text-[10px] font-black uppercase tracking-widest text-genz-purple/80">Current Milestone</span>
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-16 h-16 bg-genz-purple/20 rounded-2xl flex items-center justify-center text-4xl shadow-lg border border-genz-purple/20">
                                                                {currentAchievement ? currentAchievement.icon : '❔'}
                                                            </div>
                                                            <div>
                                                                <h4 className="font-black text-white text-lg leading-tight">{currentAchievement ? currentAchievement.title : 'No Medals Yet'}</h4>
                                                                <p className="text-genz-textDim text-xs font-bold">{currentAchievement ? currentAchievement.subtitle : 'Start tracking to earn badges'}</p>
                                                            </div>
                                                        </div>
                                                        {currentAchievement && <div className="absolute top-2 right-2 text-genz-purple">✨</div>}
                                                    </div>

                                                    {/* Next Goal */}
                                                    {nextAchievement ? (
                                                        <div
                                                            onClick={() => setSelectedAchievement(nextAchievement)}
                                                            className="bg-black/30 border border-genz-borderDark p-4 rounded-2xl flex flex-col gap-3 group hover:border-genz-aqua/40 transition-all cursor-pointer hover:bg-black/40"
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <span className="text-[10px] font-black uppercase tracking-widest text-genz-textDim/60">Next Goal</span>
                                                                <div className="w-6 h-6 rounded-full bg-genz-dark border border-genz-borderDark flex items-center justify-center">
                                                                    <Icons.Lock size={12} className="text-genz-textDim" />
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 bg-black/40 rounded-xl flex items-center justify-center text-2xl grayscale blur-[1px] opacity-40">
                                                                    {nextAchievement.icon}
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-bold text-genz-textDim text-sm">{nextAchievement.title}</h4>
                                                                    <p className="text-[10px] text-genz-textDim/60 font-medium">To unlock: {nextAchievement.subtitle}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="bg-gradient-to-br from-yellow-500/10 to-transparent border border-yellow-500/20 p-4 rounded-2xl flex flex-col items-center justify-center text-center">
                                                            <span className="text-3xl mb-1">👑</span>
                                                            <p className="text-[10px] font-black uppercase text-yellow-500">Legend Status</p>
                                                            <p className="text-white font-bold text-sm">All achievements unlocked!</p>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </div>

                            </div >
                        </div >

                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-600/50 text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-red-600 transition-all flex items-center justify-center gap-2 border border-red-600/30"
                        >
                            Log Out
                        </button>

                        {/* LEVEL UP MODAL */}
                        {
                            showLevelUp && (
                                <div className="fixed inset-0 z-[300] flex items-center justify-center pointer-events-none">
                                    <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-1 rounded-[2rem] animate-in zoom-in duration-500 shadow-[0_0_100px_rgba(255,165,0,0.5)]">
                                        <div className="bg-black/90 backdrop-blur-xl rounded-[1.9rem] p-8 text-center border border-yellow-500/50 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-yellow-500/10 animate-pulse"></div>
                                            <h2 className="text-5xl mb-2 animate-bounce">🆙</h2>
                                            <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400 uppercase italic">Level Up!</h3>
                                            <p className="text-white font-bold text-lg mt-2">You are now Level {level}!</p>
                                            <p className="text-yellow-200/80 text-sm font-mono mt-1">Keep crushing your goals! 🚀</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        }

                        {/* Add Budget Modal */}
                        {
                            showBudgetModal && (
                                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                                    <div className="bg-genz-card border border-genz-borderDark w-full max-w-sm rounded-[2rem] p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col overflow-hidden">
                                        <h3 className="text-2xl font-black text-white mb-4 shrink-0">Set Target 🎯</h3>
                                        <form onSubmit={handleAddBudget} className="flex flex-col flex-1 overflow-hidden">
                                            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                                                <div>
                                                    <label className="block text-genz-textDim text-xs font-bold uppercase mb-2">Category</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {EXPENSE_CATEGORIES.map(cat => (
                                                            <button
                                                                key={cat.name}
                                                                type="button"
                                                                onClick={() => setBudgetCategory(cat.name)}
                                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${budgetCategory === cat.name ? 'bg-genz-aqua text-white border-transparent shadow-lg shadow-genz-aqua/20' : 'bg-genz-dark text-genz-textDim border-genz-borderDark hover:border-genz-aqua/30'}`}
                                                            >
                                                                {cat.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-genz-textDim text-xs font-bold uppercase mb-2">Target Amount</label>
                                                    <div className="relative">
                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-genz-textDim font-bold">₦</span>
                                                        <input
                                                            type="number"
                                                            value={budgetAmount}
                                                            onChange={(e) => setBudgetAmount(e.target.value)}
                                                            className="w-full bg-genz-dark border border-genz-borderDark rounded-xl py-4 pl-10 pr-4 text-white font-bold focus:outline-none focus:border-genz-aqua transition-colors"
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-genz-textDim text-xs font-bold uppercase block ml-1">Tracking Period</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {['weekly', 'monthly', 'custom'].map(p => (
                                                            <button
                                                                key={p}
                                                                type="button"
                                                                onClick={() => {
                                                                    setBudgetPeriod(p);
                                                                    if (p === 'weekly') {
                                                                        const start = budgetStartDate || new Date().toISOString().split('T')[0];
                                                                        const end = new Date(new Date(start).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                                                                        setBudgetRange(start, end);
                                                                    } else if (p === 'monthly') {
                                                                        const d = new Date(budgetStartDate || new Date());
                                                                        const end = new Date(d.getFullYear(), d.getMonth() + 1, d.getDate()).toISOString().split('T')[0];
                                                                        setBudgetRange(budgetStartDate || d.toISOString().split('T')[0], end);
                                                                    } else if (p === 'custom') {
                                                                        setShowCalendar(true);
                                                                    }
                                                                }}
                                                                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider transition-all border ${budgetPeriod === p ? 'bg-genz-aqua text-white border-transparent shadow-lg shadow-genz-aqua/20' : 'bg-genz-dark text-genz-textDim border-genz-borderDark hover:border-genz-aqua/30'}`}
                                                            >
                                                                {p}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-3 pt-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowCalendar(!showCalendar)}
                                                        className="w-full flex items-center justify-between p-3 bg-genz-dark/50 border border-genz-borderDark rounded-2xl group hover:border-genz-aqua transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-genz-aqua/10 flex items-center justify-center text-genz-aqua text-sm group-hover:scale-110 transition-transform">
                                                                🗓️
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="text-[8px] text-genz-textDim font-black uppercase tracking-widest leading-none mb-1">Target Timeline</p>
                                                                <p className="text-white font-bold text-xs">
                                                                    {budgetStartDate ? new Date(budgetStartDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : 'Pick Start'}
                                                                    {budgetEndDate && ` — ${new Date(budgetEndDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}`}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className={`transition-transform duration-300 ${showCalendar ? 'rotate-180' : ''}`}>
                                                            <Icons.ChevronRight />
                                                        </div>
                                                    </button>

                                                    {showCalendar && (
                                                        <div className="animate-in slide-in-from-top-2 duration-300">
                                                            <MiniCalendar
                                                                startDate={budgetStartDate}
                                                                endDate={budgetEndDate}
                                                                accentColor="genz-aqua"
                                                                onSelectRange={(start, end) => {
                                                                    if (!start) {
                                                                        setBudgetRange(null, null);
                                                                        return;
                                                                    }
                                                                    if (budgetPeriod === 'weekly') {
                                                                        const newEnd = new Date(new Date(start).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                                                                        setBudgetRange(start, newEnd);
                                                                    } else if (budgetPeriod === 'monthly') {
                                                                        const d = new Date(start);
                                                                        const newEnd = new Date(d.getFullYear(), d.getMonth() + 1, d.getDate()).toISOString().split('T')[0];
                                                                        setBudgetRange(start, newEnd);
                                                                    } else {
                                                                        setBudgetStartDate(start);
                                                                        setBudgetEndDate(end);
                                                                        if (start && end) setBudgetPeriod('custom');
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>

                                            </div>

                                            <div className="flex gap-3 pt-4 shrink-0 bg-genz-card border-t border-genz-borderDark/20 mt-auto">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowBudgetModal(false)}
                                                    className="flex-1 py-4 rounded-xl font-bold text-genz-textDim hover:text-white hover:bg-genz-dark transition-all"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    className={`flex-1 bg-genz-aqua text-white py-4 rounded-xl font-bold shadow-lg shadow-genz-aqua/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
                                                >
                                                    {isLoading ? <><Icons.Spinner /> Saving...</> : 'Save Target'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )
                        }

                        {/* Add Savings Modal */}
                        {
                            showSavingsModal && (
                                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
                                    <div className="bg-genz-card border border-genz-borderDark w-full max-w-sm rounded-[2rem] p-6 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col overflow-hidden">
                                        <h3 className="text-2xl font-black text-white mb-4">Set Goal 🎯</h3>
                                        <form onSubmit={handleAddSavingsGoal} className="flex flex-col flex-1 overflow-hidden">
                                            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                                                <div>
                                                    <label className="block text-genz-textDim text-xs font-bold uppercase mb-2">Income Source</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {INCOME_CATEGORIES.map(cat => (
                                                            <button
                                                                key={cat.name}
                                                                type="button"
                                                                onClick={() => setSavingsCategory(cat.name)}
                                                                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold transition-all border ${savingsCategory === cat.name ? 'bg-emerald-500 text-black border-transparent shadow-lg shadow-emerald-500/30' : 'bg-genz-dark text-genz-textDim border-genz-borderDark hover:border-emerald-500/30'}`}
                                                            >
                                                                {cat.name}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-genz-textDim text-xs font-bold uppercase mb-2">Goal Amount</label>
                                                    <div className="relative">
                                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-genz-textDim font-bold">₦</span>
                                                        <input
                                                            type="number"
                                                            value={savingsAmount}
                                                            onChange={(e) => setSavingsAmount(e.target.value)}
                                                            className="w-full bg-genz-dark border border-genz-borderDark rounded-xl py-4 pl-10 pr-4 text-white font-bold focus:outline-none focus:border-emerald-500 transition-colors"
                                                            placeholder="0.00"
                                                        />
                                                    </div>
                                                </div>

                                                <div>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <label className="text-genz-textDim text-[10px] font-bold uppercase tracking-widest">Tracking Period</label>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {['weekly', 'monthly', 'custom'].map(p => (
                                                            <button
                                                                key={p}
                                                                type="button"
                                                                onClick={() => {
                                                                    setSavingsPeriod(p);
                                                                    if (p === 'weekly') {
                                                                        const start = savingsStartDate || new Date().toISOString().split('T')[0];
                                                                        const end = new Date(new Date(start).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                                                                        setSavingsRange(start, end);
                                                                    } else if (p === 'monthly') {
                                                                        const d = new Date(savingsStartDate || new Date());
                                                                        const end = new Date(d.getFullYear(), d.getMonth() + 1, d.getDate()).toISOString().split('T')[0];
                                                                        setSavingsRange(savingsStartDate || d.toISOString().split('T')[0], end);
                                                                    } else if (p === 'custom') {
                                                                        setShowSavingsCalendar(true);
                                                                    }
                                                                }}
                                                                className={`flex-1 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border ${savingsPeriod === p ? 'bg-emerald-500 text-black border-transparent shadow-lg shadow-emerald-500/30' : 'bg-genz-card/50 text-genz-textDim border-genz-borderDark hover:border-emerald-500/30'}`}
                                                            >
                                                                {p}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="space-y-3 pt-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowSavingsCalendar(!showSavingsCalendar)}
                                                        className="w-full flex items-center justify-between p-3 bg-genz-dark/50 border border-genz-borderDark rounded-2xl group hover:border-emerald-500 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 text-sm group-hover:scale-110 transition-transform">
                                                                🗓️
                                                            </div>
                                                            <div className="text-left">
                                                                <p className="text-[8px] text-genz-textDim font-black uppercase tracking-widest leading-none mb-1">Target Timeline</p>
                                                                <p className="text-white font-bold text-xs">
                                                                    {savingsPeriod === 'custom'
                                                                        ? (savingsStartDate && savingsEndDate ? `${new Date(savingsStartDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} — ${new Date(savingsEndDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}` : 'Select Dates')
                                                                        : `${new Date(savingsStartDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} — ${savingsEndDate ? new Date(savingsEndDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : '...'}`
                                                                    }
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className={`transition-transform duration-300 ${showSavingsCalendar ? 'rotate-180' : ''}`}>
                                                            <Icons.ChevronRight />
                                                        </div>
                                                    </button>

                                                    {showSavingsCalendar && (
                                                        <div className="animate-in slide-in-from-top-2 duration-300">
                                                            <MiniCalendar
                                                                startDate={savingsStartDate}
                                                                endDate={savingsEndDate}
                                                                accentColor="green-500"
                                                                onSelectRange={(start, end) => {
                                                                    if (!start) {
                                                                        setSavingsStartDate(null);
                                                                        setSavingsEndDate(null);
                                                                        return;
                                                                    }
                                                                    if (savingsPeriod === 'weekly') {
                                                                        const newEnd = new Date(new Date(start).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
                                                                        setSavingsStartDate(start);
                                                                        setSavingsEndDate(newEnd);
                                                                    } else if (savingsPeriod === 'monthly') {
                                                                        const d = new Date(start);
                                                                        const newEnd = new Date(d.getFullYear(), d.getMonth() + 1, d.getDate()).toISOString().split('T')[0];
                                                                        setSavingsStartDate(start);
                                                                        setSavingsEndDate(newEnd);
                                                                    } else {
                                                                        setSavingsStartDate(start);
                                                                        setSavingsEndDate(end);
                                                                        if (start && end) setSavingsPeriod('custom');
                                                                    }
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex gap-3 pt-4 shrink-0 bg-genz-card border-t border-genz-borderDark/20 mt-auto">
                                                <button
                                                    type="button"
                                                    onClick={() => setShowSavingsModal(false)}
                                                    className="flex-1 py-4 rounded-xl font-bold text-genz-textDim hover:text-white hover:bg-genz-dark transition-all"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    className={`flex-1 bg-emerald-500 text-black py-4 rounded-xl font-bold shadow-lg shadow-emerald-500/30 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
                                                >
                                                    {isLoading ? <><Icons.Spinner /> Saving...</> : 'Save Goal'}
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )
                        }

                        {/* Achievement Details Modal */}
                        {
                            selectedAchievement && (
                                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                                    <div className="bg-genz-card border border-genz-borderDark w-full max-w-md rounded-[2rem] p-6 shadow-2xl animate-pop-in">
                                        <div className="text-center mb-6">
                                            <div className="text-6xl mb-4">{selectedAchievement.icon}</div>
                                            <h3 className="text-2xl font-black text-white mb-2">{selectedAchievement.title}</h3>
                                            <p className="text-genz-textDim text-sm">{selectedAchievement.subtitle}</p>
                                        </div>

                                        <div className="bg-black/30 rounded-xl p-4 mb-4">
                                            <p className="text-white text-sm leading-relaxed">
                                                {isAchievementUnlocked(selectedAchievement.id)
                                                    ? selectedAchievement.description
                                                    : selectedAchievement.howToUnlock}
                                            </p>
                                        </div>

                                        <button
                                            onClick={() => setSelectedAchievement(null)}
                                            className="w-full bg-genz-purple text-white py-4 rounded-xl font-bold shadow-lg shadow-genz-purple/20 hover:scale-[1.02] active:scale-95 transition-all"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )
                        }

                        {/* Confetti Overlay */}
                        {showConfetti && <Confetti />}
                    </div >
                )
            }


            {/* Global Bottom Navigation Bar (Unchanged) */}
            {
                (currentPage === 'dashboard' || currentPage === 'analytics' || currentPage === 'profile') && user && (
                    <div className="fixed bottom-0 left-0 right-0 h-20 bg-genz-card/95 backdrop-blur-md border-t border-genz-card flex justify-around items-center z-40 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
                        <button
                            onClick={() => setCurrentPage('dashboard')}
                            className={`flex flex-col items-center p-3 rounded-xl transition-colors ${currentPage === 'dashboard' ? 'text-genz-aqua' : 'text-genz-textDim hover:text-white'}`}
                        >
                            <Icons.Home />
                            <span className="text-xs font-medium mt-1">Home</span>
                        </button>
                        <button
                            onClick={() => setCurrentPage('analytics')}
                            className={`flex flex-col items-center p-3 rounded-xl transition-colors ${currentPage === 'analytics' ? 'text-genz-aqua' : 'text-genz-textDim hover:text-white'}`}
                        >
                            <Icons.Chart />
                            <span className="text-xs font-medium mt-1">Stats</span>
                        </button>
                        <button
                            onClick={() => setCurrentPage('profile')}
                            className={`flex flex-col items-center p-3 rounded-xl transition-colors ${currentPage === 'profile' ? 'text-genz-aqua' : 'text-genz-textDim hover:text-white'}`}
                        >
                            <Icons.User />
                            <span className="text-xs font-medium mt-1">Profile</span>
                        </button>
                    </div>
                )
            }
        </>
    );
};

export default App;