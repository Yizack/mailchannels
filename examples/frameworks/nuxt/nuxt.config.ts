export default defineNuxtConfig({
  compatibilityDate: "2026-05-05",
  runtimeConfig: {
    mailchannels: {
      apiKey: "" // Automatically set from NUXT_MAILCHANNELS_API_KEY
    }
  }
});
