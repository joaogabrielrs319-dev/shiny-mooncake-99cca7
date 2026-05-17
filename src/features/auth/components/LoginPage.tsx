import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Shield, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuthStore } from '../store/authStore'
import { Button } from '@shared/components/ui/Button'
import { cn } from '@shared/utils/cn'
import { toast } from 'sonner'

const schema = z.object({
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'Mínimo 6 caracteres'),
})

type FormValues = z.infer<typeof schema>

export function LoginPage() {
  const { signIn, loading } = useAuthStore()
  const navigate = useNavigate()
  const [showPass, setShowPass] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormValues) => {
    try {
      await signIn(data.email, data.password)
      navigate('/')
    } catch {
      toast.error('Credenciais inválidas. Tente novamente.')
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#e84d3d]/5 via-transparent to-[#f97316]/5 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[380px]"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center mb-4">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Universo AGV</h1>
          <p className="text-sm text-muted-foreground mt-1">Plataforma de Proteção Veicular</p>
        </div>

        {/* Form */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">E-mail</label>
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder="seu@email.com"
              className={cn(
                'w-full h-10 bg-secondary border rounded-lg px-3 text-sm outline-none transition-all duration-150',
                'placeholder:text-muted-foreground/50',
                'focus:border-[#e84d3d]/50 focus:ring-2 focus:ring-[#e84d3d]/10',
                errors.email ? 'border-destructive' : 'border-border',
              )}
            />
            {errors.email && <p className="text-[11px] text-destructive mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">Senha</label>
            <div className="relative">
              <input
                {...register('password')}
                type={showPass ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="••••••••"
                className={cn(
                  'w-full h-10 bg-secondary border rounded-lg px-3 pr-10 text-sm outline-none transition-all duration-150',
                  'placeholder:text-muted-foreground/50',
                  'focus:border-[#e84d3d]/50 focus:ring-2 focus:ring-[#e84d3d]/10',
                  errors.password ? 'border-destructive' : 'border-border',
                )}
              />
              <button
                type="button"
                onClick={() => setShowPass(p => !p)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.password && <p className="text-[11px] text-destructive mt-1">{errors.password.message}</p>}
          </div>

          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            size="lg"
            className="w-full mt-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Entrar na Plataforma'}
          </Button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Universo AGV Enterprise · Versão 1.0
        </p>
      </motion.div>
    </div>
  )
}
