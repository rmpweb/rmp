<script setup lang="ts">
import { useData } from '../composables/useData'

const { site } = useData()
const year = new Date().getFullYear()
</script>

<template>
  <footer class="px-[var(--gutter)] pb-10 pt-24 text-[0.85rem] tracking-[0.03em] text-muted">
    <span v-if="site">© {{ year }} {{ site.footer }}</span>
  </footer>
</template>
