import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/reset.css';
import ElementPlus from 'element-plus'
import router from './router'
import 'element-plus/theme-chalk/index.css'
import './icon/iconfont.css'
import './icon/leftTab/iconfont.css'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPinia } from 'pinia';
const app = createApp(App)
const pinia=createPinia()
pinia.use(piniaPluginPersistedstate)


app.use(ElementPlus).use(Antd).use(pinia).use(router).mount('#app')
