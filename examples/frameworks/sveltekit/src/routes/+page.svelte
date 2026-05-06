<script lang="ts">
const examples = [
  {
    name: "Send a predefined email using the API route",
    description: "This example demonstrates how to send an email using a predefined API route that interacts with the MailChannels SDK.",
    path: "/send"
  }
];
</script>

<h1>SvelteKit + MailChannels Examples</h1>

<ul>
  {#each examples as example}
    <li>
      <a href={example.path}>
        <strong>{example.name}</strong>
      </a>
      <span>: {example.description}</span>
    </li>
  {/each}
</ul>
