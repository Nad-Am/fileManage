import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import("@/views/IndexView.vue")
    },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      children:[
        {
          path: '',
          name: 'about',
          component: () => import('../views/AboutView.vue'),
        },
        {
          path:'delete',
          name: 'delete',
          component: () => import('@/views/DeleteView.vue')
        }
      ]
    },
  ]
})

export default router
