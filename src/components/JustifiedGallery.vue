<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { Photo } from '../types'
import { justify, layoutFor } from '../composables/justify'
import GalleryTile from './GalleryTile.vue'

const props = defineProps<{ photos: readonly Photo[] }>()
const emit = defineEmits<{ open: [id: string] }>()

const el = ref<HTMLElement | null>(null)
const width = ref(0)
let observer: ResizeObserver | undefined

onMounted(() => {
  if (!el.value) return
  width.value = Math.floor(el.value.clientWidth)
  observer = new ResizeObserver((entries) => {
    width.value = Math.floor(entries[0].contentRect.width)
  })
  observer.observe(el.value)
})
onBeforeUnmount(() => observer?.disconnect())

const layout = computed(() => {
  const l = layoutFor(width.value)
  const ratios = props.photos.map((p) => (p.width ?? 1) / (p.height ?? 1))
  return { gap: l.gap, rows: justify(ratios, { width: width.value, ...l }) }
})
</script>

<template>
  <div ref="el" class="w-full">
    <div
      v-for="(row, r) in layout.rows"
      :key="r"
      class="flex"
      :class="row.full ? 'justify-between' : 'justify-start'"
      :style="{ gap: layout.gap + 'px', marginBottom: layout.gap + 'px' }"
    >
      <GalleryTile
        v-for="item in row.items"
        :key="photos[item.index].id"
        :photo="photos[item.index]"
        :width="item.width"
        :height="item.height"
        :priority="item.index < 4"
        @open="emit('open', $event)"
      />
    </div>
  </div>
</template>
