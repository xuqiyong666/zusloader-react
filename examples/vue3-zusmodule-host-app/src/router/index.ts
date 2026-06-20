import { createRouter, createWebHistory } from 'vue-router'

import AdminLayout from '../layouts/AdminLayout.vue'
import DashboardPage from '../pages/DashboardPage.vue'
import NotFoundPage from '../pages/NotFoundPage.vue'
import ZusModuleHostPage from '../pages/zusmoduleHost/index.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: AdminLayout,
      children: [
        {
          path: '',
          redirect: '/dashboard',
        },
        {
          path: 'dashboard',
          name: 'dashboard',
          component: DashboardPage,
        },
        {
          path: 'zusmodule/:microAppKey?/:pagePath(.*)*',
          name: 'zusmodule',
          component: ZusModuleHostPage,
        },
        {
          path: ':pathMatch(.*)*',
          name: 'not-found',
          component: NotFoundPage,
        },
      ],
    },
  ],
})

export default router
