// router/index.js
import Login from '@/components/Login.vue'
import Register from '@/components/Register.vue'
import Home from '@/pages/Home.vue'
import Owlbear from '@/pages/owlbear.vue'

import { createRouter, createWebHistory } from 'vue-router'


const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/owlbear',
    name: 'Owlbear',
    component: Owlbear
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  }
]

const router = createRouter({
  history: createWebHistory(), // ou createWebHashHistory()
  routes
})

export default router