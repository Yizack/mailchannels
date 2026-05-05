<script setup lang="ts">
import type { EmailsSendResponse } from "mailchannels-sdk";

const loading = ref(false);
const result = ref<EmailsSendResponse["data"] | null>(null);

const handleSubmit = async () => {
  loading.value = true;
  result.value = await $fetch("/api/send", { method: "POST" });
  loading.value = false;
};
</script>

<template>
  <h1>MailChannels Nuxt Example</h1>

  <form @submit.prevent="handleSubmit">
    <button type="submit" :disabled="loading">
      {{ loading ? 'Sending...' : 'Send Email' }}
    </button>
  </form>

  <pre v-if="result">{{ JSON.stringify(result, null, 2) }}</pre>
</template>
