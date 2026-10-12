<script setup lang="ts">
import { assetUrl, useData } from '../composables/useData'

const { site } = useData()
</script>

<template>
  <div class="px-[var(--gutter)]" :style="{ paddingTop: 'calc(var(--header-h) + clamp(16px, 5vw, 72px))' }">
    <div v-if="site" class="mx-auto grid max-w-[1200px] items-start gap-10 md:grid-cols-[1.1fr_1fr] md:gap-20">
      <div>
        <h1 class="mb-8 font-display text-[clamp(2.1rem,5vw,3.6rem)] leading-none font-light tracking-[-0.02em]">{{ site.about.title }}</h1>
        <p
          v-for="(paragraph, i) in site.about.paragraphs"
          :key="i"
          class="mb-5 max-w-[34em] text-[clamp(1.05rem,1.35vw,1.2rem)] leading-[1.8] text-paper/90"
        >
          {{ paragraph }}
        </p>
      </div>
      <img
        :src="assetUrl(site.about.portrait)"
        :alt="site.about.portraitAlt"
        width="1400"
        height="1400"
        class="aspect-square w-full max-w-[560px] object-cover md:justify-self-end"
      />
    </div>
  </div>
</template>
