<script setup lang="ts">
import { SITE } from "../../site";

defineProps<{
  examples: {
    title: string;
    description?: string;
    path: string;
  }[];
}>();
</script>

<template>
  <div class="examples-grid">
    <a
      v-for="(example, i) in examples"
      :key="i"
      :href="`${SITE.repo}/blob/main` + example.path"
      target="_blank"
      rel="noreferrer"
      class="VPExample link"
    >
      <article class="box">
        <span class="arrow-icon" style="--icon: url('https://api.iconify.design/lucide/arrow-up-right.svg');" />
        <div class="icon">
          <span class="vpi-social-github" style="--icon: url('https://api.iconify.design/simple-icons/github.svg');" />
        </div>
        <h4 class="title">{{ example.title }}</h4>
        <p class="details" v-if="example.description">{{ example.description }}</p>
      </article>
    </a>
  </div>
</template>

<style scoped>
.examples-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

@media (max-width: 480px) {
  .examples-grid {
    grid-template-columns: 1fr;
  }
}

.VPExample {
  display: block;
  border: 1px solid var(--vp-c-bg-soft);
  border-radius: 12px;
  height: 100%;
  background-color: var(--vp-c-bg-soft);
  transition: border-color 0.25s, background-color 0.25s;
  color: inherit;
  text-decoration: none;
}

.VPExample.link:hover {
  border-color: var(--vp-c-brand-1);
  color: inherit;
  text-decoration: none;
}

.box {
  display: flex;
  flex-direction: column;
  padding: 24px;
  height: 100%;
  position: relative;
}

.arrow-icon {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 18px;
  height: 18px;
  background-color: var(--vp-c-text-3);
  mask: var(--icon) no-repeat center / contain;
  -webkit-mask: var(--icon) no-repeat center / contain;
  transition: background-color 0.25s;
}

.VPExample.link:hover .arrow-icon {
  background-color: var(--vp-c-brand-1);
}

.title {
  margin-top: 16px;
}

.details {
  margin-top: 16px;
  margin-bottom: 0;
  flex-grow: 1;
  line-height: 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.icon {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 6px;
  background-color: var(--vp-c-default-soft);
  width: 48px;
  height: 48px;
  font-size: 24px;
  transition: background-color 0.25s;
}
</style>
