import { ref, readonly } from 'vue'
import type { Photo, SiteData } from '../types'

/**
 * Loads public/data/photos.json and public/data/site.json at runtime.
 * Because they are plain files (not bundled), you can edit them and upload
 * them without rebuilding the site.
 */

const base = import.meta.env.BASE_URL

/** Turn "photos/x.jpg" into a URL that respects Vite's base path. */
export const assetUrl = (path: string) => base + path.replace(/^\/+/, '')
// export const thumbUrl = (p: Photo) => assetUrl(`photos/thumb/${encodeURI(p.file)}`)
// export const largeUrl = (p: Photo) => assetUrl(`photos/large/${encodeURI(p.file)}`)
export const largeUrl = (p: Photo) => assetUrl(`photos/large/${encodeURI(p.file)}`)
export const thumbUrl = (p: Photo) => largeUrl(p) // no separate thumbnails

const photos = ref<Photo[]>([])
const site = ref<SiteData | null>(null)
const status = ref<'idle' | 'loading' | 'ready' | 'error'>('idle')
let started = false

async function fetchJson<T>(path: string): Promise<T> {
  // "no-cache" = always revalidate, so edits show up on the next page load.
  const res = await fetch(assetUrl(path), { cache: 'no-cache' })
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`)
  return (await res.json()) as T
}

/** Load an image just to learn its size. Resolves null if it fails or takes too long. */
function loadSize(url: string): Promise<{ w: number; h: number } | null> {
  return new Promise((resolve) => {
    const img = new Image()
    const timer = setTimeout(() => resolve(null), 6000)
    img.onload = () => {
      clearTimeout(timer)
      resolve({ w: img.naturalWidth, h: img.naturalHeight })
    }
    img.onerror = () => {
      clearTimeout(timer)
      resolve(null)
    }
    img.src = url
  })
}

/** Fill in width/height for a photo whose JSON entry has none (thumb first, else the large file). */
async function measure(photo: Photo): Promise<void> {
  const size = (await loadSize(thumbUrl(photo))) ?? (await loadSize(largeUrl(photo)))
  if (size) {
    photo.width = size.w
    photo.height = size.h
  }
}

export async function loadData() {
  if (started) return
  started = true
  status.value = 'loading'
  try {
    const [photoFile, siteFile] = await Promise.all([
      fetchJson<{ photos: Photo[] }>('data/photos.json'),
      fetchJson<SiteData>('data/site.json'),
    ])
    const list = photoFile.photos ?? []
    site.value = siteFile

    // Show every photo whose size we already know straight away...
    const publish = () => {
      photos.value = list.filter((p) => p.width && p.height)
    }
    publish()
    status.value = 'ready'

    // ...and add the others (entries added by hand without width/height) as soon as
    // each one has been measured. The page never waits for them.
    list.filter((p) => !p.width || !p.height).forEach((p) => measure(p).then(publish))
  } catch (err) {
    console.error('Could not load site data', err)
    status.value = 'error'
  }
}

export function useData() {
  return { photos: readonly(photos), site: readonly(site), status: readonly(status) }
}
