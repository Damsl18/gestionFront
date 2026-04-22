// src/api/endpoints.js
// Centralise tous les chemins d'API pour éviter les fautes de frappe

export const ENDPOINTS = {
  // Auth
  login: '/auth/token/',
  refresh: '/auth/token/refresh/',
  me: '/auth/me/',

  // Business
  business: '/business/',

  // Items
  items: '/items/',
  itemDetail: (id) => `/items/${id}/`,

  // Categories
  categories: '/categories/',
  categoryDetail: (id) => `/categories/${id}/`,

  // Stocks
  stocks: '/stocks/',
  stockDetail: (id) => `/stocks/${id}/`,

  // Suppliers
  suppliers: '/suppliers/',
  supplierDetail: (id) => `/suppliers/${id}/`,

  // Transactions
  transactions: '/transactions/',
  transactionDetail: (id) => `/transactions/${id}/`,

  // Employees
  employees: '/employees/',
  employeeDetail: (id) => `/employees/${id}/`,

  // Reports / PDF
  reportDaily: '/reports/daily/',
  reportWeekly: '/reports/weekly/',
  reportMonthly: '/reports/monthly/',
};
