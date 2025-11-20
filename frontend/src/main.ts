import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import { router } from './index.ts'

import { createVuetify } from 'vuetify'
import 'vuetify/styles'
import { aliases, mdi } from 'vuetify/iconsets/mdi-svg' // <– SVG icon set
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        colors: {
          primary: '#3b82f6', // Blue
          secondary: '#6366f1', // Indigo
          success: '#10b981', // Green
          error: '#ef4444', // Red
          warning: '#f59e0b', // Amber
          info: '#0ea5e9', // Sky
          background: '#0f172a', // Dark background
          surface: '#1e293b', // Surface
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
})

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.use(vuetify).mount('#app')
