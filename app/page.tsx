'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, CalculatorIcon, FileText, BarChart3, Zap } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            <span className="text-xl font-bold">MSME Assistant</span>
          </div>
          <div className="flex gap-4">
            <Link href="/chat">
              <Button variant="ghost">Chatbot</Button>
            </Link>
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-5xl font-bold mb-6 text-balance">
            Smart Business Management for MSMEs
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            Manage GST calculations, generate invoices, track finances, and grow your business with AI-powered insights.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          <FeatureCard
            icon={<CalculatorIcon className="w-8 h-8" />}
            title="GST Calculator"
            description="Calculate exclusive/inclusive GST with CGST, SGST, and IGST support"
          />
          <FeatureCard
            icon={<FileText className="w-8 h-8" />}
            title="Invoice Generator"
            description="Create professional invoices with automatic tax calculations"
          />
          <FeatureCard
            icon={<BarChart3 className="w-8 h-8" />}
            title="Business Analytics"
            description="Track revenue, expenses, and business health metrics"
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="AI Insights"
            description="Get intelligent recommendations for business growth"
          />
        </div>

        {/* Benefits Section */}
        <div className="mt-32 bg-card rounded-lg p-12 border border-border">
          <h2 className="text-3xl font-bold mb-12 text-center">Why Choose MSME Assistant?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <BenefitItem
              number="1"
              title="Easy to Use"
              description="Intuitive interface designed specifically for small business owners"
            />
            <BenefitItem
              number="2"
              title="Saves Time"
              description="Automate complex GST calculations and invoice generation"
            />
            <BenefitItem
              number="3"
              title="Always Available"
              description="Access your business data anytime, anywhere"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/10 border-t border-b border-border py-16 mt-20">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your business?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join hundreds of MSMEs already using our platform
          </p>
          <Link href="/register">
            <Button size="lg" className="gap-2">
              Start Free Today <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-6">
        <div className="max-w-6xl mx-auto text-center text-sm text-muted-foreground">
          <p>&copy; 2025 MSME Assistant. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="bg-card rounded-lg p-6 border border-border hover:border-primary/50 transition-colors">
      <div className="text-primary mb-4">{icon}</div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}

function BenefitItem({
  number,
  title,
  description,
}: {
  number: string
  title: string
  description: string
}) {
  return (
    <div>
      <div className="text-4xl font-bold text-primary mb-4">{number}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}
