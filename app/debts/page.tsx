'use client'
import React, { useState, useMemo } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { useStore } from '@/lib/store'
import { formatCurrency, formatDate, getDaysUntilDue } from '@/lib/utils'
import { Debt } from '@/lib/types'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Input'
import Badge from '@/components/ui/Badge'
import { Plus, Pencil, Trash2, CreditCard, AlertTriangle, CheckCircle2, Clock } from 'lucide-react'

const emptyForm = {
  lenderName: '',
  originalAmount: '',
  remainingBalance: '',
  interestRate: '0',
  dueDate: '',
  status: 'active' as 'active' | 'overdue' | 'paid',
  purpose: '',
  notes: '',
}

export default function DebtsPage() {
  const { debts, addDebt, updateDebt, deleteDebt } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<Debt | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState('')

  const filtered = useMemo(() => {
    return debts.filter(d => !filterStatus || d.status === filterStatus)
      .sort((a, b) => {
        const order = { overdue: 0, active: 1, paid: 2 }
        return order[a.status] - order[b.status]
      })
  }, [debts, filterStatus])

  const totalOwed = useMemo(() => debts.filter(d => d.status !== 'paid').reduce((s, d) => s + d.remainingBalance, 0), [debts])
  const totalOverdue = useMemo(() => debts.filter(d => d.status === 'overdue').reduce((s, d) => s + d.remainingBalance, 0), [debts])
  const totalPaid = useMemo(() => debts.filter(d => d.status === 'paid').reduce((s, d) => s + d.originalAmount, 0), [debts])

  const openAdd = () => {
    setEditItem(null)
    setForm(emptyForm)
    setErrors({})
    setIsModalOpen(true)
  }

  const openEdit = (item: Debt) => {
    setEditItem(item)
    setForm({
      lenderName: item.lenderName,
      originalAmount: String(item.originalAmount),
      remainingBalance: String(item.remainingBalance),
      interestRate: String(item.interestRate),
      dueDate: item.dueDate,
      status: item.status,
      purpose: item.purpose,
      notes: item.notes,
    })
    setErrors({})
    setIsModalOpen(true)
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.lenderName.trim()) e.lenderName = 'Lender name required'
    if (!form.originalAmount || isNaN(Number(form.originalAmount)) || Number(form.originalAmount) <= 0) e.originalAmount = 'Valid amount required'
    if (!form.remainingBalance || isNaN(Number(form.remainingBalance)) || Number(form.remainingBalance) < 0) e.remainingBalance = 'Valid balance required'
    if (!form.dueDate) e.dueDate = 'Due date required'
    if (!form.purpose.trim()) e.purpose = 'Purpose required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    const data = {
      lenderName: form.lenderName,
      originalAmount: Number(form.originalAmount),
      remainingBalance: Number(form.remainingBalance),
      interestRate: Number(form.interestRate) || 0,
      dueDate: form.dueDate,
      status: form.status,
      purpose: form.purpose,
      notes: form.notes,
    }
    if (editItem) {
      updateDebt({ ...data, id: editItem.id })
    } else {
      addDebt(data)
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    deleteDebt(id)
    setDeleteConfirm(null)
  }

  const getStatusBadge = (status: string) => {
    if (status === 'active') return <Badge variant="teal">Active</Badge>
    if (status === 'overdue') return <Badge variant="danger">Overdue</Badge>
    if (status === 'paid') return <Badge variant="success">Paid</Badge>
    return null
  }

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">💳 Debts</h1>
            <p className="text-sm text-gray-500 mt-0.5">{debts.length} total records</p>
          </div>
          <Button onClick={openAdd} variant="primary" size="md">
            <Plus className="w-4 h-4" />
            Add Debt
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl p-5 relative overflow-hidden shadow-md"
            style={{ background: 'linear-gradient(135deg, #1D4ED8, #6366f1)' }}>
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-20" style={{ background: 'rgba(255,255,255,0.4)' }} />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>Total Outstanding</p>
                <p className="text-xl font-extrabold text-white">{formatCurrency(totalOwed)}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl p-5 relative overflow-hidden shadow-md"
            style={{ background: 'linear-gradient(135deg, #F97366, #ef4444)' }}>
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-20" style={{ background: 'rgba(255,255,255,0.4)' }} />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>Overdue Amount</p>
                <p className="text-xl font-extrabold text-white">{formatCurrency(totalOverdue)}</p>
              </div>
            </div>
          </div>
          <div className="rounded-2xl p-5 relative overflow-hidden shadow-md"
            style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
            <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full opacity-20" style={{ background: 'rgba(255,255,255,0.4)' }} />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.8)' }}>Total Paid Off</p>
                <p className="text-xl font-extrabold text-white">{formatCurrency(totalPaid)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="flex gap-2 flex-wrap">
          {[
            { val: '', label: '✨ All' },
            { val: 'active', label: '🟢 Active' },
            { val: 'overdue', label: '🔴 Overdue' },
            { val: 'paid', label: '✅ Paid' },
          ].map(({ val, label }) => (
            <button
              key={val}
              onClick={() => setFilterStatus(val)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all cursor-pointer shadow-sm ${filterStatus === val
                ? 'text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-[#DB2777] hover:text-[#DB2777]'}`}
              style={filterStatus === val ? { background: 'linear-gradient(135deg, #DB2777, #EC4899)' } : {}}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Debt Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.length === 0 ? (
            <div className="col-span-2 bg-white rounded-2xl p-12 text-center text-gray-400 shadow-[0_1px_3px_0_rgba(0,0,0,0.08)]">
              No debts found.{' '}
              <button onClick={openAdd} className="text-[#DB2777] font-medium hover:underline cursor-pointer">Add one</button>
            </div>
          ) : filtered.map(debt => {
            const paidPct = debt.originalAmount > 0
              ? ((debt.originalAmount - debt.remainingBalance) / debt.originalAmount) * 100
              : 0
            const daysLeft = getDaysUntilDue(debt.dueDate)

            return (
              <div key={debt.id} className={`bg-white rounded-2xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.08)] border ${debt.status === 'overdue' ? 'border-red-100' : debt.status === 'paid' ? 'border-green-100' : 'border-gray-50'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{debt.lenderName}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{debt.purpose}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(debt.status)}
                    <button onClick={() => openEdit(debt)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#DB2777] hover:bg-[#FDF2F8] transition-colors cursor-pointer">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => setDeleteConfirm(debt.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#F97366] hover:bg-red-50 transition-colors cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Amount info */}
                <div className="flex justify-between items-baseline mb-3">
                  <div>
                    <p className="text-xs text-gray-400">Remaining</p>
                    <p className={`text-xl font-bold ${debt.status === 'paid' ? 'text-green-600' : debt.status === 'overdue' ? 'text-[#F97366]' : 'text-gray-900'}`}>
                      {formatCurrency(debt.remainingBalance)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Original</p>
                    <p className="text-sm font-medium text-gray-500">{formatCurrency(debt.originalAmount)}</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="mb-3">
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>{paidPct.toFixed(0)}% paid</span>
                    <span>{formatCurrency(debt.originalAmount - debt.remainingBalance)} paid</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${paidPct}%`,
                        backgroundColor: debt.status === 'paid' ? '#16a34a' : debt.status === 'overdue' ? '#F43F5E' : '#DB2777'
                      }}
                    />
                  </div>
                </div>

                {/* Meta info */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Due: {formatDate(debt.dueDate)}</span>
                    {debt.status !== 'paid' && (
                      <span className={`font-semibold ml-1 ${daysLeft < 0 ? 'text-red-600' : daysLeft <= 30 ? 'text-yellow-600' : 'text-gray-500'}`}>
                        ({daysLeft < 0 ? `${Math.abs(daysLeft)}d overdue` : `${daysLeft}d left`})
                      </span>
                    )}
                  </div>
                  {debt.interestRate > 0 && (
                    <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">{debt.interestRate}% interest</span>
                  )}
                </div>

                {debt.notes && (
                  <p className="mt-2 text-xs text-gray-400 italic border-t border-gray-50 pt-2">{debt.notes}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editItem ? 'Edit Debt' : 'Add Debt'} size="lg">
        <div className="space-y-4">
          <Input label="Lender Name" placeholder="e.g. BPI Bank, Tita Nena..." value={form.lenderName} onChange={e => setForm(f => ({ ...f, lenderName: e.target.value }))} error={errors.lenderName} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Original Amount (PHP)" type="number" placeholder="0" value={form.originalAmount} onChange={e => setForm(f => ({ ...f, originalAmount: e.target.value }))} error={errors.originalAmount} />
            <Input label="Remaining Balance (PHP)" type="number" placeholder="0" value={form.remainingBalance} onChange={e => setForm(f => ({ ...f, remainingBalance: e.target.value }))} error={errors.remainingBalance} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="Interest Rate (%)" type="number" placeholder="0" value={form.interestRate} onChange={e => setForm(f => ({ ...f, interestRate: e.target.value }))} helpText="0 for no interest" />
            <Input label="Due Date" type="date" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} error={errors.dueDate} />
          </div>
          <Select
            label="Status"
            options={[
              { value: 'active', label: 'Active' },
              { value: 'overdue', label: 'Overdue' },
              { value: 'paid', label: 'Paid' },
            ]}
            value={form.status}
            onChange={e => setForm(f => ({ ...f, status: e.target.value as 'active' | 'overdue' | 'paid' }))}
          />
          <Input label="Purpose" placeholder="What is this loan for?" value={form.purpose} onChange={e => setForm(f => ({ ...f, purpose: e.target.value }))} error={errors.purpose} />
          <Textarea label="Notes (optional)" placeholder="Additional details..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
            <Button variant="primary" onClick={handleSave} className="flex-1">{editItem ? 'Save Changes' : 'Add Debt'}</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Debt" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Are you sure you want to delete this debt record? All associated payments will still exist but be unlinked.</p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)} className="flex-1">Cancel</Button>
            <Button variant="danger" onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="flex-1">Delete</Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  )
}
