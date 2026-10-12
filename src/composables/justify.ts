/**
 * Justified-rows layout (as used by Flickr, Google Photos and Squarespace's
 * gallery blocks): every row is exactly as wide as the container and all photos
 * in a row share one height, so each photo keeps its real proportions.
 *
 * Pure function: no Vue, no DOM, so it is easy to test.
 */
export interface RowItem {
  /** Index into the original ratios array. */
  index: number
  width: number
  height: number
}

export interface Row {
  height: number
  items: RowItem[]
  /** True when the row spans the full container width (every row except the last). */
  full: boolean
}

export interface JustifyOptions {
  /** Width of the container in px. */
  width: number
  /** Ideal row height in px; rows end up close to this. */
  targetHeight: number
  /** Gap between photos in px. */
  gap: number
  /** At or below this width, use one photo per row (phones). */
  singleColumnBelow?: number
}

/** ratios[i] = width / height of photo i. */
export function justify(ratios: number[], opts: JustifyOptions): Row[] {
  const { width, targetHeight, gap, singleColumnBelow = 0 } = opts
  if (width <= 0 || ratios.length === 0) return []

  const makeRow = (indices: number[], height: number, full = true): Row => ({
    height: Math.round(height),
    full,
    items: indices.map((index) => ({
      index,
      // floor so rounding can never push a row wider than the container
      width: Math.floor(ratios[index] * height),
      height: Math.round(height),
    })),
  })

  // Phones: one photo per row, full width.
  if (width <= singleColumnBelow) {
    return ratios.map((r, i) => makeRow([i], width / r, false))
  }

  const heightFor = (count: number, ratioSum: number) => (width - gap * (count - 1)) / ratioSum

  const rows: Row[] = []
  let current: number[] = []
  let sum = 0

  const flush = (indices: number[], ratioSum: number) => {
    rows.push(makeRow(indices, heightFor(indices.length, ratioSum)))
  }

  for (let i = 0; i < ratios.length; i++) {
    const r = ratios[i]
    current.push(i)
    sum += r
    const h = heightFor(current.length, sum)

    if (h <= targetHeight) {
      // The row is full. Keep the last photo only if that gets closer to the target height.
      if (current.length > 1) {
        const prevSum = sum - r
        const hPrev = heightFor(current.length - 1, prevSum)
        if (Math.abs(hPrev - targetHeight) < Math.abs(h - targetHeight)) {
          flush(current.slice(0, -1), prevSum)
          current = [i]
          sum = r
          // a very wide photo can fill a row on its own
          if (heightFor(1, r) <= targetHeight) {
            flush(current, sum)
            current = []
            sum = 0
          }
          continue
        }
      }
      flush(current, sum)
      current = []
      sum = 0
    }
  }

  // Last, incomplete row: do not stretch it to the full width.
  if (current.length > 0) {
    rows.push(makeRow(current, Math.min(targetHeight, heightFor(current.length, sum)), false))
  }

  return rows
}

/** Row height, gap and side margin scale with the viewport. */
export function layoutFor(containerWidth: number) {
  const clamp = (min: number, v: number, max: number) => Math.min(max, Math.max(min, v))
  return {
    // targetHeight: clamp(220, containerWidth * 0.27, 440),
    targetHeight: clamp(220, containerWidth * 0.27, 620),
    gap: clamp(18, containerWidth * 0.035, 64),
    singleColumnBelow: 600,
  }
}
