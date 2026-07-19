'use client'

import { useEffect, useState } from 'react'
import type { GSTCalculation } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Trash2, Download, Search } from 'lucide-react'

const GST_RATES = [0, 5, 12, 18, 28]

export default function CalculatorPage() {
  const [amount, setAmount] = useState<string>('')
  const [gstRate, setGstRate] = useState<number>(18)
  const [isInclusive, setIsInclusive] = useState<boolean>(false)
  const [notes, setNotes] = useState<string>('')
  const [result, setResult] = useState<GSTCalculation | null>(null)
  const [history, setHistory] = useState<GSTCalculation[]>([])
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [filterRate, setFilterRate] = useState<number | null>(null)

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('msme_gst_calculations')
    if (saved) {
      setHistory(JSON.parse(saved))
    }
  }, [])

  const calculateGST = () => {
    if (!amount || isNaN(parseFloat(amount))) {
      return
    }

    const numAmount = parseFloat(amount)
    let baseAmount, totalGST, cgst, sgst, igst, totalAmount

    if (isInclusive) {
      // Amount includes GST
      baseAmount = numAmount / (1 + gstRate / 100)
      totalGST = numAmount - baseAmount
    } else {
      // Amount is exclusive of GST
      baseAmount = numAmount
      totalGST = (numAmount * gstRate) / 100
      totalAmount = numAmount + totalGST
    }

    if (!isInclusive) {
      totalAmount = baseAmount + totalGST
    } else {
      totalAmount = numAmount
    }

    // Calculate CGST, SGST, IGST based on rate
    if (gstRate === 0) {
      cgst = 0
      sgst = 0
      igst = 0
    } else if (gstRate === 5) {
      cgst = totalGST / 2
      sgst = totalGST / 2
      igst = 0
    } else if (gstRate === 12) {
      cgst = totalGST / 2
      sgst = totalGST / 2
      igst = 0
    } else if (gstRate === 18) {
      cgst = totalGST / 2
      sgst = totalGST / 2
      igst = 0
    } else {
      // 28% GST - IGST
      cgst = 0
      sgst = 0
      igst = totalGST
    }

    const calculation: GSTCalculation = {
      id: Math.random().toString(36).substr(2, 9),
      userId: 'current-user',
      amount: numAmount,
      gstRate,
      isInclusive,
      baseAmount,
      cgst,
      sgst,
      igst,
      totalGST,
      totalAmount,
      calculationType: isInclusive ? 'inclusive' : 'exclusive',
      createdAt: new Date(),
      notes,
    }

    setResult(calculation)

    // Save to history
    const newHistory = [calculation, ...history]
    setHistory(newHistory)
    localStorage.setItem('msme_gst_calculations', JSON.stringify(newHistory))
  }

  const deleteFromHistory = (id: string) => {
    const updated = history.filter((item) => item.id !== id)
    setHistory(updated)
    localStorage.setItem('msme_gst_calculations', JSON.stringify(updated))
  }

  const exportCSV = () => {
    const filtered = filterHistory()
    const csv =
      'Amount,GST Rate,Type,Base Amount,CGST,SGST,IGST,Total GST,Total Amount,Notes,Date\n' +
      filtered
        .map(
          (item) =>
            `${item.amount},${item.gstRate}%,${item.calculationType},${item.baseAmount.toFixed(2)},${item.cgst.toFixed(2)},${item.sgst.toFixed(2)},${item.igst.toFixed(2)},${item.totalGST.toFixed(2)},${item.totalAmount.toFixed(2)},${item.notes},${new Date(item.createdAt).toLocaleDateString()}`
        )
        .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `gst-history-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const filterHistory = () => {
    return history.filter((item) => {
      const matchSearch =
        item.notes.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.amount.toString().includes(searchTerm)
      const matchRate = filterRate === null || item.gstRate === filterRate
      return matchSearch && matchRate
    })
  }

  const filtered = filterHistory()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">GST Calculator</h1>
        <p className="text-muted-foreground">
          Calculate GST with support for exclusive/inclusive modes
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Calculator */}
        <div className="lg:col-span-1">
          <Card className="p-6 border-border sticky top-6">
            <h2 className="text-xl font-bold mb-6">Calculator</h2>

            <div className="space-y-4">
              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium mb-2">Amount (₹)</label>
                <Input
                  type="number"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  step="0.01"
                />
              </div>

              {/* GST Rate */}
              <div>
                <label className="block text-sm font-medium mb-2">GST Rate</label>
                <div className="grid grid-cols-3 gap-2">
                  {GST_RATES.map((rate) => (
                    <button
                      key={rate}
                      onClick={() => setGstRate(rate)}
                      className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        gstRate === rate
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-foreground hover:bg-secondary/80'
                      }`}
                    >
                      {rate}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculation Type */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Calculation Type</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsInclusive(false)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      !isInclusive
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    Exclusive
                  </button>
                  <button
                    onClick={() => setIsInclusive(true)}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      isInclusive
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-secondary text-foreground hover:bg-secondary/80'
                    }`}
                  >
                    Inclusive
                  </button>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium mb-2">Notes (optional)</label>
                <Input
                  type="text"
                  placeholder="Add notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Calculate Button */}
              <Button onClick={calculateGST} className="w-full" size="lg">
                Calculate
              </Button>
            </div>

            {/* Result */}
            {result && (
              <div className="mt-6 p-4 bg-secondary/30 rounded-lg space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base Amount:</span>
                  <span className="font-medium">₹{result.baseAmount.toFixed(2)}</span>
                </div>
                {result.cgst > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">CGST ({result.gstRate / 2}%):</span>
                    <span className="font-medium">₹{result.cgst.toFixed(2)}</span>
                  </div>
                )}
                {result.sgst > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">SGST ({result.gstRate / 2}%):</span>
                    <span className="font-medium">₹{result.sgst.toFixed(2)}</span>
                  </div>
                )}
                {result.igst > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">IGST ({result.gstRate}%):</span>
                    <span className="font-medium">₹{result.igst.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-border pt-3 flex justify-between">
                  <span className="font-medium">Total GST:</span>
                  <span className="font-bold text-primary">₹{result.totalGST.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total Amount:</span>
                  <span className="text-primary">₹{result.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* History */}
        <div className="lg:col-span-2 space-y-4">
          <div>
            <div className="flex gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by amount or notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <select
                value={filterRate ?? ''}
                onChange={(e) => setFilterRate(e.target.value ? parseInt(e.target.value) : null)}
                className="px-3 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground"
              >
                <option value="">All Rates</option>
                {GST_RATES.map((rate) => (
                  <option key={rate} value={rate}>
                    {rate}% GST
                  </option>
                ))}
              </select>
              {filtered.length > 0 && (
                <Button variant="outline" size="sm" onClick={exportCSV} className="gap-2">
                  <Download className="w-4 h-4" />
                  Export
                </Button>
              )}
            </div>

            {filtered.length === 0 ? (
              <Card className="p-12 border-border text-center">
                <p className="text-muted-foreground">No calculations yet</p>
              </Card>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filtered.map((item) => (
                  <Card key={item.id} className="p-4 border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-bold text-lg">₹{item.totalAmount.toFixed(2)}</span>
                          <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">
                            {item.calculationType} • {item.gstRate}%
                          </span>
                        </div>
                        {item.notes && (
                          <p className="text-sm text-muted-foreground truncate">{item.notes}</p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          {new Date(item.createdAt).toLocaleString('en-IN')}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <div className="text-right text-sm">
                          <div className="text-muted-foreground">Tax: ₹{item.totalGST.toFixed(2)}</div>
                          <div className="text-xs text-muted-foreground">
                            Base: ₹{item.baseAmount.toFixed(2)}
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteFromHistory(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
