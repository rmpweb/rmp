<script setup lang="ts">
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useData } from '../composables/useData'
import JustifiedGallery from '../components/JustifiedGallery.vue'
import Lightbox from '../components/Lightbox.vue'

const { photos, site, status } = useData()
const route = useRoute()
const router = useRouter()

/**
 * The open photo lives in the URL (/?photo=<id>), so the browser Back button
 * closes the lightbox and a photo link can be shared.
 */
const currentIndex = computed(() =>
  typeof route.query.photo === 'string' ? photos.value.findIndex((p) => p.id === route.query.photo) : -1,
)

let openedHere = false

function open(id: string) {
  openedHere = true
  router.push({ path: '/', query: { photo: id } })
}

function go(index: number) {
  // replace, not push: stepping through photos should not fill the Back history
  router.replace({ path: '/', query: { photo: photos.value[index].id } })
}

function close() {
  if (openedHere) {
    openedHere = false
    router.back()
  } else {
    router.replace({ path: '/' })
  }
}

watch(currentIndex, (i) => {
  if (i < 0) openedHere = false
})
</script>

<template>
  <div class="px-[var(--gutter)]" :style="{ paddingTop: 'calc(var(--header-h) + clamp(8px, 3vw, 40px))' }">
    <p v-if="status === 'error'" class="text-muted">The photos could not be loaded. Please try again later.</p>

    <JustifiedGallery v-if="photos.length" :photos="photos" @open="open" />

    <!-- <section v-if="site?.statement" class="mt-[clamp(48px,9vw,130px)]">
      <h2 class="max-w-[24em] font-display text-[clamp(1.4rem,2.6vw,2.2rem)] leading-[1.4] font-light tracking-[-0.01em]">
        {{ site.statement }}
        <RouterLink to="/contact" class="underline decoration-1 underline-offset-[7px]">{{ site.statementLink }}</RouterLink>
      </h2>
    </section> -->

    <Transition name="lb">
      <Lightbox v-if="currentIndex >= 0" :photos="photos" :index="currentIndex" @close="close" @go="go" />
    </Transition>
  </div>
</template>
