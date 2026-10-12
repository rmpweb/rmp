import { createApp } from 'vue'
import App from './App.vue'
import { router } from './router'
import { loadData } from './composables/useData'
import './style.css'

loadData() // start fetching photos.json / site.json immediately
createApp(App).use(router).mount('#app')
