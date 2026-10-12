// GitHub Pages has no "serve index.html for every route" rule, but it does serve
// 404.html for unknown paths. Copying index.html there makes /about and /contact
// work when opened directly. (Netlify/Cloudflare use public/_redirects instead.)
import { copyFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dist = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'docs')
await copyFile(path.join(dist, 'index.html'), path.join(dist, '404.html'))
console.log('postbuild: copied dist/index.html -> dist/404.html')
