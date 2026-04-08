'use client'
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { Income, Expense, Debt, DebtPayment } from './types'
import { SEED_INCOME, SEED_EXPENSES, SEED_DEBTS, SEED_DEBT_PAYMENTS } from './seed-data'

interface StoreState {
  income: Income[]
  expenses: Expense[]
  debts: Debt[]
  debtPayments: DebtPayment[]
}

interface StoreActions {
  addIncome: (item: Omit<Income, 'id'>) => void
  updateIncome: (item: Income) => void
  deleteIncome: (id: string) => void
  addExpense: (item: Omit<Expense, 'id'>) => void
  updateExpense: (item: Expense) => void
  deleteExpense: (id: string) => void
  addDebt: (item: Omit<Debt, 'id'>) => void
  updateDebt: (item: Debt) => void
  deleteDebt: (id: string) => void
  addDebtPayment: (item: Omit<DebtPayment, 'id'>) => void
  updateDebtPayment: (item: DebtPayment) => void
  deleteDebtPayment: (id: string) => void
}

const StoreContext = createContext<StoreState & StoreActions>({} as StoreState & StoreActions)

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [income, setIncome] = useState<Income[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [debts, setDebts] = useState<Debt[]>([])
  const [debtPayments, setDebtPayments] = useState<DebtPayment[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    try {
      const savedIncome = localStorage.getItem('wa_income')
      const savedExpenses = localStorage.getItem('wa_expenses')
      const savedDebts = localStorage.getItem('wa_debts')
      const savedPayments = localStorage.getItem('wa_debt_payments')
      setIncome(savedIncome ? JSON.parse(savedIncome) : SEED_INCOME)
      setExpenses(savedExpenses ? JSON.parse(savedExpenses) : SEED_EXPENSES)
      setDebts(savedDebts ? JSON.parse(savedDebts) : SEED_DEBTS)
      setDebtPayments(savedPayments ? JSON.parse(savedPayments) : SEED_DEBT_PAYMENTS)
    } catch {
      setIncome(SEED_INCOME)
      setExpenses(SEED_EXPENSES)
      setDebts(SEED_DEBTS)
      setDebtPayments(SEED_DEBT_PAYMENTS)
    }
    setLoaded(true)
  }, [])

  useEffect(() => { if (loaded) localStorage.setItem('wa_income', JSON.stringify(income)) }, [income, loaded])
  useEffect(() => { if (loaded) localStorage.setItem('wa_expenses', JSON.stringify(expenses)) }, [expenses, loaded])
  useEffect(() => { if (loaded) localStorage.setItem('wa_debts', JSON.stringify(debts)) }, [debts, loaded])
  useEffect(() => { if (loaded) localStorage.setItem('wa_debt_payments', JSON.stringify(debtPayments)) }, [debtPayments, loaded])

  const genId = () => `${Date.now()}-${Math.random().toString(36).slice(2)}`

  const addIncome = useCallback((item: Omit<Income, 'id'>) => setIncome(p => [...p, { ...item, id: genId() }]), [])
  const updateIncome = useCallback((item: Income) => setIncome(p => p.map(i => i.id === item.id ? item : i)), [])
  const deleteIncome = useCallback((id: string) => setIncome(p => p.filter(i => i.id !== id)), [])

  const addExpense = useCallback((item: Omit<Expense, 'id'>) => setExpenses(p => [...p, { ...item, id: genId() }]), [])
  const updateExpense = useCallback((item: Expense) => setExpenses(p => p.map(i => i.id === item.id ? item : i)), [])
  const deleteExpense = useCallback((id: string) => setExpenses(p => p.filter(i => i.id !== id)), [])

  const addDebt = useCallback((item: Omit<Debt, 'id'>) => setDebts(p => [...p, { ...item, id: genId() }]), [])
  const updateDebt = useCallback((item: Debt) => setDebts(p => p.map(i => i.id === item.id ? item : i)), [])
  const deleteDebt = useCallback((id: string) => setDebts(p => p.filter(i => i.id !== id)), [])

  const addDebtPayment = useCallback((item: Omit<DebtPayment, 'id'>) => setDebtPayments(p => [...p, { ...item, id: genId() }]), [])
  const updateDebtPayment = useCallback((item: DebtPayment) => setDebtPayments(p => p.map(i => i.id === item.id ? item : i)), [])
  const deleteDebtPayment = useCallback((id: string) => setDebtPayments(p => p.filter(i => i.id !== id)), [])

  return (
    <StoreContext.Provider value={{
      income, expenses, debts, debtPayments,
      addIncome, updateIncome, deleteIncome,
      addExpense, updateExpense, deleteExpense,
      addDebt, updateDebt, deleteDebt,
      addDebtPayment, updateDebtPayment, deleteDebtPayment,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export const useStore = () => useContext(StoreContext)
