'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth-context'
import Alert from '@/components/alert'
import { Zap, CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    businessName: '',
    gstin: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors }

    switch (name) {
      case 'businessName':
        if (!value.trim()) {
          newErrors.businessName = 'Business name is required'
        } else if (value.length < 3) {
          newErrors.businessName = 'Business name must be at least 3 characters'
        } else {
          delete newErrors.businessName
        }
        break
      case 'gstin':
        if (!value.trim()) {
          newErrors.gstin = 'GSTIN is required'
        } else if (!/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/.test(value)) {
          newErrors.gstin = 'Please enter a valid 15-character GSTIN'
        } else {
          delete newErrors.gstin
        }
        break
      case 'email':
        if (!value.trim()) {
          newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Please enter a valid email address'
        } else {
          delete newErrors.email
        }
        break
      case 'password':
        if (!value) {
          newErrors.password = 'Password is required'
        } else if (value.length < 8) {
          newErrors.password = 'Password must be at least 8 characters'
        } else if (!/(?=.*[A-Z])/.test(value)) {
          newErrors.password = 'Password must contain at least one uppercase letter'
        } else if (!/(?=.*\d)/.test(value)) {
          newErrors.password = 'Password must contain at least one number'
        } else {
          delete newErrors.password
        }
        break
      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Please confirm your password'
        } else if (value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match'
        } else {
          delete newErrors.confirmPassword
        }
        break
    }

    setErrors(newErrors)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setTouched((prev) => ({ ...prev, [name]: true }))
    validateField(name, value)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required'
    }
    if (!formData.gstin.trim() || !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/.test(formData.gstin)) {
      newErrors.gstin = 'Valid GSTIN is required'
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required'
    }
    if (!formData.password || formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
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
      await register(
        formData.email,
        formData.password,
        formData.businessName,
        formData.gstin
      )
      setSuccess('Account created successfully! Redirecting...')
      setTimeout(() => router.push('/dashboard'), 1000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="flex items-center gap-2 mb-8 justify-center">
          <Zap className="w-6 h-6 text-primary" />
          <span className="text-2xl font-bold">MSME Assistant</span>
        </div>

        {/* Card */}
        <div className="bg-card rounded-lg border border-border p-8">
          <h1 className="text-3xl font-bold mb-2">Create Account</h1>
          <p className="text-muted-foreground mb-8">Set up your business account</p>

          {error && (
            <Alert type="error" title="Registration Error" message={error} onClose={() => setError('')} />
          )}
          {success && (
            <Alert type="success" title="Success" message={success} />
          )}

          <form onSubmit={handleSubmit} className="space-y-4 mt-6">
            <div>
              <label className="block text-sm font-medium mb-2">Business Name *</label>
              <Input
                type="text"
                name="businessName"
                placeholder="Your business name"
                value={formData.businessName}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.businessName && touched.businessName ? 'border-destructive' : ''}
              />
              {errors.businessName && touched.businessName && (
                <p className="text-xs text-destructive mt-1">{errors.businessName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">GSTIN (15 characters) *</label>
              <Input
                type="text"
                name="gstin"
                placeholder="01AABCE1234F1Z0"
                value={formData.gstin}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.gstin && touched.gstin ? 'border-destructive' : ''}
              />
              {errors.gstin && touched.gstin && (
                <p className="text-xs text-destructive mt-1">{errors.gstin}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email *</label>
              <Input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
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
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.password && touched.password ? 'border-destructive' : ''}
              />
              {errors.password && touched.password && (
                <p className="text-xs text-destructive mt-1">{errors.password}</p>
              )}
              {!errors.password && formData.password && (
                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Password meets requirements
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password *</label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={errors.confirmPassword && touched.confirmPassword ? 'border-destructive' : ''}
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>
              )}
              {!errors.confirmPassword && formData.confirmPassword && (
                <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Passwords match
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
