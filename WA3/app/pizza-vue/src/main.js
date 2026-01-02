import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/tailwind.css'
import { OhVueIcon } from 'oh-vue-icons'

const app = createApp(App)

app.use(router)

app.component('v-icon', OhVueIcon) // mapiraj OhVueIcon komponentu na "v-icon" HTML tag

app.mount('#app')
