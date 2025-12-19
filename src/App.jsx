import './App.css'
import React, { useState, useEffect } from 'react';
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
    -webkit-box-shadow: 0 0 0 30px ${GENZ_COLORS.cardDark} inset !important;
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
};

// CATEGORIES
const EXPENSE_CATEGORIES = [
    { name: 'Snacks', emoji: '🍿' },
    { name: 'Food', emoji: '🍕' },
    { name: 'Groceries', emoji: '🛒' },
    { name: 'Travel', emoji: '✈️' },
    { name: 'Commute', emoji: '🚌' },
    { name: 'Subscription', emoji: '📱' },
    { name: 'Airtime', emoji: '📞' },
    { name: 'Shopping', emoji: '🛍️' },
    { name: 'Gift', emoji: '🎁' },
    { name: 'Misc', emoji: '📦' },
];

const INCOME_CATEGORIES = [
    { name: 'Salary', emoji: '💰' },
    { name: 'Freelance', emoji: '💼' },
    { name: 'Gift', emoji: '🎁' },
    { name: 'Other', emoji: '💰' },
];

// --- CategoryLegend for Analytics (Updated to handle highlighting) ---
const CategoryLegend = ({ data, highlightName }) => (
    <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
        {data.map((entry, index) => (
            <div
                key={`legend-${index}`}
                className={`flex items-center gap-2 transition-all ${entry.name === highlightName ? 'bg-genz-dark/50 p-2 rounded-xl border border-genz-pink/50 shadow-lg' : ''}`}
            >
                <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-genz-textDim">{entry.emoji}</span>
                <span className={`font-medium ${entry.name === highlightName ? 'text-genz-pink' : 'text-genz-textLight'}`}>{entry.name}</span>
                <span className="text-genz-textDim font-mono text-xs">
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
                        left: `${Math.random() * 100}vw`,
                        animationDuration: `${Math.random() * 3 + 2}s`,
                        animationDelay: `${Math.random() * 2}s`,
                        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                        width: `${Math.random() * 10 + 5}px`,
                        height: `${Math.random() * 10 + 5}px`,
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
        success: 'bg-gradient-to-r from-emerald-400 to-cyan-400 text-white border-emerald-300 shadow-[0_0_30px_rgba(52,211,153,0.4)]',
        error: 'bg-gradient-to-r from-rose-500 to-pink-500 text-white border-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.4)]',
        warning: 'bg-gradient-to-r from-amber-400 to-orange-400 text-white border-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.4)]',
        info: 'bg-gradient-to-r from-violet-500 to-purple-500 text-white border-violet-400 shadow-[0_0_30px_rgba(139,92,246,0.4)]',
    };

    const icons = {
        success: '✨',
        error: '🚨',
        warning: '⚠️',
        info: '💡',
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center p-6 z-[250] pointer-events-none">
            <div className={`${typeStyles[type]} pointer-events-auto rounded-2xl px-6 py-4 shadow-2xl border-2 flex items-center gap-3 w-full max-w-[320px] backdrop-blur-sm animate-pop-in`}>
                <span className="text-2xl">{icons[type]}</span>
                <p className="font-bold text-sm flex-1 whitespace-pre-line drop-shadow-sm">{message}</p>
                <button
                    onClick={onClose}
                    className="text-white/80 hover:text-white font-bold text-xl leading-none transition-colors"
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
                            className={`${f.color} backdrop-blur-md border p-8 lg:p-10 rounded-[2rem] lg:rounded-[2.5rem] group hover:scale-[1.02] transition-all flex flex-col items-center`}
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

    // --- SAVINGS GOALS STATE ---
    const [savingsGoals, setSavingsGoals] = useState([]);
    const [showSavingsModal, setShowSavingsModal] = useState(false);
    const [savingsCategory, setSavingsCategory] = useState('');
    const [savingsAmount, setSavingsAmount] = useState('');
    const [showConfetti, setShowConfetti] = useState(false);

    // --- NOTIFICATION STATE ---
    const [notification, setNotification] = useState(null);

    // Helper function to show notifications
    const showNotification = (message, type = 'info', duration = 3000) => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), duration);
    };

    // Auth state 
    const [authMode, setAuthMode] = useState('login');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Transaction form state
    const [transactionType, setTransactionType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [customCategory, setCustomCategory] = useState('');
    const [note, setNote] = useState('');

    // load user from localStorage (token) and fetch transactions
    useEffect(() => {
        // Load Budgets
        const savedBudgets = localStorage.getItem('spendsave_budgets');
        if (savedBudgets) {
            setBudgets(JSON.parse(savedBudgets));
        }

        // Load Savings Goals
        const savedSavings = localStorage.getItem('spendsave_savings');
        if (savedSavings) {
            setSavingsGoals(JSON.parse(savedSavings));
        }

        const savedUser = localStorage.getItem('spendsave_user');
        const token = localStorage.getItem('spendsave_token');

        if (savedUser && token) {
            setUser(JSON.parse(savedUser));
            setCurrentPage('dashboard');

            // fetch from backend
            (async () => {
                try {
                    const txs = await api.getTransactions();
                    // convert _id (from MongoDB) to id (what your UI uses)
                    const normalized = txs.map(t => ({
                        ...t,
                        id: t._id || t.id, // Use _id from MongoDB if available
                    }));

                    setTransactions(normalized);
                } catch (err) {
                    console.error('Failed to fetch transactions', err);
                    // if token invalid, clear and force login
                    if (err.status === 401) {
                        localStorage.removeItem('spendsave_token');
                        localStorage.removeItem('spendsave_user');
                        setUser(null);
                        setCurrentPage('login');
                    }
                }
            })();
        } else {
            // no token: clear any old local storage data
            localStorage.removeItem('spendsave_transactions');
        }
    }, []);


    const handleAuth = async (e) => {
        e.preventDefault();
        // Login uses Email & Password
        if (authMode === 'login' && (!email || !password)) return;
        // Signup uses Email, Username, & Password
        if (authMode === 'signup' && (!email || !username || !password)) return;

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
                localStorage.setItem('spendsave_token', res.token);
            }
            // FIX: Ensure the user object being saved to storage/state contains username
            localStorage.setItem('spendsave_user', JSON.stringify(res.user));
            setUser(res.user);
            setCurrentPage('dashboard');

            // fetch transactions after login
            const txs = await api.getTransactions();
            const normalized = txs.map(t => ({
                ...t,
                id: t._id || t.id,
            }));
            setTransactions(normalized);

        } catch (err) {
            console.error(err);
            showNotification(err.body?.message || err.message || 'Auth failed', 'error', 4000);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('spendsave_token');
        localStorage.removeItem('spendsave_user');
        setUser(null);
        setCurrentPage('login');
    };

    // --- BUDGET HANDLERS ---
    const handleAddBudget = (e) => {
        e.preventDefault();
        if (!budgetCategory || !budgetAmount) return showNotification("Please select a category and amount!", 'warning');

        // CHECK FOR DUPLICATE TARGET
        if (budgets.some(b => b.category === budgetCategory)) {
            return showNotification(`⚠️ A target for "${budgetCategory}" already exists! Please delete the old one first.`, 'warning', 4000);
        }

        const newBudget = {
            id: Date.now(),
            category: budgetCategory,
            amount: parseFloat(budgetAmount),
            emoji: EXPENSE_CATEGORIES.find(c => c.name === budgetCategory)?.emoji || '💰'
        };

        const updatedBudgets = [...budgets, newBudget];
        setBudgets(updatedBudgets);
        localStorage.setItem('spendsave_budgets', JSON.stringify(updatedBudgets));

        setShowBudgetModal(false);
        setBudgetCategory('');
        setBudgetAmount('');
    };

    const handleDeleteBudget = (id) => {
        const updated = budgets.filter(b => b.id !== id);
        setBudgets(updated);
        localStorage.setItem('spendsave_budgets', JSON.stringify(updated));
    };

    const calculateBudgetProgress = (category) => {
        // Calculate total spent in this category
        const spent = transactions
            .filter(t => t.type === 'expense' && t.category === category)
            .reduce((sum, t) => sum + (t.amount || 0), 0);
        return spent;
    };

    // --- SAVINGS HANDLERS ---
    const handleAddSavingsGoal = (e) => {
        e.preventDefault();
        if (!savingsCategory || !savingsAmount) return showNotification("Please select a category and amount!", 'warning');

        // CHECK FOR DUPLICATE GOAL
        if (savingsGoals.some(g => g.category === savingsCategory)) {
            return showNotification(`⚠️ A goal for "${savingsCategory}" already exists! Please delete the old one first.`, 'warning', 4000);
        }

        const newGoal = {
            id: Date.now(),
            category: savingsCategory,
            amount: parseFloat(savingsAmount),
            emoji: INCOME_CATEGORIES.find(c => c.name === savingsCategory)?.emoji || '💰'
        };

        const updatedGoals = [...savingsGoals, newGoal];
        setSavingsGoals(updatedGoals);
        localStorage.setItem('spendsave_savings', JSON.stringify(updatedGoals));

        setShowSavingsModal(false);
        setSavingsCategory('');
        setSavingsAmount('');
    };

    const handleDeleteSavingsGoal = (id) => {
        const updated = savingsGoals.filter(g => g.id !== id);
        setSavingsGoals(updated);
        localStorage.setItem('spendsave_savings', JSON.stringify(updated));
    };

    const calculateSavingsProgress = (category) => {
        return transactions
            .filter(t => t.type === 'income' && t.category === category)
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
        try {
            let updatedTxs;

            if (editingTransaction) {
                const id = editingTransaction._id || editingTransaction.id;
                const updated = await api.updateTransaction(id, payload);
                updatedTxs = transactions.map(t => ((t._id === id) || (t.id === id)) ? updated : t);
                setEditingTransaction(null);
            } else {
                const created = await api.createTransaction(payload);
                // prepend to state
                updatedTxs = [created, ...transactions];
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

            // NEW: Check for budget overspending
            if (transactionType === 'expense') {
                const spendingBudget = budgets.find(b => b.category === finalCategory);
                if (spendingBudget) {
                    const currentSpent = calculateBudgetProgress(finalCategory);
                    // Note: calculateBudgetProgress is sync and based on 'transactions' state, 
                    // which we just updated. However, React state updates are async, 
                    // so 'transactions' might not reflect the new one yet depending on timing,
                    // BUT 'updatedTxs' DOES have it. Let's use updatedTxs for accuracy.

                    const newTotal = updatedTxs
                        .filter(t => t.type === 'expense' && t.category === finalCategory)
                        .reduce((sum, t) => sum + (t.amount || 0), 0);

                    if (newTotal > spendingBudget.amount) {
                        showNotification(`Alert: You have exceeded your ${finalCategory} target!\nTarget: ₦${spendingBudget.amount.toLocaleString()}\nSpent: ₦${newTotal.toLocaleString()}`, 'warning', 5000);
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
                        }, 500);
                    }
                }
            }

        } catch (err) {
            if (err?.body?.message === "Insufficient balance. Cannot record this expense.") {
                showNotification("You do not have enough balance for this expense!", 'error', 4000);
            } else {
                showNotification(err?.body?.message || err?.message || "Transaction failed", 'error', 4000);
            }
            console.error('Transaction error', err);
        }
    };

    const deleteTransaction = async (id) => {
        try {
            await api.deleteTransaction(id);
            setTransactions(transactions.filter(t => (t._id || t.id) !== id));
            setCurrentPage('dashboard');
            showNotification('Transaction deleted successfully!', 'success');
        } catch (err) {
            console.error(err);
            showNotification('Failed to delete transaction', 'error');
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
                                <input
                                    type="password"
                                    placeholder="PASSWORD"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/50 text-white border-2 border-genz-card rounded-2xl px-5 py-4 focus:outline-none focus:border-genz-aqua focus:shadow-[0_0_15px_rgba(92,196,246,0.3)] transition-all placeholder:text-genz-textDim/50 font-medium"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="w-full bg-genz-purple text-black py-4 rounded-2xl font-black uppercase tracking-wider hover:bg-genz-pink hover:scale-[1.02] transition-all duration-300 shadow-genz-purple-brutalist hover:shadow-genz-pink-brutalist active:translate-y-1 active:shadow-none"
                                >
                                    {authMode === 'login' ? "Let's Go" : 'Create Account'}
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

                            <div className="mt-8 grid grid-cols-3 gap-2">
                                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3">
                                    <p className="text-black text-[10px] font-black uppercase tracking-wider">Money In</p>
                                    <p className="text-genz-aqua font-bold text-sm lg:text-lg">+₦{totalIncome.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                </div>
                                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3">
                                    <p className="text-black text-[10px] font-black uppercase tracking-wider">Money Out</p>
                                    <p className="text-genz-pink font-bold text-sm lg:text-lg">-₦{totalExpense.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                                </div>
                                <div className="bg-black/20 backdrop-blur-sm rounded-xl p-3">
                                    <p className="text-black text-[8px] font-black uppercase tracking-wider">Total Transactions</p>
                                    <p className="text-white font-bold text-sm lg:text-lg">₦{(totalIncome + totalExpense).toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
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
                                    className={`py-4 rounded-xl font-bold uppercase tracking-wider transition-all ${transactionType === 'expense'
                                        ? 'bg-genz-pink text-black shadow-lg'
                                        : 'text-genz-textDim hover:text-white'
                                        } ${editingTransaction ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Expense
                                </button>
                                <button
                                    type="button"
                                    onClick={() => !editingTransaction && setTransactionType('income')}
                                    className={`py-4 rounded-xl font-bold uppercase tracking-wider transition-all ${transactionType === 'income'
                                        ? 'bg-genz-aqua text-black shadow-lg'
                                        : 'text-genz-textDim hover:text-white'
                                        } ${editingTransaction ? 'opacity-50 cursor-not-allowed' : ''}`}
                                >
                                    Income
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
                                <div className="grid grid-cols-3 gap-3">
                                    {(transactionType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES).map(cat => (
                                        <button
                                            key={cat.name}
                                            type="button"
                                            onClick={() => setCategory(cat.name)}
                                            className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${category === cat.name
                                                ? 'bg-black/50 border-genz-aqua shadow-[0_0_15px_rgba(92,196,246,0.3)]'
                                                : 'bg-genz-card/50 border-genz-card hover:border-genz-textDim/50'
                                                }`}
                                        >
                                            <div className="text-2xl">{cat.emoji}</div>
                                            <div className="text-[10px] font-bold uppercase tracking-wide">{cat.name}</div>
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
                                className="w-full bg-genz-aqua text-black py-5 rounded-2xl font-black hover:bg-genz-purple transition-all shadow-genz-purple-brutalist active:translate-y-1 active:shadow-none"
                            >
                                {editingTransaction ? 'Save Changes' : 'Add Transaction'}
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
                            <p className="text-genz-textDim font-mono text-xl mb-4">{user.email || 'No Email'}</p>

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
                                            const spent = calculateBudgetProgress(budget.category);
                                            const progress = Math.min((spent / budget.amount) * 100, 100);
                                            const isExceeded = spent > budget.amount;

                                            return (
                                                <div key={budget.id} className="bg-black/30 rounded-xl p-3 relative group">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xl">{budget.emoji}</span>
                                                            <span className="font-bold text-sm">{budget.category}</span>
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
                                                        onClick={() => handleDeleteBudget(budget.id)}
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
                                                const saved = calculateSavingsProgress(goal.category);
                                                const progress = Math.min((saved / goal.amount) * 100, 100);
                                                const isCompleted = saved >= goal.amount;

                                                return (
                                                    <div key={goal.id} className={`rounded-xl p-3 relative group ${isCompleted ? 'bg-green-900/20 border border-green-500/30' : 'bg-black/30'}`}>
                                                        <div className="flex justify-between items-center mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-xl">{goal.emoji}</span>
                                                                <span className="font-bold text-sm text-white">{goal.category}</span>
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
                                                            onClick={() => handleDeleteSavingsGoal(goal.id)}
                                                            className="absolute top-2 right-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                                        >
                                                            <Icons.Trash />
                                                        </button>
                                                    </div>
                                                );
                                            })
                                        )}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-6 mb-2 pt-4 border-t border-genz-borderDark/50">
                                    <span className="text-genz-textDim text-sm font-bold uppercase tracking-wider">Current Streak</span>
                                    <span className="text-white font-bold">{getStreak()} 🔥</span>
                                </div>

                                {/* Badges Section */}
                                <div className="pt-6 border-t border-genz-borderDark/50 mt-6 text-left">
                                    <span className="text-genz-textDim text-sm font-bold uppercase tracking-wider mb-4 block">Achievements 🏆</span>
                                    <div className="flex gap-3 flex-wrap">
                                        {/* Badge 1: Early Bird (First Transaction) */}
                                        {transactions.length > 0 && (
                                            <div className="bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 p-2 rounded-xl flex items-center gap-2 group hover:scale-105 transition-all cursor-default">
                                                <span className="text-2xl drop-shadow-lg">🌟</span>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] bg-yellow-500/20 text-yellow-300 px-1.5 py-0.5 rounded uppercase font-bold w-fit">Starter</span>
                                                    <span className="text-xs font-bold text-white">First Step</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Badge 2: Streak Master (Streak > 3) */}
                                        {getStreak() > 3 && (
                                            <div className="bg-gradient-to-br from-red-500/20 to-pink-500/20 border border-red-500/30 p-2 rounded-xl flex items-center gap-2 group hover:scale-105 transition-all cursor-default">
                                                <span className="text-2xl drop-shadow-lg">🔥</span>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded uppercase font-bold w-fit">Hot</span>
                                                    <span className="text-xs font-bold text-white">On Fire!</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Badge 3: Goal Crusher (Completed a Savings Goal) */}
                                        {savingsGoals.some(g => calculateSavingsProgress(g.category) >= g.amount) && (
                                            <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/30 p-2 rounded-xl flex items-center gap-2 group hover:scale-105 transition-all cursor-default">
                                                <span className="text-2xl drop-shadow-lg">💎</span>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded uppercase font-bold w-fit">Rich</span>
                                                    <span className="text-xs font-bold text-white">Goal Crusher</span>
                                                </div>
                                            </div>
                                        )}

                                        {/* Placeholder Badge (Locked) */}
                                        {getStreak() < 30 && (
                                            <div className="bg-black/20 border border-white/5 p-2 rounded-xl flex items-center gap-2 opacity-50 grayscale">
                                                <span className="text-2xl">👑</span>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] bg-white/10 text-genz-textDim px-1.5 py-0.5 rounded uppercase font-bold w-fit">Locked</span>
                                                    <span className="text-xs font-bold text-genz-textDim">Monthly King</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="w-full bg-red-600/50 text-white py-4 rounded-xl font-bold uppercase tracking-wider hover:bg-red-600 transition-all flex items-center justify-center gap-2 border border-red-600/30"
                        >
                            Log Out
                        </button>

                        {/* Add Budget Modal */}
                        {showBudgetModal && (
                            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                                <div className="bg-genz-card border border-genz-borderDark w-full max-w-sm rounded-[2rem] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                                    <h3 className="text-2xl font-black text-white mb-6">Set Target 🎯</h3>
                                    <form onSubmit={handleAddBudget} className="space-y-4">
                                        <div>
                                            <label className="block text-genz-textDim text-xs font-bold uppercase mb-2">Category</label>
                                            <div className="grid grid-cols-5 gap-2">
                                                {EXPENSE_CATEGORIES.map(cat => (
                                                    <button
                                                        key={cat.name}
                                                        type="button"
                                                        onClick={() => setBudgetCategory(cat.name)}
                                                        className={`aspect-square rounded-xl flex items-center justify-center text-xl transition-all ${budgetCategory === cat.name ? 'bg-genz-aqua text-white scale-110 shadow-lg shadow-genz-aqua/20' : 'bg-genz-dark text-genz-textDim hover:bg-genz-borderDark'}`}
                                                    >
                                                        {cat.emoji}
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

                                        <div className="flex gap-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={() => setShowBudgetModal(false)}
                                                className="flex-1 py-4 rounded-xl font-bold text-genz-textDim hover:text-white hover:bg-genz-dark transition-all"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-1 bg-genz-aqua text-white py-4 rounded-xl font-bold shadow-lg shadow-genz-aqua/20 hover:scale-[1.02] active:scale-95 transition-all"
                                            >
                                                Save Target
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Add Savings Modal */}
                        {showSavingsModal && (
                            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                                <div className="bg-genz-card border border-genz-borderDark w-full max-w-sm rounded-[2rem] p-6 shadow-2xl animate-in zoom-in-95 duration-200">
                                    <h3 className="text-2xl font-black text-white mb-6">Set Goal 💸</h3>
                                    <form onSubmit={handleAddSavingsGoal} className="space-y-4">
                                        <div>
                                            <label className="block text-genz-textDim text-xs font-bold uppercase mb-2">Income</label>
                                            <div className="grid grid-cols-4 gap-2">
                                                {INCOME_CATEGORIES.map(cat => (
                                                    <button
                                                        key={cat.name}
                                                        type="button"
                                                        onClick={() => setSavingsCategory(cat.name)}
                                                        className={`aspect-square rounded-xl flex items-center justify-center text-xl transition-all ${savingsCategory === cat.name ? 'bg-green-500 text-black scale-110 shadow-lg shadow-green-500/20' : 'bg-genz-dark text-genz-textDim hover:bg-genz-borderDark'}`}
                                                    >
                                                        {cat.emoji}
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
                                                    className="w-full bg-genz-dark border border-genz-borderDark rounded-xl py-4 pl-10 pr-4 text-white font-bold focus:outline-none focus:border-green-500 transition-colors"
                                                    placeholder="0.00"
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-3 pt-4">
                                            <button
                                                type="button"
                                                onClick={() => setShowSavingsModal(false)}
                                                className="flex-1 py-4 rounded-xl font-bold text-genz-textDim hover:text-white hover:bg-genz-dark transition-all"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="flex-1 bg-green-500 text-black py-4 rounded-xl font-bold shadow-lg shadow-green-500/20 hover:scale-[1.02] active:scale-95 transition-all"
                                            >
                                                Save Goal
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* Confetti Overlay */}
                        {showConfetti && <Confetti />}
                    </div>
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