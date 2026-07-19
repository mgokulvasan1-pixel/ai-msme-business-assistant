'use client'

import { useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { User, Mail, Building2, FileText } from 'lucide-react'

export default function ProfilePage() {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    businessName: user?.businessName || '',
    gstin: user?.gstin || '',
    email: user?.email || '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (user) {
      updateUser({
        businessName: formData.businessName,
        gstin: formData.gstin,
      })
      setIsEditing(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your business information</p>
      </div>

      {/* Profile Card */}
      <Card className="p-8 border-border">
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user.businessName}</h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Business Name
              </label>
              <Input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                GSTIN (15 digits)
              </label>
              <Input
                type="text"
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
                placeholder="01AABCE1234F1Z0"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </label>
              <Input
                type="email"
                value={formData.email}
                disabled
                className="bg-secondary/50 cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground mt-2">Email cannot be changed</p>
            </div>

            <div className="flex gap-4">
              <Button type="submit" className="flex-1">Save Changes</Button>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setIsEditing(false)
                  setFormData({
                    businessName: user.businessName,
                    gstin: user.gstin,
                    email: user.email,
                  })
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Business Name
              </p>
              <p className="text-lg font-medium">{user.businessName}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                GSTIN
              </p>
              <p className="text-lg font-medium">{user.gstin}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </p>
              <p className="text-lg font-medium">{user.email}</p>
            </div>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Member since {new Date(user.createdAt).toLocaleDateString('en-IN')}
              </p>
            </div>
          </div>
        )}
      </Card>

      {/* Account Info */}
      <Card className="p-6 border-border">
        <h3 className="font-bold mb-4">Account Information</h3>
        <div className="space-y-4 text-sm">
          <div className="flex justify-between pb-4 border-b border-border">
            <span className="text-muted-foreground">Account Type</span>
            <span className="font-medium">Individual Business Owner</span>
          </div>
          <div className="flex justify-between pb-4 border-b border-border">
            <span className="text-muted-foreground">Account Status</span>
            <span className="font-medium text-green-400">Active</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Member Since</span>
            <span className="font-medium">{new Date(user.createdAt).toLocaleDateString('en-IN')}</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
