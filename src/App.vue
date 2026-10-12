<script setup lang="ts">
import SiteHeader from './components/SiteHeader.vue'
import SiteFooter from './components/SiteFooter.vue'
</script>

<template>
  <div class="flex min-h-svh flex-col">
    <a
      href="#main"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-paper focus:px-3 focus:py-2 focus:text-ink"
    >
      Skip to content
    </a>
    <SiteHeader />
    <main id="main" class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <SiteFooter />
  </div>
</template>
