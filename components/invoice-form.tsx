'use client'

import { useState, useEffect } from 'react'
import type { Invoice, InvoiceItem } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Trash2, Plus } from 'lucide-react'

interface InvoiceFormProps {
  invoice?: Invoice
  onSave: (invoice: Invoice) => void
  onCancel: () => void
}

export default function InvoiceForm({ invoice, onSave, onCancel }: InvoiceFormProps) {
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    clientName: '',
    clientEmail: '',
    clientGSTIN: '',
    items: [{ id: '1', description: '', quantity: 1, rate: 0, gstRate: 18, amount: 0, tax: 0 }] as InvoiceItem[],
    notes: '',
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    if (invoice) {
      setFormData({
        invoiceNumber: invoice.invoiceNumber,
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
        clientGSTIN: invoice.clientGSTIN,
        items: invoice.items,
        notes: invoice.notes,
      })
    }
  }, [invoice])

  const handleAddItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        id: Math.random().toString(36).substr(2, 9),
        description: '',
        quantity: 1,
        rate: 0,
        gstRate: 18,
        amount: 0,
        tax: 0,
      }]
    }))
  }

  const handleRemoveItem = (id: string) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id)
    }))
  }

  const handleItemChange = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value }
          if (field === 'quantity' || field === 'rate') {
            updated.amount = (updated.quantity || 0) * (updated.rate || 0)
            updated.tax = updated.amount * (updated.gstRate || 0) / 100
          } else if (field === 'gstRate') {
            updated.tax = updated.amount * (updated.gstRate || 0) / 100
          }
          return updated
        }
        return item
      })
    }))
  }

  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.amount, 0)
    const totalGST = formData.items.reduce((sum, item) => sum + item.tax, 0)
    return {
      subtotal,
      totalGST,
      totalAmount: subtotal + totalGST
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    
    if (!formData.invoiceNumber.trim()) {
      newErrors.invoiceNumber = 'Invoice number is required'
    }
    if (!formData.clientName.trim()) {
      newErrors.clientName = 'Client name is required'
    }
    if (formData.clientEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.clientEmail)) {
      newErrors.clientEmail = 'Please enter a valid email address'
    }
    if (formData.clientGSTIN && !/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/.test(formData.clientGSTIN)) {
      newErrors.clientGSTIN = 'Please enter a valid 15-character GSTIN'
    }
    if (formData.items.length === 0) {
      newErrors.items = 'At least one item is required'
    }
    if (formData.items.some(item => !item.description.trim())) {
      newErrors.itemDescription = 'All items must have a description'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }

    const totals = calculateTotals()
    
    const newInvoice: Invoice = {
      id: invoice?.id || Math.random().toString(36).substr(2, 9),
      userId: 'current-user',
      invoiceNumber: formData.invoiceNumber,
      date: invoice?.date || new Date(),
      dueDate: invoice?.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      clientName: formData.clientName,
      clientEmail: formData.clientEmail,
      clientGSTIN: formData.clientGSTIN,
      items: formData.items,
      subtotal: totals.subtotal,
      totalGST: totals.totalGST,
      totalAmount: totals.totalAmount,
      status: invoice?.status || 'draft',
      notes: formData.notes,
      createdAt: invoice?.createdAt || new Date(),
    }

    onSave(newInvoice)
  }

  const totals = calculateTotals()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Invoice Number *</label>
              <Input
                type="text"
                value={formData.invoiceNumber}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))
                  setTouched(prev => ({ ...prev, invoiceNumber: true }))
                  if (e.target.value.trim()) {
                    setErrors(prev => ({ ...prev, invoiceNumber: undefined }))
                  }
                }}
                onBlur={() => setTouched(prev => ({ ...prev, invoiceNumber: true }))}
                placeholder="INV-001"
                className={errors.invoiceNumber && touched.invoiceNumber ? 'border-destructive' : ''}
              />
              {errors.invoiceNumber && touched.invoiceNumber && (
                <p className="text-xs text-destructive mt-1">{errors.invoiceNumber}</p>
              )}
            </div>
        <div>
          <label className="block text-sm font-medium mb-2">Client Name *</label>
          <Input
            type="text"
            value={formData.clientName}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, clientName: e.target.value }))
              setTouched(prev => ({ ...prev, clientName: true }))
              if (e.target.value.trim()) {
                setErrors(prev => ({ ...prev, clientName: undefined }))
              }
            }}
            onBlur={() => setTouched(prev => ({ ...prev, clientName: true }))}
            placeholder="Client business name"
            className={errors.clientName && touched.clientName ? 'border-destructive' : ''}
          />
          {errors.clientName && touched.clientName && (
            <p className="text-xs text-destructive mt-1">{errors.clientName}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Client Email</label>
          <Input
            type="email"
            value={formData.clientEmail}
            onChange={(e) => {
              setFormData(prev => ({ ...prev, clientEmail: e.target.value }))
              setTouched(prev => ({ ...prev, clientEmail: true }))
              if (!e.target.value || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.target.value)) {
                setErrors(prev => ({ ...prev, clientEmail: undefined }))
              }
            }}
            onBlur={() => setTouched(prev => ({ ...prev, clientEmail: true }))}
            placeholder="client@example.com"
            className={errors.clientEmail && touched.clientEmail ? 'border-destructive' : ''}
          />
          {errors.clientEmail && touched.clientEmail && (
            <p className="text-xs text-destructive mt-1">{errors.clientEmail}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Client GSTIN</label>
          <Input
            type="text"
            value={formData.clientGSTIN}
            onChange={(e) => setFormData(prev => ({ ...prev, clientGSTIN: e.target.value }))}
            placeholder="15-digit GSTIN"
          />
        </div>
      </div>

      {/* Items */}
      <div>
        <h3 className="font-bold mb-4">Invoice Items</h3>
        <div className="space-y-3">
          {formData.items.map((item) => (
            <div key={item.id} className="flex gap-2 items-end">
              <div className="flex-1">
                <Input
                  type="text"
                  value={item.description}
                  onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                  placeholder="Description"
                  className="mb-2"
                />
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <label className="text-xs text-muted-foreground">Qty</label>
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(item.id, 'quantity', parseFloat(e.target.value))}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Rate</label>
                    <Input
                      type="number"
                      value={item.rate}
                      onChange={(e) => handleItemChange(item.id, 'rate', parseFloat(e.target.value))}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">GST %</label>
                    <select
                      value={item.gstRate}
                      onChange={(e) => handleItemChange(item.id, 'gstRate', parseInt(e.target.value))}
                      className="w-full px-2 py-1 bg-secondary border border-border rounded text-sm"
                    >
                      <option value="0">0%</option>
                      <option value="5">5%</option>
                      <option value="12">12%</option>
                      <option value="18">18%</option>
                      <option value="28">28%</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Amount</label>
                    <Input
                      type="number"
                      value={item.amount.toFixed(2)}
                      disabled
                      className="bg-secondary"
                    />
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveItem(item.id)}
                className="mb-2"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
        <Button variant="outline" onClick={handleAddItem} className="w-full mt-4 gap-2">
          <Plus className="w-4 h-4" />
          Add Item
        </Button>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium mb-2">Notes (optional)</label>
        <Input
          type="text"
          value={formData.notes}
          onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
          placeholder="Add any notes for the invoice..."
        />
      </div>

      {/* Totals */}
      <div className="bg-secondary/30 p-4 rounded-lg space-y-2">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Subtotal:</span>
          <span className="font-medium">₹{totals.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total Tax:</span>
          <span className="font-medium">₹{totals.totalGST.toFixed(2)}</span>
        </div>
        <div className="border-t border-border pt-2 flex justify-between text-lg font-bold">
          <span>Total Amount:</span>
          <span className="text-primary">₹{totals.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={handleSubmit} className="flex-1">
          {invoice ? 'Update Invoice' : 'Create Invoice'}
        </Button>
        <Button variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
      </div>
    </div>
  )
}
