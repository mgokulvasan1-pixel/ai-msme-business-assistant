'use client'

import { useEffect, useState } from 'react'
import type { Invoice, GSTCalculation } from '@/lib/types'
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'

interface ReportData {
  totalRevenue: number
  totalTax: number
  invoiceCount: number
  paidCount: number
  unpaidCount: number
  averageInvoice: number
  taxRate: number
  gstBreakdown: { name: string; value: number }[]
  statusBreakdown: { name: string; value: number }[]
  monthlyData: { month: string; revenue: number; tax: number }[]
}

export default function ReportsPage() {
  const [report, setReport] = useState<ReportData>({
    totalRevenue: 0,
    totalTax: 0,
    invoiceCount: 0,
    paidCount: 0,
    unpaidCount: 0,
    averageInvoice: 0,
    taxRate: 0,
    gstBreakdown: [],
    statusBreakdown: [],
    monthlyData: [],
  })

  useEffect(() => {
    // Load data from localStorage
    const invoices: Invoice[] = JSON.parse(localStorage.getItem('msme_invoices') || '[]')
    const calculations: GSTCalculation[] = JSON.parse(
      localStorage.getItem('msme_gst_calculations') || '[]'
    )

    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
    const totalTax = invoices.reduce((sum, inv) => sum + inv.totalGST, 0)
    const paidCount = invoices.filter(inv => inv.status === 'paid').length
    const unpaidCount = invoices.filter(inv => inv.status !== 'paid').length

    // GST Breakdown by rate
    const gstByRate: Record<number, number> = {}
    calculations.forEach(calc => {
      if (!gstByRate[calc.gstRate]) gstByRate[calc.gstRate] = 0
      gstByRate[calc.gstRate] += 1
    })
    const gstBreakdown = Object.entries(gstByRate).map(([rate, count]) => ({
      name: `${rate}% GST`,
      value: count,
    }))

    // Status breakdown
    const statusBreakdown = [
      { name: 'Draft', value: invoices.filter(inv => inv.status === 'draft').length },
      { name: 'Sent', value: invoices.filter(inv => inv.status === 'sent').length },
      { name: 'Paid', value: paidCount },
    ]

    // Monthly data
    const monthlyMap: Record<string, { revenue: number; tax: number }> = {}
    invoices.forEach(inv => {
      const month = new Date(inv.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
      if (!monthlyMap[month]) monthlyMap[month] = { revenue: 0, tax: 0 }
      monthlyMap[month].revenue += inv.totalAmount
      monthlyMap[month].tax += inv.totalGST
    })
    const monthlyData = Object.entries(monthlyMap).map(([month, data]) => ({
      month,
      ...data,
    }))

    setReport({
      totalRevenue,
      totalTax,
      invoiceCount: invoices.length,
      paidCount,
      unpaidCount,
      averageInvoice: invoices.length > 0 ? totalRevenue / invoices.length : 0,
      taxRate: totalRevenue > 0 ? (totalTax / totalRevenue) * 100 : 0,
      gstBreakdown,
      statusBreakdown,
      monthlyData,
    })
  }, [])

  const handleExportReport = () => {
    const csv = `Business Report - ${new Date().toLocaleDateString()}
Total Revenue,₹${report.totalRevenue.toFixed(2)}
Total Tax,₹${report.totalTax.toFixed(2)}
Average Tax Rate,${report.taxRate.toFixed(2)}%
Total Invoices,${report.invoiceCount}
Paid Invoices,${report.paidCount}
Unpaid Invoices,${report.unpaidCount}
Average Invoice Value,₹${report.averageInvoice.toFixed(2)}`

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `business-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const COLORS = [
    'oklch(0.55 0.25 240)',
    'oklch(0.7 0.15 180)',
    'oklch(0.65 0.2 120)',
    'oklch(0.6 0.18 30)',
  ]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports</h1>
          <p className="text-muted-foreground">Business analytics and insights</p>
        </div>
        <Button onClick={handleExportReport} className="gap-2">
          <Download className="w-4 h-4" />
          Export Report
        </Button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Revenue" value={`₹${report.totalRevenue.toLocaleString('en-IN')}`} />
        <MetricCard label="Total Tax" value={`₹${report.totalTax.toLocaleString('en-IN')}`} />
        <MetricCard label="Avg Tax Rate" value={`${report.taxRate.toFixed(1)}%`} />
        <MetricCard label="Avg Invoice" value={`₹${Math.round(report.averageInvoice).toLocaleString('en-IN')}`} />
      </div>

      {/* Status & GST Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 border-border">
          <h3 className="font-bold mb-4">Invoice Status</h3>
          {report.statusBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={report.statusBreakdown}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {report.statusBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </Card>

        <Card className="p-6 border-border">
          <h3 className="font-bold mb-4">GST Breakdown by Rate</h3>
          {report.gstBreakdown.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={report.gstBreakdown}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                <YAxis stroke="rgba(255,255,255,0.5)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1a1a1a',
                    border: '1px solid #333',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="value" fill="oklch(0.55 0.25 240)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex items-center justify-center text-muted-foreground">
              No data available
            </div>
          )}
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card className="p-6 border-border">
        <h3 className="font-bold mb-4">Monthly Revenue & Tax Trend</h3>
        {report.monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={report.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1a1a1a',
                  border: '1px solid #333',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Bar dataKey="revenue" fill="oklch(0.55 0.25 240)" name="Revenue" />
              <Bar dataKey="tax" fill="oklch(0.7 0.15 180)" name="Tax" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-80 flex items-center justify-center text-muted-foreground">
            No data available
          </div>
        )}
      </Card>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 border-border">
          <h3 className="text-sm text-muted-foreground mb-2">Invoice Statistics</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span>Total Invoices:</span>
              <span className="font-bold">{report.invoiceCount}</span>
            </div>
            <div className="flex justify-between text-green-400">
              <span>Paid:</span>
              <span className="font-bold">{report.paidCount}</span>
            </div>
            <div className="flex justify-between text-yellow-400">
              <span>Pending:</span>
              <span className="font-bold">{report.unpaidCount}</span>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border">
          <h3 className="text-sm text-muted-foreground mb-2">Revenue Summary</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">₹{(report.totalRevenue / 100000).toFixed(1)}L</p>
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">Average per Invoice</p>
              <p className="text-lg font-bold">₹{Math.round(report.averageInvoice).toLocaleString('en-IN')}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 border-border">
          <h3 className="text-sm text-muted-foreground mb-2">Tax Summary</h3>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground">Total Tax Collected</p>
              <p className="text-2xl font-bold">₹{(report.totalTax / 1000).toFixed(1)}K</p>
            </div>
            <div className="pt-2 border-t border-border">
              <p className="text-xs text-muted-foreground">Effective Tax Rate</p>
              <p className="text-lg font-bold">{report.taxRate.toFixed(2)}%</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-4 border-border">
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold">{value}</p>
    </Card>
  )
}
