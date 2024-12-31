import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import { useAuthStore } from '@/stores/authStore'
import Cookies from 'js-cookie'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/:slug',
      name: 'detail_post',
      component: () => import('../views/post/PublicPostView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: AboutView,
    },
    // {
    //   path: '/register',
    //   name: 'register',
    //   component: () => import('../views/RegisterView.vue'),
    // },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/posts/create',
      name: 'post-create',
      component: () => import('../views/post/CreatePostView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/posts',
      name: 'posts',
      component: () => import('../views/post/PostView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/posts/:slug',
      name: 'post-detail',
      component: () => import('../views/post/DetailPostView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/posts/:slug/edit',
      name: 'post-edit',
      component: () => import('../views/post/EditPostView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('../views/category/CategoryView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/edit-profile',
      name: 'profile',
      component: () => import('../views/user/EditProfileView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const accessToken = Cookies.get('x-token')
  const authStore = useAuthStore()

  // Redirect ke halaman login jika belum autentikasi
  if (to.meta.requiresAuth && !accessToken && !authStore.state.isAuthenticated) {
    next({
      name: 'login',
      query: { redirect: to.fullPath },
    })
  } else {
    next()
  }
})

export default router
