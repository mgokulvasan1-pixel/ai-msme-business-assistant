'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth-context'
import Alert from '@/components/alert'
import { Zap } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({})

  const validateForm = () => {
    const newErrors: typeof errors = {}
    if (!email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email address'
    }
    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await login(email, password)
      setSuccess('Login successful! Redirecting...')
      setTimeout(() => router.push('/dashboard'), 500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <Zap className="w-6 h-6 text-primary" />
          <span className="text-2xl font-bold">MSME Assistant</span>
        </div>

        {/* Card */}
        <div className="bg-card rounded-lg border border-border p-8">
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground mb-8">Sign in to your account to continue</p>

          {error && (
            <Alert type="error" title="Login Error" message={error} onClose={() => setError('')} />
          )}
          {success && (
            <Alert type="success" title="Success" message={success} />
          )}

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value)
                  setTouched({ ...touched, email: true })
                  if (e.target.value && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)) {
                    setErrors({ ...errors, email: undefined })
                  }
                }}
                onBlur={() => setTouched({ ...touched, email: true })}
                className={errors.email && touched.email ? 'border-destructive' : ''}
              />
              {errors.email && touched.email && (
                <p className="text-xs text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Password *</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setTouched({ ...touched, password: true })
                  if (e.target.value && e.target.value.length >= 6) {
                    setErrors({ ...errors, password: undefined })
                  }
                }}
                onBlur={() => setTouched({ ...touched, password: true })}
                className={errors.password && touched.password ? 'border-destructive' : ''}
              />
              {errors.password && touched.password && (
                <p className="text-xs text-destructive mt-1">{errors.password}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Create one
            </Link>
          </div>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-secondary/20 rounded-lg text-sm">
            <p className="font-medium mb-2">Demo credentials:</p>
            <p>Email: demo@example.com</p>
            <p>Password: password123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
