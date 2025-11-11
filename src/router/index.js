import ClienteList from '@/pages/ClienteList.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/clientes'
    },
    {
      path: '/clientes',
      component: ClienteList
    }
  ],
})

export default router
