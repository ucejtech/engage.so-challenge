import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/notes/edit',
    name: 'Create Notes',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/create-notes.vue')
  },
  {
    path: '/notes/edit/:noteId',
    name: 'Create Notes',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/create-notes.vue')
  },
  {
    path: '/notes/:noteId/view',
    name: 'Create Notes',
    component: () =>
      import(/* webpackChunkName: "about" */ '../views/view-notes.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
