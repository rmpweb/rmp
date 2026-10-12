import { createRouter, createWebHistory } from 'vue-router'
import GalleryView from './views/GalleryView.vue'
import AboutView from './views/AboutView.vue'
import ContactView from './views/ContactView.vue'

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'gallery', component: GalleryView, meta: { title: 'Photography' } },
    { path: '/about', name: 'about', component: AboutView, meta: { title: 'About' } },
    { path: '/contact', name: 'contact', component: ContactView, meta: { title: 'Contact' } },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
  scrollBehavior(to, from, saved) {
    // Opening/closing the lightbox only changes the query: keep the scroll position.
    if (to.path === from.path) return false
    return saved ?? { top: 0 }
  },
})

router.afterEach((to) => {
  const section = to.meta.title as string | undefined
  document.title = section && to.name !== 'gallery' ? `${section} — Richard Muscat` : 'Richard Muscat — Photography'
})
