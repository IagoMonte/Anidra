// router/index.js
import Mobile from '@/pages/Mobile.vue'
import Owlbear from '@/pages/owlbear.vue'
import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Mobile
  },
  {
    path: '/owlbear',
    name: 'Owlbear',
    component: Owlbear
  }
]

const router = createRouter({
  history: createWebHistory(), // ou createWebHashHistory()
  routes
})

export default router