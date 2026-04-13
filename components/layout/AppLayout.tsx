'use client'
import React, { useState } from 'react'
import Sidebar from './Sidebar'
import { Menu, Building2 } from 'lucide-react'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #FDF2F8 0%, #FFF0F5 40%, #EFF6FF 100%)' }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between px-4 py-3 shadow-sm"
          style={{ background: 'linear-gradient(135deg, #831843, #BE185D)' }}>
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 cursor-pointer transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #F472B6, #60A5FA)' }}>
              <Building2 className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-bold text-white">Wendy Business Hub</span>
          </div>
          <div className="w-9" />
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
