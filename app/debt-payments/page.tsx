'use client'
import React, { useState, useMemo } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { useStore } from '@/lib/store'
import { formatCurrency, formatDate } from '@/lib/utils'
import { DebtPayment } from '@/lib/types'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Input'
import { Plus, Pencil, Trash2, Receipt, TrendingDown } from 'lucide-react'

const emptyForm = {
  debtId: '',
  paymentDate: new Date().toISOString().split('T')[0],
  amountPaid: '',
  balanceAfter: '',
  notes: '',
}

export default function DebtPaymentsPage() {
  const { debts, debtPayments, addDebtPayment, updateDebtPayment, deleteDebtPayment } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<DebtPayment | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [filterDebt, setFilterDebt] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return debtPayments
      .filter(p => !filterDebt || p.debtId === filterDebt)
      .sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime())
  }, [debtPayments, filterDebt])

  const totalPaid = useMemo(() => filtered.reduce((s, p) => s + p.amountPaid, 0), [filtered])

  const openAdd = () => {
    setEditItem(null)
    setForm(emptyForm)
    setErrors({})
    setIsModalOpen(true)
  }

  const openEdit = (item: DebtPayment) => {
    setEditItem(item)
    setForm({
      debtId: item.debtId,
      paymentDate: item.paymentDate,
      amountPaid: String(item.amountPaid),
      balanceAfter: String(item.balanceAfter),
      notes: item.notes,
    })
    setErrors({})
    setIsModalOpen(true)
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.debtId) e.debtId = 'Select a debt'
    if (!form.paymentDate) e.paymentDate = 'Date required'
    if (!form.amountPaid || isNaN(Number(form.amountPaid)) || Number(form.amountPaid) <= 0) e.amountPaid = 'Valid amount required'
    if (form.balanceAfter === '' || isNaN(Number(form.balanceAfter)) || Number(form.balanceAfter) < 0) e.balanceAfter = 'Valid balance required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    const data = {
      debtId: form.debtId,
      paymentDate: form.paymentDate,
      amountPaid: Number(form.amountPaid),
      balanceAfter: Number(form.balanceAfter),
      notes: form.notes,
    }
    if (editItem) {
      updateDebtPayment({ ...data, id: editItem.id })
    } else {
      addDebtPayment(data)
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    deleteDebtPayment(id)
    setDeleteConfirm(null)
  }

  // Selected debt info for auto-calc
  const selectedDebt = useMemo(() => debts.find(d => d.id === form.debtId), [debts, form.debtId])

  // Payment summary by debt
  const paymentsByDebt = useMemo(() => {
    const map: Record<string, number> = {}
    debtPayments.forEach(p => {
      map[p.debtId] = (map[p.debtId] || 0) + p.amountPaid
    })
    return map
  }, [debtPayments])

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">🧾 Debt Payments</h1>
            <p className="text-sm text-gray-500 mt-0.5">{debtPayments.length} total payments</p>
          </div>
          <Button onClick={openAdd} variant="primary" size="md">
            <Plus className="w-4 h-4" />
            Record Payment
          </Button>
        </div>

        {/* Payment summary per debt */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {debts.filter(d => d.status !== 'paid' || paymentsByDebt[d.id]).map(debt => {
            const paid = paymentsByDebt[debt.id] || 0
            const pct = debt.originalAmount > 0 ? (paid / debt.originalAmount) * 100 : 0
            return (
              <div key={debt.id} className="bg-white rounded-xl p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.08)] border border-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-semibold text-gray-800 pr-2">{debt.lenderName}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${debt.status === 'overdue' ? 'bg-red-100 text-red-700' : debt.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-pink-50 text-[#DB2777]'}`}>
                    {debt.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mb-2">{debt.purpose}</p>
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Paid: {formatCurrency(paid)}</span>
                  <span>Total: {formatCurrency(debt.originalAmount)}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: 'linear-gradient(90deg, #DB2777, #EC4899)' }} />
                </div>
              </div>
            )
          })}
        </div>

        {/* Filter by debt */}
        <div className="flex flex-wrap gap-3 items-center">
          <Select
            options={[{ value: '', label: 'All Debts' }, ...debts.map(d => ({ value: d.id, label: d.lenderName }))]}
            value={filterDebt}
            onChange={e => setFilterDebt(e.target.value)}
            placeholder="Filter by debt..."
            className="min-w-[200px]"
          />
          <div className="flex items-center gap-1.5 ml-auto font-semibold text-sm text-[#DB2777]">
            <Receipt className="w-4 h-4" />
            Total: {formatCurrency(totalPaid)}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-[0_1px_3px_0_rgba(0,0,0,0.08)] border border-gray-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Lender</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount Paid</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Balance After</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Notes</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-gray-400">
                      No payments recorded.{' '}
                      <button onClick={openAdd} className="text-[#DB2777] font-medium hover:underline cursor-pointer">Record one</button>
                    </td>
                  </tr>
                ) : filtered.map(payment => {
                  const debt = debts.find(d => d.id === payment.debtId)
                  return (
                    <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{formatDate(payment.paymentDate)}</td>
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-gray-800">{debt?.lenderName || 'Unknown'}</div>
                        <div className="text-xs text-gray-400">{debt?.purpose}</div>
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-[#DB2777] whitespace-nowrap">{formatCurrency(payment.amountPaid)}</td>
                      <td className="px-5 py-3.5 text-right text-gray-600 whitespace-nowrap">{formatCurrency(payment.balanceAfter)}</td>
                      <td className="px-5 py-3.5 text-gray-500 text-xs">{payment.notes}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(payment)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#DB2777] hover:bg-[#FDF2F8] transition-colors cursor-pointer">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeleteConfirm(payment.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#F97366] hover:bg-red-50 transition-colors cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editItem ? 'Edit Payment' : 'Record Payment'} size="md">
        <div className="space-y-4">
          <Select
            label="Debt / Lender"
            options={debts.map(d => ({ value: d.id, label: `${d.lenderName} (${formatCurrency(d.remainingBalance)} remaining)` }))}
            value={form.debtId}
            onChange={e => {
              const debt = debts.find(d => d.id === e.target.value)
              setForm(f => ({
                ...f,
                debtId: e.target.value,
                balanceAfter: debt ? String(Math.max(0, debt.remainingBalance - (Number(f.amountPaid) || 0))) : f.balanceAfter
              }))
            }}
            placeholder="Select debt..."
            error={errors.debtId}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Payment Date" type="date" value={form.paymentDate} onChange={e => setForm(f => ({ ...f, paymentDate: e.target.value }))} error={errors.paymentDate} />
            <Input
              label="Amount Paid (PHP)"
              type="number"
              placeholder="0"
              value={form.amountPaid}
              onChange={e => {
                const amt = Number(e.target.value) || 0
                const debt = selectedDebt
                setForm(f => ({
                  ...f,
                  amountPaid: e.target.value,
                  balanceAfter: debt ? String(Math.max(0, debt.remainingBalance - amt)) : f.balanceAfter
                }))
              }}
              error={errors.amountPaid}
            />
          </div>
          <Input
            label="Balance After Payment (PHP)"
            type="number"
            placeholder="0"
            value={form.balanceAfter}
            onChange={e => setForm(f => ({ ...f, balanceAfter: e.target.value }))}
            error={errors.balanceAfter}
            helpText="Auto-calculated, adjust if needed"
          />
          {selectedDebt && (
            <div className="bg-[#FDF2F8] border border-[#FBCFE8] rounded-xl p-3 text-sm">
              <p className="text-[#DB2777] font-medium">{selectedDebt.lenderName}</p>
              <p className="text-xs text-[#DB2777]/70 mt-0.5">Current balance: {formatCurrency(selectedDebt.remainingBalance)}</p>
            </div>
          )}
          <Textarea label="Notes (optional)" placeholder="Payment notes..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
            <Button variant="primary" onClick={handleSave} className="flex-1">{editItem ? 'Save Changes' : 'Record Payment'}</Button>
          </div>
        </div>
      </Modal>

      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Payment" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Delete this payment record? This cannot be undone.</p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)} className="flex-1">Cancel</Button>
            <Button variant="danger" onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="flex-1">Delete</Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  )
}
