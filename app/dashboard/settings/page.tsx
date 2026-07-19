'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Bell, Lock, Moon, Zap, Database, HelpCircle } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    darkMode: true,
    autoSave: true,
    twoFactorAuth: false,
  })

  const [savedMessage, setSavedMessage] = useState(false)

  const handleToggle = (key: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }))
  }

  const handleSave = () => {
    localStorage.setItem('msme_settings', JSON.stringify(settings))
    setSavedMessage(true)
    setTimeout(() => setSavedMessage(false), 3000)
  }

  const handleClearData = () => {
    if (confirm('Are you sure? This will delete all your invoices and calculations.')) {
      localStorage.removeItem('msme_invoices')
      localStorage.removeItem('msme_gst_calculations')
      alert('Data cleared successfully')
    }
  }

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your preferences and account settings</p>
      </div>

      {/* Save Message */}
      {savedMessage && (
        <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm">
          Settings saved successfully!
        </div>
      )}

      {/* Notifications */}
      <Card className="p-6 border-border">
        <div className="flex items-start gap-4 mb-6">
          <Bell className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-bold mb-1">Notifications</h3>
            <p className="text-sm text-muted-foreground">Control how you receive alerts and updates</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium">Email Notifications</p>
              <p className="text-sm text-muted-foreground">Receive updates about your invoices and calculations</p>
            </div>
            <button
              onClick={() => handleToggle('emailNotifications')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.emailNotifications ? 'bg-primary' : 'bg-secondary'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                  settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <p className="font-medium">Invoice Reminders</p>
              <p className="text-sm text-muted-foreground">Get reminded about unpaid invoices</p>
            </div>
            <button
              onClick={() => handleToggle('autoSave')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.autoSave ? 'bg-primary' : 'bg-secondary'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                  settings.autoSave ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </Card>

      {/* Display */}
      <Card className="p-6 border-border">
        <div className="flex items-start gap-4 mb-6">
          <Moon className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-bold mb-1">Display</h3>
            <p className="text-sm text-muted-foreground">Customize your visual experience</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">Use dark theme for the application</p>
            </div>
            <button
              onClick={() => handleToggle('darkMode')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.darkMode ? 'bg-primary' : 'bg-secondary'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                  settings.darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="py-3">
            <p className="font-medium mb-2">Theme</p>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
                Professional Blue
              </button>
              <button className="px-4 py-2 bg-secondary text-foreground rounded-lg text-sm font-medium hover:bg-secondary/80">
                Light Gray
              </button>
            </div>
          </div>
        </div>
      </Card>

      {/* Security */}
      <Card className="p-6 border-border">
        <div className="flex items-start gap-4 mb-6">
          <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-bold mb-1">Security</h3>
            <p className="text-sm text-muted-foreground">Keep your account safe and secure</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
            </div>
            <button
              onClick={() => handleToggle('twoFactorAuth')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.twoFactorAuth ? 'bg-primary' : 'bg-secondary'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-background transition-transform ${
                  settings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="pt-3">
            <Button variant="outline" className="w-full">Change Password</Button>
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card className="p-6 border-border">
        <div className="flex items-start gap-4 mb-6">
          <Database className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-bold mb-1">Data Management</h3>
            <p className="text-sm text-muted-foreground">Manage your business data</p>
          </div>
        </div>

        <div className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <Zap className="w-4 h-4 mr-2" />
            Download My Data
          </Button>
          <Button
            variant="outline"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleClearData}
          >
            Delete All Data
          </Button>
        </div>
      </Card>

      {/* Help & Support */}
      <Card className="p-6 border-border">
        <div className="flex items-start gap-4 mb-6">
          <HelpCircle className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h3 className="font-bold mb-1">Help & Support</h3>
            <p className="text-sm text-muted-foreground">Get help and reach out to support</p>
          </div>
        </div>

        <div className="space-y-3">
          <a href="#" className="block p-3 border border-border rounded-lg hover:bg-secondary/30 transition-colors">
            <p className="font-medium text-sm">Documentation</p>
            <p className="text-xs text-muted-foreground">Learn how to use the MSME Assistant</p>
          </a>
          <a href="#" className="block p-3 border border-border rounded-lg hover:bg-secondary/30 transition-colors">
            <p className="font-medium text-sm">FAQ</p>
            <p className="text-xs text-muted-foreground">Frequently asked questions</p>
          </a>
          <a href="#" className="block p-3 border border-border rounded-lg hover:bg-secondary/30 transition-colors">
            <p className="font-medium text-sm">Contact Support</p>
            <p className="text-xs text-muted-foreground">Email us at support@example.com</p>
          </a>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex gap-4">
        <Button onClick={handleSave} className="flex-1">Save Settings</Button>
      </div>

      {/* App Info */}
      <Card className="p-6 border-border text-center text-sm">
        <p className="text-muted-foreground mb-2">MSME Business Assistant</p>
        <p className="text-xs text-muted-foreground">Version 1.0.0</p>
      </Card>
    </div>
  )
}
