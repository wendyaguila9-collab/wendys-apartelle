import { Income, Expense, Debt, DebtPayment } from './types'

export const SEED_INCOME: Income[] = [
  // March 2026 - Apartelle
  { id: 'inc-1', date: '2026-03-28', amount: 3500, businessAreaId: 'apartelle', categoryId: 'room-rental', paymentMethod: 'Cash', description: 'Room 3 - 5 nights', notes: '' },
  { id: 'inc-2', date: '2026-03-25', amount: 7000, businessAreaId: 'apartelle', categoryId: 'room-rental', paymentMethod: 'GCash', description: 'Room 1 & 2 weekly', notes: '' },
  { id: 'inc-3', date: '2026-03-20', amount: 14000, businessAreaId: 'apartelle', categoryId: 'room-rental', paymentMethod: 'Bank Transfer', description: 'Room 4 monthly contract', notes: 'Long term tenant' },
  { id: 'inc-4', date: '2026-03-15', amount: 2500, businessAreaId: 'apartelle', categoryId: 'room-rental', paymentMethod: 'Cash', description: 'Room 2 short stay', notes: '' },
  { id: 'inc-5', date: '2026-03-10', amount: 4200, businessAreaId: 'apartelle', categoryId: 'room-rental', paymentMethod: 'GCash', description: 'Room 5 - 6 nights', notes: '' },
  // March 2026 - Dress Shop
  { id: 'inc-6', date: '2026-03-29', amount: 3800, businessAreaId: 'dress-shop', categoryId: 'dress-sales', paymentMethod: 'Cash', description: 'Barong & dress set', notes: '' },
  { id: 'inc-7', date: '2026-03-24', amount: 5500, businessAreaId: 'dress-shop', categoryId: 'dress-sales', paymentMethod: 'GCash', description: 'Wedding collection x3', notes: 'Bulk order' },
  { id: 'inc-8', date: '2026-03-18', amount: 2200, businessAreaId: 'dress-shop', categoryId: 'dress-sales', paymentMethod: 'Cash', description: 'Casual dresses x5', notes: '' },
  { id: 'inc-9', date: '2026-03-12', amount: 4100, businessAreaId: 'dress-shop', categoryId: 'dress-sales', paymentMethod: 'Maya', description: 'Evening gown rental & sale', notes: '' },
  // March 2026 - Captain
  { id: 'inc-10', date: '2026-03-27', amount: 65000, businessAreaId: 'captain', categoryId: 'remittance', paymentMethod: 'Bank Transfer', description: 'Monthly remittance - March', notes: 'Western Union converted' },
  { id: 'inc-11', date: '2026-03-05', amount: 8500, businessAreaId: 'captain', categoryId: 'remittance', paymentMethod: 'Remittance', description: 'Extra allowance', notes: '' },
  // February 2026
  { id: 'inc-12', date: '2026-02-27', amount: 58000, businessAreaId: 'captain', categoryId: 'remittance', paymentMethod: 'Bank Transfer', description: 'Monthly remittance - February', notes: '' },
  { id: 'inc-13', date: '2026-02-22', amount: 18500, businessAreaId: 'apartelle', categoryId: 'room-rental', paymentMethod: 'Cash', description: 'Feb room rentals total', notes: '' },
  { id: 'inc-14', date: '2026-02-18', amount: 9200, businessAreaId: 'dress-shop', categoryId: 'dress-sales', paymentMethod: 'GCash', description: 'Valentine collection sales', notes: 'Big sales month' },
  { id: 'inc-15', date: '2026-02-14', amount: 6800, businessAreaId: 'dress-shop', categoryId: 'dress-sales', paymentMethod: 'Cash', description: "Valentine's special orders", notes: '' },
  // January 2026
  { id: 'inc-16', date: '2026-01-28', amount: 72000, businessAreaId: 'captain', categoryId: 'remittance', paymentMethod: 'Bank Transfer', description: 'Monthly remittance - January', notes: 'Bonus included' },
  { id: 'inc-17', date: '2026-01-25', amount: 21000, businessAreaId: 'apartelle', categoryId: 'room-rental', paymentMethod: 'Cash', description: 'Jan room rentals', notes: 'Good occupancy' },
  { id: 'inc-18', date: '2026-01-20', amount: 7500, businessAreaId: 'dress-shop', categoryId: 'dress-sales', paymentMethod: 'GCash', description: 'New year collection', notes: '' },
  // December 2025
  { id: 'inc-19', date: '2025-12-28', amount: 80000, businessAreaId: 'captain', categoryId: 'remittance', paymentMethod: 'Bank Transfer', description: 'December remittance + Christmas bonus', notes: '' },
  { id: 'inc-20', date: '2025-12-24', amount: 32000, businessAreaId: 'apartelle', categoryId: 'room-rental', paymentMethod: 'Cash', description: 'Dec room rentals - holiday season', notes: 'Full occupancy' },
  { id: 'inc-21', date: '2025-12-20', amount: 15000, businessAreaId: 'dress-shop', categoryId: 'dress-sales', paymentMethod: 'Cash', description: 'Christmas party dresses', notes: 'Best month this year' },
  // November 2025
  { id: 'inc-22', date: '2025-11-27', amount: 62000, businessAreaId: 'captain', categoryId: 'remittance', paymentMethod: 'Bank Transfer', description: 'November remittance', notes: '' },
  { id: 'inc-23', date: '2025-11-22', amount: 17500, businessAreaId: 'apartelle', categoryId: 'room-rental', paymentMethod: 'Cash', description: 'Nov room rentals', notes: '' },
  { id: 'inc-24', date: '2025-11-15', amount: 6500, businessAreaId: 'dress-shop', categoryId: 'dress-sales', paymentMethod: 'GCash', description: 'Dress sales Nov', notes: '' },
  // October 2025
  { id: 'inc-25', date: '2025-10-28', amount: 55000, businessAreaId: 'captain', categoryId: 'remittance', paymentMethod: 'Bank Transfer', description: 'October remittance', notes: '' },
  { id: 'inc-26', date: '2025-10-22', amount: 16000, businessAreaId: 'apartelle', categoryId: 'room-rental', paymentMethod: 'Cash', description: 'Oct room rentals', notes: '' },
  { id: 'inc-27', date: '2025-10-15', amount: 5800, businessAreaId: 'dress-shop', categoryId: 'dress-sales', paymentMethod: 'GCash', description: 'Dress sales Oct', notes: '' },
]

export const SEED_EXPENSES: Expense[] = [
  // March 2026
  { id: 'exp-1', date: '2026-03-30', amount: 4200, businessAreaId: 'household', categoryId: 'utilities', paymentMethod: 'Cash', description: 'Electricity bill - March', notes: '' },
  { id: 'exp-2', date: '2026-03-28', amount: 1800, businessAreaId: 'household', categoryId: 'utilities', paymentMethod: 'GCash', description: 'Water bill - March', notes: '' },
  { id: 'exp-3', date: '2026-03-25', amount: 8500, businessAreaId: 'household', categoryId: 'food', paymentMethod: 'Cash', description: 'Monthly groceries', notes: '' },
  { id: 'exp-4', date: '2026-03-22', amount: 3500, businessAreaId: 'apartelle', categoryId: 'maintenance', paymentMethod: 'Cash', description: 'Room 1 aircon repair', notes: 'Freon recharge' },
  { id: 'exp-5', date: '2026-03-20', amount: 2200, businessAreaId: 'apartelle', categoryId: 'supplies', paymentMethod: 'Cash', description: 'Bedsheets & toiletries restock', notes: '' },
  { id: 'exp-6', date: '2026-03-18', amount: 5000, businessAreaId: 'household', categoryId: 'education', paymentMethod: 'Bank Transfer', description: 'School tuition - April', notes: '' },
  { id: 'exp-7', date: '2026-03-15', amount: 1500, businessAreaId: 'dress-shop', categoryId: 'supplies', paymentMethod: 'Cash', description: 'Fabric & thread restock', notes: '' },
  { id: 'exp-8', date: '2026-03-12', amount: 950, businessAreaId: 'household', categoryId: 'transportation', paymentMethod: 'Cash', description: 'Tricycle & jeepney fare', notes: '' },
  { id: 'exp-9', date: '2026-03-10', amount: 2800, businessAreaId: 'household', categoryId: 'medical', paymentMethod: 'Cash', description: 'Medicine & checkup', notes: '' },
  { id: 'exp-10', date: '2026-03-05', amount: 1200, businessAreaId: 'apartelle', categoryId: 'utilities', paymentMethod: 'Cash', description: 'Internet connection - apartelle', notes: '' },
  // February 2026
  { id: 'exp-11', date: '2026-02-28', amount: 3900, businessAreaId: 'household', categoryId: 'utilities', paymentMethod: 'Cash', description: 'Electricity bill - February', notes: '' },
  { id: 'exp-12', date: '2026-02-25', amount: 1700, businessAreaId: 'household', categoryId: 'utilities', paymentMethod: 'GCash', description: 'Water bill - February', notes: '' },
  { id: 'exp-13', date: '2026-02-22', amount: 9000, businessAreaId: 'household', categoryId: 'food', paymentMethod: 'Cash', description: 'Groceries + valentines food', notes: '' },
  { id: 'exp-14', date: '2026-02-18', amount: 4500, businessAreaId: 'dress-shop', categoryId: 'supplies', paymentMethod: 'Cash', description: 'Valentine collection fabric', notes: '' },
  { id: 'exp-15', date: '2026-02-10', amount: 2000, businessAreaId: 'apartelle', categoryId: 'maintenance', paymentMethod: 'Cash', description: 'Plumbing repairs - Room 3', notes: '' },
  { id: 'exp-16', date: '2026-02-05', amount: 4000, businessAreaId: 'apartelle', categoryId: 'salary', paymentMethod: 'Cash', description: 'Caretaker salary - February', notes: '' },
  // January 2026
  { id: 'exp-17', date: '2026-01-30', amount: 4800, businessAreaId: 'household', categoryId: 'utilities', paymentMethod: 'Cash', description: 'Electricity bill - January', notes: 'High due to holidays' },
  { id: 'exp-18', date: '2026-01-25', amount: 12000, businessAreaId: 'household', categoryId: 'food', paymentMethod: 'Cash', description: 'New year food & groceries', notes: '' },
  { id: 'exp-19', date: '2026-01-20', amount: 3200, businessAreaId: 'dress-shop', categoryId: 'supplies', paymentMethod: 'Cash', description: 'New year collection fabrics', notes: '' },
  { id: 'exp-20', date: '2026-01-15', amount: 5000, businessAreaId: 'household', categoryId: 'education', paymentMethod: 'Bank Transfer', description: 'School fees - January', notes: '' },
  { id: 'exp-21', date: '2026-01-05', amount: 4000, businessAreaId: 'apartelle', categoryId: 'salary', paymentMethod: 'Cash', description: 'Caretaker salary - January', notes: '' },
  // December 2025
  { id: 'exp-22', date: '2025-12-28', amount: 18000, businessAreaId: 'household', categoryId: 'food', paymentMethod: 'Cash', description: 'Christmas & New Year provisions', notes: 'Noche buena + media noche' },
  { id: 'exp-23', date: '2025-12-20', amount: 6500, businessAreaId: 'household', categoryId: 'miscellaneous', paymentMethod: 'Cash', description: 'Christmas gifts & decorations', notes: '' },
  { id: 'exp-24', date: '2025-12-15', amount: 3500, businessAreaId: 'apartelle', categoryId: 'maintenance', paymentMethod: 'Cash', description: 'Holiday room freshening', notes: '' },
  { id: 'exp-25', date: '2025-12-05', amount: 4800, businessAreaId: 'household', categoryId: 'utilities', paymentMethod: 'Cash', description: 'Electricity bill - December', notes: '' },
  // November 2025
  { id: 'exp-26', date: '2025-11-28', amount: 3800, businessAreaId: 'household', categoryId: 'utilities', paymentMethod: 'Cash', description: 'Electricity bill - November', notes: '' },
  { id: 'exp-27', date: '2025-11-20', amount: 7500, businessAreaId: 'household', categoryId: 'food', paymentMethod: 'Cash', description: 'Monthly groceries', notes: '' },
  { id: 'exp-28', date: '2025-11-15', amount: 4000, businessAreaId: 'apartelle', categoryId: 'salary', paymentMethod: 'Cash', description: 'Caretaker salary - November', notes: '' },
  { id: 'exp-29', date: '2025-11-10', amount: 2500, businessAreaId: 'household', categoryId: 'medical', paymentMethod: 'Cash', description: 'Medical checkup & meds', notes: '' },
  // October 2025
  { id: 'exp-30', date: '2025-10-28', amount: 3600, businessAreaId: 'household', categoryId: 'utilities', paymentMethod: 'Cash', description: 'Electricity bill - October', notes: '' },
  { id: 'exp-31', date: '2025-10-20', amount: 7200, businessAreaId: 'household', categoryId: 'food', paymentMethod: 'Cash', description: 'Monthly groceries', notes: '' },
  { id: 'exp-32', date: '2025-10-15', amount: 4000, businessAreaId: 'apartelle', categoryId: 'salary', paymentMethod: 'Cash', description: 'Caretaker salary - October', notes: '' },
  { id: 'exp-33', date: '2025-10-08', amount: 1800, businessAreaId: 'apartelle', categoryId: 'maintenance', paymentMethod: 'Cash', description: 'Minor repairs - hallway', notes: '' },
]

export const SEED_DEBTS: Debt[] = [
  { id: 'debt-1', lenderName: 'Tita Nena (Private Loan)', originalAmount: 80000, remainingBalance: 45000, interestRate: 0, dueDate: '2026-06-30', status: 'active', purpose: 'Apartelle renovation', notes: 'No interest, pay monthly' },
  { id: 'debt-2', lenderName: 'BPI Family Bank', originalAmount: 150000, remainingBalance: 98500, interestRate: 12, dueDate: '2026-12-31', status: 'active', purpose: 'Business capital loan', notes: 'Monthly amortization ₱5,500' },
  { id: 'debt-3', lenderName: 'Nanay Cita (Paluwagan)', originalAmount: 30000, remainingBalance: 30000, interestRate: 0, dueDate: '2026-03-15', status: 'overdue', purpose: 'Dress shop supplies', notes: 'Overdue - need to settle ASAP' },
  { id: 'debt-4', lenderName: 'SSS Salary Loan', originalAmount: 25000, remainingBalance: 12500, interestRate: 10, dueDate: '2026-09-30', status: 'active', purpose: 'Emergency fund', notes: 'Deducted from benefits' },
  { id: 'debt-5', lenderName: 'Kuya Danny (Family)', originalAmount: 50000, remainingBalance: 0, interestRate: 0, dueDate: '2025-12-31', status: 'paid', purpose: 'Medical emergency', notes: 'Fully paid December 2025' },
]

export const SEED_DEBT_PAYMENTS: DebtPayment[] = [
  { id: 'dp-1', debtId: 'debt-1', paymentDate: '2026-03-15', amountPaid: 5000, balanceAfter: 45000, notes: 'March payment' },
  { id: 'dp-2', debtId: 'debt-1', paymentDate: '2026-02-15', amountPaid: 5000, balanceAfter: 50000, notes: 'February payment' },
  { id: 'dp-3', debtId: 'debt-1', paymentDate: '2026-01-15', amountPaid: 5000, balanceAfter: 55000, notes: 'January payment' },
  { id: 'dp-4', debtId: 'debt-1', paymentDate: '2025-12-15', amountPaid: 5000, balanceAfter: 60000, notes: 'December payment' },
  { id: 'dp-5', debtId: 'debt-2', paymentDate: '2026-03-20', amountPaid: 5500, balanceAfter: 98500, notes: 'BPI March amortization' },
  { id: 'dp-6', debtId: 'debt-2', paymentDate: '2026-02-20', amountPaid: 5500, balanceAfter: 104000, notes: 'BPI February amortization' },
  { id: 'dp-7', debtId: 'debt-2', paymentDate: '2026-01-20', amountPaid: 5500, balanceAfter: 109500, notes: 'BPI January amortization' },
  { id: 'dp-8', debtId: 'debt-4', paymentDate: '2026-03-10', amountPaid: 2500, balanceAfter: 12500, notes: 'SSS loan March' },
  { id: 'dp-9', debtId: 'debt-4', paymentDate: '2026-02-10', amountPaid: 2500, balanceAfter: 15000, notes: 'SSS loan February' },
  { id: 'dp-10', debtId: 'debt-5', paymentDate: '2025-12-20', amountPaid: 25000, balanceAfter: 0, notes: 'Final payment to Kuya Danny' },
  { id: 'dp-11', debtId: 'debt-5', paymentDate: '2025-11-20', amountPaid: 25000, balanceAfter: 25000, notes: 'First payment to Kuya Danny' },
]
