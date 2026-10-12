<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Photo } from '../types'
import { largeUrl, thumbUrl } from '../composables/useData'

const props = defineProps<{ photos: readonly Photo[]; index: number }>()
const emit = defineEmits<{ close: []; go: [index: number] }>()

const root = ref<HTMLElement | null>(null)
const photo = computed(() => props.photos[props.index])
const count = computed(() => props.photos.length)

/** Which way we last moved, so the new photo can slide in from that side. */
const direction = ref<'next' | 'prev' | 'none'>('none')
const largeLoaded = ref(false)

function navigate(delta: number) {
  if (count.value < 2) return
  direction.value = delta > 0 ? 'next' : 'prev'
  emit('go', (props.index + delta + count.value) % count.value)
}

function goTo(index: number) {
  direction.value = index > props.index ? 'next' : 'prev'
  emit('go', index)
}

// Show the (already cached) thumbnail instantly, then fade the big file in over it.
watch(
  () => props.index,
  () => {
    largeLoaded.value = false
  },
)

function markLoaded(el: unknown) {
  const img = el as HTMLImageElement | null
  if (img && img.complete && img.naturalWidth > 0) largeLoaded.value = true
}

// Preload the neighbours so arrow presses feel instant.
watch(
  () => props.index,
  (i) => {
    for (const d of [1, -1]) {
      const p = props.photos[(i + d + count.value) % count.value]
      if (p) new Image().src = largeUrl(p)
    }
  },
  { immediate: true },
)

/* ---------- keyboard ---------- */
function onKey(e: KeyboardEvent) {
  switch (e.key) {
    case 'Escape':
      e.preventDefault()
      emit('close')
      break
    case 'ArrowRight':
      e.preventDefault()
      navigate(1)
      break
    case 'ArrowLeft':
      e.preventDefault()
      navigate(-1)
      break
    case 'Home':
      e.preventDefault()
      goTo(0)
      break
    case 'End':
      e.preventDefault()
      goTo(count.value - 1)
      break
    case 'Tab': {
      // keep keyboard focus inside the dialog
      const focusables = root.value?.querySelectorAll<HTMLElement>('button:not([disabled])')
      if (!focusables || focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement
      if (e.shiftKey && (active === first || active === root.value)) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault()
        first.focus()
      }
      break
    }
  }
}

/* ---------- swipe / drag ---------- */
const dragX = ref(0)
const isDragging = ref(false)
let pointerId: number | null = null
let startX = 0
let startY = 0
let justDragged = false

function onPointerDown(e: PointerEvent) {
  if (e.pointerType === 'mouse' && e.button !== 0) return
  if (pointerId !== null) return // ignore a second finger (pinch)
  pointerId = e.pointerId
  startX = e.clientX
  startY = e.clientY
}

function onPointerMove(e: PointerEvent) {
  if (e.pointerId !== pointerId) return
  const dx = e.clientX - startX
  const dy = e.clientY - startY
  if (!isDragging.value) {
    // start dragging only for a clearly horizontal gesture
    if (Math.abs(dx) > 10 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      isDragging.value = true
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    } else {
      return
    }
  }
  dragX.value = dx
}

function endDrag(e: PointerEvent, cancelled: boolean) {
  if (e.pointerId !== pointerId) return
  const dx = e.clientX - startX
  const wasDragging = isDragging.value
  pointerId = null
  isDragging.value = false
  dragX.value = 0
  if (wasDragging) {
    // the click that follows a drag must not close the lightbox
    justDragged = true
    setTimeout(() => (justDragged = false), 0)
    if (!cancelled && Math.abs(dx) > 60) navigate(dx < 0 ? 1 : -1)
  }
}

function onBackdropClick() {
  if (!justDragged) emit('close')
}

/* ---------- lifecycle: focus + scroll lock ---------- */
let previouslyFocused: HTMLElement | null = null

onMounted(() => {
  previouslyFocused = document.activeElement as HTMLElement | null
  document.documentElement.style.overflow = 'hidden'
  window.addEventListener('keydown', onKey)
  root.value?.focus()
})

onBeforeUnmount(() => {
  document.documentElement.style.overflow = ''
  window.removeEventListener('keydown', onKey)
  previouslyFocused?.focus?.({ preventScroll: true })
})
</script>

<template>
  <div
    ref="root"
    role="dialog"
    aria-modal="true"
    :aria-label="photo.title ? `Photo: ${photo.title}` : 'Photo viewer'"
    tabindex="-1"
    class="fixed inset-0 z-50 overscroll-contain bg-ink-deep text-paper outline-none"
  >
    <!-- top bar -->
    <div class="pointer-events-none absolute inset-x-0 top-0 z-10 flex h-16 items-center justify-between px-4 md:px-8">
    <!-- <div
      class="pointer-events-none absolute inset-x-0 top-0 z-10 flex items-center justify-between px-[var(--lb-gutter)]"
      :style="{ height: 'var(--header-h)' }"
    > -->
      <span class="text-[0.95rem] tabular-nums text-muted" aria-live="polite">{{ index + 1 }} / {{ count }}</span>
      <button type="button" class="lb-btn pointer-events-auto" aria-label="Close photo viewer" @click="emit('close')">
        <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path d="M5 5l14 14M19 5L5 19" stroke-linecap="round" />
        </svg>
      </button>
    </div>

    <!-- stage: clicking the empty margin closes; dragging swipes -->
    <div
      class="stage absolute inset-0"
      @click.self="onBackdropClick"
      @pointerdown="onPointerDown"
      @pointermove="onPointerMove"
      @pointerup="endDrag($event, false)"
      @pointercancel="endDrag($event, true)"
    >
      <div
        class="relative h-full w-full"
        :style="{
          transform: `translateX(${dragX}px)`,
          transition: isDragging ? 'none' : 'transform 0.25s ease',
        }"
      >
        <figure :key="photo.id" class="lb-in absolute inset-0 m-0" :class="`from-${direction}`">
          <img
            :src="thumbUrl(photo)"
            alt=""
            aria-hidden="true"
            draggable="false"
            class="pointer-events-none absolute inset-0 h-full w-full select-none object-contain"
          />
          <img
            :ref="markLoaded"
            :src="largeUrl(photo)"
            :alt="photo.alt || photo.title"
            draggable="false"
            class="pointer-events-none absolute inset-0 h-full w-full select-none object-contain transition-opacity duration-300"
            :class="largeLoaded ? 'opacity-100' : 'opacity-0'"
            @load="largeLoaded = true"
          />
        </figure>
      </div>
    </div>

    <!-- arrows -->
    <template v-if="count > 1">
      <button type="button" class="lb-btn lb-arrow left-2 md:left-6" aria-label="Previous photo" @click="navigate(-1)">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path d="M15 4l-8 8 8 8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
      <button type="button" class="lb-btn lb-arrow right-2 md:right-6" aria-label="Next photo" @click="navigate(1)">
        <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path d="M9 4l8 8-8 8" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </template>

    <!-- caption -->
    <!-- <p
      v-if="photo.title"
      class="pointer-events-none absolute inset-x-0 bottom-0 flex h-[64px] items-center justify-center px-16 text-center text-[0.95rem] font-light tracking-[0.04em] text-muted md:h-[72px] md:text-[1.05rem]"
    >
      {{ photo.title }}
    </p> -->
  </div>
</template>

<style scoped>/* room for the top bar and caption; arrows get side room on larger screens */
.stage {
  padding: 64px 0 64px;
  touch-action: pan-y pinch-zoom;
  cursor: grab;
}
@media (min-width: 768px) {
  .stage {
    padding: 64px 96px 64px;
  }
}
/* .stage {
  padding: var(--header-h) 0 64px;
  touch-action: pan-y pinch-zoom;
  cursor: grab;
}
@media (min-width: 768px) {
  .stage {
    padding: var(--header-h) 96px 72px;
  }
} */

.lb-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border: 0;
  border-radius: 9999px;
  background: transparent;
  color: var(--color-paper);
  opacity: 0.75;
  cursor: pointer;
  transition:
    opacity 0.2s,
    background-color 0.2s;
}
.lb-btn:hover {
  opacity: 1;
  background: rgb(255 255 255 / 0.08);
}
.lb-arrow {
  position: absolute;
  top: 50%;
  z-index: 10;
  transform: translateY(-50%);
  background: rgb(0 0 0 / 0.35); /* readable over a photo on phones */
}

.lb-in {
  animation: lbFade 0.28s ease both;
}
.lb-in.from-next {
  animation-name: lbNext;
}
.lb-in.from-prev {
  animation-name: lbPrev;
}
@keyframes lbFade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes lbNext {
  from {
    opacity: 0;
    transform: translateX(28px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
@keyframes lbPrev {
  from {
    opacity: 0;
    transform: translateX(-28px);
  }
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
