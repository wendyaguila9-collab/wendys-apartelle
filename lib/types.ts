export interface BusinessArea {
  id: string
  name: string
  color: string
  bgColor: string
  textColor: string
  icon: string
}

export interface Category {
  id: string
  name: string
  type: 'income' | 'expense'
}

export interface Income {
  id: string
  date: string
  amount: number
  businessAreaId: string
  categoryId: string
  paymentMethod: string
  description: string
  notes: string
}

export interface Expense {
  id: string
  date: string
  amount: number
  businessAreaId: string
  categoryId: string
  paymentMethod: string
  description: string
  notes: string
}

export interface Debt {
  id: string
  lenderName: string
  originalAmount: number
  remainingBalance: number
  interestRate: number
  dueDate: string
  status: 'active' | 'overdue' | 'paid'
  purpose: string
  notes: string
}

export interface DebtPayment {
  id: string
  debtId: string
  paymentDate: string
  amountPaid: number
  balanceAfter: number
  notes: string
}
