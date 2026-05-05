<script lang="ts">
let loading = $state(false);
let result = $state<{ data?: unknown, error?: unknown } | null>(null);

async function handleSubmit (event: SubmitEvent) {
  event.preventDefault();
  loading = true;
  result = null;

  const response = await fetch("/api/send", { method: "POST" });
  result = await response.json();
  loading = false;
}
</script>

<h1>MailChannels SvelteKit Example</h1>

<form onsubmit={handleSubmit}>
  <button type="submit" disabled={loading}>
    {loading ? 'Sending...' : 'Send Email'}
  </button>
</form>

{#if result}
  <pre>{JSON.stringify(result, null, 2)}</pre>
{/if}
