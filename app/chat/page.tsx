import Chatbot from "@/components/Chatbot"

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-background text-foreground px-6 py-10">
      <div className="mx-auto w-full max-w-5xl">
        <section className="mb-10 rounded-3xl border border-border bg-card p-8 shadow-sm">
          <h1 className="text-3xl font-bold mb-3">Business Chatbot</h1>
          <p className="text-sm text-muted-foreground">
            Get instant answers for GST, invoices, inventory, business finance,
            tax, and MSME assistance.
          </p>
        </section>

        <Chatbot />
      </div>
    </main>
  )
}
