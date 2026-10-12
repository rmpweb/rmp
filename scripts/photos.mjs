#!/usr/bin/env node
/**
 * Prepares photos for the site.
 *
 *   1. Drop original photos (jpg/png/webp/tiff) into  photos-src/
 *   2. Run                                            npm run photos
 *   3. Upload the new files in public/photos/ and public/data/photos.json
 *      (no site rebuild needed - the site reads photos.json at runtime)
 *
 * For every source photo it writes
 *   public/photos/large/<id>.jpg   (long edge 2400px, shown in the lightbox)
 *   public/photos/thumb/<id>.jpg   (long edge 1200px, shown in the grid)
 * and adds/updates its entry in public/data/photos.json (width/height included,
 * so the grid can lay out without waiting for images to load).
 *
 * Privacy: output files carry NO metadata, so GPS location, camera serial
 * numbers etc. are stripped. Orientation is baked into the pixels.
 *
 * Existing entries keep whatever title/alt you edited by hand.
 *
 * Options:  --force   regenerate images even if they look up to date
 */
import { readdir, mkdir, readFile, writeFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SRC = path.join(ROOT, 'photos-src')
const OUT_LARGE = path.join(ROOT, 'public/photos/large')
const OUT_THUMB = path.join(ROOT, 'public/photos/thumb')
const DATA = path.join(ROOT, 'public/data/photos.json')

const LARGE_EDGE = 2400
const THUMB_EDGE = 1200
const FORCE = process.argv.includes('--force')
const EXT = /\.(jpe?g|png|webp|tiff?|avif)$/i

const slugify = (name) =>
  name
    .replace(EXT, '')
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'photo'

const humanize = (slug) =>
  slug
    .split('-')
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(' ')

const mtime = async (p) => {
  try {
    return (await stat(p)).mtimeMs
  } catch {
    return 0
  }
}

async function readData() {
  try {
    const parsed = JSON.parse(await readFile(DATA, 'utf8'))
    if (!Array.isArray(parsed.photos)) throw new Error('"photos" must be an array')
    return parsed
  } catch (err) {
    if (err.code === 'ENOENT') return { photos: [] }
    throw new Error(`Could not read ${DATA}: ${err.message}`)
  }
}

async function main() {
  await mkdir(SRC, { recursive: true })
  await mkdir(OUT_LARGE, { recursive: true })
  await mkdir(OUT_THUMB, { recursive: true })

  const files = (await readdir(SRC))
    .filter((f) => EXT.test(f) && !f.startsWith('.'))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))

  const data = await readData()
  const byId = new Map(data.photos.map((p) => [p.id, p]))
  const seen = new Set()

  if (files.length === 0) {
    console.log('No photos found in photos-src/. Drop your originals there and run again.')
  }

  let made = 0
  let skipped = 0
  for (const file of files) {
    const id = slugify(file)
    if (seen.has(id)) {
      console.warn(`! Skipping ${file}: its name collides with another file (id "${id}")`)
      continue
    }
    seen.add(id)

    const src = path.join(SRC, file)
    const largePath = path.join(OUT_LARGE, `${id}.jpg`)
    const thumbPath = path.join(OUT_THUMB, `${id}.jpg`)
    const srcTime = await mtime(src)
    const upToDate =
      !FORCE && (await mtime(largePath)) > srcTime && (await mtime(thumbPath)) > srcTime

    if (!upToDate) {
      const base = () => sharp(src, { failOn: 'none' }).rotate() // bake in EXIF orientation
      await base()
        .resize({ width: LARGE_EDGE, height: LARGE_EDGE, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 82, mozjpeg: true })
        .toFile(largePath)
      await base()
        .resize({ width: THUMB_EDGE, height: THUMB_EDGE, fit: 'inside', withoutEnlargement: true })
        .jpeg({ quality: 80, mozjpeg: true })
        .toFile(thumbPath)
      made++
    } else {
      skipped++
    }

    const { width, height } = await sharp(largePath).metadata()
    const existing = byId.get(id)
    if (existing) {
      existing.file = `${id}.jpg`
      existing.width = width
      existing.height = height
    } else {
      const entry = { id, file: `${id}.jpg`, title: humanize(id), width, height }
      data.photos.push(entry)
      byId.set(id, entry)
      console.log(`+ added "${id}"`)
    }
  }

  // Warn about entries whose image files are missing (e.g. a typo from hand-editing).
  for (const p of data.photos) {
    if ((await mtime(path.join(OUT_LARGE, p.file))) === 0) {
      console.warn(`! "${p.id}" is listed in photos.json but public/photos/large/${p.file} is missing`)
    }
  }

  await mkdir(path.dirname(DATA), { recursive: true })
  await writeFile(DATA, JSON.stringify({ photos: data.photos }, null, 2) + '\n')
  console.log(`\nDone: ${made} processed, ${skipped} up to date, ${data.photos.length} photos in photos.json`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
