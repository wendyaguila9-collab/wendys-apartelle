'use client'
import React, { useState, useMemo } from 'react'
import AppLayout from '@/components/layout/AppLayout'
import { useStore } from '@/lib/store'
import { BUSINESS_AREAS, INCOME_CATEGORIES, PAYMENT_METHODS } from '@/lib/constants'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Income } from '@/lib/types'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Input'
import { Plus, Pencil, Trash2, Search, TrendingUp, Filter } from 'lucide-react'

const emptyForm = {
  date: new Date().toISOString().split('T')[0],
  amount: '',
  businessAreaId: '',
  categoryId: '',
  paymentMethod: 'Cash',
  description: '',
  notes: '',
}

export default function IncomePage() {
  const { income, addIncome, updateIncome, deleteIncome } = useStore()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<Income | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [search, setSearch] = useState('')
  const [filterArea, setFilterArea] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [filterMonth, setFilterMonth] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return income.filter(item => {
      if (search && !item.description.toLowerCase().includes(search.toLowerCase()) &&
        !item.notes.toLowerCase().includes(search.toLowerCase())) return false
      if (filterArea && item.businessAreaId !== filterArea) return false
      if (filterCategory && item.categoryId !== filterCategory) return false
      if (filterMonth) {
        const d = new Date(item.date + 'T00:00:00')
        const ym = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        if (ym !== filterMonth) return false
      }
      return true
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }, [income, search, filterArea, filterCategory, filterMonth])

  const totalFiltered = useMemo(() => filtered.reduce((s, i) => s + i.amount, 0), [filtered])

  const openAdd = () => {
    setEditItem(null)
    setForm(emptyForm)
    setErrors({})
    setIsModalOpen(true)
  }

  const openEdit = (item: Income) => {
    setEditItem(item)
    setForm({
      date: item.date,
      amount: String(item.amount),
      businessAreaId: item.businessAreaId,
      categoryId: item.categoryId,
      paymentMethod: item.paymentMethod,
      description: item.description,
      notes: item.notes,
    })
    setErrors({})
    setIsModalOpen(true)
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.date) e.date = 'Date is required'
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) e.amount = 'Valid amount required'
    if (!form.businessAreaId) e.businessAreaId = 'Business area required'
    if (!form.categoryId) e.categoryId = 'Category required'
    if (!form.description.trim()) e.description = 'Description required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = () => {
    if (!validate()) return
    const data = {
      date: form.date,
      amount: Number(form.amount),
      businessAreaId: form.businessAreaId,
      categoryId: form.categoryId,
      paymentMethod: form.paymentMethod,
      description: form.description,
      notes: form.notes,
    }
    if (editItem) {
      updateIncome({ ...data, id: editItem.id })
    } else {
      addIncome(data)
    }
    setIsModalOpen(false)
  }

  const handleDelete = (id: string) => {
    deleteIncome(id)
    setDeleteConfirm(null)
  }

  // Month options from data
  const monthOptions = useMemo(() => {
    const months = new Set<string>()
    income.forEach(i => {
      const d = new Date(i.date + 'T00:00:00')
      months.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`)
    })
    return Array.from(months).sort().reverse().map(m => {
      const [y, mo] = m.split('-')
      const d = new Date(Number(y), Number(mo) - 1, 1)
      return { value: m, label: d.toLocaleDateString('en-PH', { month: 'long', year: 'numeric' }) }
    })
  }, [income])

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">💰 Income</h1>
            <p className="text-sm text-gray-500 mt-0.5">{income.length} total records</p>
          </div>
          <Button onClick={openAdd} variant="primary" size="md">
            <Plus className="w-4 h-4" />
            Add Income
          </Button>
        </div>

        {/* Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {BUSINESS_AREAS.map((area, i) => {
            const areaTotal = income.filter(it => it.businessAreaId === area.id).reduce((s, it) => s + it.amount, 0)
            const gradients = [
              'linear-gradient(135deg, #0F766E, #14B8A6)',
              'linear-gradient(135deg, #F97366, #fb923c)',
              'linear-gradient(135deg, #1D4ED8, #6366f1)',
              'linear-gradient(135deg, #FB923C, #FACC15)',
            ]
            return (
              <div key={area.id} className="rounded-2xl p-4 relative overflow-hidden shadow-md"
                style={{ background: gradients[i % gradients.length] }}>
                <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-20" style={{ background: 'rgba(255,255,255,0.5)' }} />
                <p className="text-xs font-semibold relative z-10" style={{ color: 'rgba(255,255,255,0.85)' }}>{area.name}</p>
                <p className="text-xl font-extrabold mt-1 text-white relative z-10">{formatCurrency(areaTotal)}</p>
              </div>
            )
          })}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-[0_1px_3px_0_rgba(0,0,0,0.08)] border border-gray-50">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[180px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search descriptions..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#DB2777] bg-white"
                />
              </div>
            </div>
            <div className="min-w-[140px]">
              <Select
                options={[{ value: '', label: 'All Areas' }, ...BUSINESS_AREAS.map(a => ({ value: a.id, label: a.name }))]}
                value={filterArea}
                onChange={e => setFilterArea(e.target.value)}
                placeholder="All Areas"
              />
            </div>
            <div className="min-w-[140px]">
              <Select
                options={[{ value: '', label: 'All Categories' }, ...INCOME_CATEGORIES.map(c => ({ value: c.id, label: c.name }))]}
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                placeholder="All Categories"
              />
            </div>
            <div className="min-w-[160px]">
              <Select
                options={[{ value: '', label: 'All Months' }, ...monthOptions]}
                value={filterMonth}
                onChange={e => setFilterMonth(e.target.value)}
                placeholder="All Months"
              />
            </div>
            {(search || filterArea || filterCategory || filterMonth) && (
              <Button variant="ghost" size="sm" onClick={() => { setSearch(''); setFilterArea(''); setFilterCategory(''); setFilterMonth('') }}>
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Results summary */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{filtered.length} records</span>
          <div className="flex items-center gap-1.5 font-semibold text-[#DB2777]">
            <TrendingUp className="w-4 h-4" />
            {formatCurrency(totalFiltered)}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-[0_1px_3px_0_rgba(0,0,0,0.08)] border border-gray-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Description</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Area</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Category</th>
                  <th className="text-left px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                  <th className="text-right px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-12 text-gray-400">
                      No income records found.{' '}
                      <button onClick={openAdd} className="text-[#DB2777] font-medium hover:underline cursor-pointer">Add one</button>
                    </td>
                  </tr>
                ) : filtered.map(item => {
                  const area = BUSINESS_AREAS.find(a => a.id === item.businessAreaId)
                  const cat = INCOME_CATEGORIES.find(c => c.id === item.categoryId)
                  return (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5 text-gray-600 whitespace-nowrap">{formatDate(item.date)}</td>
                      <td className="px-5 py-3.5">
                        <div className="font-medium text-gray-800">{item.description}</div>
                        {item.notes && <div className="text-xs text-gray-400 mt-0.5">{item.notes}</div>}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                          style={{ backgroundColor: area?.bgColor || '#f1f5f9', color: area?.color || '#64748b' }}>
                          {area?.name || item.businessAreaId}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-600">{cat?.name || item.categoryId}</td>
                      <td className="px-5 py-3.5">
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{item.paymentMethod}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-bold text-[#DB2777] whitespace-nowrap">{formatCurrency(item.amount)}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#DB2777] hover:bg-[#FDF2F8] transition-colors cursor-pointer">
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button onClick={() => setDeleteConfirm(item.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-[#F97366] hover:bg-red-50 transition-colors cursor-pointer">
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editItem ? 'Edit Income' : 'Add Income'} size="lg">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Date" type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} error={errors.date} />
            <Input label="Amount (PHP)" type="number" placeholder="0" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} error={errors.amount} />
          </div>
          <Select
            label="Business Area"
            options={BUSINESS_AREAS.map(a => ({ value: a.id, label: a.name }))}
            value={form.businessAreaId}
            onChange={e => setForm(f => ({ ...f, businessAreaId: e.target.value }))}
            placeholder="Select area..."
            error={errors.businessAreaId}
          />
          <Select
            label="Category"
            options={INCOME_CATEGORIES.map(c => ({ value: c.id, label: c.name }))}
            value={form.categoryId}
            onChange={e => setForm(f => ({ ...f, categoryId: e.target.value }))}
            placeholder="Select category..."
            error={errors.categoryId}
          />
          <Select
            label="Payment Method"
            options={PAYMENT_METHODS.map(m => ({ value: m, label: m }))}
            value={form.paymentMethod}
            onChange={e => setForm(f => ({ ...f, paymentMethod: e.target.value }))}
          />
          <Input label="Description" placeholder="Brief description..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} error={errors.description} />
          <Textarea label="Notes (optional)" placeholder="Additional notes..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)} className="flex-1">Cancel</Button>
            <Button variant="primary" onClick={handleSave} className="flex-1">{editItem ? 'Save Changes' : 'Add Income'}</Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Delete Income" size="sm">
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Are you sure you want to delete this income record? This action cannot be undone.</p>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setDeleteConfirm(null)} className="flex-1">Cancel</Button>
            <Button variant="danger" onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="flex-1">Delete</Button>
          </div>
        </div>
      </Modal>
    </AppLayout>
  )
}
