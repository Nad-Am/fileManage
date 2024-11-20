import './assets/main.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as elementIcon from "@element-plus/icons-vue"

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

for(const [key,component] of Object.entries(elementIcon)) {
    app.component(key,component);
}

app.mount('#app')
