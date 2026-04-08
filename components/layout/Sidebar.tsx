'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Receipt,
  BarChart3,
  Building2,
  X,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', activeColor: 'from-pink-400 to-pink-600', glowColor: 'shadow-pink-500/30' },
  { href: '/income', icon: TrendingUp, label: 'Income', activeColor: 'from-rose-400 to-pink-600', glowColor: 'shadow-rose-500/30' },
  { href: '/expenses', icon: TrendingDown, label: 'Expenses', activeColor: 'from-fuchsia-400 to-pink-500', glowColor: 'shadow-fuchsia-500/30' },
  { href: '/debts', icon: CreditCard, label: 'Debts', activeColor: 'from-blue-400 to-blue-600', glowColor: 'shadow-blue-500/30' },
  { href: '/debt-payments', icon: Receipt, label: 'Payments', activeColor: 'from-violet-400 to-purple-600', glowColor: 'shadow-violet-500/30' },
  { href: '/reports', icon: BarChart3, label: 'Reports', activeColor: 'from-pink-500 to-rose-600', glowColor: 'shadow-pink-500/30' },
]

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        'fixed top-0 left-0 z-50 h-full w-64 flex flex-col transition-transform duration-300',
        'lg:translate-x-0',
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}
        style={{ background: 'linear-gradient(160deg, #831843 0%, #BE185D 45%, #9D174D 100%)' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl flex items-center justify-center shadow-lg"
              style={{ background: 'linear-gradient(135deg, #F472B6, #60A5FA)', boxShadow: '0 4px 14px rgba(244,114,182,0.5)' }}>
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-extrabold text-white leading-tight tracking-tight">Wendy&apos;s</p>
              <p className="text-xs font-semibold leading-tight" style={{ color: '#5eead4' }}>Apartelle</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg cursor-pointer transition-colors"
            style={{ color: 'rgba(255,255,255,0.6)' }}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.35)' }}>Menu</p>
          {navItems.map(({ href, icon: Icon, label, activeColor, glowColor }) => {
            const isActive = pathname === href || pathname.startsWith(href + '/')
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
                  isActive
                    ? `bg-gradient-to-r ${activeColor} text-white shadow-lg ${glowColor}`
                    : 'text-white/60 hover:text-white hover:bg-white/10'
                )}
              >
                <Icon style={{ width: '18px', height: '18px' }} className={isActive ? 'text-white' : ''} />
                {label}
                {isActive && <Sparkles className="w-3 h-3 ml-auto text-white/70" />}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div className="px-4 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-3 px-2 py-2.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm"
              style={{ background: 'linear-gradient(135deg, #F472B6, #60A5FA)', color: '#fff' }}>
              W
            </div>
            <div>
              <p className="text-xs font-bold text-white">Wendy</p>
              <p className="text-[10px]" style={{ color: 'rgba(255,255,255,0.45)' }}>Financial Manager</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
