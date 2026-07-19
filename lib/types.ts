export interface User {
  id: string
  email: string
  password: string
  businessName: string
  gstin: string
  createdAt: Date
}

export interface GSTCalculation {
  id: string
  userId: string
  amount: number
  gstRate: number
  isInclusive: boolean
  baseAmount: number
  cgst: number
  sgst: number
  igst: number
  totalGST: number
  totalAmount: number
  calculationType: 'exclusive' | 'inclusive'
  createdAt: Date
  notes: string
}

export interface Invoice {
  id: string
  userId: string
  invoiceNumber: string
  date: Date
  dueDate: Date
  clientName: string
  clientEmail: string
  clientGSTIN: string
  items: InvoiceItem[]
  subtotal: number
  totalGST: number
  totalAmount: number
  status: 'draft' | 'sent' | 'paid'
  notes: string
  createdAt: Date
}

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
  gstRate: number
  amount: number
  tax: number
}

export interface BusinessMetrics {
  userId: string
  totalRevenue: number
  totalTax: number
  invoicesSent: number
  invoicesPaid: number
  averageInvoiceValue: number
  businessHealth: number
}

export interface DashboardData {
  totalRevenue: number
  totalTax: number
  invoiceCount: number
  calculationCount: number
  recentInvoices: Invoice[]
  recentCalculations: GSTCalculation[]
}
