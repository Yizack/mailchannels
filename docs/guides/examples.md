<script setup lang="ts">
import sidebar from '../.vitepress/sidebar'

const guides = sidebar.find(item => item.text === 'Guides')?.items?.filter(item => item.text !== 'Examples') ?? []
</script>

# Examples

Explore our collection of sample projects on GitHub.

<template v-for="group in guides" :key="group.text">

## {{ group.text }}

<VPExamples
  :examples="group.items.map(item => ({
    title: item.text,
    path: item.link.replace('/guides', '/examples')
  }))"
/>

</template>
