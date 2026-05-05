<script setup lang="ts">
const examples = [
  {
    name: "Send a predefined email using the API route",
    description: "This example demonstrates how to send an email using a predefined API route that interacts with the MailChannels SDK.",
    path: "/send"
  }
];
</script>

<template>
  <h1>Nuxt + MailChannels Examples</h1>

  <ul>
    <li v-for="example in examples" :key="example.path">
      <NuxtLink :to="example.path">
        <strong>{{ example.name }}</strong>
      </NuxtLink>
      <span>: {{ example.description }}</span>
    </li>
  </ul>
</template>
