'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts'
import { TrendingUp, AlertCircle, CheckCircle, Clock } from 'lucide-react'

interface HealthMetric {
  label: string
  value: string | number
  status: 'good' | 'warning' | 'critical'
  icon: React.ReactNode
}

const monthlyTrend = [
  { month: 'Jan', revenue: 45000, expenses: 32000, profit: 13000 },
  { month: 'Feb', revenue: 52000, expenses: 35000, profit: 17000 },
  { month: 'Mar', revenue: 48000, expenses: 33000, profit: 15000 },
  { month: 'Apr', revenue: 61000, expenses: 38000, profit: 23000 },
  { month: 'May', revenue: 55000, expenses: 36000, profit: 19000 },
  { month: 'Jun', revenue: 67000, expenses: 40000, profit: 27000 },
]

const expenseBreakdown = [
  { name: 'Salaries', value: 45 },
  { name: 'Materials', value: 25 },
  { name: 'Operations', value: 20 },
  { name: 'Other', value: 10 },
]

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

export default function BusinessHealthPage() {
  const [metrics, setMetrics] = useState<HealthMetric[]>([])

  useEffect(() => {
    const invoices = JSON.parse(localStorage.getItem('msme_invoices') || '[]')
    const totalRevenue = invoices.reduce((sum: number, inv: any) => sum + inv.totalAmount, 0)
    const paidInvoices = invoices.filter((inv: any) => inv.status === 'paid').length
    const invoiceCount = invoices.length

    const newMetrics: HealthMetric[] = [
      {
        label: 'Revenue Growth',
        value: '+12.5%',
        status: 'good',
        icon: <TrendingUp className="w-5 h-5 text-green-500" />,
      },
      {
        label: 'Invoice Collection',
        value: `${paidInvoices}/${invoiceCount}`,
        status: paidInvoices === invoiceCount ? 'good' : 'warning',
        icon: <CheckCircle className="w-5 h-5 text-blue-500" />,
      },
      {
        label: 'Cash Position',
        value: '₹' + (totalRevenue * 0.6).toLocaleString('en-IN'),
        status: 'good',
        icon: <TrendingUp className="w-5 h-5 text-green-500" />,
      },
      {
        label: 'Pending Invoices',
        value: invoiceCount - paidInvoices,
        status: invoiceCount - paidInvoices > 2 ? 'warning' : 'good',
        icon: <Clock className="w-5 h-5 text-yellow-500" />,
      },
    ]

    setMetrics(newMetrics)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'border-green-500/30 bg-green-500/10'
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10'
      case 'critical':
        return 'border-red-500/30 bg-red-500/10'
      default:
        return 'border-border'
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Business Health</h1>
        <p className="text-muted-foreground mt-1">Monitor your business performance and key metrics</p>
      </div>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card key={index} className={`p-6 border-2 ${getStatusColor(metric.status)} animate-slide-up`} style={{ animationDelay: `${index * 0.1}s` }}>
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p className="text-2xl font-bold mt-2">{metric.value}</p>
              </div>
              {metric.icon}
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card className="p-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-lg font-bold mb-4">Revenue vs Expenses Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis stroke="rgba(255,255,255,0.5)" />
              <YAxis stroke="rgba(255,255,255,0.5)" />
              <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Expense Breakdown */}
        <Card className="p-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-lg font-bold mb-4">Expense Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {expenseBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Profit Trend */}
      <Card className="p-6 animate-slide-up" style={{ animationDelay: '0.6s' }}>
        <h2 className="text-lg font-bold mb-4">Monthly Profit Analysis</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis stroke="rgba(255,255,255,0.5)" />
            <YAxis stroke="rgba(255,255,255,0.5)" />
            <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none' }} />
            <Legend />
            <Bar dataKey="profit" fill="#10b981" name="Profit" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Health Recommendations */}
      <Card className="p-6 border-2 border-blue-500/30 bg-blue-500/10 animate-slide-up" style={{ animationDelay: '0.7s' }}>
        <div className="flex gap-4">
          <AlertCircle className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
          <div>
            <h3 className="font-bold mb-2">Business Recommendations</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>• Keep up with the revenue growth trend - aim for 15% YoY growth</li>
              <li>• Review expense categories and identify cost optimization opportunities</li>
              <li>• Focus on reducing accounts receivable - follow up on pending invoices</li>
              <li>• Maintain cash reserves at 2-3 months of operating expenses</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
