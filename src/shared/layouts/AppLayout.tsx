import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, FileText, Users, BarChart2,
  Radio, Bell, Settings, Shield, LogOut, ChevronRight,
} from 'lucide-react'
import { useAuthStore } from '@features/auth/store/authStore'
import { cn } from '@shared/utils/cn'
import { Toaster } from 'sonner'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: LayoutDashboard, to: '/' },
  { label: 'Propostas', icon: FileText, to: '/proposals', badge: 3 },
  { label: 'CRM', icon: Users, to: '/crm' },
  { label: 'Analytics', icon: BarChart2, to: '/analytics' },
]

const BOTTOM_ITEMS = [
  { label: 'Realtime', icon: Radio, to: '/realtime' },
  { label: 'Notificações', icon: Bell, to: '/notifications', badge: 5 },
  { label: 'Admin', icon: Settings, to: '/admin' },
]

function NavItem({ label, icon: Icon, to, badge }: { label: string; icon: React.ElementType; to: string; badge?: number }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }: { isActive: boolean }) =>
        cn(
          'flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] transition-all duration-150',
          isActive
            ? 'bg-secondary text-foreground font-medium'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60',
        )
      }
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span className="flex-1">{label}</span>
      {badge != null && (
        <span className="text-[10px] font-semibold bg-[#e84d3d] text-white rounded-full px-1.5 py-px min-w-[18px] text-center">
          {badge}
        </span>
      )}
    </NavLink>
  )
}

export function AppLayout() {
  const { user, signOut } = useAuthStore()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-[220px] flex-shrink-0 border-r border-border flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 h-[52px] border-b border-border flex-shrink-0">
          <div className="w-7 h-7 rounded-lg gradient-brand flex items-center justify-center flex-shrink-0">
            <Shield className="w-3.5 h-3.5 text-white" />
          </div>
          <div>
            <p className="text-[13px] font-semibold leading-none">Universo AGV</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">Enterprise</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-2.5 py-2">Principal</p>
          {NAV_ITEMS.map(item => <NavItem key={item.to} {...item} />)}
          <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-2.5 py-2 mt-3">Sistema</p>
          {BOTTOM_ITEMS.map(item => <NavItem key={item.to} {...item} />)}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-secondary/60 cursor-pointer group transition-colors" onClick={handleSignOut}>
            <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center text-[11px] font-semibold text-white flex-shrink-0">
              {user?.name?.slice(0, 2).toUpperCase() ?? 'JG'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[12px] font-medium truncate">{user?.name ?? 'João Gabriel'}</p>
              <p className="text-[10px] text-muted-foreground truncate">Consultor Executivo</p>
            </div>
            <LogOut className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-[52px] flex-shrink-0 border-b border-border flex items-center px-6 gap-4">
          <div className="flex-1" />
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-[11px] text-green-500 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-dot" />
            8 online
          </div>
          <button className="relative w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors">
            <Bell className="w-4 h-4 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#e84d3d]" />
          </button>
          <button className="flex items-center gap-1.5 text-[13px] text-muted-foreground hover:text-foreground transition-colors">
            Nova Proposta <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Toaster position="bottom-right" richColors theme="dark" />
    </div>
  )
}
