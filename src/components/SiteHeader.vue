<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watchEffect } from 'vue'
import { assetUrl, useData } from '../composables/useData'
import type { NavItem } from '../types'

const { site } = useData()

// Shown immediately, before site.json has arrived.
const fallbackNav: NavItem[] = [
  { label: 'Gallery', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]
const nav = computed(() => site.value?.nav ?? fallbackNav)
const name = computed(() => site.value?.name ?? 'Richard Muscat')
const logo = computed(() => (site.value?.logo ? assetUrl(site.value.logo) : null))
const social = computed(() => (site.value?.social ?? []).filter((s) => s.url))
const centered = computed(() => site.value?.headerLayout === 'center')

// The page padding is driven by --header-h, which differs between the two layouts (see style.css).
watchEffect(() => {
  document.documentElement.dataset.header = centered.value ? 'center' : 'left'
})

/**
 * "Scroll-back" header: transparent at the top, hides while scrolling down,
 * comes back as soon as you scroll up.
 */
const hidden = ref(false)
const solid = ref(false)
let lastY = 0

function onScroll() {
  const y = window.scrollY
  solid.value = y > 40
  if (Math.abs(y - lastY) < 8) return
  hidden.value = y > lastY && y > 120
  lastY = y
}

onMounted(() => {
  lastY = window.scrollY
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-40 transition-[transform,background-color,backdrop-filter] duration-300"
    :class="[hidden ? '-translate-y-full' : 'translate-y-0', solid ? 'bg-ink/85 backdrop-blur-md' : 'bg-transparent']"
    :style="{ height: 'var(--header-h)' }"
  >
    <div
      class="flex h-full px-[var(--gutter)] pt-6 md:pt-9"
      :class="centered ? 'flex-col items-center justify-center gap-3 md:gap-4' : 'items-center justify-between gap-4'"
    >
      <RouterLink to="/" class="shrink-0 no-underline">
        <!-- Logo image if site.json has one, otherwise the name as text. -->
        <img
          v-if="logo"
          :src="logo"
          :alt="name"
          width="193"
          height="46"
          class="block h-[clamp(30px,4.6vw,100px)] w-auto"
        />
        <span v-else class="text-[clamp(1.1rem,2vw,1.6rem)] font-light tracking-[0.04em] whitespace-nowrap">{{ name }}</span>
      </RouterLink>

      <nav
        aria-label="Main"
        class="flex items-center gap-[clamp(14px,2.4vw,36px)] text-[clamp(0.68rem,0.95vw,0.82rem)] font-normal tracking-[0.16em] uppercase"
      >
        <RouterLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          exact-active-class="nav-active"
          class="py-1 no-underline decoration-1 underline-offset-[8px] hover:underline"
        >
          {{ item.label }}
        </RouterLink>
        <a
          v-for="s in social"
          :key="s.url"
          :href="s.url"
          target="_blank"
          rel="noopener noreferrer"
          class="hidden py-1 text-muted no-underline hover:text-paper sm:inline"
        >
          {{ s.label }}
        </a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.nav-active {
  text-decoration: underline;
}
</style>
