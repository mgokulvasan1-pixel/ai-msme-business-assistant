'use client'

import { useEffect, useState } from 'react'
import type { Invoice, InvoiceItem } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Plus, Eye, Download, Trash2, Edit2 } from 'lucide-react'
import InvoiceForm from '@/components/invoice-form'
import InvoicePreview from '@/components/invoice-preview'

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Load invoices on mount
  useEffect(() => {
    const saved = localStorage.getItem('msme_invoices')
    if (saved) {
      setInvoices(JSON.parse(saved))
    }
  }, [])

  const handleSaveInvoice = (invoice: Invoice) => {
    let updated: Invoice[]
    
    if (editingInvoice) {
      updated = invoices.map(inv => inv.id === editingInvoice.id ? invoice : inv)
    } else {
      updated = [invoice, ...invoices]
    }
    
    setInvoices(updated)
    localStorage.setItem('msme_invoices', JSON.stringify(updated))
    setShowForm(false)
    setEditingInvoice(null)
  }

  const handleDeleteInvoice = (id: string) => {
    const updated = invoices.filter(inv => inv.id !== id)
    setInvoices(updated)
    localStorage.setItem('msme_invoices', JSON.stringify(updated))
  }

  const handleEditInvoice = (invoice: Invoice) => {
    setEditingInvoice(invoice)
    setShowForm(true)
  }

  const handleDownloadPDF = (invoice: Invoice) => {
    // Generate HTML content
    const htmlContent = generateInvoiceHTML(invoice)
    
    // Create a blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `invoice-${invoice.invoiceNumber}.html`
    a.click()
  }

  const filteredInvoices = invoices.filter(invoice =>
    invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    invoice.clientName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">Create and manage your business invoices</p>
        </div>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="gap-2">
            <Plus className="w-4 h-4" />
            New Invoice
          </Button>
        )}
      </div>

      {showForm ? (
        <Card className="p-6 border-border">
          <InvoiceForm
            invoice={editingInvoice || undefined}
            onSave={handleSaveInvoice}
            onCancel={() => {
              setShowForm(false)
              setEditingInvoice(null)
            }}
          />
        </Card>
      ) : (
        <>
          {/* Search */}
          <div>
            <Input
              placeholder="Search by invoice number or client name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Invoices List */}
          {filteredInvoices.length === 0 ? (
            <Card className="p-12 border-border text-center">
              <p className="text-muted-foreground mb-4">No invoices yet</p>
              <Button onClick={() => setShowForm(true)} className="gap-2">
                <Plus className="w-4 h-4" />
                Create your first invoice
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredInvoices.map(invoice => (
                <Card key={invoice.id} className="p-4 border-border">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-lg">INV-{invoice.invoiceNumber}</h3>
                        <span className={`text-xs px-2 py-1 rounded ${
                          invoice.status === 'paid' ? 'bg-green-500/20 text-green-400' :
                          invoice.status === 'sent' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-yellow-500/20 text-yellow-400'
                        }`}>
                          {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                        </span>
                      </div>
                      <div className="flex gap-6 text-sm text-muted-foreground mb-2">
                        <span>{invoice.clientName}</span>
                        <span>{new Date(invoice.date).toLocaleDateString('en-IN')}</span>
                      </div>
                      <div className="flex gap-4 text-sm">
                        <span className="text-muted-foreground">
                          Items: <span className="text-foreground font-medium">{invoice.items.length}</span>
                        </span>
                        <span className="text-muted-foreground">
                          Amount: <span className="font-bold text-foreground">₹{invoice.totalAmount.toFixed(2)}</span>
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setPreviewInvoice(invoice)}
                        title="Preview"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadPDF(invoice)}
                        title="Download"
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditInvoice(invoice)}
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {/* Preview Modal */}
      {previewInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg border border-border max-w-4xl w-full max-h-96 overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Invoice Preview</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewInvoice(null)}
                >
                  ✕
                </Button>
              </div>
              <InvoicePreview invoice={previewInvoice} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function generateInvoiceHTML(invoice: Invoice): string {
  const itemsHTML = invoice.items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #ddd;">${item.description}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.rate.toFixed(2)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">${item.gstRate}%</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.tax.toFixed(2)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #ddd; text-align: right;">₹${item.amount.toFixed(2)}</td>
    </tr>
  `).join('')

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Invoice ${invoice.invoiceNumber}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
        .header { text-align: center; margin-bottom: 30px; }
        .invoice-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
        .section { margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
        th { background-color: #f5f5f5; padding: 10px; text-align: left; border-bottom: 2px solid #333; }
        .total-section { text-align: right; margin-top: 20px; }
        .total-row { display: flex; justify-content: flex-end; padding: 8px 0; }
        .total-label { min-width: 150px; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>INVOICE</h1>
        <p>INV-${invoice.invoiceNumber}</p>
      </div>

      <div class="invoice-info">
        <div>
          <h3>From:</h3>
          <p>Your Business</p>
        </div>
        <div>
          <h3>To:</h3>
          <p><strong>${invoice.clientName}</strong></p>
          <p>Email: ${invoice.clientEmail}</p>
          <p>GSTIN: ${invoice.clientGSTIN}</p>
        </div>
        <div>
          <p><strong>Date:</strong> ${new Date(invoice.date).toLocaleDateString('en-IN')}</p>
          <p><strong>Due Date:</strong> ${new Date(invoice.dueDate).toLocaleDateString('en-IN')}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th style="text-align: right;">Qty</th>
            <th style="text-align: right;">Rate</th>
            <th style="text-align: right;">GST %</th>
            <th style="text-align: right;">Tax</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHTML}
        </tbody>
      </table>

      <div class="total-section">
        <div class="total-row">
          <span class="total-label">Subtotal:</span>
          <span>₹${invoice.subtotal.toFixed(2)}</span>
        </div>
        <div class="total-row">
          <span class="total-label">Total Tax:</span>
          <span>₹${invoice.totalGST.toFixed(2)}</span>
        </div>
        <div class="total-row" style="border-top: 2px solid #333; padding-top: 12px; font-size: 18px; font-weight: bold;">
          <span class="total-label">Total Amount:</span>
          <span>₹${invoice.totalAmount.toFixed(2)}</span>
        </div>
      </div>

      ${invoice.notes ? `<div class="section"><strong>Notes:</strong><p>${invoice.notes}</p></div>` : ''}
    </body>
    </html>
  `
}
