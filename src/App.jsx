import './App.css'

import React, { useState, useEffect } from 'react';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Icons
const Icons = {
  Plus: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  Chart: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
  User: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>,
  Home: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Edit: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>,
  Trash: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
  ArrowLeft: () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
};

const EXPENSE_CATEGORIES = [
  { name: 'Snacks', emoji: '🍿' },
  { name: 'Food', emoji: '🍕' },
  { name: 'Groceries', emoji: '🛒' },
  { name: 'Travel', emoji: '✈️' },
  { name: 'Commute', emoji: '🚌' },
  { name: 'Subscriptions', emoji: '📱' },
  { name: 'Airtime', emoji: '📞' },
  { name: 'Shopping', emoji: '🛍️' },
  { name: 'Gift', emoji: '🎁' },
  { name: 'Misc', emoji: '📦' },
];

const INCOME_CATEGORIES = [
  { name: 'Salary', emoji: '💼' },
  { name: 'Freelance', emoji: '💻' },
  { name: 'Gift', emoji: '🎁' },
  { name: 'Other', emoji: '💰' },
];

const App = () => {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Auth state
  const [authMode, setAuthMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Transaction form state
  const [transactionType, setTransactionType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('spendsave_user');
    const savedTransactions = localStorage.getItem('spendsave_transactions');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setCurrentPage('dashboard');
    }
    if (savedTransactions) {
      setTransactions(JSON.parse(savedTransactions));
    }
  }, []);

  useEffect(() => {
    if (transactions.length > 0) {
      localStorage.setItem('spendsave_transactions', JSON.stringify(transactions));
    }
  }, [transactions]);

  const handleAuth = (e) => {
    e.preventDefault();
    if (username && password) {
      const userData = { username, id: Date.now() };
      setUser(userData);
      localStorage.setItem('spendsave_user', JSON.stringify(userData));
      setCurrentPage('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('spendsave_user');
    setCurrentPage('login');
  };

  const addTransaction = (e) => {
    e.preventDefault();
    const finalCategory = category === 'Other' ? customCategory : category;
    const categoryEmoji = transactionType === 'expense' 
      ? EXPENSE_CATEGORIES.find(c => c.name === category)?.emoji || '📦'
      : INCOME_CATEGORIES.find(c => c.name === category)?.emoji || '💰';

    const newTransaction = {
      id: Date.now(),
      amount: parseFloat(amount),
      type: transactionType,
      category: finalCategory,
      emoji: categoryEmoji,
      note,
      createdAt: new Date().toISOString(),
    };

    if (editingTransaction) {
      setTransactions(transactions.map(t => t.id === editingTransaction.id ? { ...newTransaction, id: editingTransaction.id } : t));
      setEditingTransaction(null);
    } else {
      setTransactions([newTransaction, ...transactions]);
    }

    setAmount('');
    setCategory('');
    setCustomCategory('');
    setNote('');
    setCurrentPage('dashboard');
  };

  const deleteTransaction = (id) => {
    setTransactions(transactions.filter(t => t.id !== id));
    setCurrentPage('dashboard');
  };

  const startEdit = (transaction) => {
    setEditingTransaction(transaction);
    setTransactionType(transaction.type);
    setAmount(transaction.amount.toString());
    setCategory(transaction.category);
    setNote(transaction.note);
    setCurrentPage('add');
  };

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const balance = totalIncome - totalExpense;

  const getStreak = () => {
    if (transactions.length === 0) return 0;
    const uniqueDays = new Set(transactions.map(t => new Date(t.createdAt).toDateString())).size;
    return uniqueDays;
  };

  const getCategoryData = () => {
    const categoryTotals = {};
    transactions.forEach(t => {
      if (!categoryTotals[t.category]) {
        categoryTotals[t.category] = { name: t.category, value: 0, emoji: t.emoji };
      }
      categoryTotals[t.category].value += t.amount;
    });
    return Object.values(categoryTotals);
  };

  const getWeeklyData = () => {
    const weekData = {};
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
    return Object.values(weekData);
  };

  const COLORS = ['#10b981', '#8b5cf6', '#ec4899', '#06b6d4', '#f59e0b', '#ef4444', '#3b82f6', '#14b8a6'];

  // Auth Page
  if (currentPage === 'login' || currentPage === 'signup') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-3xl p-8 w-full max-w-md shadow-2xl border border-purple-500/20">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              SpendSave
            </h1>
            <p className="text-gray-400">Track your money, save your future 💰</p>
          </div>

          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setAuthMode('login')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                authMode === 'login'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setAuthMode('signup')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                authMode === 'signup'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-700 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all"
            >
              {authMode === 'login' ? 'Login' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Dashboard
  if (currentPage === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 pb-24">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white">Hey {user.username}! 👋</h1>
              <p className="text-gray-400 text-sm">🔥 {getStreak()} day streak!</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 mb-6">
            <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-2xl p-6 shadow-xl">
              <p className="text-emerald-100 text-sm mb-1">Current Balance</p>
              <p className="text-4xl font-bold text-white">₦{balance.toLocaleString()}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-800 rounded-2xl p-4 border border-emerald-500/20">
                <p className="text-gray-400 text-sm mb-1">Income</p>
                <p className="text-2xl font-bold text-emerald-400">₦{totalIncome.toLocaleString()}</p>
              </div>
              <div className="bg-gray-800 rounded-2xl p-4 border border-pink-500/20">
                <p className="text-gray-400 text-sm mb-1">Expenses</p>
                <p className="text-2xl font-bold text-pink-400">₦{totalExpense.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-bold text-white mb-3">Recent Transactions</h2>
            {transactions.length === 0 ? (
              <div className="bg-gray-800 rounded-2xl p-8 text-center border border-purple-500/20">
                <p className="text-gray-400">No transactions yet 😴</p>
                <p className="text-gray-500 text-sm mt-2">Tap the + button to add one!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.slice(0, 10).map(transaction => (
                  <div
                    key={transaction.id}
                    onClick={() => { setSelectedTransaction(transaction); setCurrentPage('details'); }}
                    className="bg-gray-800 rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-gray-750 transition-all border border-gray-700"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{transaction.emoji}</div>
                      <div>
                        <p className="text-white font-semibold">{transaction.category}</p>
                        <p className="text-gray-400 text-sm">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className={`text-lg font-bold ${transaction.type === 'income' ? 'text-emerald-400' : 'text-pink-400'}`}>
                      {transaction.type === 'income' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={() => setCurrentPage('add')}
          className="fixed bottom-24 right-6 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white w-16 h-16 rounded-full shadow-2xl flex items-center justify-center hover:shadow-emerald-500/50 transition-all"
        >
          <Icons.Plus />
        </button>

        <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 px-6 py-4">
          <div className="flex justify-around items-center max-w-md mx-auto">
            <button onClick={() => setCurrentPage('dashboard')} className="flex flex-col items-center gap-1 text-emerald-400">
              <Icons.Home />
              <span className="text-xs">Home</span>
            </button>
            <button onClick={() => setCurrentPage('analytics')} className="flex flex-col items-center gap-1 text-gray-400">
              <Icons.Chart />
              <span className="text-xs">Analytics</span>
            </button>
            <button onClick={() => setCurrentPage('profile')} className="flex flex-col items-center gap-1 text-gray-400">
              <Icons.User />
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </nav>
      </div>
    );
  }

  // Add Transaction Page
  if (currentPage === 'add') {
    const categories = transactionType === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6 pb-24">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => { setCurrentPage('dashboard'); setEditingTransaction(null); }} className="text-white">
            <Icons.ArrowLeft />
          </button>
          <h1 className="text-2xl font-bold text-white">{editingTransaction ? 'Edit' : 'Add'} Transaction</h1>
        </div>

        <form onSubmit={addTransaction} className="space-y-6">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTransactionType('expense')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                transactionType === 'expense'
                  ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              💸 Expense
            </button>
            <button
              type="button"
              onClick={() => setTransactionType('income')}
              className={`flex-1 py-3 rounded-xl font-semibold transition-all ${
                transactionType === 'income'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                  : 'bg-gray-800 text-gray-400'
              }`}
            >
              💰 Income
            </button>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">Amount</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-xl">₦</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="w-full bg-gray-800 text-white rounded-xl pl-10 pr-4 py-4 text-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-gray-400 text-sm mb-2 block">Category</label>
            <div className="grid grid-cols-3 gap-3">
              {categories.map(cat => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setCategory(cat.name)}
                  className={`p-4 rounded-xl transition-all ${
                    category === cat.name
                      ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white'
                      : 'bg-gray-800 text-gray-300'
                  }`}
                >
                  <div className="text-2xl mb-1">{cat.emoji}</div>
                  <div className="text-xs">{cat.name}</div>
                </button>
              ))}
            </div>
          </div>

          {category === 'Other' && (
            <div>
              <input
                type="text"
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Enter custom category"
                className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>
          )}

          <div>
            <label className="text-gray-400 text-sm mb-2 block">Note (optional)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note..."
              className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              rows="3"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-emerald-500 to-cyan-500 text-white py-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/50 transition-all"
          >
            {editingTransaction ? 'Update' : 'Add'} Transaction
          </button>
        </form>
      </div>
    );
  }

  // Transaction Details Page
  if (currentPage === 'details' && selectedTransaction) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 p-6">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setCurrentPage('dashboard')} className="text-white">
            <Icons.ArrowLeft />
          </button>
          <h1 className="text-2xl font-bold text-white">Transaction Details</h1>
        </div>

        <div className="bg-gray-800 rounded-3xl p-8 border border-purple-500/20 mb-6">
          <div className="text-center mb-6">
            <div className="text-6xl mb-4">{selectedTransaction.emoji}</div>
            <h2 className="text-3xl font-bold text-white mb-2">{selectedTransaction.category}</h2>
            <p className={`text-4xl font-bold ${selectedTransaction.type === 'income' ? 'text-emerald-400' : 'text-pink-400'}`}>
              {selectedTransaction.type === 'income' ? '+' : '-'}₦{selectedTransaction.amount.toLocaleString()}
            </p>
          </div>

          <div className="space-y-4 border-t border-gray-700 pt-6">
            <div>
              <p className="text-gray-400 text-sm">Type</p>
              <p className="text-white capitalize">{selectedTransaction.type}</p>
            </div>
            <div>
              <p className="text-gray-400 text-sm">Date</p>
              <p className="text-white">{new Date(selectedTransaction.createdAt).toLocaleString()}</p>
            </div>
            {selectedTransaction.note && (
              <div>
                <p className="text-gray-400 text-sm">Note</p>
                <p className="text-white">{selectedTransaction.note}</p>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => startEdit(selectedTransaction)}
            className="flex-1 bg-gray-800 text-white py-4 rounded-xl font-semibold hover:bg-gray-700 transition-all flex items-center justify-center gap-2"
          >
            <Icons.Edit />
            Edit
          </button>
          <button
            onClick={() => deleteTransaction(selectedTransaction.id)}
            className="flex-1 bg-red-500/20 text-red-400 py-4 rounded-xl font-semibold hover:bg-red-500/30 transition-all flex items-center justify-center gap-2 border border-red-500/30"
          >
            <Icons.Trash />
            Delete
          </button>
        </div>
      </div>
    );
  }

  // Analytics Page
  if (currentPage === 'analytics') {
    const categoryData = getCategoryData();
    const weeklyData = getWeeklyData();
    const biggestExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((max, t) => {
        const categoryTotal = transactions
          .filter(tr => tr.category === t.category && tr.type === 'expense')
          .reduce((sum, tr) => sum + tr.amount, 0);
        return categoryTotal > max.total ? { category: t.category, total: categoryTotal, emoji: t.emoji } : max;
      }, { category: '', total: 0, emoji: '' });

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 pb-24">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Analytics 📊</h1>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800 rounded-2xl p-4 border border-emerald-500/20">
              <p className="text-gray-400 text-sm mb-1">Total Income</p>
              <p className="text-2xl font-bold text-emerald-400">₦{totalIncome.toLocaleString()}</p>
            </div>
            <div className="bg-gray-800 rounded-2xl p-4 border border-pink-500/20">
              <p className="text-gray-400 text-sm mb-1">Total Expense</p>
              <p className="text-2xl font-bold text-pink-400">₦{totalExpense.toLocaleString()}</p>
            </div>
          </div>

          {biggestExpense.category && (
            <div className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 rounded-2xl p-4 mb-6 border border-pink-500/30">
              <p className="text-gray-300 text-sm mb-2">💡 Biggest Spending Category</p>
              <p className="text-white text-xl font-bold">
                {biggestExpense.emoji} {biggestExpense.category}: ₦{biggestExpense.total.toLocaleString()}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                You spent {((biggestExpense.total / totalExpense) * 100).toFixed(0)}% of your expenses here 😭
              </p>
            </div>
          )}

          {categoryData.length > 0 && (
            <div className="bg-gray-800 rounded-2xl p-6 mb-6 border border-purple-500/20">
              <h2 className="text-white font-bold mb-4">Spending by Category</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {weeklyData.length > 0 && (
            <div className="bg-gray-800 rounded-2xl p-6 border border-purple-500/20">
              <h2 className="text-white font-bold mb-4">Weekly Trend</h2>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="day" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px' }} />
                  <Legend />
                  <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} />
                  <Line type="monotone" dataKey="expense" stroke="#ec4899" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 px-6 py-4">
          <div className="flex justify-around items-center max-w-md mx-auto">
            <button onClick={() => setCurrentPage('dashboard')} className="flex flex-col items-center gap-1 text-gray-400">
              <Icons.Home />
              <span className="text-xs">Home</span>
            </button>
            <button onClick={() => setCurrentPage('analytics')} className="flex flex-col items-center gap-1 text-emerald-400">
              <Icons.Chart />
              <span className="text-xs">Analytics</span>
            </button>
            <button onClick={() => setCurrentPage('profile')} className="flex flex-col items-center gap-1 text-gray-400">
              <Icons.User />
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </nav>
      </div>
    );
  }

  // Profile Page
  if (currentPage === 'profile') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 pb-24">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white mb-6">Profile</h1>

          <div className="bg-gray-800 rounded-2xl p-6 mb-6 border border-purple-500/20 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              👤
            </div>
            <h2 className="text-2xl font-bold text-white mb-1">{user.username}</h2>
            <p className="text-gray-400">SpendSave Member</p>
          </div>

          <div className="bg-gray-800 rounded-2xl p-6 mb-6 border border-purple-500/20">
            <h3 className="text-white font-bold mb-4">Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Transactions</span>
                <span className="text-white font-semibold">{transactions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Days Active</span>
                <span className="text-white font-semibold">{getStreak()} days 🔥</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Current Balance</span>
                <span className="text-emerald-400 font-semibold">₦{balance.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button className="w-full bg-gray-800 text-white py-4 rounded-xl font-semibold hover:bg-gray-700 transition-all text-left px-6 border border-gray-700">
              🎨 App Theme: Dark Mode
            </button>
            <button className="w-full bg-gray-800 text-white py-4 rounded-xl font-semibold hover:bg-gray-700 transition-all text-left px-6 border border-gray-700">
              📱 Notifications: Enabled
            </button>
            <button 
              onClick={handleLogout}
              className="w-full bg-red-500/20 text-red-400 py-4 rounded-xl font-semibold hover:bg-red-500/30 transition-all border border-red-500/30"
            >
              🚪 Logout
            </button>
          </div>
        </div>

        <nav className="fixed bottom-0 left-0 right-0 bg-gray-800 border-t border-gray-700 px-6 py-4">
          <div className="flex justify-around items-center max-w-md mx-auto">
            <button onClick={() => setCurrentPage('dashboard')} className="flex flex-col items-center gap-1 text-gray-400">
              <Icons.Home />
              <span className="text-xs">Home</span>
            </button>
            <button onClick={() => setCurrentPage('analytics')} className="flex flex-col items-center gap-1 text-gray-400">
              <Icons.Chart />
              <span className="text-xs">Analytics</span>
            </button>
            <button onClick={() => setCurrentPage('profile')} className="flex flex-col items-center gap-1 text-emerald-400">
              <Icons.User />
              <span className="text-xs">Profile</span>
            </button>
          </div>
        </nav>
      </div>
    );
  }

  return null;
};

export default App;

