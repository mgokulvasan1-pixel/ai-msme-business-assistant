'use client'

import type { Invoice } from '@/lib/types'

interface InvoicePreviewProps {
  invoice: Invoice
}

export default function InvoicePreview({ invoice }: InvoicePreviewProps) {
  return (
    <div className="bg-card rounded-lg p-8 space-y-6">
      {/* Header */}
      <div className="text-center border-b border-border pb-6">
        <h1 className="text-3xl font-bold">INVOICE</h1>
        <p className="text-lg text-primary">INV-{invoice.invoiceNumber}</p>
      </div>

      {/* Invoice Info */}
      <div className="grid grid-cols-3 gap-8">
        <div>
          <h3 className="font-bold mb-2">From:</h3>
          <p className="text-sm text-muted-foreground">Your Business Name</p>
        </div>
        <div>
          <h3 className="font-bold mb-2">Bill To:</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">{invoice.clientName}</p>
            <p>{invoice.clientEmail}</p>
            <p>GSTIN: {invoice.clientGSTIN}</p>
          </div>
        </div>
        <div className="text-sm">
          <div className="mb-3">
            <span className="text-muted-foreground">Invoice Date: </span>
            <span className="font-medium">{new Date(invoice.date).toLocaleDateString('en-IN')}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Due Date: </span>
            <span className="font-medium">{new Date(invoice.dueDate).toLocaleDateString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 px-3">Description</th>
            <th className="text-right py-2 px-3">Qty</th>
            <th className="text-right py-2 px-3">Rate</th>
            <th className="text-right py-2 px-3">GST %</th>
            <th className="text-right py-2 px-3">Tax</th>
            <th className="text-right py-2 px-3">Amount</th>
          </tr>
        </thead>
        <tbody>
          {invoice.items.map((item) => (
            <tr key={item.id} className="border-b border-border/50">
              <td className="py-2 px-3">{item.description}</td>
              <td className="text-right py-2 px-3">{item.quantity}</td>
              <td className="text-right py-2 px-3">₹{item.rate.toFixed(2)}</td>
              <td className="text-right py-2 px-3">{item.gstRate}%</td>
              <td className="text-right py-2 px-3">₹{item.tax.toFixed(2)}</td>
              <td className="text-right py-2 px-3 font-medium">₹{item.amount.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end">
        <div className="w-64 space-y-2 border-t border-border pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal:</span>
            <span>₹{invoice.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Tax (GST):</span>
            <span>₹{invoice.totalGST.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold border-t border-border pt-2">
            <span>Total Amount:</span>
            <span className="text-primary">₹{invoice.totalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {invoice.notes && (
        <div className="border-t border-border pt-4">
          <h3 className="font-bold text-sm mb-2">Notes:</h3>
          <p className="text-sm text-muted-foreground">{invoice.notes}</p>
        </div>
      )}

      {/* Footer */}
      <div className="border-t border-border pt-4 text-center text-xs text-muted-foreground">
        <p>Thank you for your business!</p>
      </div>
    </div>
  )
}
