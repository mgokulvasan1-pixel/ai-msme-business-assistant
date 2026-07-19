import type { Invoice } from './types'

export function generateInvoicePDF(invoice: Invoice) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice ${invoice.invoiceNumber}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #fff;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #2563eb;
          }
          .invoice-title {
            font-size: 28px;
            font-weight: bold;
            text-align: right;
          }
          .invoice-number {
            text-align: right;
            color: #666;
            margin-top: 5px;
          }
          .section {
            margin-bottom: 30px;
          }
          .section-title {
            font-weight: bold;
            margin-bottom: 10px;
            color: #333;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
            margin-bottom: 30px;
          }
          .info-block {
            margin-bottom: 20px;
          }
          .info-label {
            font-weight: bold;
            margin-bottom: 5px;
            color: #333;
          }
          .info-value {
            color: #666;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th {
            background-color: #f3f4f6;
            padding: 12px;
            text-align: left;
            font-weight: bold;
            border: 1px solid #ddd;
          }
          td {
            padding: 12px;
            border: 1px solid #ddd;
          }
          .text-right {
            text-align: right;
          }
          .totals {
            margin-left: auto;
            width: 300px;
            margin-top: 20px;
          }
          .totals-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #ddd;
          }
          .totals-row.total {
            font-weight: bold;
            border-bottom: 2px solid #333;
            padding: 12px 0;
            font-size: 16px;
          }
          .notes {
            background-color: #f9fafb;
            padding: 15px;
            border-radius: 4px;
            margin-top: 20px;
          }
          .footer {
            text-align: center;
            margin-top: 40px;
            color: #666;
            font-size: 12px;
            border-top: 1px solid #ddd;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">MSME Assistant</div>
            <div>
              <div class="invoice-title">INVOICE</div>
              <div class="invoice-number">Invoice # ${invoice.invoiceNumber}</div>
            </div>
          </div>

          <div class="info-grid">
            <div>
              <div class="section-title">From:</div>
              <div class="info-block">
                <div class="info-label">Your Business</div>
                <div class="info-value">GST Registered Business</div>
              </div>
            </div>
            <div>
              <div class="section-title">Bill To:</div>
              <div class="info-block">
                <div class="info-label">${invoice.clientName}</div>
                <div class="info-value">${invoice.clientEmail}</div>
                ${invoice.clientGSTIN ? `<div class="info-value">GSTIN: ${invoice.clientGSTIN}</div>` : ''}
              </div>
            </div>
          </div>

          <div class="info-grid">
            <div>
              <div class="info-block">
                <div class="info-label">Invoice Date:</div>
                <div class="info-value">${new Date(invoice.date).toLocaleDateString('en-IN')}</div>
              </div>
            </div>
            <div>
              <div class="info-block">
                <div class="info-label">Due Date:</div>
                <div class="info-value">${new Date(invoice.dueDate).toLocaleDateString('en-IN')}</div>
              </div>
            </div>
          </div>

          <div class="section">
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th class="text-right">Quantity</th>
                  <th class="text-right">Rate</th>
                  <th class="text-right">Amount</th>
                  <th class="text-right">GST %</th>
                  <th class="text-right">Tax</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items.map(item => `
                  <tr>
                    <td>${item.description}</td>
                    <td class="text-right">${item.quantity}</td>
                    <td class="text-right">₹${item.rate.toFixed(2)}</td>
                    <td class="text-right">₹${item.amount.toFixed(2)}</td>
                    <td class="text-right">${item.gstRate}%</td>
                    <td class="text-right">₹${item.tax.toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="totals">
            <div class="totals-row">
              <span>Subtotal:</span>
              <span>₹${invoice.subtotal.toFixed(2)}</span>
            </div>
            <div class="totals-row">
              <span>Total Tax:</span>
              <span>₹${invoice.totalGST.toFixed(2)}</span>
            </div>
            <div class="totals-row total">
              <span>Total Amount:</span>
              <span>₹${invoice.totalAmount.toFixed(2)}</span>
            </div>
          </div>

          ${invoice.notes ? `
            <div class="notes">
              <div class="section-title">Notes:</div>
              ${invoice.notes}
            </div>
          ` : ''}

          <div class="footer">
            <p>Thank you for your business!</p>
            <p>Generated on ${new Date().toLocaleString('en-IN')}</p>
          </div>
        </div>
      </body>
    </html>
  `

  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `invoice-${invoice.invoiceNumber}.html`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export function generateCSVExport(data: any[], filename: string) {
  const headers = Object.keys(data[0] || {})
  const csv = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header]
        if (typeof value === 'string' && value.includes(',')) {
          return `"${value}"`
        }
        return value
      }).join(',')
    )
  ].join('\n')

  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${filename}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
