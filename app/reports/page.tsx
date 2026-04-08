'use client'
import React, { useMemo } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { useStore } from '@/lib/store'
import { BUSINESS_AREAS, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/lib/constants'
import { formatCurrency } from '@/lib/utils'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts'

const COLORS = ['#DB2777', '#60A5FA', '#A78BFA', '#F472B6', '#FB7185', '#818CF8', '#EC4899', '#38BDF8']

export default function ReportsPage() {
  const { income, expenses, debts, debtPayments } = useStore()

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  // Last 6 months data
  const monthlyData = useMemo(() => {
    const months = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(currentYear, currentMonth - i, 1)
      const m = d.getMonth()
      const y = d.getFullYear()
      const monthIncome = income.filter(item => {
        const id = new Date(item.date + 'T00:00:00')
        return id.getMonth() === m && id.getFullYear() === y
      }).reduce((s, item) => s + item.amount, 0)
      const monthExpenses = expenses.filter(item => {
        const id = new Date(item.date + 'T00:00:00')
        return id.getMonth() === m && id.getFullYear() === y
      }).reduce((s, item) => s + item.amount, 0)
      months.push({
        month: d.toLocaleDateString('en-PH', { month: 'short', year: '2-digit' }),
        income: monthIncome,
        expenses: monthExpenses,
        net: monthIncome - monthExpenses,
      })
    }
    return months
  }, [income, expenses, currentMonth, currentYear])

  // Income by business area (all time)
  const incomeByArea = useMemo(() => {
    const map: Record<string, number> = {}
    income.forEach(item => {
      map[item.businessAreaId] = (map[item.businessAreaId] || 0) + item.amount
    })
    return Object.entries(map).map(([id, value]) => ({
      name: BUSINESS_AREAS.find(a => a.id === id)?.name || id,
      value,
      color: BUSINESS_AREAS.find(a => a.id === id)?.color || '#ccc',
    })).filter(d => d.value > 0).sort((a, b) => b.value - a.value)
  }, [income])

  // Expenses by category (all time)
  const expensesByCategory = useMemo(() => {
    const map: Record<string, number> = {}
    expenses.forEach(item => {
      map[item.categoryId] = (map[item.categoryId] || 0) + item.amount
    })
    return Object.entries(map).map(([id, value]) => ({
      name: EXPENSE_CATEGORIES.find(c => c.id === id)?.name || id,
      value,
    })).filter(d => d.value > 0).sort((a, b) => b.value - a.value)
  }, [expenses])

  // Income by category (all time)
  const incomeByCategory = useMemo(() => {
    const map: Record<string, number> = {}
    income.forEach(item => {
      map[item.categoryId] = (map[item.categoryId] || 0) + item.amount
    })
    return Object.entries(map).map(([id, value]) => ({
      name: INCOME_CATEGORIES.find(c => c.id === id)?.name || id,
      value,
    })).filter(d => d.value > 0).sort((a, b) => b.value - a.value)
  }, [income])

  const totalIncome = income.reduce((s, i) => s + i.amount, 0)
  const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0)
  const totalDebtRemaining = debts.filter(d => d.status !== 'paid').reduce((s, d) => s + d.remainingBalance, 0)
  const totalPayments = debtPayments.reduce((s, p) => s + p.amountPaid, 0)

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ name: string; value: number; color: string }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-sm">
          <p className="font-semibold text-gray-700 mb-1">{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color }} className="font-medium">
              {p.name}: {formatCurrency(p.value)}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">📋 Reports</h1>
          <p className="text-sm text-gray-500 mt-0.5">Financial overview for all time</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.08)] border border-gray-50">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Income</p>
            <p className="text-2xl font-bold text-[#DB2777] mt-1">{formatCurrency(totalIncome)}</p>
            <p className="text-xs text-gray-400 mt-0.5">{income.length} transactions</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.08)] border border-gray-50">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Total Expenses</p>
            <p className="text-2xl font-bold text-[#F97366] mt-1">{formatCurrency(totalExpenses)}</p>
            <p className="text-xs text-gray-400 mt-0.5">{expenses.length} transactions</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.08)] border border-gray-50">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Net Savings</p>
            <p className={`text-2xl font-bold mt-1 ${totalIncome - totalExpenses >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(Math.abs(totalIncome - totalExpenses))}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{totalIncome - totalExpenses >= 0 ? 'surplus' : 'deficit'}</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.08)] border border-gray-50">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Outstanding Debt</p>
            <p className="text-2xl font-bold text-[#1D4ED8] mt-1">{formatCurrency(totalDebtRemaining)}</p>
            <p className="text-xs text-gray-400 mt-0.5">{formatCurrency(totalPayments)} paid total</p>
          </div>
        </div>

        {/* Monthly Income vs Expenses */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.08)] border border-gray-50">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Monthly Income vs Expenses (Last 6 Months)</h3>
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} barGap={6} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₱${(v / 1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="income" name="Income" fill="#DB2777" radius={[5, 5, 0, 0]} />
                <Bar dataKey="expenses" name="Expenses" fill="#F97366" radius={[5, 5, 0, 0]} />
                <Bar dataKey="net" name="Net" fill="#1D4ED8" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex gap-4 mt-2">
            {[['Income', '#DB2777'], ['Expenses', '#60A5FA'], ['Net', '#A78BFA']].map(([label, color]) => (
              <div key={label} className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />
                <span className="text-xs text-gray-500">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Income by Business Area */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.08)] border border-gray-50">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Income by Business Area (All Time)</h3>
            <div style={{ height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={incomeByArea} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="value">
                    {incomeByArea.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {incomeByArea.map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-gray-600">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">{totalIncome > 0 ? ((item.value / totalIncome) * 100).toFixed(1) : 0}%</span>
                    <span className="font-semibold text-gray-800">{formatCurrency(item.value)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Expenses by Category */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.08)] border border-gray-50">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Expenses by Category (All Time)</h3>
            <div style={{ height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={expensesByCategory} cx="50%" cy="50%" outerRadius={80} paddingAngle={3} dataKey="value">
                    {expensesByCategory.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {expensesByCategory.slice(0, 5).map((item, i) => (
                <div key={i} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    <span className="text-gray-600 truncate max-w-[140px]">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-gray-400">{totalExpenses > 0 ? ((item.value / totalExpenses) * 100).toFixed(1) : 0}%</span>
                    <span className="font-semibold text-gray-800">{formatCurrency(item.value)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Debt Summary Table */}
        <div className="bg-white rounded-2xl shadow-[0_1px_3px_0_rgba(0,0,0,0.08)] border border-gray-50 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">Debt Summary</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Lender</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Purpose</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Original</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Remaining</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Paid</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-center px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Progress</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {debts.map(debt => {
                  const paid = debt.originalAmount - debt.remainingBalance
                  const pct = debt.originalAmount > 0 ? (paid / debt.originalAmount) * 100 : 0
                  return (
                    <tr key={debt.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-gray-800">{debt.lenderName}</td>
                      <td className="px-5 py-3.5 text-gray-500 text-xs">{debt.purpose}</td>
                      <td className="px-5 py-3.5 text-right text-gray-600">{formatCurrency(debt.originalAmount)}</td>
                      <td className="px-5 py-3.5 text-right font-semibold text-gray-900">{formatCurrency(debt.remainingBalance)}</td>
                      <td className="px-5 py-3.5 text-right text-[#DB2777] font-semibold">{formatCurrency(paid)}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${debt.status === 'paid' ? 'bg-green-100 text-green-700' : debt.status === 'overdue' ? 'bg-red-100 text-red-700' : 'bg-pink-50 text-[#DB2777]'}`}>
                          {debt.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: 'linear-gradient(90deg, #DB2777, #EC4899)' }} />
                          </div>
                          <span className="text-xs text-gray-400 w-8 text-right">{pct.toFixed(0)}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot>
                <tr className="bg-gray-50 border-t border-gray-200">
                  <td colSpan={2} className="px-5 py-3 text-sm font-semibold text-gray-700">Total</td>
                  <td className="px-5 py-3 text-right font-semibold text-gray-700">{formatCurrency(debts.reduce((s, d) => s + d.originalAmount, 0))}</td>
                  <td className="px-5 py-3 text-right font-semibold text-gray-700">{formatCurrency(totalDebtRemaining)}</td>
                  <td className="px-5 py-3 text-right font-semibold text-[#DB2777]">{formatCurrency(debts.reduce((s, d) => s + (d.originalAmount - d.remainingBalance), 0))}</td>
                  <td colSpan={2} />
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Monthly breakdown table */}
        <div className="bg-white rounded-2xl shadow-[0_1px_3px_0_rgba(0,0,0,0.08)] border border-gray-50 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="text-sm font-semibold text-gray-700">Monthly Breakdown (Last 6 Months)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Month</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Income</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Expenses</th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Net</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {monthlyData.map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gray-800">{row.month}</td>
                    <td className="px-5 py-3.5 text-right text-[#DB2777] font-semibold">{formatCurrency(row.income)}</td>
                    <td className="px-5 py-3.5 text-right text-[#F97366] font-semibold">{formatCurrency(row.expenses)}</td>
                    <td className={`px-5 py-3.5 text-right font-bold ${row.net >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {row.net >= 0 ? '+' : ''}{formatCurrency(row.net)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
