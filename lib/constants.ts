import { BusinessArea, Category } from './types'

export const BUSINESS_AREAS: BusinessArea[] = [
  { id: 'apartelle', name: 'Apartelle', color: '#DB2777', bgColor: '#FDF2F8', textColor: '#DB2777', icon: 'Building2' },
  { id: 'dress-shop', name: 'Dress Shop', color: '#EC4899', bgColor: '#FCE7F3', textColor: '#EC4899', icon: 'ShoppingBag' },
  { id: 'captain', name: 'Daddy', color: '#3B82F6', bgColor: '#EFF6FF', textColor: '#3B82F6', icon: 'Anchor' },
  { id: 'household', name: 'Household', color: '#A78BFA', bgColor: '#F5F3FF', textColor: '#A78BFA', icon: 'Home' },
]

export const INCOME_CATEGORIES: Category[] = [
  { id: 'room-rental', name: 'Room Rental', type: 'income' },
  { id: 'dress-sales', name: 'Dress Sales', type: 'income' },
  { id: 'remittance', name: 'Remittance', type: 'income' },
  { id: 'other-income', name: 'Other Income', type: 'income' },
  { id: 'food-sales', name: 'Food Sales', type: 'income' },
  { id: 'service-fee', name: 'Service Fee', type: 'income' },
]

export const EXPENSE_CATEGORIES: Category[] = [
  { id: 'utilities', name: 'Utilities', type: 'expense' },
  { id: 'maintenance', name: 'Maintenance & Repairs', type: 'expense' },
  { id: 'supplies', name: 'Supplies & Inventory', type: 'expense' },
  { id: 'food', name: 'Food & Groceries', type: 'expense' },
  { id: 'salary', name: 'Salary & Labor', type: 'expense' },
  { id: 'transportation', name: 'Transportation', type: 'expense' },
  { id: 'education', name: 'School & Education', type: 'expense' },
  { id: 'medical', name: 'Medical', type: 'expense' },
  { id: 'debt-payment', name: 'Debt Payment', type: 'expense' },
  { id: 'miscellaneous', name: 'Miscellaneous', type: 'expense' },
]

export const PAYMENT_METHODS = ['Cash', 'Bank Transfer', 'GCash', 'Maya', 'Remittance', 'Check', 'Other']
