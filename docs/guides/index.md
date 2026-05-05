<script setup lang="ts">
import sidebar from '../.vitepress/sidebar'

const guides = sidebar.find(item => item.text === 'Guides')?.items ?? []
</script>

# Guides

Learn how to integrate the MailChannels Node.js SDK into your preferred framework or serverless platform.

<template v-for="group in guides" :key="group.text">

## {{ group.text }}

<ul>
  <li v-for="item in group.items" :key="item.link">
    <a :href="item.link">{{ item.text }}</a>
  </li>
</ul>

</template>
