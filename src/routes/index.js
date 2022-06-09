import { createRouter, createWebHashHistory } from 'vue-router'
import Home from './Home'
import Movie from './Movie'
import About from './About'
import NotFound from './NotFound'

export default createRouter({
  history: createWebHashHistory(),
  scrollBehavior() {
    return {
      top: 0
    }
  },
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/movie/:id', //파라미터 이름은 원하는대로 지정 가능
      component: Movie
    },
    {
      path: '/about',
      component: About
    },
    {
      path: '/:notFound(.*)',
      component: NotFound
    }
  ]
})