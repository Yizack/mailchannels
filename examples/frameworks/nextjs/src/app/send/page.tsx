"use client";

import type { EmailsSendResponse } from "mailchannels-sdk";
import { useState } from "react";

export default function Send () {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<EmailsSendResponse["data"]>();

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/send", { method: "POST" });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  };

  return (
    <main>
      <h1>Send a predefined email using the API route</h1>

      <form onSubmit={handleSubmit}>
        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send Email"}
        </button>
      </form>

      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </main>
  );
}
