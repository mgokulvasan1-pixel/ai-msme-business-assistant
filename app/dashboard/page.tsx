'use client'

import { useEffect, useState } from 'react'
import type { GSTCalculation, Invoice } from '@/lib/types'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card } from '@/components/ui/card'
import Chatbot from '@/components/Chatbot'
import { IndianRupee, TrendingUp, FileText, CalculatorIcon } from 'lucide-react'

interface DashboardMetrics {
  totalRevenue: number
  totalTax: number
  invoiceCount: number
  calculationCount: number
  revenueData: { name: string; value: number }[]
  taxData: { name: string; value: number }[]
}

export default function DashboardPage() {
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    totalRevenue: 0,
    totalTax: 0,
    invoiceCount: 0,
    calculationCount: 0,
    revenueData: [],
    taxData: [],
  })

  useEffect(() => {
    // Load data from localStorage
    const invoices: Invoice[] = JSON.parse(localStorage.getItem('msme_invoices') || '[]')
    const calculations: GSTCalculation[] = JSON.parse(
      localStorage.getItem('msme_gst_calculations') || '[]'
    )

    const totalRevenue = invoices.reduce((sum, inv) => sum + inv.totalAmount, 0)
    const totalTax = invoices.reduce((sum, inv) => sum + inv.totalGST, 0)

    // Generate chart data
    const revenueData = generateChartData(invoices, 'revenue')
    const taxData = generateChartData(calculations, 'tax')

    setMetrics({
      totalRevenue,
      totalTax,
      invoiceCount: invoices.length,
      calculationCount: calculations.length,
      revenueData,
      taxData,
    })
  }, [])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s your business overview.</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          label="Total Revenue"
          value={`₹${metrics.totalRevenue.toLocaleString('en-IN')}`}
          icon={<IndianRupee className="w-5 h-5" />}
          trend="+12.5%"
        />
        <MetricCard
          label="Total Tax Collected"
          value={`₹${metrics.totalTax.toLocaleString('en-IN')}`}
          icon={<TrendingUp className="w-5 h-5" />}
          trend="+8.2%"
        />
        <MetricCard
          label="Invoices Sent"
          value={metrics.invoiceCount.toString()}
          icon={<FileText className="w-5 h-5" />}
          trend={`${metrics.invoiceCount} total`}
        />
        <MetricCard
          label="GST Calculations"
          value={metrics.calculationCount.toString()}
          icon={<CalculatorIcon className="w-5 h-5" />}
          trend={`${metrics.calculationCount} total`}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Revenue Trend" height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={metrics.revenueData}>
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
              <Line
                type="monotone"
                dataKey="value"
                stroke="oklch(0.55 0.25 240)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Tax Breakdown" height={300}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={metrics.taxData}>
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
        </ChartCard>
      </div>

      {/* Summary Stats */}
      <Card className="p-6 border-border">
        <h3 className="text-lg font-bold mb-4">Quick Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Average Invoice Value</p>
            <p className="text-2xl font-bold">
              ₹{metrics.invoiceCount > 0 ? Math.round(metrics.totalRevenue / metrics.invoiceCount).toLocaleString('en-IN') : '0'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Average Tax per Invoice</p>
            <p className="text-2xl font-bold">
              ₹{metrics.invoiceCount > 0 ? Math.round(metrics.totalTax / metrics.invoiceCount).toLocaleString('en-IN') : '0'}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-2">Tax Rate</p>
            <p className="text-2xl font-bold">
              {metrics.totalRevenue > 0
                ? ((metrics.totalTax / metrics.totalRevenue) * 100).toFixed(1)
                : '0'}
              %
            </p>
          </div>
        </div>
      </Card>

      {/* Chatbot Section */}
      <section className="rounded-3xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-2xl font-bold mb-4">Ask BizFlow AI</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Use the chatbot to ask about invoices, GST, inventory, tax, and business finance.
        </p>
        <Chatbot />
      </section>
    </div>
  )
}

function MetricCard({
  label,
  value,
  icon,
  trend,
}: {
  label: string
  value: string
  icon: React.ReactNode
  trend: string
}) {
  return (
    <Card className="p-6 border-border">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground mb-2">{label}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          <p className="text-xs text-primary mt-2">{trend}</p>
        </div>
        <div className="text-primary opacity-60">{icon}</div>
      </div>
    </Card>
  )
}

function ChartCard({
  title,
  children,
  height,
}: {
  title: string
  children: React.ReactNode
  height: number
}) {
  return (
    <Card className="p-6 border-border">
      <h3 className="text-lg font-bold mb-4">{title}</h3>
      <div style={{ height }}>{children}</div>
    </Card>
  )
}

function generateChartData(
  items: any[],
  type: 'revenue' | 'tax'
): { name: string; value: number }[] {
  if (items.length === 0) {
    return [
      { name: 'Jan', value: 0 },
      { name: 'Feb', value: 0 },
      { name: 'Mar', value: 0 },
    ]
  }

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  return months.map((month, index) => ({
    name: month,
    value: Math.max(
      0,
      Math.floor(
        (items.length * (index + 1) * (type === 'revenue' ? 50000 : 5000)) /
          months.length
      )
    ),
  }))
}
