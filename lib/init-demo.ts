export function initDemoData() {
  // Initialize demo user if not exists
  const users = JSON.parse(localStorage.getItem('msme_users') || '[]')
  
  if (users.length === 0) {
    const demoUser = {
      id: 'demo-user-001',
      email: 'demo@example.com',
      password: 'password123',
      businessName: 'Tech Solutions Inc.',
      gstin: '01AABCE1234F1Z0',
      createdAt: new Date('2025-01-01'),
    }
    
    users.push(demoUser)
    localStorage.setItem('msme_users', JSON.stringify(users))
  }

  // Initialize sample invoices
  const invoices = JSON.parse(localStorage.getItem('msme_invoices') || '[]')
  if (invoices.length === 0) {
    const sampleInvoices = [
      {
        id: 'inv-001',
        userId: 'demo-user-001',
        invoiceNumber: '001',
        date: new Date('2025-01-15'),
        dueDate: new Date('2025-02-15'),
        clientName: 'ABC Corporation',
        clientEmail: 'abc@corporation.com',
        clientGSTIN: '27AABCT1234H1Z5',
        items: [
          {
            id: 'item-1',
            description: 'Web Development Services',
            quantity: 10,
            rate: 5000,
            gstRate: 18,
            amount: 50000,
            tax: 9000,
          },
          {
            id: 'item-2',
            description: 'UI/UX Design',
            quantity: 5,
            rate: 3000,
            gstRate: 18,
            amount: 15000,
            tax: 2700,
          },
        ],
        subtotal: 65000,
        totalGST: 11700,
        totalAmount: 76700,
        status: 'paid',
        notes: 'Payment received on time',
        createdAt: new Date('2025-01-15'),
      },
      {
        id: 'inv-002',
        userId: 'demo-user-001',
        invoiceNumber: '002',
        date: new Date('2025-01-20'),
        dueDate: new Date('2025-02-20'),
        clientName: 'XYZ Enterprises',
        clientEmail: 'xyz@enterprises.com',
        clientGSTIN: '09AABCU1234F1Z5',
        items: [
          {
            id: 'item-3',
            description: 'Mobile App Development',
            quantity: 20,
            rate: 4000,
            gstRate: 18,
            amount: 80000,
            tax: 14400,
          },
        ],
        subtotal: 80000,
        totalGST: 14400,
        totalAmount: 94400,
        status: 'sent',
        notes: 'Pending payment',
        createdAt: new Date('2025-01-20'),
      },
    ]
    
    localStorage.setItem('msme_invoices', JSON.stringify(sampleInvoices))
  }

  // Initialize sample GST calculations
  const calculations = JSON.parse(localStorage.getItem('msme_gst_calculations') || '[]')
  if (calculations.length === 0) {
    const sampleCalculations = [
      {
        id: 'calc-001',
        userId: 'demo-user-001',
        amount: 50000,
        gstRate: 18,
        isInclusive: false,
        baseAmount: 50000,
        cgst: 4500,
        sgst: 4500,
        igst: 0,
        totalGST: 9000,
        totalAmount: 59000,
        calculationType: 'exclusive',
        createdAt: new Date('2025-01-10'),
        notes: 'Client project billing',
      },
      {
        id: 'calc-002',
        userId: 'demo-user-001',
        amount: 35600,
        gstRate: 18,
        isInclusive: true,
        baseAmount: 30169.49,
        cgst: 1357.63,
        sgst: 1357.63,
        igst: 0,
        totalGST: 5430.51,
        totalAmount: 35600,
        calculationType: 'inclusive',
        createdAt: new Date('2025-01-12'),
        notes: 'Vendor payment calculation',
      },
      {
        id: 'calc-003',
        userId: 'demo-user-001',
        amount: 100000,
        gstRate: 12,
        isInclusive: false,
        baseAmount: 100000,
        cgst: 6000,
        sgst: 6000,
        igst: 0,
        totalGST: 12000,
        totalAmount: 112000,
        calculationType: 'exclusive',
        createdAt: new Date('2025-01-14'),
        notes: 'Monthly business expenses',
      },
    ]
    
    localStorage.setItem('msme_gst_calculations', JSON.stringify(sampleCalculations))
  }
}
