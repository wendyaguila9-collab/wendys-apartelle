'use client'
import React, { useMemo } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { useStore } from '@/lib/store'
import { BUSINESS_AREAS, EXPENSE_CATEGORIES } from '@/lib/constants'
import { formatCurrency, getDaysUntilDue } from '@/lib/utils'
import {
  TrendingUp, TrendingDown, DollarSign, AlertTriangle, Clock, Building2, ShoppingBag, Anchor, Home,
  ArrowUpRight, ArrowDownRight
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line
} from 'recharts'
import Badge from '@/components/ui/Badge'

const AREA_ICONS: Record<string, React.ElementType> = {
  apartelle: Building2,
  'dress-shop': ShoppingBag,
  captain: Anchor,
  household: Home,
}

const CHART_COLORS = ['#DB2777', '#60A5FA', '#A78BFA', '#F472B6', '#FB7185', '#818CF8', '#EC4899', '#38BDF8']

function MetricCard({
  title, value, subtitle, icon: Icon, gradient, iconBg
}: {
  title: string
  value: string
  subtitle?: string
  icon: React.ElementType
  gradient: string
  iconBg: string
}) {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden shadow-lg"
      style={{ background: gradient }}>
      {/* Decorative circle */}
      <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-20"
        style={{ background: 'rgba(255,255,255,0.4)' }} />
      <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full opacity-10"
        style={{ background: 'rgba(255,255,255,0.4)' }} />
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'rgba(255,255,255,0.8)' }}>{title}</p>
          <p className="text-2xl font-extrabold text-white mt-1">{value}</p>
          {subtitle && <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.7)' }}>{subtitle}</p>}
        </div>
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0"
          style={{ background: iconBg }}>
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { income, expenses, debts, debtPayments } = useStore()

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  const monthlyIncome = useMemo(() =>
    income.filter(i => {
      const d = new Date(i.date + 'T00:00:00')
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    }).reduce((sum, i) => sum + i.amount, 0),
    [income, currentMonth, currentYear]
  )

  const monthlyExpenses = useMemo(() =>
    expenses.filter(e => {
      const d = new Date(e.date + 'T00:00:00')
      return d.getMonth() === currentMonth && d.getFullYear() === currentYear
    }).reduce((sum, e) => sum + e.amount, 0),
    [expenses, currentMonth, currentYear]
  )

  const totalOutstandingDebt = useMemo(() =>
    debts.filter(d => d.status !== 'paid').reduce((sum, d) => sum + d.remainingBalance, 0),
    [debts]
  )

  const overdueDebts = useMemo(() =>
    debts.filter(d => d.status === 'overdue'),
    [debts]
  )

  const upcomingDebts = useMemo(() =>
    debts.filter(d => {
      const days = getDaysUntilDue(d.dueDate)
      return d.status === 'active' && days >= 0 && days <= 30
    }),
    [debts]
  )

  // Last 6 months data for chart
  const monthlyCashflowData = useMemo(() => {
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
        month: d.toLocaleDateString('en-PH', { month: 'short' }),
        income: monthIncome,
        expenses: monthExpenses,
        net: monthIncome - monthExpenses,
      })
    }
    return months
  }, [income, expenses, currentMonth, currentYear])

  // Income by business area (current month)
  const incomeByArea = useMemo(() => {
    const map: Record<string, number> = {}
    income.forEach(item => {
      const d = new Date(item.date + 'T00:00:00')
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        map[item.businessAreaId] = (map[item.businessAreaId] || 0) + item.amount
      }
    })
    return Object.entries(map).map(([id, value]) => ({
      name: BUSINESS_AREAS.find(a => a.id === id)?.name || id,
      value,
      color: BUSINESS_AREAS.find(a => a.id === id)?.color || '#ccc',
    })).filter(d => d.value > 0)
  }, [income, currentMonth, currentYear])

  // Expenses by category (current month)
  const expenseByCategory = useMemo(() => {
    const map: Record<string, number> = {}
    expenses.forEach(item => {
      const d = new Date(item.date + 'T00:00:00')
      if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
        map[item.categoryId] = (map[item.categoryId] || 0) + item.amount
      }
    })
    return Object.entries(map).map(([id, value]) => ({
      name: EXPENSE_CATEGORIES.find(c => c.id === id)?.name || id,
      value,
    })).filter(d => d.value > 0).sort((a, b) => b.value - a.value)
  }, [expenses, currentMonth, currentYear])

  // Recent transactions (last 8, combined)
  const recentTransactions = useMemo(() => {
    const combined = [
      ...income.map(i => ({ ...i, type: 'income' as const })),
      ...expenses.map(e => ({ ...e, type: 'expense' as const })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 8)
    return combined
  }, [income, expenses])

  const netCashflow = monthlyIncome - monthlyExpenses

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
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              👋 Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {now.toLocaleDateString('en-PH', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold shadow-sm"
            style={{ background: 'linear-gradient(135deg, #0F766E, #14B8A6)', color: 'white' }}>
            <span>💼</span> Wendy Business Hub
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Income This Month"
            value={formatCurrency(monthlyIncome)}
            icon={TrendingUp}
            gradient="linear-gradient(135deg, #DB2777 0%, #EC4899 100%)"
            iconBg="rgba(255,255,255,0.25)"
            subtitle={`${income.filter(i => {
              const d = new Date(i.date + 'T00:00:00')
              return d.getMonth() === currentMonth && d.getFullYear() === currentYear
            }).length} transactions`}
          />
          <MetricCard
            title="Expenses This Month"
            value={formatCurrency(monthlyExpenses)}
            icon={TrendingDown}
            gradient="linear-gradient(135deg, #F43F5E 0%, #FB7185 100%)"
            iconBg="rgba(255,255,255,0.25)"
            subtitle={`${expenses.filter(e => {
              const d = new Date(e.date + 'T00:00:00')
              return d.getMonth() === currentMonth && d.getFullYear() === currentYear
            }).length} transactions`}
          />
          <MetricCard
            title="Net Cashflow"
            value={formatCurrency(Math.abs(netCashflow))}
            icon={DollarSign}
            gradient={netCashflow >= 0
              ? 'linear-gradient(135deg, #A78BFA 0%, #818CF8 100%)'
              : 'linear-gradient(135deg, #F43F5E 0%, #FB7185 100%)'}
            iconBg="rgba(255,255,255,0.25)"
            subtitle={netCashflow >= 0 ? 'Surplus this month' : 'Deficit this month'}
          />
          <MetricCard
            title="Outstanding Debt"
            value={formatCurrency(totalOutstandingDebt)}
            icon={AlertTriangle}
            gradient="linear-gradient(135deg, #3B82F6 0%, #60A5FA 100%)"
            iconBg="rgba(255,255,255,0.25)"
            subtitle={`${debts.filter(d => d.status !== 'paid').length} active loans`}
          />
        </div>

        {/* Alerts Row */}
        {(overdueDebts.length > 0 || upcomingDebts.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {overdueDebts.length > 0 && (
              <div className="rounded-2xl p-4 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #fef2f2, #fee2e2)', border: '1px solid #fecaca' }}>
                <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20" style={{ background: '#ef4444' }} />
                <div className="flex items-center gap-2 mb-3 relative z-10">
                  <span className="text-lg">🚨</span>
                  <h3 className="text-sm font-bold text-red-800">Overdue Debts</h3>
                  <span className="ml-auto text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>{overdueDebts.length}</span>
                </div>
                <div className="space-y-2 relative z-10">
                  {overdueDebts.map(d => (
                    <div key={d.id} className="flex justify-between items-center text-sm bg-white/60 rounded-xl px-3 py-2">
                      <span className="text-red-700 font-semibold">{d.lenderName}</span>
                      <span className="text-red-800 font-bold">{formatCurrency(d.remainingBalance)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {upcomingDebts.length > 0 && (
              <div className="rounded-2xl p-4 relative overflow-hidden"
                style={{ background: 'linear-gradient(135deg, #fefce8, #fef9c3)', border: '1px solid #fde68a' }}>
                <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full opacity-20" style={{ background: '#eab308' }} />
                <div className="flex items-center gap-2 mb-3 relative z-10">
                  <span className="text-lg">⏰</span>
                  <h3 className="text-sm font-bold text-yellow-800">Due Within 30 Days</h3>
                  <span className="ml-auto text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-sm"
                    style={{ background: 'linear-gradient(135deg, #eab308, #ca8a04)' }}>{upcomingDebts.length}</span>
                </div>
                <div className="space-y-2 relative z-10">
                  {upcomingDebts.map(d => (
                    <div key={d.id} className="flex justify-between items-center text-sm bg-white/60 rounded-xl px-3 py-2">
                      <span className="text-yellow-700 font-semibold">{d.lenderName}</span>
                      <span className="text-yellow-800 font-bold">{getDaysUntilDue(d.dueDate)}d left</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Monthly Cashflow Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] border border-gray-50">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-base">📊</span>
              <h3 className="text-sm font-bold text-gray-800">6-Month Cashflow</h3>
            </div>
            <div style={{ height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyCashflowData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₱${(v/1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="income" name="Income" fill="url(#incomeGrad)" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expenses" name="Expenses" fill="url(#expenseGrad)" radius={[6, 6, 0, 0]} />
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EC4899" />
                      <stop offset="100%" stopColor="#DB2777" />
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#93C5FD" />
                      <stop offset="100%" stopColor="#3B82F6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ background: 'linear-gradient(#EC4899, #DB2777)' }} />
                <span className="text-xs text-gray-500">Income</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm" style={{ background: 'linear-gradient(#93C5FD, #3B82F6)' }} />
                <span className="text-xs text-gray-500">Expenses</span>
              </div>
            </div>
          </div>

          {/* Income by Area */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] border border-gray-50">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-base">🏆</span>
              <h3 className="text-sm font-bold text-gray-800">Income by Area</h3>
            </div>
            {incomeByArea.length > 0 ? (
              <>
                <div style={{ height: '160px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={incomeByArea} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={4} dataKey="value">
                        {incomeByArea.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2 mt-2">
                  {incomeByArea.map((area, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: area.color }} />
                        <span className="text-gray-600 truncate max-w-[100px]">{area.name}</span>
                      </div>
                      <span className="font-bold text-gray-800">{formatCurrency(area.value)}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-gray-400 text-sm gap-2">
                <span className="text-3xl">📭</span>
                No data this month
              </div>
            )}
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Expenses by Category */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] border border-gray-50">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-base">💸</span>
              <h3 className="text-sm font-bold text-gray-800">Expenses by Category</h3>
            </div>
            {expenseByCategory.length > 0 ? (
              <div className="space-y-3">
                {expenseByCategory.slice(0, 6).map((cat, i) => {
                  const maxVal = expenseByCategory[0].value
                  const pct = (cat.value / maxVal) * 100
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-600 font-medium truncate">{cat.name}</span>
                        <span className="font-bold text-gray-800 ml-2">{formatCurrency(cat.value)}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${CHART_COLORS[i % CHART_COLORS.length]}cc, ${CHART_COLORS[i % CHART_COLORS.length]})` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="h-40 flex flex-col items-center justify-center text-gray-400 text-sm gap-2">
                <span className="text-3xl">📭</span>
                No data this month
              </div>
            )}
          </div>

          {/* Recent Transactions */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] border border-gray-50">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-base">⚡</span>
              <h3 className="text-sm font-bold text-gray-800">Recent Transactions</h3>
            </div>
            <div className="space-y-1.5">
              {recentTransactions.map((tx, i) => {
                const area = BUSINESS_AREAS.find(a => a.id === tx.businessAreaId)
                const AreaIcon = AREA_ICONS[tx.businessAreaId] || Building2
                return (
                  <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-default">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
                      style={{ background: area?.color ? `linear-gradient(135deg, ${area.color}22, ${area.color}44)` : '#f1f5f9', border: `1px solid ${area?.color ?? '#e2e8f0'}33` }}>
                      <AreaIcon className="w-4 h-4" style={{ color: area?.color || '#64748b' }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{tx.description}</p>
                      <p className="text-xs text-gray-400">{new Date(tx.date + 'T00:00:00').toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })} · {area?.name}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-sm font-extrabold ${tx.type === 'income' ? 'text-pink-600' : 'text-blue-500'}`}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Net Cashflow Line Chart */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_8px_0_rgba(0,0,0,0.08)] border border-gray-50">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-base">📈</span>
            <h3 className="text-sm font-bold text-gray-800">Net Cashflow Trend</h3>
          </div>
          <div style={{ height: '160px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyCashflowData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} tickFormatter={v => `₱${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <defs>
                  <linearGradient id="netGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#A78BFA" />
                    <stop offset="50%" stopColor="#DB2777" />
                    <stop offset="100%" stopColor="#60A5FA" />
                  </linearGradient>
                </defs>
                <Line type="monotone" dataKey="net" name="Net" stroke="url(#netGrad)" strokeWidth={3} dot={{ fill: '#DB2777', r: 5, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 7, fill: '#60A5FA' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
