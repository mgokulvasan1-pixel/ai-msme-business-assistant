"use client";

import { useState } from "react";

export default function Chatbot() {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function sendMessage() {
    if (!message.trim()) {
      setError("Please enter a message before sending.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.reply || "Unable to send your message. Please try again.");
        return;
      }

      setReply(data.reply);
      setMessage("");
    } catch (err) {
      console.error(err);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 border border-border rounded-3xl bg-card shadow-sm">
      <h2 className="text-2xl font-bold mb-4">BizFlow AI Assistant</h2>
      <p className="text-sm text-muted-foreground mb-6">
        Ask about GST, invoices, inventory, tax, finance, and MSME schemes.
      </p>

      <div className="grid gap-3">
        <textarea
          rows={4}
          className="resize-none rounded-lg border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          placeholder="Type your question here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isLoading}
        />

        <button
          type="button"
          onClick={sendMessage}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={isLoading}
        >
          {isLoading ? "Sending..." : "Send"}
        </button>

        {error ? (
          <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        ) : null}

        {reply ? (
          <div className="rounded-3xl border border-border bg-muted p-4 text-sm leading-6">
            <p className="font-semibold mb-2">Response</p>
            <p>{reply}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
