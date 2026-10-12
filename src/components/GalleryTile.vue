<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Photo } from '../types'
import { largeUrl, thumbUrl } from '../composables/useData'

defineProps<{
  photo: Photo
  width: number
  height: number
  /** Load immediately (first photos on screen) instead of lazily. */
  priority?: boolean
}>()
defineEmits<{ open: [id: string] }>()

const loaded = ref(false)
// If a photo has no thumbnail file, fall back to the large one.
const thumbMissing = ref(false)
const img = ref<HTMLImageElement | null>(null)

// A cached image can finish loading before our listener is attached.
onMounted(() => {
  if (img.value?.complete && img.value.naturalWidth > 0) loaded.value = true
})
</script>

<template>
  <button
    type="button"
    class="group relative block shrink-0 cursor-zoom-in overflow-hidden border-0 bg-[#1b1b1a] p-0"
    :style="{ width: width + 'px', height: height + 'px' }"
    :aria-label="`View photo: ${photo.title}`"
    @click="$emit('open', photo.id)"
  >
    <img
      ref="img"
      :src="thumbMissing ? largeUrl(photo) : thumbUrl(photo)"
      :alt="photo.alt || photo.title"
      :width="photo.width"
      :height="photo.height"
      :loading="priority ? 'eager' : 'lazy'"
      decoding="async"
      draggable="false"
      class="h-full w-full object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
      :class="loaded ? 'opacity-100' : 'opacity-0'"
      @load="loaded = true"
      @error="thumbMissing = true"
    />
  </button>
</template>
