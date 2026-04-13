'use client'
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { Income, Expense, Debt, DebtPayment } from './types'
import { supabase } from './supabase'

interface StoreState {
  income: Income[]
  expenses: Expense[]
  debts: Debt[]
  debtPayments: DebtPayment[]
  loading: boolean
}

interface StoreActions {
  addIncome: (item: Omit<Income, 'id'>) => Promise<void>
  updateIncome: (item: Income) => Promise<void>
  deleteIncome: (id: string) => Promise<void>
  addExpense: (item: Omit<Expense, 'id'>) => Promise<void>
  updateExpense: (item: Expense) => Promise<void>
  deleteExpense: (id: string) => Promise<void>
  addDebt: (item: Omit<Debt, 'id'>) => Promise<void>
  updateDebt: (item: Debt) => Promise<void>
  deleteDebt: (id: string) => Promise<void>
  addDebtPayment: (item: Omit<DebtPayment, 'id'>) => Promise<void>
  updateDebtPayment: (item: DebtPayment) => Promise<void>
  deleteDebtPayment: (id: string) => Promise<void>
}

const StoreContext = createContext<StoreState & StoreActions>({} as StoreState & StoreActions)

// --- Mappers: DB snake_case ↔ TypeScript camelCase ---

const mapIncome = (r: Record<string, unknown>): Income => ({
  id: r.id as string,
  date: r.date as string,
  amount: Number(r.amount),
  businessAreaId: r.business_area_id as string,
  categoryId: r.category_id as string,
  paymentMethod: r.payment_method as string,
  description: r.description as string,
  notes: (r.notes as string) || '',
})

const mapExpense = (r: Record<string, unknown>): Expense => ({
  id: r.id as string,
  date: r.date as string,
  amount: Number(r.amount),
  businessAreaId: r.business_area_id as string,
  categoryId: r.category_id as string,
  paymentMethod: r.payment_method as string,
  description: r.description as string,
  notes: (r.notes as string) || '',
})

const mapDebt = (r: Record<string, unknown>): Debt => ({
  id: r.id as string,
  lenderName: r.lender_name as string,
  originalAmount: Number(r.original_amount),
  remainingBalance: Number(r.remaining_balance),
  interestRate: Number(r.interest_rate),
  dueDate: r.due_date as string,
  status: r.status as 'active' | 'overdue' | 'paid',
  purpose: (r.purpose as string) || '',
  notes: (r.notes as string) || '',
})

const mapDebtPayment = (r: Record<string, unknown>): DebtPayment => ({
  id: r.id as string,
  debtId: r.debt_id as string,
  paymentDate: r.payment_date as string,
  amountPaid: Number(r.amount_paid),
  balanceAfter: Number(r.balance_after),
  notes: (r.notes as string) || '',
})

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [income, setIncome] = useState<Income[]>([])
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [debts, setDebts] = useState<Debt[]>([])
  const [debtPayments, setDebtPayments] = useState<DebtPayment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true)
      const [incRes, expRes, debtRes, dpRes] = await Promise.all([
        supabase.from('income').select('*').order('date', { ascending: false }),
        supabase.from('expenses').select('*').order('date', { ascending: false }),
        supabase.from('debts').select('*').order('created_at', { ascending: false }),
        supabase.from('debt_payments').select('*').order('payment_date', { ascending: false }),
      ])
      if (incRes.data) setIncome(incRes.data.map(mapIncome))
      if (expRes.data) setExpenses(expRes.data.map(mapExpense))
      if (debtRes.data) setDebts(debtRes.data.map(mapDebt))
      if (dpRes.data) setDebtPayments(dpRes.data.map(mapDebtPayment))
      setLoading(false)
    }
    fetchAll()
  }, [])

  // --- Income ---
  const addIncome = useCallback(async (item: Omit<Income, 'id'>) => {
    const { data, error } = await supabase.from('income').insert({
      date: item.date,
      amount: item.amount,
      business_area_id: item.businessAreaId,
      category_id: item.categoryId,
      payment_method: item.paymentMethod,
      description: item.description,
      notes: item.notes,
    }).select().single()
    if (!error && data) setIncome(p => [mapIncome(data), ...p])
  }, [])

  const updateIncome = useCallback(async (item: Income) => {
    const { error } = await supabase.from('income').update({
      date: item.date,
      amount: item.amount,
      business_area_id: item.businessAreaId,
      category_id: item.categoryId,
      payment_method: item.paymentMethod,
      description: item.description,
      notes: item.notes,
    }).eq('id', item.id)
    if (!error) setIncome(p => p.map(i => i.id === item.id ? item : i))
  }, [])

  const deleteIncome = useCallback(async (id: string) => {
    const { error } = await supabase.from('income').delete().eq('id', id)
    if (!error) setIncome(p => p.filter(i => i.id !== id))
  }, [])

  // --- Expenses ---
  const addExpense = useCallback(async (item: Omit<Expense, 'id'>) => {
    const { data, error } = await supabase.from('expenses').insert({
      date: item.date,
      amount: item.amount,
      business_area_id: item.businessAreaId,
      category_id: item.categoryId,
      payment_method: item.paymentMethod,
      description: item.description,
      notes: item.notes,
    }).select().single()
    if (!error && data) setExpenses(p => [mapExpense(data), ...p])
  }, [])

  const updateExpense = useCallback(async (item: Expense) => {
    const { error } = await supabase.from('expenses').update({
      date: item.date,
      amount: item.amount,
      business_area_id: item.businessAreaId,
      category_id: item.categoryId,
      payment_method: item.paymentMethod,
      description: item.description,
      notes: item.notes,
    }).eq('id', item.id)
    if (!error) setExpenses(p => p.map(i => i.id === item.id ? item : i))
  }, [])

  const deleteExpense = useCallback(async (id: string) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (!error) setExpenses(p => p.filter(i => i.id !== id))
  }, [])

  // --- Debts ---
  const addDebt = useCallback(async (item: Omit<Debt, 'id'>) => {
    const { data, error } = await supabase.from('debts').insert({
      lender_name: item.lenderName,
      original_amount: item.originalAmount,
      remaining_balance: item.remainingBalance,
      interest_rate: item.interestRate,
      due_date: item.dueDate,
      status: item.status,
      purpose: item.purpose,
      notes: item.notes,
    }).select().single()
    if (!error && data) setDebts(p => [mapDebt(data), ...p])
  }, [])

  const updateDebt = useCallback(async (item: Debt) => {
    const { error } = await supabase.from('debts').update({
      lender_name: item.lenderName,
      original_amount: item.originalAmount,
      remaining_balance: item.remainingBalance,
      interest_rate: item.interestRate,
      due_date: item.dueDate,
      status: item.status,
      purpose: item.purpose,
      notes: item.notes,
    }).eq('id', item.id)
    if (!error) setDebts(p => p.map(i => i.id === item.id ? item : i))
  }, [])

  const deleteDebt = useCallback(async (id: string) => {
    const { error } = await supabase.from('debts').delete().eq('id', id)
    if (!error) setDebts(p => p.filter(i => i.id !== id))
  }, [])

  // --- Debt Payments ---
  const addDebtPayment = useCallback(async (item: Omit<DebtPayment, 'id'>) => {
    const { data, error } = await supabase.from('debt_payments').insert({
      debt_id: item.debtId,
      payment_date: item.paymentDate,
      amount_paid: item.amountPaid,
      balance_after: item.balanceAfter,
      notes: item.notes,
    }).select().single()
    if (!error && data) setDebtPayments(p => [mapDebtPayment(data), ...p])
  }, [])

  const updateDebtPayment = useCallback(async (item: DebtPayment) => {
    const { error } = await supabase.from('debt_payments').update({
      debt_id: item.debtId,
      payment_date: item.paymentDate,
      amount_paid: item.amountPaid,
      balance_after: item.balanceAfter,
      notes: item.notes,
    }).eq('id', item.id)
    if (!error) setDebtPayments(p => p.map(i => i.id === item.id ? item : i))
  }, [])

  const deleteDebtPayment = useCallback(async (id: string) => {
    const { error } = await supabase.from('debt_payments').delete().eq('id', id)
    if (!error) setDebtPayments(p => p.filter(i => i.id !== id))
  }, [])

  return (
    <StoreContext.Provider value={{
      income, expenses, debts, debtPayments, loading,
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
