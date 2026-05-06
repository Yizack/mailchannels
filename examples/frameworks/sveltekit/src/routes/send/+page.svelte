<script lang="ts">
import type { EmailsSendResponse } from "mailchannels-sdk";

let loading = $state(false);
let result = $state<EmailsSendResponse["data"]>();

async function handleSubmit (event: SubmitEvent) {
  event.preventDefault();
  loading = true;
  const res = await fetch("/api/send", { method: "POST" });
  result = await res.json();
  loading = false;
}
</script>

<h1>Send a predefined email using the API route</h1>

<form onsubmit={handleSubmit}>
  <button type="submit" disabled={loading}>
    {loading ? "Sending..." : "Send Email"}
  </button>
</form>

{#if result}
  <pre>{JSON.stringify(result, null, 2)}</pre>
{/if}
