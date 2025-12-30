// src/api.js
const API_BASE =
  import.meta.env.VITE_API_BASE ||
  window?.API_BASE ||
  "https://genz-finance-tracker.onrender.com";

async function request(path, options = {}) {
  const token = sessionStorage.getItem("spendsave_token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const text = await res.text();
    let body;
    try {
      body = JSON.parse(text);
    } catch {
      body = { message: text };
    }
    const err = new Error(body.message || "API Error");
    err.status = res.status;
    err.body = body;
    throw err;
  }

  return res.status === 204 ? null : res.json();
}

// ⭐ FIXED: Now accepts (email, username, password)
export const signup = (email, username, password) =>
  request("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify({ email, username, password }),
  });

// ⭐ FIXED: Now accepts (email, password)
export const login = (email, password) =>
  request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const getTransactions = () =>
  request("/api/transactions", { method: "GET" });

export const createTransaction = (tx) =>
  request("/api/transactions", {
    method: "POST",
    body: JSON.stringify(tx),
  });

export const updateTransaction = (id, tx) =>
  request(`/api/transactions/${id}`, {
    method: "PUT",
    body: JSON.stringify(tx),
  });

export const deleteTransaction = (id) =>
  request(`/api/transactions/${id}`, { method: "DELETE" });

// Budget API
export const getBudgets = () =>
  request("/api/budgets", { method: "GET" });

export const createBudget = (budget) =>
  request("/api/budgets", {
    method: "POST",
    body: JSON.stringify(budget),
  });

export const deleteBudget = (id) =>
  request(`/api/budgets/${id}`, { method: "DELETE" });

// Savings Goals API
export const getSavingsGoals = () =>
  request("/api/savings", { method: "GET" });

export const createSavingsGoal = (goal) =>
  request("/api/savings", {
    method: "POST",
    body: JSON.stringify(goal),
  });

export const deleteSavingsGoal = (id) =>
  request(`/api/savings/${id}`, { method: "DELETE" });

