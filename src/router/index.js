import { createRouter, createWebHistory } from 'vue-router'

// 引入组件（可替换成你自己的页面组件）
import paper from '../views/paper.vue'
import home from '../views/home.vue'
import edit from '../views/edit.vue'
const routes = [
    {
        path: '/',
        name: 'home',
        component: home,
    },

    {
        path: '/paper/:id',
        name: 'paper',
        component: paper,
    },

    {
        path:'/edit',
        name:'edit',
        component:edit
    }

]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router