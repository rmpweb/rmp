<script setup lang="ts">
import { computed } from 'vue'
import { useData } from '../composables/useData'

const { site } = useData()
const social = computed(() => (site.value?.social ?? []).filter((s) => s.url))
</script>

<template>
  <div class="px-[var(--gutter)]" :style="{ paddingTop: 'calc(var(--header-h) + clamp(16px, 5vw, 72px))' }">
    <div v-if="site" class="mx-auto max-w-[1200px]">
      <h1 class="mb-8 font-display text-[clamp(2.1rem,5vw,3.6rem)] leading-none font-light tracking-[-0.02em]">{{ site.contact.title }}</h1>
      <p v-if="site.contact.intro" class="mb-6 max-w-[34em] text-[clamp(1.05rem,1.35vw,1.2rem)] leading-[1.8] text-paper/90">
        {{ site.contact.intro }}
      </p>
      <a
        :href="`mailto:${site.contact.email}`"
        class="break-all font-display text-[clamp(1.35rem,3.4vw,2.4rem)] font-light tracking-[-0.01em] underline decoration-1 underline-offset-[8px]"
      >
        {{ site.contact.email }}
      </a>
      <ul v-if="social.length" class="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-muted">
        <li v-for="s in social" :key="s.url">
          <a :href="s.url" target="_blank" rel="noopener noreferrer" class="hover:text-paper">{{ s.label }}</a>
        </li>
      </ul>
    </div>
  </div>
</template>
